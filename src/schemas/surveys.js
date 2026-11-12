import { z } from 'zod'

// Número escrito en un input, dentro de un rango
const numberIn = (min, max, message) =>
  z
    .string()
    .min(1, message)
    .refine((value) => Number(value) >= min && Number(value) <= max, message)

export const surveySchema = z.object({
  mood: z.number({ message: 'Elige cómo te sientes' }).min(1, 'Elige cómo te sientes').max(5),
  sleepHours: numberIn(0, 24, 'Escribe entre 0 y 24 horas'),
  waterGlasses: numberIn(0, 30, 'Escribe entre 0 y 30 vasos'),
  activityMinutes: numberIn(0, 1440, 'Escribe los minutos (0 si no hiciste)'),
  planAdherence: z.number().min(0).max(100),
  comment: z.string().trim().max(500, 'Máximo 500 caracteres').optional(),
})

export const measurementSchema = z.object({
  date: z.string().min(1, 'Elige la fecha'),
  weightKg: numberIn(20, 300, 'Escribe un peso entre 20 y 300 kg'),
  waistCm: z.string().optional(),
  hipCm: z.string().optional(),
  armCm: z.string().optional(),
  bodyFatPct: z
    .string()
    .optional()
    .refine((value) => !value || (Number(value) >= 1 && Number(value) <= 70), 'Escribe un porcentaje entre 1 y 70'),
  notes: z.string().trim().max(500, 'Máximo 500 caracteres').optional(),
})
