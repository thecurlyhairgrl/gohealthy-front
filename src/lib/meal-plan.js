import { MEAL_TIMES } from './meal-times'
import { WEEK_DAY } from './labels'

// El constructor guarda el plan en una forma fácil de editar:
//   distribution: { breakfast: { 'cereals-no-fat': 2, fruits: 1 }, lunch: {...} }
//   menu: { monday: { breakfast: meal, lunch: meal }, tuesday: {...} }
// y lo convierte a la forma de la API (arreglos) al guardar.

export const DAYS = Object.keys(WEEK_DAY)

export const emptyPlan = () => ({
  name: 'Plan alimenticio',
  targetKcal: '',
  waterLiters: '2',
  notes: '',
  distribution: Object.fromEntries(MEAL_TIMES.map((meal) => [meal.key, {}])),
  menu: Object.fromEntries(DAYS.map((day) => [day, {}])),
})

// API -> constructor
export const planToForm = (plan) => {
  const form = emptyPlan()
  form.name = plan.name || form.name
  form.targetKcal = plan.targetKcal ? String(plan.targetKcal) : ''
  form.waterLiters = plan.waterLiters ? String(plan.waterLiters) : ''
  form.notes = plan.notes || ''
  for (const item of plan.distribution || []) {
    form.distribution[item.mealTime] = Object.fromEntries(item.equivalents.map((equivalent) => [equivalent.groupKey, equivalent.quantity]))
  }
  for (const menuDay of plan.menu || []) {
    form.menu[menuDay.day] = Object.fromEntries(menuDay.meals.map((meal) => [meal.mealTime, meal]))
  }
  return form
}

// Constructor -> API. Los grupos en 0 y los días sin comidas no se mandan
export const formToPlan = (form) => ({
  name: form.name,
  targetKcal: form.targetKcal ? Number(form.targetKcal) : undefined,
  waterLiters: form.waterLiters ? Number(form.waterLiters) : undefined,
  notes: form.notes,
  distribution: MEAL_TIMES.map((meal) => ({
    mealTime: meal.key,
    equivalents: Object.entries(form.distribution[meal.key])
      .filter(([, quantity]) => quantity > 0)
      .map(([groupKey, quantity]) => ({ groupKey, quantity })),
  })).filter((item) => item.equivalents.length > 0),
  menu: DAYS.map((day) => ({
    day,
    meals: MEAL_TIMES.filter((meal) => form.menu[day][meal.key]).map((meal) => ({ ...form.menu[day][meal.key], mealTime: meal.key })),
  })).filter((menuDay) => menuDay.meals.length > 0),
})

// Al asignar una receta se copian al plan su nombre, foto, ingredientes y pasos.
// Así se pueden ajustar las porciones y borrar la receta no afecta al plan
export const mealFromRecipe = (recipe, mealTime) => ({
  mealTime,
  title: recipe.name,
  recipe: recipe._id,
  imageUrl: recipe.imageUrl,
  foods: recipe.ingredients.map(({ food, name, groupKey, equivalents, quantity, unit }) => ({ food, name, groupKey, equivalents, quantity, unit })),
  steps: recipe.steps,
})

// Equivalentes que ya tiene una comida, por grupo: { 'cereals-no-fat': 2 }
export const countEquivalents = (meal) => {
  const counts = {}
  for (const food of meal?.foods || []) {
    if (food.groupKey) {
      counts[food.groupKey] = (counts[food.groupKey] || 0) + (food.equivalents || 0)
    }
  }
  return counts
}
