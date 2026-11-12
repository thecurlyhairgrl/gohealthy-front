import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/context/AuthContext'
import { updateMeRequest } from '@/api/auth'
import { profileSchema } from '@/schemas/profile'

/**
 * Diálogo para editar el perfil. El correo no se puede cambiar.
 */
export function EditarPerfilModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        {isOpen && <EditarPerfilForm onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}

function EditarPerfilForm({ onClose }) {
  const { user, saveUser } = useAuth()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      paternalLastName: user.paternalLastName,
      maternalLastName: user.maternalLastName || '',
      phone: user.phone || '',
      professionalLicense: user.professionalLicense || '',
      specialty: user.specialty || '',
      university: user.university || '',
      officeAddress: user.officeAddress || '',
      bio: user.bio || '',
    },
  })

  async function onSubmit(formData) {
    setApiError(null)
    try {
      const updatedUser = await updateMeRequest(formData)
      saveUser(updatedUser)
      toast.add({ title: 'Perfil actualizado', type: 'success' })
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Editar perfil</DialogTitle>
        <DialogDescription>Tus pacientes ven tu nombre, especialidad y biografía.</DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre(s)" htmlFor="firstName" error={errors.firstName}>
          <Input id="firstName" aria-invalid={Boolean(errors.firstName)} {...register('firstName')} />
        </FormField>
        <FormField label="Apellido paterno" htmlFor="paternalLastName" error={errors.paternalLastName}>
          <Input id="paternalLastName" aria-invalid={Boolean(errors.paternalLastName)} {...register('paternalLastName')} />
        </FormField>
        <FormField label="Apellido materno" htmlFor="maternalLastName" error={errors.maternalLastName}>
          <Input id="maternalLastName" {...register('maternalLastName')} />
        </FormField>
        <FormField label="Teléfono" htmlFor="phone" error={errors.phone}>
          <Input id="phone" type="tel" {...register('phone')} />
        </FormField>
        <FormField label="Cédula profesional" htmlFor="professionalLicense" error={errors.professionalLicense}>
          <Input id="professionalLicense" {...register('professionalLicense')} />
        </FormField>
        <FormField label="Especialidad" htmlFor="specialty" error={errors.specialty}>
          <Input id="specialty" placeholder="Nutrición clínica" {...register('specialty')} />
        </FormField>
        <FormField label="Universidad" htmlFor="university" error={errors.university}>
          <Input id="university" {...register('university')} />
        </FormField>
        <FormField label="Consultorio" htmlFor="officeAddress" error={errors.officeAddress}>
          <Input id="officeAddress" {...register('officeAddress')} />
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Biografía" htmlFor="bio" error={errors.bio}>
            <Textarea id="bio" rows={4} {...register('bio')} />
          </FormField>
        </div>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </form>
  )
}
