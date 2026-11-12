import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { FormField } from '@/components/FormField'
import { toast } from '@/components/ui/toast'
import { resetPasswordRequest } from '@/api/auth'
import { passwordSchema } from '@/schemas/auth'

// Paso 3: guarda la contraseña nueva. El back vuelve a revisar el código
export function RecoveryNewPasswordForm({ email, code }) {
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) })

  async function onSubmit({ newPassword }) {
    setApiError(null)
    try {
      await resetPasswordRequest({ email, code, newPassword })
      toast.add({ title: 'Contraseña actualizada', description: 'Ya puedes iniciar sesión', type: 'success' })
      navigate('/auth/login', { replace: true })
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Ingresa tu nueva contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Asegúrate de usar caracteres seguros para proteger tu cuenta.
        </p>
      </div>

      {apiError && <p className="text-center text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Nueva contraseña" htmlFor="newPassword" error={errors.newPassword}>
          <Input id="newPassword" type="password" placeholder="••••••••" autoComplete="new-password" aria-invalid={Boolean(errors.newPassword)} {...register('newPassword')} />
        </FormField>

        <FormField label="Confirmar contraseña" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <Input id="confirmPassword" type="password" placeholder="••••••••" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar contraseña'}
      </Button>
    </form>
  )
}
