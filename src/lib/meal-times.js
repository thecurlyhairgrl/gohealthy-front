// Horarios de comida: son fijos e iguales para todos los pacientes
export const MEAL_TIMES = [
  { key: 'breakfast', label: 'Desayuno', start: '07:30', end: '08:30' },
  { key: 'morning-snack', label: 'Colación matutina', start: '11:00', end: '11:30' },
  { key: 'lunch', label: 'Comida', start: '14:00', end: '15:00' },
  { key: 'afternoon-snack', label: 'Colación vespertina', start: '17:30', end: '18:00' },
  { key: 'dinner', label: 'Cena', start: '20:30', end: '21:30' },
]

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// La comida que toca: la última que ya empezó o que empieza en menos de una hora
export const getCurrentMealKey = (now = new Date()) => {
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  let current = MEAL_TIMES[0].key

  for (const meal of MEAL_TIMES) {
    if (minutesNow >= toMinutes(meal.start) - 60) {
      current = meal.key
    }
  }

  return current
}

// El día de hoy como lo guarda el plan: 'monday' ... 'sunday'
export const getTodayKey = (now = new Date()) => {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
}
