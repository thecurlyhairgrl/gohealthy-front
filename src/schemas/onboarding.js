import { z } from 'zod'

// Las listas (metas, alergias, etc.) se escriben separadas por comas.
// Los números llegan como texto desde los inputs y se convierten al guardar
export const onboardingSchema = z.object({
  birthDate: z.string().min(1, 'Escribe tu fecha de nacimiento'),
  sex: z.enum(['female', 'male'], { message: 'Elige una opción' }),
  occupation: z.string().trim().optional(),
  goals: z.string().trim().min(1, 'Escribe al menos una meta'),
  diseases: z.string().trim().optional(),
  allergies: z.string().trim().optional(),
  medications: z.string().trim().optional(),
  smoking: z.enum(['yes', 'no']),
  alcoholConsumption: z.enum(['never', 'occasional', 'frequent']),
  physicalActivity: z.string().trim().optional(),
  sleepHours: z.string().optional(),
  mealsPerDay: z.string().optional(),
  preferredFoods: z.string().trim().optional(),
  dislikedFoods: z.string().trim().optional(),
})
