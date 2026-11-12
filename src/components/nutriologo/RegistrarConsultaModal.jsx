import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { FormSelect } from '@/components/FormSelect'
import { DatePicker } from '@/components/DatePicker'
import { useAppointments } from '@/context/AppointmentsContext'
import { usePatientDetail } from '@/hooks/usePatientDetail'
import { useConsultations } from '@/hooks/useConsultations'
import { createConsultationRequest } from '@/api/consultations'
import { ACTIVITY_FACTORS, ENERGY_FORMULAS, getBasalEnergy, getBmi } from '@/lib/energy'
import { getAge, toDateInput } from '@/lib/dates'
import { fullName, SEX } from '@/lib/labels'
import { toNumber } from '@/lib/lists'
import { consultationSchema } from '@/schemas/consultations'

/**
 * Diálogo para registrar una consulta: medidas, calculadora energética y notas.
 * Si viene de una cita (`appointment`), la cita queda como completada.
 */
function RegistrarConsultaModal({ open, onOpenChange, patientId, appointment, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {open && (
          <ConsultaLoader
            patientId={patientId}
            appointment={appointment}
            onSaved={onSaved}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

// Carga el sexo, la edad y la última estatura del paciente para la calculadora
function ConsultaLoader({ patientId, ...props }) {
  const { detail, loading, error } = usePatientDetail(patientId)
  const { consultations, loading: loadingConsultations } = useConsultations(patientId)

  if (loading || loadingConsultations) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  const lastHeight = consultations.find((consultation) => consultation.measurements?.heightCm)?.measurements.heightCm
  return <ConsultaForm detail={detail} lastHeight={lastHeight} {...props} />
}

function ConsultaForm({ detail, lastHeight, appointment, onSaved, onClose }) {
  const { reloadAppointments } = useAppointments()
  const [apiError, setApiError] = useState(null)
  const { patient, clinicalHistory } = detail
  const sex = clinicalHistory.identification?.sex
  const age = getAge(clinicalHistory.identification?.birthDate)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      date: toDateInput(appointment ? new Date(appointment.dateTime) : new Date()),
      weightKg: '',
      heightCm: lastHeight ? String(lastHeight) : '',
      waistCm: '',
      hipCm: '',
      bodyFatPct: '',
      systolicPressure: '',
      diastolicPressure: '',
      formula: 'mifflin-st-jeor',
      activityFactor: '1.375',
      targetKcal: '',
      diagnosis: '',
      instructions: '',
      notes: '',
    },
  })

  // La calculadora se actualiza mientras se escribe
  const [weightKg, heightCm, formula, activityFactor] = useWatch({ control, name: ['weightKg', 'heightCm', 'formula', 'activityFactor'] })
  const bmi = getBmi(Number(weightKg), Number(heightCm))
  const basalEnergy = getBasalEnergy({ formula, sex, weightKg: Number(weightKg), heightCm: Number(heightCm), age })
  const totalEnergy = basalEnergy ? Math.round(basalEnergy * Number(activityFactor)) : null

  async function onSubmit(formData) {
    setApiError(null)
    const [year, month, day] = formData.date.split('-').map(Number)

    const consultationData = {
      patientId: patient._id,
      appointmentId: appointment?._id,
      // Mediodía local, para que la fecha no cambie por la zona horaria
      date: new Date(year, month - 1, day, 12).toISOString(),
      measurements: {
        weightKg: toNumber(formData.weightKg),
        heightCm: toNumber(formData.heightCm),
        waistCm: toNumber(formData.waistCm),
        hipCm: toNumber(formData.hipCm),
        bodyFatPct: toNumber(formData.bodyFatPct),
        systolicPressure: toNumber(formData.systolicPressure),
        diastolicPressure: toNumber(formData.diastolicPressure),
      },
      diagnosis: formData.diagnosis,
      instructions: formData.instructions,
      notes: formData.notes,
    }

    // Solo se guarda el cálculo si se pudo hacer
    if (basalEnergy) {
      consultationData.energyCalculation = {
        formula: formData.formula,
        activityFactor: Number(formData.activityFactor),
        basalEnergyExpenditure: basalEnergy,
        totalEnergyExpenditure: totalEnergy,
        targetKcal: toNumber(formData.targetKcal) ?? totalEnergy,
      }
    }

    try {
      await createConsultationRequest(consultationData)
      if (appointment) {
        reloadAppointments()
      }
      toast.add({ title: 'Consulta registrada', type: 'success' })
      onSaved?.()
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  const numberInput = (name, props = {}) => (
    <Input id={name} type="number" step="0.1" inputMode="decimal" aria-invalid={Boolean(errors[name])} {...register(name)} {...props} />
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Registrar consulta</DialogTitle>
        <DialogDescription>
          {fullName(patient)}
          {age !== null && ` · ${age} años`}
          {sex && ` · ${SEX[sex]}`}
        </DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldSet>
        <FieldLegend>Medidas</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-3">
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
          <FormField label="Estatura (cm)" htmlFor="heightCm" error={errors.heightCm}>
            {numberInput('heightCm')}
          </FormField>
          <FormField label="Cintura (cm)" htmlFor="waistCm" error={errors.waistCm}>
            {numberInput('waistCm')}
          </FormField>
          <FormField label="Cadera (cm)" htmlFor="hipCm" error={errors.hipCm}>
            {numberInput('hipCm')}
          </FormField>
          <FormField label="Grasa corporal (%)" htmlFor="bodyFatPct" error={errors.bodyFatPct}>
            {numberInput('bodyFatPct')}
          </FormField>
          <FormField label="Presión sistólica" htmlFor="systolicPressure" error={errors.systolicPressure}>
            {numberInput('systolicPressure', { step: '1' })}
          </FormField>
          <FormField label="Presión diastólica" htmlFor="diastolicPressure" error={errors.diastolicPressure}>
            {numberInput('diastolicPressure', { step: '1' })}
          </FormField>
          <div className="space-y-1 rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">IMC</p>
            <p className="font-mono text-lg font-semibold">{bmi ?? '—'}</p>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Calculadora energética</FieldLegend>
        {!sex || age === null ? (
          <p className="text-sm text-muted-foreground">
            Para calcular falta el sexo o la fecha de nacimiento en la historia clínica del paciente.
          </p>
        ) : (
          !basalEnergy && <p className="text-sm text-muted-foreground">Escribe el peso y la estatura para calcular.</p>
        )}
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField label="Fórmula" htmlFor="formula" error={errors.formula}>
            <FormSelect control={control} name="formula" id="formula" options={ENERGY_FORMULAS} />
          </FormField>
          <FormField label="Factor de actividad" htmlFor="activityFactor" error={errors.activityFactor}>
            <FormSelect control={control} name="activityFactor" id="activityFactor" options={ACTIVITY_FACTORS} />
          </FormField>
          <div className="grid grid-cols-2 gap-3 sm:col-span-2">
            <div className="space-y-1 rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Gasto basal (GEB)</p>
              <p className="font-mono text-lg font-semibold">{basalEnergy ? `${basalEnergy} kcal` : '—'}</p>
            </div>
            <div className="space-y-1 rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Gasto total (GET = GEB × factor)</p>
              <p className="font-mono text-lg font-semibold">{totalEnergy ? `${totalEnergy} kcal` : '—'}</p>
            </div>
          </div>
          <FormField label="Kcal meta (vacío = GET)" htmlFor="targetKcal" error={errors.targetKcal}>
            {numberInput('targetKcal', { step: '10', placeholder: totalEnergy ? String(totalEnergy) : '' })}
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Notas</FieldLegend>
        <FieldGroup>
          <FormField label="Diagnóstico" htmlFor="diagnosis" error={errors.diagnosis}>
            <Textarea id="diagnosis" {...register('diagnosis')} />
          </FormField>
          <FormField label="Indicaciones para el paciente" htmlFor="instructions" error={errors.instructions}>
            <Textarea id="instructions" {...register('instructions')} />
          </FormField>
          <FormField label="Notas internas" htmlFor="notes" error={errors.notes}>
            <Textarea id="notes" {...register('notes')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar consulta'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default RegistrarConsultaModal
