import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { usePatients } from '@/context/PatientsContext'
import { editPatientSchema } from '@/schemas/patients'

/**
 * Diálogo para editar el nombre y el teléfono de un paciente. El correo no se puede cambiar.
 */
function EditarPacienteModal({ open, onOpenChange, patient, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <EditarPacienteForm patient={patient} onSaved={onSaved} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function EditarPacienteForm({ patient, onSaved, onClose }) {
  const { editPatient } = usePatients()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      firstName: patient.firstName,
      paternalLastName: patient.paternalLastName,
      maternalLastName: patient.maternalLastName || '',
      phone: patient.phone || '',
    },
  })

  async function onSubmit(formData) {
    setApiError(null)
    try {
      await editPatient(patient._id, formData)
      toast.add({ title: 'Datos actualizados', type: 'success' })
      onSaved()
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Editar datos del paciente</DialogTitle>
        <DialogDescription>El correo ({patient.email}) no se puede cambiar.</DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Nombre(s)" htmlFor="firstName" error={errors.firstName}>
          <Input id="firstName" aria-invalid={Boolean(errors.firstName)} {...register('firstName')} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Apellido paterno" htmlFor="paternalLastName" error={errors.paternalLastName}>
            <Input id="paternalLastName" aria-invalid={Boolean(errors.paternalLastName)} {...register('paternalLastName')} />
          </FormField>
          <FormField label="Apellido materno" htmlFor="maternalLastName" error={errors.maternalLastName}>
            <Input id="maternalLastName" {...register('maternalLastName')} />
          </FormField>
        </div>
        <FormField label="Teléfono" htmlFor="phone" error={errors.phone}>
          <Input id="phone" type="tel" {...register('phone')} />
        </FormField>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default EditarPacienteModal
