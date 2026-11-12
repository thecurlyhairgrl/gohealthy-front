import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { FormField } from '@/components/FormField'
import { forgotPasswordRequest } from '@/api/auth'
import { recoveryEmailSchema } from '@/schemas/auth'

// Paso 1: pide el correo y el back manda el código
export function RecoveryEmailForm({ onCodeSent }) {
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(recoveryEmailSchema) })

  async function onSubmit({ email }) {
    setApiError(null)
    try {
      await forgotPasswordRequest(email)
      onCodeSent(email)
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Recupera tu cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos un código para recuperar el acceso.
        </p>
      </div>

      {apiError && <p className="text-center text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Correo electrónico" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" placeholder="tu@correo.com" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar código'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Recordaste tu contraseña?{' '}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
