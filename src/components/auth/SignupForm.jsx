import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'
import { signupSchema } from '@/schemas/auth'

// El registro es solo para nutriólogos: a los pacientes los da de alta su nutriólogo
export function SignupForm() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) })

  async function onSubmit(formData) {
    setApiError(null)
    // confirmPassword solo sirve para validar; no se manda al back
    const userData = { ...formData }
    delete userData.confirmPassword
    try {
      const user = await registerUser(userData)
      navigate(getHomePath(user), { replace: true })
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Crear una cuenta</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus datos para comenzar.</p>
      </div>

      {apiError && <p className="text-center text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Nombre(s)" htmlFor="firstName" error={errors.firstName}>
          <Input id="firstName" placeholder="Tu nombre" autoComplete="given-name" aria-invalid={Boolean(errors.firstName)} {...register('firstName')} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Apellido paterno" htmlFor="paternalLastName" error={errors.paternalLastName}>
            <Input id="paternalLastName" autoComplete="family-name" aria-invalid={Boolean(errors.paternalLastName)} {...register('paternalLastName')} />
          </FormField>

          <FormField label="Apellido materno (opcional)" htmlFor="maternalLastName" error={errors.maternalLastName}>
            <Input id="maternalLastName" {...register('maternalLastName')} />
          </FormField>
        </div>

        <FormField label="Cédula profesional (opcional)" htmlFor="professionalLicense" error={errors.professionalLicense}>
          <Input id="professionalLicense" {...register('professionalLicense')} />
        </FormField>

        <FormField label="Correo electrónico" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" placeholder="tu@correo.com" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>

        <FormField label="Contraseña" htmlFor="password" error={errors.password}>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" aria-invalid={Boolean(errors.password)} {...register('password')} />
        </FormField>

        <FormField label="Confirmar contraseña" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <Input id="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
