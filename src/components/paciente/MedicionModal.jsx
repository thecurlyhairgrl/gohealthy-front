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
import { DatePicker } from '@/components/DatePicker'
import { createMeasurementRequest, updateMeasurementRequest } from '@/api/measurements'
import { toDateInput } from '@/lib/dates'
import { numberToText, toNumber } from '@/lib/lists'
import { measurementSchema } from '@/schemas/surveys'

/**
 * Diálogo para registrar o editar una medición del paciente (peso y medidas).
 */
function MedicionModal({ open, onOpenChange, measurement, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        {open && <MedicionForm measurement={measurement} onSaved={onSaved} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function MedicionForm({ measurement, onSaved, onClose }) {
  const [apiError, setApiError] = useState(null)
  const isEdit = Boolean(measurement)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      date: measurement ? measurement.date.slice(0, 10) : toDateInput(),
      weightKg: numberToText(measurement?.weightKg),
      waistCm: numberToText(measurement?.waistCm),
      hipCm: numberToText(measurement?.hipCm),
      armCm: numberToText(measurement?.armCm),
      bodyFatPct: numberToText(measurement?.bodyFatPct),
      notes: measurement?.notes || '',
    },
  })

  async function onSubmit(formData) {
    setApiError(null)
    // Al editar, el back reemplaza la medición completa: se mandan todos los campos
    const data = {
      date: formData.date,
      weightKg: Number(formData.weightKg),
      waistCm: toNumber(formData.waistCm),
      hipCm: toNumber(formData.hipCm),
      armCm: toNumber(formData.armCm),
      bodyFatPct: toNumber(formData.bodyFatPct),
      notes: formData.notes,
    }
    try {
      if (isEdit) {
        await updateMeasurementRequest(measurement._id, data)
      } else {
        await createMeasurementRequest(data)
      }
      toast.add({ title: isEdit ? 'Medición actualizada' : 'Medición registrada', type: 'success' })
      onSaved()
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  const numberInput = (name) => (
    <Input id={name} type="number" step="0.1" inputMode="decimal" aria-invalid={Boolean(errors[name])} {...register(name)} />
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">{isEdit ? 'Editar medición' : 'Registrar medición'}</DialogTitle>
        <DialogDescription>Solo el peso es obligatorio.</DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <FormField label="Fecha" htmlFor="date" error={errors.date}>
          <Controller
            control={control}
            name="date"
            render={({ field }) => <DatePicker id="date" value={field.value} onChange={field.onChange} toDate={new Date()} />}
          />
        </FormField>
        <FormField label="Peso (kg)" htmlFor="weightKg" error={errors.weightKg}>
          {numberInput('weightKg')}
        </FormField>
        <FormField label="Cintura (cm)" htmlFor="waistCm" error={errors.waistCm}>
          {numberInput('waistCm')}
        </FormField>
        <FormField label="Cadera (cm)" htmlFor="hipCm" error={errors.hipCm}>
          {numberInput('hipCm')}
        </FormField>
        <FormField label="Brazo (cm)" htmlFor="armCm" error={errors.armCm}>
          {numberInput('armCm')}
        </FormField>
        <FormField label="Grasa corporal (%)" htmlFor="bodyFatPct" error={errors.bodyFatPct}>
          {numberInput('bodyFatPct')}
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Notas (opcional)" htmlFor="notes" error={errors.notes}>
            <Textarea id="notes" {...register('notes')} />
          </FormField>
        </div>
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

export default MedicionModal
