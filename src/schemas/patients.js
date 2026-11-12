import { z } from 'zod'

// Los campos opcionales llegan como "" cuando están vacíos
const optionalText = z.string().trim().optional()

// Número opcional escrito en un input: "" o un número dentro del rango
const optionalNumber = (min, max, message) =>
  z
    .string()
    .optional()
    .refine((value) => !value || (Number(value) >= min && Number(value) <= max), message)

export const newPatientSchema = z.object({
  firstName: z.string().trim().min(1, 'Escribe el nombre'),
  paternalLastName: z.string().trim().min(1, 'Escribe el apellido paterno'),
  maternalLastName: optionalText,
  email: z.string().trim().min(1, 'Escribe el correo').email('El correo no es válido'),
  phone: optionalText,
  birthDate: optionalText,
  sex: optionalText,
  reasonForVisit: optionalText,
})

export const editPatientSchema = z.object({
  firstName: z.string().trim().min(1, 'Escribe el nombre'),
  paternalLastName: z.string().trim().min(1, 'Escribe el apellido paterno'),
  maternalLastName: optionalText,
  phone: optionalText,
})

// Historia clínica: las listas se escriben separadas por comas
export const clinicalHistorySchema = z.object({
  birthDate: optionalText,
  sex: optionalText,
  occupation: optionalText,
  reasonForVisit: optionalText,
  goals: optionalText,
  weightGoalKg: optionalNumber(20, 300, 'Escribe un peso entre 20 y 300 kg'),
  bodyFatGoalPct: optionalNumber(1, 70, 'Escribe un porcentaje entre 1 y 70'),
  diseases: optionalText,
  surgeries: optionalText,
  allergies: optionalText,
  medications: optionalText,
  smoking: z.enum(['yes', 'no']),
  alcoholConsumption: optionalText,
  physicalActivity: optionalText,
  sleepHours: optionalNumber(0, 24, 'Escribe entre 0 y 24 horas'),
  mealsPerDay: optionalNumber(1, 10, 'Escribe entre 1 y 10 comidas'),
  preferredFoods: optionalText,
  dislikedFoods: optionalText,
})

export { optionalNumber }
