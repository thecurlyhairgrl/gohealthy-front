import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Activity, HeartPulse, Scale, Utensils } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useReport } from '@/hooks/useReport'
import { getFollowUpReportRequest, getTopFoodsReportRequest, getWeightReportRequest, getWellnessReportRequest } from '@/api/reports'
import { fullName } from '@/lib/labels'
import { formatDate } from '@/lib/dates'

// Selector del periodo de un reporte
function PeriodoSelector({ days, onChange }) {
  return (
    <ToggleGroup variant="outline" size="sm" value={[String(days)]} onValueChange={(values) => values.length > 0 && onChange(Number(values[0]))}>
      {[30, 90, 180].map((value) => (
        <ToggleGroupItem key={value} value={String(value)}>
          {value} días
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

// Carga, error o vacío de cualquier reporte
function ReportState({ loading, error, empty, emptyText, children }) {
  if (loading) return <Skeleton className="h-64 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>
  if (empty) return <p className="py-10 text-center text-sm text-muted-foreground">{emptyText}</p>
  return children
}

function SeguimientoReporte() {
  const { report, loading, error } = useReport(getFollowUpReportRequest)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Seguimiento de pacientes</CardTitle>
        <CardDescription>Primero los que no tienen cita próxima, de los que llevan más días sin consulta</CardDescription>
      </CardHeader>
      <CardContent>
        <ReportState loading={loading} error={error} empty={report?.length === 0} emptyText="No tienes pacientes activos.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 font-medium">Paciente</th>
                  <th className="py-2 font-medium">Consultas</th>
                  <th className="py-2 font-medium">Última consulta</th>
                  <th className="py-2 font-medium">Próxima cita</th>
                  <th className="py-2 font-medium">Peso / meta</th>
                  <th className="py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {report?.map((patient) => (
                  <tr key={patient._id}>
                    <td className="py-2">
                      <Link to={`/nutriologo/pacientes/${patient._id}`} className="font-medium hover:underline">
                        {fullName(patient)}
                      </Link>
                    </td>
                    <td className="py-2">{patient.totalConsultations}</td>
                    <td className="py-2">
                      {patient.lastConsultation ? (
                        <>
                          {formatDate(patient.lastConsultation)}
                          <span className="text-xs text-muted-foreground"> · hace {patient.daysSinceLastConsultation} días</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Sin consultas</span>
                      )}
                    </td>
                    <td className="py-2">{patient.nextAppointment ? formatDate(patient.nextAppointment) : <span className="text-muted-foreground">—</span>}</td>
                    <td className="py-2 font-mono text-xs">
                      {patient.currentWeightKg ?? '—'} / {patient.weightGoalKg ?? '—'} kg
                    </td>
                    <td className="py-2">
                      {patient.needsFollowUp ? (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                          Agendar cita
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
                          Con cita
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportState>
      </CardContent>
    </Card>
  )
}

function PesoReporte() {
  const [days, setDays] = useState(90)
  const { report, loading, error } = useReport(getWeightReportRequest, days)
  const data = (report?.patients || []).map((patient) => ({ ...patient, label: `${patient.firstName} ${patient.paternalLastName}` }))

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base">Evolución de peso</CardTitle>
          <CardDescription>Cambio de peso de cada paciente en el periodo (mediciones y consultas)</CardDescription>
        </div>
        <PeriodoSelector days={days} onChange={setDays} />
      </CardHeader>
      <CardContent className="space-y-6">
        <ReportState loading={loading} error={error} empty={data.length === 0} emptyText="Nadie tiene registros de peso en este periodo.">
          <div className="w-full" style={{ height: Math.max(220, data.length * 44) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/50" />
                {/* El eje siempre incluye el 0, para que cada barra parta de "sin cambio" */}
                <XAxis
                  type="number"
                  domain={[(min) => Math.min(0, Math.floor(min)), (max) => Math.max(0, Math.ceil(max))]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  unit=" kg"
                />
                <YAxis type="category" dataKey="label" width={140} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} kg`, 'Cambio']} />
                <ReferenceLine x={0} className="stroke-border" />
                <Bar dataKey="changeKg" radius={4}>
                  {data.map((patient) => (
                    <Cell key={patient._id} fill={patient.changeKg <= 0 ? '#2F6B4E' : '#D97706'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 font-medium">Paciente</th>
                <th className="py-2 font-medium">Inicial</th>
                <th className="py-2 font-medium">Actual</th>
                <th className="py-2 font-medium">Cambio</th>
                <th className="py-2 font-medium">Registros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-xs">
              {data.map((patient) => (
                <tr key={patient._id}>
                  <td className="py-2 font-sans text-sm">{patient.label}</td>
                  <td className="py-2">{patient.initialWeightKg} kg</td>
                  <td className="py-2">{patient.currentWeightKg} kg</td>
                  <td className={`py-2 ${patient.changeKg <= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {patient.changeKg > 0 ? '+' : ''}
                    {patient.changeKg} kg ({patient.changePct} %)
                  </td>
                  <td className="py-2">{patient.totalMeasurements}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportState>
      </CardContent>
    </Card>
  )
}

function BienestarReporte() {
  const [days, setDays] = useState(30)
  const { report, loading, error } = useReport(getWellnessReportRequest, days)
  const conditions = report?.conditions || []

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base">Bienestar por padecimiento</CardTitle>
          <CardDescription>Promedios de los cuestionarios diarios, agrupados por las enfermedades de la historia clínica</CardDescription>
        </div>
        <PeriodoSelector days={days} onChange={setDays} />
      </CardHeader>
      <CardContent className="space-y-6">
        <ReportState loading={loading} error={error} empty={conditions.length === 0} emptyText="No hay cuestionarios de pacientes con padecimientos en este periodo.">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditions} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                <XAxis dataKey="condition" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={(value) => [`${value} %`, 'Cumplimiento del plan']} />
                <Bar dataKey="avgPlanAdherence" fill="#2F6B4E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 font-medium">Padecimiento</th>
                  <th className="py-2 font-medium">Pacientes</th>
                  <th className="py-2 font-medium">Cuestionarios</th>
                  <th className="py-2 font-medium">Ánimo (1-5)</th>
                  <th className="py-2 font-medium">Sueño</th>
                  <th className="py-2 font-medium">Agua</th>
                  <th className="py-2 font-medium">Actividad</th>
                  <th className="py-2 font-medium">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {conditions.map((item) => (
                  <tr key={item.condition}>
                    <td className="py-2 font-medium">{item.condition}</td>
                    <td className="py-2">{item.patientsCount}</td>
                    <td className="py-2">{item.totalSurveys}</td>
                    <td className="py-2">{item.avgMood}</td>
                    <td className="py-2">{item.avgSleepHours} h</td>
                    <td className="py-2">{item.avgWaterGlasses} vasos</td>
                    <td className="py-2">{item.avgActivityMinutes} min</td>
                    <td className="py-2">{item.avgPlanAdherence} %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportState>
      </CardContent>
    </Card>
  )
}

function AlimentosReporte() {
  const { report, loading, error } = useReport(getTopFoodsReportRequest)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alimentos más usados</CardTitle>
        <CardDescription>Los 10 alimentos que más aparecen en los planes activos</CardDescription>
      </CardHeader>
      <CardContent>
        <ReportState loading={loading} error={error} empty={report?.length === 0} emptyText="Aún no hay planes activos.">
          <ol className="divide-y divide-border/50">
            {report?.map((item, index) => (
              <li key={`${item.food}-${item.groupKey}`} className="flex items-center gap-3 py-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.food}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.groupName}
                    {item.subgroup && ` (${item.subgroup.toLowerCase()})`}
                  </p>
                </div>
                <span className="text-right text-xs text-muted-foreground">
                  <span className="block font-mono text-sm font-semibold text-foreground">{item.timesUsed} veces</span>
                  en {item.plansCount} {item.plansCount === 1 ? 'plan' : 'planes'}
                </span>
              </li>
            ))}
          </ol>
        </ReportState>
      </CardContent>
    </Card>
  )
}

const TABS = [
  { value: 'seguimiento', label: 'Seguimiento', icon: Activity, component: SeguimientoReporte },
  { value: 'peso', label: 'Evolución de peso', icon: Scale, component: PesoReporte },
  { value: 'bienestar', label: 'Bienestar', icon: HeartPulse, component: BienestarReporte },
  { value: 'alimentos', label: 'Alimentos', icon: Utensils, component: AlimentosReporte },
]

/**
 * Los cuatro reportes del nutriólogo.
 */
function NutricionistaReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Reportes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cómo van tus pacientes en conjunto</p>
      </div>
      <Tabs defaultValue="seguimiento">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="pt-4">
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default NutricionistaReportesPage
