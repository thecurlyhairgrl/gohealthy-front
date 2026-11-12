import { useEffect, useState } from 'react'
import { Droplets, Flame, Sparkles, Utensils } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ComidaCard } from '@/components/paciente/ComidaCard'
import { EquivalentesSheet } from '@/components/paciente/EquivalentesSheet'
import { ProximaCitaCard } from '@/components/paciente/ProximaCitaCard'
import { AvisoCuestionario } from '@/components/paciente/AvisoCuestionario'
import { useActiveMealPlan } from '@/hooks/useActiveMealPlan'
import { MEAL_TIMES, getCurrentMealKey, getTodayKey } from '@/lib/meal-times'
import { WEEK_DAY } from '@/lib/labels'

/**
 * Plan alimenticio del paciente: un día a la vez, con las comidas ordenadas por hora
 * y cada una como receta. Al abrirla se ubica sola en la comida que toca.
 */
function PacientePlanAlimenticioPage() {
  const { mealPlan, loading, error } = useActiveMealPlan()
  const [day, setDay] = useState(getTodayKey())
  const [equivalentsFood, setEquivalentsFood] = useState(null)

  const isToday = day === getTodayKey()
  const currentMeal = getCurrentMealKey()

  // Al cargar el plan, baja a la comida que toca ahora
  useEffect(() => {
    if (mealPlan) {
      document.getElementById(getCurrentMealKey())?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [mealPlan])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  const menuDay = mealPlan?.menu.find((item) => item.day === day)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Mi plan alimenticio</h1>
        <p className="text-sm text-muted-foreground">{mealPlan ? mealPlan.name : 'Plan diseñado por tu nutriólogo'}</p>
      </div>

      <ProximaCitaCard />
      <AvisoCuestionario />

      {!mealPlan ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Utensils />
            </EmptyMedia>
            <EmptyTitle>Aún no tienes un plan</EmptyTitle>
            <EmptyDescription>Tu nutriólogo aún no te asigna un plan alimenticio. Aparecerá aquí en cuanto lo haga.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          {/* Metas del día */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600">
                  <Flame className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Energía al día</p>
                  <p className="font-mono text-xl font-bold">{mealPlan.targetKcal ? `${mealPlan.targetKcal.toLocaleString('es-MX')} kcal` : '—'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600">
                  <Droplets className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Agua al día</p>
                  <p className="font-mono text-xl font-bold">{mealPlan.waterLiters ? `${mealPlan.waterLiters} L` : '—'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Un día a la vez; empieza en hoy */}
          <Tabs value={day} onValueChange={setDay}>
            <TabsList className="h-auto w-full flex-wrap justify-start">
              {Object.entries(WEEK_DAY).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>
                  {label}
                  {key === getTodayKey() && ' (hoy)'}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {!menuDay || menuDay.meals.length === 0 ? (
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyTitle>Sin comidas para el {WEEK_DAY[day].toLowerCase()}</EmptyTitle>
                <EmptyDescription>Tu nutriólogo no asignó comidas para este día.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              {MEAL_TIMES.map((mealTime) => (
                <ComidaCard
                  key={mealTime.key}
                  mealTime={mealTime}
                  meal={menuDay.meals.find((meal) => meal.mealTime === mealTime.key)}
                  isCurrent={isToday && mealTime.key === currentMeal}
                  onVerEquivalentes={setEquivalentsFood}
                />
              ))}
            </div>
          )}

          {mealPlan.notes && (
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-primary" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">{mealPlan.notes}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <EquivalentesSheet food={equivalentsFood} onClose={() => setEquivalentsFood(null)} />
    </div>
  )
}

export default PacientePlanAlimenticioPage
