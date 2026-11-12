import { Activity, Scale, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateOnly } from '@/lib/dates'

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
 * Progreso del paciente: peso de las consultas y de sus registros, contra la meta,
 * y el cumplimiento del plan que contesta en el cuestionario diario.
 */
export default function ExpedienteProgresoTab({ progress, weights, loading, error, weightGoalKg }) {

  if (loading) return <Skeleton className="h-80 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>

  const initialWeight = weights[0]?.weight ?? null
  const currentWeight = weights.at(-1)?.weight ?? null
  const change = initialWeight && currentWeight ? Math.round((currentWeight - initialWeight) * 10) / 10 : null

  // Avance hacia la meta: cuánto del camino entre el peso inicial y la meta ya recorrió
  let goalProgress = null
  if (initialWeight && currentWeight && weightGoalKg && initialWeight !== weightGoalKg) {
    const percent = ((initialWeight - currentWeight) / (initialWeight - weightGoalKg)) * 100
    goalProgress = Math.max(0, Math.min(100, Math.round(percent)))
  }

  const adherenceData = progress.surveys.map((survey) => ({ label: formatDateOnly(survey.date), adherence: survey.planAdherence }))

  const allWeights = weights.map((item) => item.weight).concat(weightGoalKg ? [weightGoalKg] : [])
  const minY = Math.floor(Math.min(...allWeights) - 2)
  const maxY = Math.ceil(Math.max(...allWeights) + 2)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Peso inicial" value={initialWeight} unit="kg" icon={Scale} />
        <StatCard label="Peso actual" value={currentWeight} unit="kg" icon={change !== null && change > 0 ? TrendingUp : TrendingDown}>
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
        <StatCard label="Avance" value={goalProgress} unit="%" icon={Activity}>
          {goalProgress !== null && <Progress value={goalProgress} className="mt-2" />}
        </StatCard>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Evolución del peso</CardTitle>
          <CardDescription>Consultas y registros del paciente{weightGoalKg ? `, contra la meta de ${weightGoalKg} kg` : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          {weights.length < 2 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Se necesitan al menos dos registros de peso para la gráfica.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weights} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2F6B4E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2F6B4E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis domain={[minY, maxY]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit="kg" />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Peso']} />
                  {weightGoalKg && <ReferenceLine y={weightGoalKg} stroke="#ABB748" strokeDasharray="4 4" strokeWidth={2} />}
                  <Area type="monotone" dataKey="weight" stroke="#2F6B4E" strokeWidth={2.5} fill="url(#colorPeso)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
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
