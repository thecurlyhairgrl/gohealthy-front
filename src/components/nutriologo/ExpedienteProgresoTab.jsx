import { Activity, Scale, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { GraficaPeso } from '@/components/progreso/GraficaPeso'
import { HistorialPeso } from '@/components/progreso/HistorialPeso'
import { formatDateOnly } from '@/lib/dates'
import { toWeightPoints } from '@/lib/weights'

// Tarjeta con un dato del progreso
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
 * Progreso del paciente: peso (de sus registros y de las consultas) contra la meta,
 * y el cumplimiento del plan que contesta en el cuestionario diario.
 */
export default function ExpedienteProgresoTab({ progress, loading, error }) {
  if (loading) return <Skeleton className="h-80 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>

  // El back ya junta el peso de las consultas y de las mediciones del paciente
  const points = toWeightPoints(progress.weights)
  const { initialWeightKg, currentWeightKg, weightGoalKg, goalProgressPct } = progress.goals
  const change = initialWeightKg && currentWeightKg ? Math.round((currentWeightKg - initialWeightKg) * 10) / 10 : null
  const adherenceData = progress.surveys.map((survey) => ({ label: formatDateOnly(survey.date), adherence: survey.planAdherence }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Peso inicial" value={initialWeightKg} unit="kg" icon={Scale} />
        <StatCard label="Peso actual" value={currentWeightKg} unit="kg" icon={change !== null && change > 0 ? TrendingUp : TrendingDown}>
          {change !== null && (
            <p className="mt-1 text-xs text-muted-foreground">
              {change > 0 ? '+' : ''}
              {change} kg desde el inicio
            </p>
          )}
        </StatCard>
        <StatCard label="Meta" value={weightGoalKg} unit="kg" icon={Target}>
          {!weightGoalKg && <p className="mt-1 text-xs text-muted-foreground">Defínela en la historia clínica</p>}
        </StatCard>
        <StatCard label="Avance" value={goalProgressPct} unit="%" icon={Activity}>
          {goalProgressPct !== null && <Progress value={goalProgressPct} className="mt-2" />}
        </StatCard>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Evolución del peso</CardTitle>
          <CardDescription>Lo que registra el paciente y lo que se anota en consulta</CardDescription>
        </CardHeader>
        <CardContent>
          <GraficaPeso points={points} weightGoalKg={weightGoalKg} />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Historial de peso</CardTitle>
          <CardDescription>Cada registro con su origen y la diferencia contra el anterior</CardDescription>
        </CardHeader>
        <CardContent>
          <HistorialPeso points={points} />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Cumplimiento del plan</CardTitle>
          <CardDescription>Lo que el paciente contestó en su cuestionario diario (0 a 100 %)</CardDescription>
        </CardHeader>
        <CardContent>
          {adherenceData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">El paciente todavía no contesta cuestionarios.</p>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adherenceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(value) => [`${value} %`, 'Cumplimiento']} />
                  <Bar dataKey="adherence" fill="#2F6B4E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
