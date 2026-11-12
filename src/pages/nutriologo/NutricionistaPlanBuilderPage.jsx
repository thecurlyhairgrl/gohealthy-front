import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, History, Save } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { PlanDistribucionTabla } from '@/components/nutriologo/plan/PlanDistribucionTabla'
import { PlanComidaEditor } from '@/components/nutriologo/plan/PlanComidaEditor'
import { RecetaPickerDialog } from '@/components/nutriologo/plan/RecetaPickerDialog'
import { CopiarDiaDialog } from '@/components/nutriologo/plan/CopiarDiaDialog'
import { MotivoCambioDialog } from '@/components/nutriologo/plan/MotivoCambioDialog'
import { PlanHistorialSheet } from '@/components/nutriologo/plan/PlanHistorialSheet'
import { usePatientDetail } from '@/hooks/usePatientDetail'
import { useActiveMealPlan } from '@/hooks/useActiveMealPlan'
import { useConsultations } from '@/hooks/useConsultations'
import { useSmaeGroups } from '@/hooks/useSmaeGroups'
import { useRecipes } from '@/hooks/useRecipes'
import { createMealPlanRequest, updateMealPlanRequest } from '@/api/meal-plans'
import { DAYS, emptyPlan, formToPlan, mealFromRecipe, planToForm } from '@/lib/meal-plan'
import { MEAL_TIMES } from '@/lib/meal-times'
import { WEEK_DAY, fullName } from '@/lib/labels'

/**
 * Constructor del plan alimenticio de un paciente.
 * Primero carga todo lo que necesita y después monta el editor.
 */
function NutricionistaPlanBuilderPage() {
  const { id } = useParams()
  const patientState = usePatientDetail(id)
  const planState = useActiveMealPlan(id)
  const consultationsState = useConsultations(id)
  const { groups, loading: loadingGroups } = useSmaeGroups()
  const { recipes, loading: loadingRecipes } = useRecipes()

  const loading = patientState.loading || planState.loading || consultationsState.loading || loadingGroups || loadingRecipes
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }
  const error = patientState.error || planState.error || consultationsState.error
  if (error) return <p className="text-sm text-destructive">{error}</p>

  // Las kcal meta salen de la última consulta con cálculo energético
  const lastTargetKcal = consultationsState.consultations.find((consultation) => consultation.energyCalculation?.targetKcal)?.energyCalculation.targetKcal

  return (
    <PlanBuilder
      patient={patientState.detail.patient}
      plan={planState.mealPlan}
      lastTargetKcal={lastTargetKcal}
      groups={groups}
      recipes={recipes}
    />
  )
}

function PlanBuilder({ patient, plan, lastTargetKcal, groups, recipes }) {
  const navigate = useNavigate()
  // El plan que se está editando, en la forma de lib/meal-plan.js
  const [form, setForm] = useState(() => {
    if (plan) return planToForm(plan)
    const newPlan = emptyPlan()
    newPlan.targetKcal = lastTargetKcal ? String(lastTargetKcal) : ''
    return newPlan
  })
  const [planId, setPlanId] = useState(plan?._id || null)
  const [version, setVersion] = useState(plan?.version || null)
  const [day, setDay] = useState('monday')
  const [pickingFor, setPickingFor] = useState(null) // el horario de comida al que se le elige receta
  const [copyingDay, setCopyingDay] = useState(null)
  const [isReasonOpen, setIsReasonOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  // Cambia (o quita, con null) una comida del día seleccionado
  function setMeal(mealKey, meal) {
    setForm((current) => {
      const dayMeals = { ...current.menu[day] }
      if (meal) dayMeals[mealKey] = meal
      else delete dayMeals[mealKey]
      return { ...current, menu: { ...current.menu, [day]: dayMeals } }
    })
  }

  function handleCopyDay(targets) {
    setForm((current) => {
      const menu = { ...current.menu }
      for (const target of targets) {
        menu[target] = structuredClone(current.menu[copyingDay])
      }
      return { ...current, menu }
    })
    toast.add({ title: `Se copió el ${WEEK_DAY[copyingDay].toLowerCase()}`, type: 'success' })
    setCopyingDay(null)
  }

  async function save(reason) {
    const data = formToPlan(form)
    if (!data.name?.trim()) {
      toast.add({ title: 'Escribe el nombre del plan', type: 'error' })
      return
    }
    if (data.menu.length === 0) {
      toast.add({ title: 'Asigna al menos una comida', type: 'error' })
      return
    }

    setSaving(true)
    try {
      const saved = planId
        ? await updateMealPlanRequest(planId, { ...data, reason })
        : await createMealPlanRequest({ ...data, patientId: patient._id })
      setPlanId(saved._id)
      setVersion(saved.version)
      setIsReasonOpen(false)
      toast.add({ title: planId ? `Plan actualizado (versión ${saved.version})` : 'Plan creado', description: 'El paciente ya lo puede ver', type: 'success' })
    } catch (error) {
      toast.add({ title: 'No se pudo guardar el plan', description: error.message, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const mealsInDay = Object.keys(form.menu[day]).length

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/nutriologo/pacientes/${patient._id}`)} className="-ml-2 text-muted-foreground">
        <ArrowLeft data-icon="inline-start" />
        Volver al expediente
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">{planId ? 'Editar plan' : 'Nuevo plan'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {fullName(patient)}
            {version && ` · versión ${version}`}
          </p>
        </div>
        <div className="flex gap-2">
          {planId && (
            <Button variant="outline" onClick={() => setIsHistoryOpen(true)}>
              <History data-icon="inline-start" />
              Historial
            </Button>
          )}
          <Button disabled={saving} onClick={() => (planId ? setIsReasonOpen(true) : save())}>
            <Save data-icon="inline-start" />
            {saving ? 'Guardando...' : 'Guardar plan'}
          </Button>
        </div>
      </div>

      {/* 1. Datos y meta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Datos del plan</CardTitle>
          <CardDescription>
            {lastTargetKcal ? `La última consulta calculó ${lastTargetKcal} kcal.` : 'No hay una consulta con cálculo energético; escribe la meta.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
            <FormField label="Nombre" htmlFor="name">
              <Input id="name" value={form.name} onChange={(event) => setField('name', event.target.value)} />
            </FormField>
            <FormField label="Kcal al día" htmlFor="targetKcal">
              <Input id="targetKcal" type="number" step="10" value={form.targetKcal} onChange={(event) => setField('targetKcal', event.target.value)} />
            </FormField>
            <FormField label="Agua (litros)" htmlFor="waterLiters">
              <Input id="waterLiters" type="number" step="0.1" value={form.waterLiters} onChange={(event) => setField('waterLiters', event.target.value)} />
            </FormField>
            <div className="sm:col-span-3">
              <FormField label="Recomendaciones para el paciente" htmlFor="notes">
                <Textarea id="notes" value={form.notes} onChange={(event) => setField('notes', event.target.value)} />
              </FormField>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* 2. Distribución de equivalentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Distribución de equivalentes</CardTitle>
          <CardDescription>Cuántos equivalentes de cada grupo van en cada comida. Las kcal se calculan solas.</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanDistribucionTabla
            distribution={form.distribution}
            groups={groups}
            targetKcal={form.targetKcal}
            onChange={(distribution) => setField('distribution', distribution)}
          />
        </CardContent>
      </Card>

      {/* 3. Menú por día */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">3. Menú</CardTitle>
          <CardDescription>
            Elige una receta o alimentos sueltos para cada comida. El contador compara con la distribución: avisa, pero no bloquea. Los días son
            opcionales.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={day} onValueChange={setDay}>
              <TabsList className="h-auto flex-wrap justify-start">
                {DAYS.map((item) => (
                  <TabsTrigger key={item} value={item}>
                    {WEEK_DAY[item]}
                    {Object.keys(form.menu[item]).length > 0 && ` (${Object.keys(form.menu[item]).length})`}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" disabled={mealsInDay === 0} onClick={() => setCopyingDay(day)}>
              <Copy data-icon="inline-start" />
              Copiar día
            </Button>
          </div>

          <div className="space-y-3">
            {MEAL_TIMES.map((mealTime) => (
              <PlanComidaEditor
                key={`${day}-${mealTime.key}`}
                mealTime={mealTime}
                meal={form.menu[day][mealTime.key]}
                planned={form.distribution[mealTime.key]}
                groups={groups}
                onChange={(meal) => setMeal(mealTime.key, meal)}
                onElegirReceta={() => setPickingFor(mealTime)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={saving} onClick={() => (planId ? setIsReasonOpen(true) : save())}>
          <Save data-icon="inline-start" />
          {saving ? 'Guardando...' : 'Guardar plan'}
        </Button>
      </div>

      <RecetaPickerDialog
        mealTime={pickingFor}
        recipes={recipes}
        groups={groups}
        onClose={() => setPickingFor(null)}
        onSelect={(recipe) => {
          setMeal(pickingFor.key, mealFromRecipe(recipe, pickingFor.key))
          setPickingFor(null)
        }}
      />
      <CopiarDiaDialog day={copyingDay} onCopy={handleCopyDay} onClose={() => setCopyingDay(null)} />
      <MotivoCambioDialog open={isReasonOpen} saving={saving} onConfirm={save} onClose={() => setIsReasonOpen(false)} />
      {planId && <PlanHistorialSheet planId={planId} open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />}
    </div>
  )
}

export default NutricionistaPlanBuilderPage
