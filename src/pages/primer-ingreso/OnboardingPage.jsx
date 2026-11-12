import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { DatePicker } from '@/components/DatePicker'
import PrimerIngresoLayout from '@/layouts/PrimerIngresoLayout'
import { useAuth } from '@/context/AuthContext'
import { useOnboarding } from '@/hooks/useOnboarding'
import { completeOnboardingRequest } from '@/api/onboarding'
import { getHomePath } from '@/lib/home-path'
import { onboardingSchema } from '@/schemas/onboarding'

// "pollo, arroz" -> ['pollo', 'arroz']
const toList = (text) => (text || '').split(',').map((item) => item.trim()).filter(Boolean)
// ['pollo', 'arroz'] -> "pollo, arroz"
const toText = (list) => (list || []).join(', ')
// "" -> undefined, "7" -> 7
const toNumber = (text) => (text ? Number(text) : undefined)

// Opciones de los selectores: { valor que se guarda: texto que se muestra }
const SEX_OPTIONS = { female: 'Femenino', male: 'Masculino' }
const SMOKING_OPTIONS = { no: 'No', yes: 'Sí' }
const ALCOHOL_OPTIONS = { never: 'Nunca', occasional: 'Ocasionalmente', frequent: 'Frecuentemente' }

// Edad cumplida a partir de "yyyy-MM-dd"
function getAge(birthDate) {
  if (!birthDate) return null
  const [year, month, day] = birthDate.split('-').map(Number)
  const today = new Date()
  const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  return today.getFullYear() - year - (hadBirthday ? 0 : 1)
}

// Select de shadcn conectado a React Hook Form con <Controller>
function FormSelect({ control, name, id, options, placeholder = 'Elige una opción', invalid }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select items={options} value={field.value || null} onValueChange={field.onChange}>
          <SelectTrigger id={id} className="w-full" aria-invalid={invalid} onBlur={field.onBlur}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(options).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}

// Paso 2 del primer ingreso: el paciente completa su expediente
function OnboardingPage() {
  const { clinicalHistory, loading, error } = useOnboarding()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <PrimerIngresoLayout
      step={2}
      title="Cuéntanos sobre ti"
      description="Con estos datos tu nutriólogo prepara tu plan. Puedes cambiarlos después en tu consulta."
    >
      {error ? <p className="text-sm text-destructive">{error}</p> : <OnboardingForm clinicalHistory={clinicalHistory} />}
    </PrimerIngresoLayout>
  )
}

function OnboardingForm({ clinicalHistory }) {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const identification = clinicalHistory.identification || {}
  const pathological = clinicalHistory.pathologicalHistory || {}
  const nonPathological = clinicalHistory.nonPathologicalHistory || {}
  const eating = clinicalHistory.eatingHabits || {}

  // El formulario empieza con lo que el nutriólogo ya haya escrito
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      birthDate: identification.birthDate ? identification.birthDate.slice(0, 10) : '',
      sex: identification.sex || '',
      occupation: identification.occupation || '',
      goals: toText(clinicalHistory.goals),
      diseases: toText(pathological.diseases),
      allergies: toText(pathological.allergies),
      medications: toText(pathological.medications),
      smoking: nonPathological.smoking ? 'yes' : 'no',
      alcoholConsumption: nonPathological.alcoholConsumption || 'never',
      physicalActivity: nonPathological.physicalActivity || '',
      sleepHours: nonPathological.sleepHours?.toString() || '',
      mealsPerDay: eating.mealsPerDay?.toString() || '',
      preferredFoods: toText(eating.preferredFoods),
      dislikedFoods: toText(eating.dislikedFoods),
    },
  })

  const age = getAge(useWatch({ control, name: 'birthDate' }))

  async function onSubmit(formData) {
    setApiError(null)
    // El back reemplaza cada sección completa, así que conservamos lo que ya tenía
    const onboardingData = {
      identification: {
        ...identification,
        birthDate: formData.birthDate,
        sex: formData.sex,
        occupation: formData.occupation,
      },
      goals: toList(formData.goals),
      pathologicalHistory: {
        ...pathological,
        diseases: toList(formData.diseases),
        allergies: toList(formData.allergies),
        medications: toList(formData.medications),
      },
      nonPathologicalHistory: {
        ...nonPathological,
        smoking: formData.smoking === 'yes',
        alcoholConsumption: formData.alcoholConsumption,
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
      await completeOnboardingRequest(onboardingData)
      const user = await refreshUser()
      toast.add({ title: '¡Listo!', description: 'Ya puedes ver tu plan', type: 'success' })
      navigate(getHomePath(user), { replace: true })
    } catch (err) {
      setApiError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldSet>
        <FieldLegend>Datos personales</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField label="Fecha de nacimiento" htmlFor="birthDate" error={errors.birthDate}>
            <Controller
              control={control}
              name="birthDate"
              render={({ field }) => (
                <DatePicker id="birthDate" value={field.value} onChange={field.onChange} invalid={Boolean(errors.birthDate)} />
              )}
            />
            {age !== null && <p className="text-sm text-muted-foreground">{age} años</p>}
          </FormField>

          <FormField label="Sexo" htmlFor="sex" error={errors.sex}>
            <FormSelect control={control} name="sex" id="sex" options={SEX_OPTIONS} invalid={Boolean(errors.sex)} />
          </FormField>

          <FormField label="Ocupación" htmlFor="occupation" error={errors.occupation}>
            <Input id="occupation" {...register('occupation')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Tus metas</FieldLegend>
        <FormField label="¿Qué te gustaría lograr? (separa con comas)" htmlFor="goals" error={errors.goals}>
          <Textarea id="goals" placeholder="Bajar de peso, comer más verduras" aria-invalid={Boolean(errors.goals)} {...register('goals')} />
        </FormField>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Salud (separa con comas)</FieldLegend>
        <FieldGroup>
          <FormField label="Enfermedades" htmlFor="diseases" error={errors.diseases}>
            <Input id="diseases" placeholder="Diabetes, hipertensión" {...register('diseases')} />
          </FormField>
          <FormField label="Alergias e intolerancias" htmlFor="allergies" error={errors.allergies}>
            <Input id="allergies" placeholder="Lactosa, nuez" {...register('allergies')} />
          </FormField>
          <FormField label="Medicamentos" htmlFor="medications" error={errors.medications}>
            <Input id="medications" {...register('medications')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Estilo de vida</FieldLegend>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField label="¿Fumas?" htmlFor="smoking" error={errors.smoking}>
            <FormSelect control={control} name="smoking" id="smoking" options={SMOKING_OPTIONS} />
          </FormField>

          <FormField label="¿Tomas alcohol?" htmlFor="alcoholConsumption" error={errors.alcoholConsumption}>
            <FormSelect control={control} name="alcoholConsumption" id="alcoholConsumption" options={ALCOHOL_OPTIONS} />
          </FormField>

          <FormField label="Actividad física" htmlFor="physicalActivity" error={errors.physicalActivity}>
            <Input id="physicalActivity" placeholder="Caminar 30 min diarios" {...register('physicalActivity')} />
          </FormField>

          <FormField label="Horas de sueño" htmlFor="sleepHours" error={errors.sleepHours}>
            <Input id="sleepHours" type="number" min="0" max="24" {...register('sleepHours')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Alimentación</FieldLegend>
        <FieldGroup>
          <FormField label="Comidas al día" htmlFor="mealsPerDay" error={errors.mealsPerDay}>
            <Input id="mealsPerDay" type="number" min="1" max="10" {...register('mealsPerDay')} />
          </FormField>
          <FormField label="Alimentos que te gustan (separa con comas)" htmlFor="preferredFoods" error={errors.preferredFoods}>
            <Input id="preferredFoods" {...register('preferredFoods')} />
          </FormField>
          <FormField label="Alimentos que no te gustan (separa con comas)" htmlFor="dislikedFoods" error={errors.dislikedFoods}>
            <Input id="dislikedFoods" {...register('dislikedFoods')} />
          </FormField>
        </FieldGroup>
      </FieldSet>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Terminar'}
      </Button>
    </form>
  )
}

export default OnboardingPage
