import { useState, useMemo } from 'react'
import {
  Scale,
  Activity,
  Utensils,
  Heart,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

/**
 * Tooltip personalizado para la gráfica de evolución del paciente.
 */
function CustomChartTooltip({ active, payload, metricaActiva }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const esPeso = metricaActiva === 'peso'

    return (
      <div className="rounded-xl border border-border/80 bg-card/95 p-3 shadow-lg backdrop-blur-xs text-xs space-y-1.5 z-50 min-w-[190px]">
        <div className="flex items-center justify-between border-b border-border/50 pb-1">
          <span className="font-semibold text-foreground font-mono">{data.fecha}</span>
          <span className="text-[10px] text-muted-foreground">Evaluación</span>
        </div>
        <div className="flex items-baseline gap-2">
          {esPeso ? (
            <>
              <span className="font-mono text-base font-bold text-[#2F6B4E]">
                {data.peso} kg
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {data.grasa}% grasa
              </span>
            </>
          ) : (
            <>
              <span className="font-mono text-base font-bold text-[#2F6B4E]">
                {data.grasa}% grasa
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {data.apego}% apego
              </span>
            </>
          )}
        </div>
        {data.nota && (
          <p className="text-muted-foreground text-[11px] leading-snug italic pt-0.5 border-t border-border/40">
            &ldquo;{data.nota}&rdquo;
          </p>
        )}
      </div>
    )
  }
  return null
}

/**
 * Componente principal de Progreso del Paciente.
 * Muestra métricas clave con comparativas respecto a la semana previa,
 * barra de progreso general, gráfica de evolución temporal interactiva con Recharts
 * e historial de notas y retroalimentación del nutriólogo.
 */
export default function PacienteProgreso({ datosProgreso }) {
  const [metricaActiva, setMetricaActiva] = useState('peso') // 'peso' | 'grasa'

  const { meta, metricasComparativa, evolucionTemporal } = datosProgreso

  // Cálculo del rango del eje Y dinámico para la métrica activa
  const { minY, maxY } = useMemo(() => {
    if (metricaActiva === 'peso') {
      const valores = evolucionTemporal.map((d) => d.peso)
      if (meta?.pesoMeta) valores.push(meta.pesoMeta)
      const min = Math.min(...valores)
      const max = Math.max(...valores)
      return {
        minY: Math.floor(min - 2),
        maxY: Math.ceil(max + 2),
      }
    } else {
      const valores = evolucionTemporal.map((d) => d.grasa)
      if (meta?.grasaMeta) valores.push(meta.grasaMeta)
      const min = Math.min(...valores)
      const max = Math.max(...valores)
      return {
        minY: Math.floor(min - 2),
        maxY: Math.ceil(max + 2),
      }
    }
  }, [metricaActiva, evolucionTemporal, meta])

  const pesoPerdido = useMemo(() => {
    if (meta?.pesoInicial && meta?.pesoActual) {
      return (meta.pesoInicial - meta.pesoActual).toFixed(1)
    }
    return '0.0'
  }, [meta])

  const pesoRestante = useMemo(() => {
    if (meta?.pesoActual && meta?.pesoMeta) {
      return Math.max(0, meta.pesoActual - meta.pesoMeta).toFixed(1)
    }
    return '0.0'
  }, [meta])

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
          Mi Progreso y Evolución
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Monitoreo de tus métricas corporales, cumplimiento de metas y evolución semana a semana
        </p>
      </div>

      {/* Grid de Métricas Principales con Comparativas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card: Peso Actual */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Peso Actual
              </span>
              <Scale className="size-4 text-[#2F6B4E]" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-foreground">
                {meta.pesoActual}
              </span>
              <span className="text-xs font-sans text-muted-foreground ml-1">kg</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <ArrowDownRight className="size-3.5" />
              <span>{Math.abs(metricasComparativa.cambioPesoSemana)} kg vs sem. previa</span>
            </div>
          </CardContent>
        </Card>

        {/* Card: % Grasa Corporal */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                % Grasa
              </span>
              <Activity className="size-4 text-[#2F6B4E]" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-foreground">
                {meta.grasaActual}
              </span>
              <span className="text-xs font-sans text-muted-foreground ml-1">%</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <ArrowDownRight className="size-3.5" />
              <span>{Math.abs(metricasComparativa.cambioGrasaSemana)}% vs sem. previa</span>
            </div>
          </CardContent>
        </Card>

        {/* Card: Apego al Plan */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Apego Dieta
              </span>
              <Utensils className="size-4 text-[#ABB748]" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-foreground">
                {meta.apegoPromedio}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F6B4E] bg-[#ABB748]/20 px-2 py-0.5 rounded-md">
              <ArrowUpRight className="size-3.5" />
              <span>+{metricasComparativa.cambioApegoSemana}% vs sem. previa</span>
            </div>
          </CardContent>
        </Card>

        {/* Card: Índice IMC */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Índice IMC
              </span>
              <Heart className="size-4 text-rose-500/80" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold font-mono text-foreground truncate block">
                {meta.imcActual}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="size-3.5" />
              <span>Rango óptimo</span>
            </div>
          </CardContent>
        </Card>

        {/* Card: Meta Final */}
        <Card className="col-span-2 sm:col-span-1 border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Meta Acordada
              </span>
              <TrendingDown className="size-4 text-[#ABB748]" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-foreground">
                {meta.pesoMeta}
              </span>
              <span className="text-xs font-sans text-muted-foreground ml-1">kg</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
              <span>{pesoRestante} kg restantes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarjeta de Avance de Meta Final */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-[#ABB748]" />
                <span>Avance hacia tu Meta Final</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Objetivo actual: <strong className="text-foreground">{meta.objetivo}</strong>
              </CardDescription>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground">Progreso global:</span>
              <span className="font-mono text-2xl font-bold text-[#2F6B4E]">
                {meta.progresoPorcentaje}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={meta.progresoPorcentaje} className="h-3 bg-muted" />
          <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
            <span>Inicio: {meta.pesoInicial} kg</span>
            <span className="text-[#2F6B4E] font-medium font-sans">
              -{pesoPerdido} kg logrados
            </span>
            <span>Meta: {meta.pesoMeta} kg</span>
          </div>
        </CardContent>
      </Card>

      {/* Gráfica de Evolución Temporal (Recharts) */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="size-4 text-[#2F6B4E]" />
                <span>
                  {metricaActiva === 'peso'
                    ? 'Curva de Evolución de Peso (kg)'
                    : 'Curva de Composición de Grasa (%)'}
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                {metricaActiva === 'peso'
                  ? `Comportamiento en cada registro vs tu meta acordada de ${meta.pesoMeta} kg`
                  : `Reducción progresiva de porcentaje de grasa vs objetivo de ${meta.grasaMeta}%`}
              </CardDescription>
            </div>

            {/* Alternar métrica de la gráfica */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg w-fit border border-border/40">
              <button
                type="button"
                onClick={() => setMetricaActiva('peso')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  metricaActiva === 'peso'
                    ? 'bg-background text-[#2F6B4E] shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Peso (kg)
              </button>
              <button
                type="button"
                onClick={() => setMetricaActiva('grasa')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                  metricaActiva === 'grasa'
                    ? 'bg-background text-[#2F6B4E] shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                % Grasa
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[270px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={evolucionTemporal}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMetrica" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6B4E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2F6B4E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border/50"
                  vertical={false}
                />
                <XAxis
                  dataKey="fecha"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground font-mono"
                />
                <YAxis
                  domain={[minY, maxY]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  className="text-muted-foreground font-mono"
                  unit={metricaActiva === 'peso' ? 'kg' : '%'}
                />
                <Tooltip
                  content={<CustomChartTooltip metricaActiva={metricaActiva} />}
                />
                <ReferenceLine
                  y={metricaActiva === 'peso' ? meta.pesoMeta : meta.grasaMeta}
                  stroke="#ABB748"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Meta ${metricaActiva === 'peso' ? `${meta.pesoMeta} kg` : `${meta.grasaMeta}%`}`,
                    position: 'insideBottomRight',
                    fill: '#ABB748',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={metricaActiva === 'peso' ? 'peso' : 'grasa'}
                  stroke="#2F6B4E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMetrica)"
                  dot={{ r: 4, fill: '#2F6B4E', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#2F6B4E', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Historial Comparativo y Notas del Nutriólogo */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="size-4 text-[#2F6B4E]" />
            <span>Historial de Evaluaciones y Retroalimentación</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Registro cronológico de tus avances y recomendaciones dejadas por el Dr. Carlos Mendoza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-border/80 ml-3 space-y-6 pl-6 py-2">
            {[...evolucionTemporal].reverse().map((evaluacion, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-background bg-[#2F6B4E]" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground bg-muted/70 px-2 py-0.5 rounded">
                      {evaluacion.fecha}
                    </span>
                    <span className="text-xs font-mono font-medium text-foreground">
                      {evaluacion.peso} kg
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      • {evaluacion.grasa}% grasa
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-[#2F6B4E] bg-[#ABB748]/20 px-2 py-0.5 rounded">
                    {evaluacion.apego}% apego a dieta
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-foreground/90 leading-relaxed bg-background/60 p-3 rounded-xl border border-border/40">
                  {evaluacion.nota}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
