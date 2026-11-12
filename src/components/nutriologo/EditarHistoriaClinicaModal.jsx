import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { FormSelect } from '@/components/FormSelect'
import { DatePicker } from '@/components/DatePicker'
import { updateClinicalHistoryRequest } from '@/api/patients'
import { ALCOHOL_CONSUMPTION, SEX } from '@/lib/labels'
import { numberToText, toList, toNumber, toText } from '@/lib/lists'
import { clinicalHistorySchema } from '@/schemas/patients'

const SMOKING_OPTIONS = { no: 'No', yes: 'Sí' }

/**
 * Diálogo para editar la historia clínica. Las listas se escriben separadas por comas.
 */
function EditarHistoriaClinicaModal({ open, onOpenChange, patientId, clinicalHistory, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {open && (
          <HistoriaClinicaForm
            patientId={patientId}
            clinicalHistory={clinicalHistory}
            onSaved={onSaved}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function HistoriaClinicaForm({ patientId, clinicalHistory, onSaved, onClose }) {
  const [apiError, setApiError] = useState(null)
  const identification = clinicalHistory.identification || {}
  const pathological = clinicalHistory.pathologicalHistory || {}
  const nonPathological = clinicalHistory.nonPathologicalHistory || {}
  const eating = clinicalHistory.eatingHabits || {}

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clinicalHistorySchema),
    defaultValues: {
      birthDate: identification.birthDate ? identification.birthDate.slice(0, 10) : '',
      sex: identification.sex || '',
      occupation: identification.occupation || '',
      reasonForVisit: clinicalHistory.reasonForVisit || '',
      goals: toText(clinicalHistory.goals),
      weightGoalKg: numberToText(clinicalHistory.weightGoalKg),
      bodyFatGoalPct: numberToText(clinicalHistory.bodyFatGoalPct),
      diseases: toText(pathological.diseases),
      surgeries: toText(pathological.surgeries),
      allergies: toText(pathological.allergies),
      medications: toText(pathological.medications),
      smoking: nonPathological.smoking ? 'yes' : 'no',
      alcoholConsumption: nonPathological.alcoholConsumption || '',
      physicalActivity: nonPathological.physicalActivity || '',
      sleepHours: numberToText(nonPathological.sleepHours),
      mealsPerDay: numberToText(eating.mealsPerDay),
      preferredFoods: toText(eating.preferredFoods),
      dislikedFoods: toText(eating.dislikedFoods),
    },
  })

  async function onSubmit(formData) {
    setApiError(null)
    // El back reemplaza cada sección completa, así que conservamos lo que ya tenía
    const data = {
      identification: {
        ...identification,
        birthDate: formData.birthDate || undefined,
        sex: formData.sex || undefined,
        occupation: formData.occupation,
      },
      reasonForVisit: formData.reasonForVisit,
      goals: toList(formData.goals),
      weightGoalKg: toNumber(formData.weightGoalKg) ?? null,
      bodyFatGoalPct: toNumber(formData.bodyFatGoalPct) ?? null,
      pathologicalHistory: {
        ...pathological,
        diseases: toList(formData.diseases),
        surgeries: toList(formData.surgeries),
        allergies: toList(formData.allergies),
        medications: toList(formData.medications),
      },
      nonPathologicalHistory: {
        ...nonPathological,
        smoking: formData.smoking === 'yes',
        alcoholConsumption: formData.alcoholConsumption || undefined,
        physicalActivity: formData.physicalActivity,
        sleepHours: toNumber(formData.sleepHours),
      },
      eatingHabits: {
        ...eating,
        mealsPerDay: toNumber(formData.mealsPerDay),
        preferredFoods: toList(formData.preferredFoods),
        dislikedFoods: toList(formData.dislikedFoods),
      },
    }

    try {
      await updateClinicalHistoryRequest(patientId, data)
      toast.add({ title: 'Historia clínica actualizada', type: 'success' })
      onSaved()
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Editar historia clínica</DialogTitle>
        <DialogDescription>Las listas se escriben separadas por comas.</DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldSet>
        <FieldLegend>Identificación</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-3">
          <FormField label="Fecha de nacimiento" htmlFor="birthDate" error={errors.birthDate}>
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
          <FormField label="Sexo" htmlFor="sex" error={errors.sex}>
            <FormSelect control={control} name="sex" id="sex" options={SEX} />
          </FormField>
          <FormField label="Ocupación" htmlFor="occupation" error={errors.occupation}>
            <Input id="occupation" {...register('occupation')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Motivo y metas</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField label="Motivo de consulta" htmlFor="reasonForVisit" error={errors.reasonForVisit}>
            <Textarea id="reasonForVisit" {...register('reasonForVisit')} />
          </FormField>
          <FormField label="Metas" htmlFor="goals" error={errors.goals}>
            <Textarea id="goals" placeholder="Bajar de peso, mejorar digestión" {...register('goals')} />
          </FormField>
          <FormField label="Peso meta (kg)" htmlFor="weightGoalKg" error={errors.weightGoalKg}>
            <Input id="weightGoalKg" type="number" step="0.1" aria-invalid={Boolean(errors.weightGoalKg)} {...register('weightGoalKg')} />
          </FormField>
          <FormField label="Grasa corporal meta (%)" htmlFor="bodyFatGoalPct" error={errors.bodyFatGoalPct}>
            <Input id="bodyFatGoalPct" type="number" step="0.1" aria-invalid={Boolean(errors.bodyFatGoalPct)} {...register('bodyFatGoalPct')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Antecedentes patológicos</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField label="Alergias e intolerancias" htmlFor="allergies" error={errors.allergies}>
            <Input id="allergies" placeholder="Nuez, intolerancia a la lactosa" {...register('allergies')} />
          </FormField>
          <FormField label="Enfermedades" htmlFor="diseases" error={errors.diseases}>
            <Input id="diseases" {...register('diseases')} />
          </FormField>
          <FormField label="Cirugías" htmlFor="surgeries" error={errors.surgeries}>
            <Input id="surgeries" {...register('surgeries')} />
          </FormField>
          <FormField label="Medicamentos" htmlFor="medications" error={errors.medications}>
            <Input id="medications" {...register('medications')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Estilo de vida y alimentación</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField label="¿Fuma?" htmlFor="smoking" error={errors.smoking}>
            <FormSelect control={control} name="smoking" id="smoking" options={SMOKING_OPTIONS} />
          </FormField>
          <FormField label="Alcohol" htmlFor="alcoholConsumption" error={errors.alcoholConsumption}>
            <FormSelect control={control} name="alcoholConsumption" id="alcoholConsumption" options={ALCOHOL_CONSUMPTION} />
          </FormField>
          <FormField label="Actividad física" htmlFor="physicalActivity" error={errors.physicalActivity}>
            <Input id="physicalActivity" {...register('physicalActivity')} />
          </FormField>
          <FormField label="Horas de sueño" htmlFor="sleepHours" error={errors.sleepHours}>
            <Input id="sleepHours" type="number" aria-invalid={Boolean(errors.sleepHours)} {...register('sleepHours')} />
          </FormField>
          <FormField label="Comidas al día" htmlFor="mealsPerDay" error={errors.mealsPerDay}>
            <Input id="mealsPerDay" type="number" aria-invalid={Boolean(errors.mealsPerDay)} {...register('mealsPerDay')} />
          </FormField>
          <FormField label="Alimentos que le gustan" htmlFor="preferredFoods" error={errors.preferredFoods}>
            <Input id="preferredFoods" {...register('preferredFoods')} />
          </FormField>
          <FormField label="Alimentos que no le gustan" htmlFor="dislikedFoods" error={errors.dislikedFoods}>
            <Input id="dislikedFoods" {...register('dislikedFoods')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

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

export default EditarHistoriaClinicaModal
