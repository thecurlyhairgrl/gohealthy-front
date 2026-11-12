import { z } from 'zod'

const email = z.string().trim().min(1, 'Escribe tu correo').email('El correo no es válido')
const newPassword = z.string().min(8, 'Debe tener al menos 8 caracteres')

// Revisa que la confirmación sea igual a la contraseña nueva
const passwordsMatch = (field) => [
  (data) => data[field] === data.confirmPassword,
  { message: 'Las contraseñas no coinciden', path: ['confirmPassword'] },
]

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Escribe tu contraseña'),
})

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Escribe tu nombre'),
    paternalLastName: z.string().trim().min(1, 'Escribe tu apellido paterno'),
    maternalLastName: z.string().trim().optional(),
    professionalLicense: z.string().trim().optional(),
    email,
    password: newPassword,
    confirmPassword: z.string(),
  })
  .refine(...passwordsMatch('password'))

// Recuperación de contraseña
export const recoveryEmailSchema = z.object({ email })

export const passwordSchema = z
  .object({
    newPassword,
    confirmPassword: z.string(),
  })
  .refine(...passwordsMatch('newPassword'))

// Cambio de la contraseña temporal en el primer ingreso
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Escribe la contraseña que te llegó por correo'),
    newPassword,
    confirmPassword: z.string(),
  })
  .refine(...passwordsMatch('newPassword'))
