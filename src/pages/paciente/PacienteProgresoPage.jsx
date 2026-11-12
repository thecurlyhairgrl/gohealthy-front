import { useState } from 'react'
import { Activity, Pencil, Plus, Scale, Target, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { GraficaPeso } from '@/components/progreso/GraficaPeso'
import { HistorialPeso } from '@/components/progreso/HistorialPeso'
import MedicionModal from '@/components/paciente/MedicionModal'
import { useProgress } from '@/hooks/useProgress'
import { useMeasurements } from '@/hooks/useMeasurements'
import { deleteMeasurementRequest } from '@/api/measurements'
import { formatDateOnly } from '@/lib/dates'
import { toWeightPoints } from '@/lib/weights'

function StatCard({ label, value, unit, icon: Icon, children }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium tracking-wider uppercase">{label}</span>
          <Icon className="size-4 text-primary" />
        </div>
        <p className="font-mono text-2xl font-bold">
          {value ?? '—'} {value !== null && value !== undefined && <span className="font-sans text-sm font-normal text-muted-foreground">{unit}</span>}
        </p>
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * Progreso del paciente: sus metas, la gráfica del peso (lo que registra él y lo que
 * anota su nutriólogo en consulta) y sus mediciones.
 */
function PacienteProgresoPage() {
  const progressState = useProgress()
  const measurementsState = useMeasurements()
  // Diálogo de medición: { measurement } para editar, {} para una nueva, null si está cerrado
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  // Después de cambiar una medición cambian la gráfica y la lista
  function reloadAll() {
    progressState.reload()
    measurementsState.reload()
  }

  async function handleDelete() {
    try {
      await deleteMeasurementRequest(toDelete._id)
      toast.add({ title: 'Medición eliminada', type: 'success' })
      reloadAll()
    } catch (error) {
      toast.add({ title: 'No se pudo eliminar', description: error.message, type: 'error' })
    }
  }

  if (progressState.loading && !progressState.progress) return <Skeleton className="h-96 w-full" />
  if (progressState.error) return <p className="text-sm text-destructive">{progressState.error}</p>

  const { goals, weights } = progressState.progress
  const points = toWeightPoints(weights)
  const change = goals.initialWeightKg && goals.currentWeightKg ? Math.round((goals.currentWeightKg - goals.initialWeightKg) * 10) / 10 : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Mi progreso</h1>
          <p className="text-sm text-muted-foreground">Tus registros y los que anota tu nutriólogo en consulta</p>
        </div>
        <Button onClick={() => setEditing({})}>
          <Plus data-icon="inline-start" />
          Registrar medición
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Peso inicial" value={goals.initialWeightKg} unit="kg" icon={Scale} />
        <StatCard label="Peso actual" value={goals.currentWeightKg} unit="kg" icon={change !== null && change > 0 ? TrendingUp : TrendingDown}>
          {change !== null && (
            <p className="mt-1 text-xs text-muted-foreground">
              {change > 0 ? '+' : ''}
              {change} kg desde el inicio
            </p>
          )}
        </StatCard>
        <StatCard label="Meta" value={goals.weightGoalKg} unit="kg" icon={Target}>
          {!goals.weightGoalKg && <p className="mt-1 text-xs text-muted-foreground">Tu nutriólogo la definirá</p>}
        </StatCard>
        <StatCard label="Avance" value={goals.goalProgressPct} unit="%" icon={Activity}>
          {goals.goalProgressPct !== null && <Progress value={goals.goalProgressPct} className="mt-2" />}
        </StatCard>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Evolución de tu peso</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <GraficaPeso points={points} weightGoalKg={goals.weightGoalKg} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Historial de peso</CardTitle>
            <CardDescription>Con la diferencia contra el registro anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <HistorialPeso points={points} />
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Mis mediciones</CardTitle>
            <CardDescription>Las que registraste tú; puedes corregirlas o borrarlas</CardDescription>
          </CardHeader>
          <CardContent>
            {measurementsState.measurements.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Aún no registras mediciones.</p>
            ) : (
              <div className="divide-y divide-border/50">
                {measurementsState.measurements.map((measurement) => (
                  <div key={measurement._id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div>
                      <p className="font-medium">
                        {measurement.weightKg} kg
                        {measurement.bodyFatPct ? ` · ${measurement.bodyFatPct} % grasa` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateOnly(measurement.date)}
                        {measurement.waistCm ? ` · cintura ${measurement.waistCm} cm` : ''}
                        {measurement.hipCm ? ` · cadera ${measurement.hipCm} cm` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Editar medición" onClick={() => setEditing({ measurement })}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" aria-label="Eliminar medición" onClick={() => setToDelete(measurement)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MedicionModal
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        measurement={editing?.measurement}
        onSaved={reloadAll}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Eliminar la medición?"
        description={toDelete && `${toDelete.weightKg} kg del ${formatDateOnly(toDelete.date)}`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default PacienteProgresoPage
