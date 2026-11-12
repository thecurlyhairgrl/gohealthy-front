import { z } from 'zod'
import { optionalNumber } from './patients'

export const consultationSchema = z.object({
  date: z.string().min(1, 'Elige la fecha'),
  weightKg: z
    .string()
    .min(1, 'Escribe el peso')
    .refine((value) => Number(value) >= 20 && Number(value) <= 300, 'Escribe un peso entre 20 y 300 kg'),
  heightCm: optionalNumber(50, 250, 'Escribe una estatura entre 50 y 250 cm'),
  waistCm: optionalNumber(30, 250, 'Escribe una medida entre 30 y 250 cm'),
  hipCm: optionalNumber(30, 250, 'Escribe una medida entre 30 y 250 cm'),
  bodyFatPct: optionalNumber(1, 70, 'Escribe un porcentaje entre 1 y 70'),
  systolicPressure: optionalNumber(50, 250, 'Escribe un valor entre 50 y 250'),
  diastolicPressure: optionalNumber(30, 150, 'Escribe un valor entre 30 y 150'),
  formula: z.enum(['harris-benedict', 'mifflin-st-jeor']),
  activityFactor: z.string(),
  targetKcal: optionalNumber(800, 6000, 'Escribe entre 800 y 6000 kcal'),
  diagnosis: z.string().trim().optional(),
  instructions: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})
