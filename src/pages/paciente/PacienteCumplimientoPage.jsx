import { Link } from 'react-router-dom'
import { CalendarCheck, Droplets, Flame, Target } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useSurveys } from '@/hooks/useSurveys'
import { formatDateOnly, toDateInput } from '@/lib/dates'
import { WATER_GOAL_GLASSES, findTodaySurvey, getStreak } from '@/lib/surveys'

const DAY_LETTERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

// Los últimos 7 días, del más viejo a hoy
function getLastWeek() {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date()
    day.setDate(day.getDate() - (6 - index))
    return day
  })
}

function StatCard({ icon: Icon, label, value, children }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between text-muted-foreground">
          <span className="text-xs font-medium tracking-wider uppercase">{label}</span>
          <Icon className="size-4 text-primary" />
        </div>
        <p className="font-mono text-2xl font-bold">{value}</p>
        {children}
      </CardContent>
    </Card>
  )
}

/**
 * Cumplimiento del plan: solo muestra lo que el paciente contestó en sus cuestionarios.
 */
function PacienteCumplimientoPage() {
  const { surveys, loading, error } = useSurveys()

  if (loading) return <Skeleton className="h-96 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>

  if (surveys.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarCheck />
          </EmptyMedia>
          <EmptyTitle>Aún no hay datos</EmptyTitle>
          <EmptyDescription>Tu cumplimiento se arma con el cuestionario del día. Contesta el primero para empezar.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link to="/paciente/cuestionario" className={buttonVariants()}>
            Contestar el cuestionario
          </Link>
        </EmptyContent>
      </Empty>
    )
  }

  const today = findTodaySurvey(surveys)
  const streak = getStreak(surveys)
  const lastWeek = getLastWeek()
  const byDay = new Map(surveys.map((survey) => [survey.date.slice(0, 10), survey]))
  const weekSurveys = lastWeek.map((day) => byDay.get(toDateInput(day))).filter(Boolean)
  const weekAverage = weekSurveys.length
    ? Math.round(weekSurveys.reduce((sum, survey) => sum + survey.planAdherence, 0) / weekSurveys.length)
    : null

  // Las encuestas vienen de la más nueva a la más vieja; la gráfica va al revés
  const chartData = surveys
    .slice(0, 14)
    .reverse()
    .map((survey) => ({ label: formatDateOnly(survey.date), adherence: survey.planAdherence }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Mi cumplimiento</h1>
        <p className="text-sm text-muted-foreground">Sale de lo que contestas en el cuestionario del día</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Flame} label="Racha" value={`${streak} ${streak === 1 ? 'día' : 'días'}`}>
          <p className="mt-1 text-xs text-muted-foreground">seguidos con cuestionario</p>
        </StatCard>
        <StatCard icon={Target} label="Plan esta semana" value={weekAverage !== null ? `${weekAverage} %` : '—'}>
          {weekAverage !== null && <Progress value={weekAverage} className="mt-2" />}
        </StatCard>
        <StatCard icon={Droplets} label="Agua hoy" value={today ? `${today.waterGlasses} / ${WATER_GOAL_GLASSES}` : '—'}>
          <p className="mt-1 text-xs text-muted-foreground">{today ? 'vasos' : 'Contesta el cuestionario de hoy'}</p>
        </StatCard>
        <StatCard icon={CalendarCheck} label="Plan hoy" value={today ? `${today.planAdherence} %` : '—'}>
          {today && <Progress value={today.planAdherence} className="mt-2" />}
        </StatCard>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Últimos 7 días</CardTitle>
          <CardDescription>Los días en verde contestaste el cuestionario</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between gap-2">
          {lastWeek.map((day) => {
            const survey = byDay.get(toDateInput(day))
            return (
              <div key={day.toISOString()} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{DAY_LETTERS[day.getDay()]}</span>
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-xs font-semibold ${
                    survey ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {survey ? `${survey.planAdherence}` : day.getDate()}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Cumplimiento del plan</CardTitle>
          <CardDescription>Tus últimos 14 cuestionarios (0 a 100 %)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(value) => [`${value} %`, 'Cumplimiento']} />
                <Bar dataKey="adherence" fill="#2F6B4E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PacienteCumplimientoPage
