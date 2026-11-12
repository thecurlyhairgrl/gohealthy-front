import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { FormSelect } from '@/components/FormSelect'
import { DatePicker } from '@/components/DatePicker'
import { usePatients } from '@/context/PatientsContext'
import { SEX } from '@/lib/labels'
import { newPatientSchema } from '@/schemas/patients'

/**
 * Diálogo para dar de alta a un paciente. El back le manda por correo su contraseña temporal.
 */
function NuevoPacienteModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {open && <NuevoPacienteForm onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function NuevoPacienteForm({ onClose }) {
  const { addPatient } = usePatients()
  const [apiError, setApiError] = useState(null)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newPatientSchema),
    defaultValues: {
      firstName: '',
      paternalLastName: '',
      maternalLastName: '',
      email: '',
      phone: '',
      birthDate: '',
      sex: '',
      reasonForVisit: '',
    },
  })

  async function onSubmit(formData) {
    setApiError(null)
    // Los campos vacíos no se mandan
    const patientData = {}
    for (const [key, value] of Object.entries(formData)) {
      if (value) patientData[key] = value
    }

    try {
      const data = await addPatient(patientData)
      if (data.emailSent) {
        toast.add({ title: 'Paciente creado', description: 'Le enviamos su contraseña temporal por correo', type: 'success' })
      } else {
        toast.add({ title: 'Paciente creado, pero no se envió el correo', description: 'Usa "Reenviar acceso" desde su expediente', type: 'warning' })
      }
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Nuevo paciente</DialogTitle>
        <DialogDescription>Le enviaremos un correo con su contraseña temporal para que entre a GoHealthy.</DialogDescription>
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
          <FormField label="Apellido materno (opcional)" htmlFor="maternalLastName" error={errors.maternalLastName}>
            <Input id="maternalLastName" {...register('maternalLastName')} />
          </FormField>
        </div>
        <FormField label="Correo electrónico" htmlFor="email" error={errors.email}>
          <Input id="email" type="email" aria-invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>
        <FormField label="Teléfono (opcional)" htmlFor="phone" error={errors.phone}>
          <Input id="phone" type="tel" {...register('phone')} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Fecha de nacimiento (opcional)" htmlFor="birthDate" error={errors.birthDate}>
            <Controller
              control={control}
              name="birthDate"
              render={({ field }) => (
                <DatePicker
                  id="birthDate"
                  value={field.value}
                  onChange={field.onChange}
                  fromDate={new Date(1920, 0, 1)}
                  toDate={new Date()}
                  defaultMonth={new Date(2000, 0)}
                />
              )}
            />
          </FormField>
          <FormField label="Sexo (opcional)" htmlFor="sex" error={errors.sex}>
            <FormSelect control={control} name="sex" id="sex" options={SEX} />
          </FormField>
        </div>
        <FormField label="Motivo de consulta (opcional)" htmlFor="reasonForVisit" error={errors.reasonForVisit}>
          <Textarea id="reasonForVisit" {...register('reasonForVisit')} />
        </FormField>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Crear paciente'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default NuevoPacienteModal
