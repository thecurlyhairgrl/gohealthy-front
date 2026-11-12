import { z } from 'zod'

const optionalText = z.string().trim().optional()

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'Escribe tu nombre'),
  paternalLastName: z.string().trim().min(1, 'Escribe tu apellido paterno'),
  maternalLastName: optionalText,
  phone: optionalText,
  professionalLicense: optionalText,
  specialty: optionalText,
  university: optionalText,
  officeAddress: optionalText,
  bio: z.string().trim().max(1000, 'Máximo 1000 caracteres').optional(),
})
