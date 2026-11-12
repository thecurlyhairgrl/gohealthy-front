import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { changePasswordRequest } from '@/api/auth'
import { profilePasswordSchema } from '@/schemas/auth'

/**
 * Diálogo para cambiar la contraseña desde el perfil.
 */
export function CambiarPasswordModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">{isOpen && <CambiarPasswordForm onClose={onClose} />}</DialogContent>
    </Dialog>
  )
}

function CambiarPasswordForm({ onClose }) {
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(profilePasswordSchema) })

  async function onSubmit({ currentPassword, newPassword }) {
    setApiError(null)
    try {
      await changePasswordRequest({ currentPassword, newPassword })
      toast.add({ title: 'Contraseña actualizada', type: 'success' })
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Cambiar contraseña</DialogTitle>
        <DialogDescription>Debe tener al menos 8 caracteres.</DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Contraseña actual" htmlFor="currentPassword" error={errors.currentPassword}>
          <Input id="currentPassword" type="password" autoComplete="current-password" aria-invalid={Boolean(errors.currentPassword)} {...register('currentPassword')} />
        </FormField>
        <FormField label="Nueva contraseña" htmlFor="newPassword" error={errors.newPassword}>
          <Input id="newPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.newPassword)} {...register('newPassword')} />
        </FormField>
        <FormField label="Confirmar contraseña" htmlFor="confirmPassword" error={errors.confirmPassword}>
          <Input id="confirmPassword" type="password" autoComplete="new-password" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </DialogFooter>
    </form>
  )
}
