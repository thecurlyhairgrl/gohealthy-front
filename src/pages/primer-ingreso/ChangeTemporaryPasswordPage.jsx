import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import PrimerIngresoLayout from '@/layouts/PrimerIngresoLayout'
import { useAuth } from '@/context/AuthContext'
import { changePasswordRequest } from '@/api/auth'
import { getHomePath } from '@/lib/home-path'
import { changePasswordSchema } from '@/schemas/auth'

// Paso 1 del primer ingreso: cambiar la contraseña temporal que llegó por correo
function ChangeTemporaryPasswordPage() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(changePasswordSchema) })

  async function onSubmit({ currentPassword, newPassword }) {
    setApiError(null)
    try {
      await changePasswordRequest({ currentPassword, newPassword })
      // El back ya puso mustChangePassword en false; pedimos el usuario actualizado
      const user = await refreshUser()
      toast.add({ title: 'Contraseña actualizada', type: 'success' })
      navigate(getHomePath(user), { replace: true })
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <PrimerIngresoLayout
      step={1}
      title="Crea tu contraseña"
      description="Por seguridad, cambia la contraseña temporal que te enviamos por correo."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {apiError && <p className="text-sm text-destructive">{apiError}</p>}

        <FieldGroup>
          <FormField label="Contraseña temporal" htmlFor="currentPassword" error={errors.currentPassword}>
            <Input id="currentPassword" type="password" autoComplete="current-password" aria-invalid={Boolean(errors.currentPassword)} {...register('currentPassword')} />
          </FormField>

          <FormField label="Nueva contraseña" htmlFor="newPassword" error={errors.newPassword}>
            <Input id="newPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.newPassword)} {...register('newPassword')} />
          </FormField>

          <FormField label="Confirmar contraseña" htmlFor="confirmPassword" error={errors.confirmPassword}>
            <Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
          </FormField>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
        </Button>
      </form>
    </PrimerIngresoLayout>
  )
}

export default ChangeTemporaryPasswordPage
