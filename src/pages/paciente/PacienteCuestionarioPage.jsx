import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Skeleton } from '@/components/ui/skeleton'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { useSurveys } from '@/hooks/useSurveys'
import { createSurveyRequest } from '@/api/wellness-surveys'
import { toDateInput } from '@/lib/dates'
import { MOODS, findTodaySurvey } from '@/lib/surveys'
import { surveySchema } from '@/schemas/surveys'

/**
 * Cuestionario del día: una sola encuesta por día con cinco preguntas.
 * Si ya la contestó, muestra sus respuestas.
 */
function PacienteCuestionarioPage() {
  const { surveys, loading, error, reload } = useSurveys()

  if (loading) return <Skeleton className="h-96 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>

  const todaySurvey = findTodaySurvey(surveys)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Cuestionario del día</h1>
        <p className="text-sm text-muted-foreground first-letter:uppercase">
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>
      {todaySurvey ? <RespuestasDeHoy survey={todaySurvey} /> : <CuestionarioForm onSaved={reload} />}
    </div>
  )
}

// Lo que contestó hoy
function RespuestasDeHoy({ survey }) {
  const answers = [
    ['Ánimo', `${MOODS[survey.mood].emoji} ${MOODS[survey.mood].label}`],
    ['Horas de sueño', `${survey.sleepHours} h`],
    ['Vasos de agua', survey.waterGlasses],
    ['Actividad física', `${survey.activityMinutes} min`],
    ['Cumplimiento del plan', `${survey.planAdherence} %`],
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-primary" />
          ¡Listo! Ya contestaste hoy
        </CardTitle>
        <CardDescription>Mañana podrás contestar otra vez. Esto es lo que respondiste:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="divide-y divide-border/50">
          {answers.map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
        {survey.comment && <p className="rounded-lg bg-muted/50 p-3 text-sm">{survey.comment}</p>}
        <Link to="/paciente/cumplimiento" className={buttonVariants({ variant: 'outline' })}>
          Ver mi cumplimiento
        </Link>
      </CardContent>
    </Card>
  )
}

function CuestionarioForm({ onSaved }) {
  const [apiError, setApiError] = useState(null)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues: { mood: 0, sleepHours: '', waterGlasses: '', activityMinutes: '', planAdherence: 80, comment: '' },
  })

  async function onSubmit(formData) {
    setApiError(null)
    try {
      await createSurveyRequest({
        // La fecha local del paciente, no la de UTC
        date: toDateInput(),
        mood: formData.mood,
        sleepHours: Number(formData.sleepHours),
        waterGlasses: Number(formData.waterGlasses),
        activityMinutes: Number(formData.activityMinutes),
        planAdherence: formData.planAdherence,
        comment: formData.comment || undefined,
      })
      toast.add({ title: '¡Gracias!', description: 'Tu nutriólogo ya puede ver tus respuestas', type: 'success' })
      onSaved()
    } catch (error) {
      // 409: ya había una encuesta de hoy (por ejemplo, desde otra pestaña)
      if (error.status === 409) {
        onSaved()
      } else {
        setApiError(error.message)
      }
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {apiError && <p className="text-sm text-destructive">{apiError}</p>}

          <FieldGroup>
            <FormField label="1. ¿Cómo te sientes hoy?" htmlFor="mood" error={errors.mood}>
              <Controller
                control={control}
                name="mood"
                render={({ field }) => (
                  <div id="mood" className="grid grid-cols-5 gap-2">
                    {Object.entries(MOODS).map(([value, mood]) => (
                      <Button
                        key={value}
                        type="button"
                        variant={field.value === Number(value) ? 'default' : 'outline'}
                        className="h-auto flex-col gap-1 py-2"
                        onClick={() => field.onChange(Number(value))}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-xs">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="2. Horas que dormiste" htmlFor="sleepHours" error={errors.sleepHours}>
                <Input id="sleepHours" type="number" min="0" max="24" step="0.5" aria-invalid={Boolean(errors.sleepHours)} {...register('sleepHours')} />
              </FormField>
              <FormField label="3. Vasos de agua" htmlFor="waterGlasses" error={errors.waterGlasses}>
                <Input id="waterGlasses" type="number" min="0" max="30" aria-invalid={Boolean(errors.waterGlasses)} {...register('waterGlasses')} />
              </FormField>
              <FormField label="4. Minutos de actividad" htmlFor="activityMinutes" error={errors.activityMinutes}>
                <Input id="activityMinutes" type="number" min="0" aria-invalid={Boolean(errors.activityMinutes)} {...register('activityMinutes')} />
              </FormField>
            </div>

            <Controller
              control={control}
              name="planAdherence"
              render={({ field }) => (
                <FormField label={`5. ¿Cuánto seguiste tu plan hoy? ${field.value} %`} htmlFor="planAdherence" error={errors.planAdherence}>
                  <Slider
                    id="planAdherence"
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(Array.isArray(value) ? value[0] : value)}
                    min={0}
                    max={100}
                    step={10}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nada</span>
                    <span>Todo</span>
                  </div>
                </FormField>
              )}
            />

            <FormField label="¿Algo que quieras contarle a tu nutriólogo? (opcional)" htmlFor="comment" error={errors.comment}>
              <Textarea id="comment" {...register('comment')} />
            </FormField>
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar respuestas'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default PacienteCuestionarioPage
