// Calculadora energética de la consulta

export const ENERGY_FORMULAS = {
  'harris-benedict': 'Harris-Benedict',
  'mifflin-st-jeor': 'Mifflin-St Jeor',
}

// Factor de actividad: { valor: texto }
export const ACTIVITY_FACTORS = {
  '1.2': 'Sedentario (1.2)',
  '1.375': 'Actividad ligera (1.375)',
  '1.55': 'Actividad moderada (1.55)',
  '1.725': 'Actividad intensa (1.725)',
  '1.9': 'Muy intensa (1.9)',
}

// Gasto energético basal (GEB) en kcal. Regresa null si falta algún dato
export const getBasalEnergy = ({ formula, sex, weightKg, heightCm, age }) => {
  if (!sex || !weightKg || !heightCm || !age) return null

  if (formula === 'mifflin-st-jeor') {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age
    return Math.round(sex === 'male' ? base + 5 : base - 161)
  }

  // Harris-Benedict
  if (sex === 'male') {
    return Math.round(66.473 + 13.7516 * weightKg + 5.0033 * heightCm - 6.755 * age)
  }
  return Math.round(655.0955 + 9.5634 * weightKg + 1.8496 * heightCm - 4.6756 * age)
}

// IMC con una decimal
export const getBmi = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null
  const meters = heightCm / 100
  return Math.round((weightKg / (meters * meters)) * 10) / 10
}
