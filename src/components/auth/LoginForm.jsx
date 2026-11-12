import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'
import { loginSchema } from '@/schemas/auth'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit({ email, password }) {
    setApiError(null)
    try {
      const user = await login(email, password)
      // Cada usuario va a su inicio (el paciente nuevo, a su primer ingreso)
      navigate(getHomePath(user), { replace: true })
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Bienvenido de nuevo</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar.</p>
      </div>

      {apiError && <p className="text-center text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Correo electrónico" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        {/* Este campo no usa FormField porque lleva el enlace junto a la etiqueta */}
        <Field data-invalid={Boolean(errors.password)}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Link to="/auth/recovery" className="text-sm font-medium text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to="/auth/signin" className="font-semibold text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
