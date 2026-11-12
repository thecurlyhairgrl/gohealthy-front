import { z } from 'zod'

export const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Elige un paciente'),
  day: z.string().min(1, 'Elige el día'),
  dateTime: z.string().min(1, 'Elige un horario'),
  modality: z.enum(['in-person', 'video-call']),
  reason: z.string().trim().optional(),
})
