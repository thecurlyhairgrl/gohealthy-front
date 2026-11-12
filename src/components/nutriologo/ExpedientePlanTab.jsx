import { useNavigate } from 'react-router-dom'
import { Droplets, Flame, Pencil, Utensils } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useActiveMealPlan } from '@/hooks/useActiveMealPlan'
import { MEAL_TIME, WEEK_DAY } from '@/lib/labels'
import { formatDate } from '@/lib/dates'

/**
 * Resumen del plan alimenticio activo. Se arma y se edita en el constructor de planes.
 */
export default function ExpedientePlanTab({ patientId }) {
  const navigate = useNavigate()
  const { mealPlan, loading, error } = useActiveMealPlan(patientId)
  const goToBuilder = () => navigate(`/nutriologo/pacientes/${patientId}/plan`)

  if (loading) return <Skeleton className="h-60 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>

  if (!mealPlan) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Utensils />
          </EmptyMedia>
          <EmptyTitle>Sin plan alimenticio</EmptyTitle>
          <EmptyDescription>Este paciente todavía no tiene un plan asignado.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={goToBuilder}>Crear plan</Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold">{mealPlan.name}</h2>
          <p className="text-xs text-muted-foreground">
            Versión {mealPlan.version} · actualizado el {formatDate(mealPlan.updatedAt)}
          </p>
        </div>
        <Button onClick={goToBuilder}>
          <Pencil data-icon="inline-start" />
          Editar plan
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-3 p-4">
            <Flame className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Energía</p>
              <p className="font-mono text-lg font-bold">{mealPlan.targetKcal ? `${mealPlan.targetKcal.toLocaleString('es-MX')} kcal` : '—'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="flex items-center gap-3 p-4">
            <Droplets className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Agua</p>
              <p className="font-mono text-lg font-bold">{mealPlan.waterLiters ? `${mealPlan.waterLiters} L al día` : '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mealPlan.menu.map((menuDay) => (
          <Card key={menuDay.day} className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{WEEK_DAY[menuDay.day]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {menuDay.meals.map((meal) => (
                <p key={meal.mealTime} className="text-sm">
                  <span className="text-muted-foreground">{MEAL_TIME[meal.mealTime]}:</span> {meal.title || 'Sin título'}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {mealPlan.notes && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recomendaciones</CardTitle>
            <CardDescription className="whitespace-pre-wrap">{mealPlan.notes}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
