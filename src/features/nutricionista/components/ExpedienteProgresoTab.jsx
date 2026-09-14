import { useState, useMemo } from 'react'
import {
  Scale,
  TrendingDown,
  Activity,
  Heart,
  Calendar,
  PlusCircle,
  TrendingUp,
  Sparkles,
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
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import RegistrarSesionModal from './RegistrarSesionModal'

/**
 * Tooltip personalizado para la gráfica de evolución de peso.
 */
function CustomChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border/80 bg-background/95 p-3 shadow-md backdrop-blur-xs text-xs space-y-1 z-50">
        <p className="font-semibold text-foreground">{data.fecha}</p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-bold text-[#2F6B4E]">
            {data.peso} kg
          </span>
          {data.meta && (
            <span className="text-[11px] text-muted-foreground">
              (Meta: {data.meta} kg)
            </span>
          )}
        </div>
        {data.nota && (
          <p className="text-muted-foreground text-[11px] max-w-[220px] line-clamp-2 italic">
            &ldquo;{data.nota}&rdquo;
          </p>
        )}
      </div>
    )
  }
  return null
}

/**
 * Pestaña de Resumen y Progreso del Paciente.
 * Incluye:
 * - Métricas clave (peso inicial, actual, meta, IMC, grasa corporal).
 * - Gráfica de evolución temporal del peso vs meta con Recharts.
 * - Registro de nuevas sesiones y consultas periódicas.
 * - Historial y notas de cada sesión.
 */
export default function ExpedienteProgresoTab({ paciente, onActualizarSesion }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [mensajeExito, setMensajeExito] = useState(null)

  const historial = useMemo(() => {
    return paciente.antecedentes?.historialConsultas || []
  }, [paciente])

  // Datos ordenados cronológicamente para la gráfica de Recharts
  const chartData = useMemo(() => {
    if (!historial || historial.length === 0) {
      return [
        {
          fecha: 'Inicial',
          peso: paciente.pesoInicial,
          meta: paciente.pesoMeta,
          nota: 'Inicio de tratamiento',
        },
        {
          fecha: 'Actual',
          peso: paciente.pesoActual,
          meta: paciente.pesoMeta,
          nota: 'Sesión reciente',
        },
      ]
    }

    // Clonar y ordenar ascendentemente por fecha
    const ordenado = [...historial].sort(
      (a, b) => new Date(a.fecha) - new Date(b.fecha)
    )

    return ordenado.map((h) => ({
      fecha: h.fecha,
      peso: Number(h.peso),
      meta: Number(paciente.pesoMeta),
      nota: h.nota,
    }))
  }, [historial, paciente.pesoInicial, paciente.pesoActual, paciente.pesoMeta])

  // Rango del eje Y dinámico con margen de seguridad
  const { minY, maxY } = useMemo(() => {
    const pesos = chartData.map((d) => d.peso)
    if (paciente.pesoMeta) pesos.push(Number(paciente.pesoMeta))
    if (paciente.pesoInicial) pesos.push(Number(paciente.pesoInicial))

    const min = Math.min(...pesos)
    const max = Math.max(...pesos)
    return {
      minY: Math.floor(min - 2),
      maxY: Math.ceil(max + 2),
    }
  }, [chartData, paciente.pesoMeta, paciente.pesoInicial])

  const pesoPerdido =
    paciente.pesoInicial && paciente.pesoActual
      ? (paciente.pesoInicial - paciente.pesoActual).toFixed(1)
      : 0

  const handleGuardarSesion = (nuevaSesion) => {
    if (onActualizarSesion) {
      onActualizarSesion(nuevaSesion)
    }
    setMensajeExito(
      `Sesión registrada exitosamente con peso de ${nuevaSesion.peso} kg.`
    )
    setTimeout(() => setMensajeExito(null), 4500)
  }

  return (
    <div className="space-y-6">
      {/* Barra de cabecera de la pestaña con botón para registrar sesión */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold font-heading">
            Evolución y Estado Físico
          </h2>
          <p className="text-xs text-muted-foreground">
            Monitoreo antropométrico y comparación visual del progreso
          </p>
        </div>

        <Button
          onClick={() => setModalAbierto(true)}
          className="gap-2 bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white shadow-xs w-fit"
          size="sm"
        >
          <PlusCircle className="size-4" />
          <span>Registrar Nueva Sesión</span>
        </Button>
      </div>

      {mensajeExito && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <Sparkles className="size-4 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Peso Inicial
              </span>
              <Scale className="size-4 text-muted-foreground/70" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {paciente.pesoInicial}{' '}
              <span className="text-xs font-sans font-normal text-muted-foreground">
                kg
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Inicio del tratamiento
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Peso Actual
              </span>
              <Activity className="size-4 text-[#2F6B4E]" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {paciente.pesoActual}{' '}
              <span className="text-xs font-sans font-normal text-muted-foreground">
                kg
              </span>
            </div>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {pesoPerdido > 0
                ? `-${pesoPerdido} kg logrados`
                : 'En seguimiento'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Peso Meta
              </span>
              <TrendingDown className="size-4 text-[#ABB748]" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {paciente.pesoMeta}{' '}
              <span className="text-xs font-sans font-normal text-muted-foreground">
                kg
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Objetivo acordado
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Índice IMC
              </span>
              <Heart className="size-4 text-rose-500/80" />
            </div>
            <div className="text-lg font-bold font-mono text-foreground truncate">
              {paciente.imc || 'N/A'}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Clasificación de salud
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 sm:col-span-1 border-border/60 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                % Grasa
              </span>
              <Activity className="size-4 text-[#2F6B4E]" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {paciente.grasaCorporal || 'N/A'}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Composición corporal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de Progreso de Peso a lo largo del tiempo */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="size-4 text-[#2F6B4E]" />
                Curva de Evolución de Peso (kg)
              </CardTitle>
              <CardDescription className="text-xs">
                Comparativa de peso en cada consulta vs meta acordada ({paciente.pesoMeta} kg)
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#2F6B4E]" />
                <span>Peso registrado</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 bg-[#ABB748] border-dashed border-t border-[#ABB748]" />
                <span className="text-muted-foreground">Meta ({paciente.pesoMeta} kg)</span>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
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
                  unit="kg"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <ReferenceLine
                  y={Number(paciente.pesoMeta)}
                  stroke="#ABB748"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Meta ${paciente.pesoMeta} kg`,
                    position: 'insideBottomRight',
                    fill: '#ABB748',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="peso"
                  stroke="#2F6B4E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPeso)"
                  dot={{ r: 4, fill: '#2F6B4E', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#2F6B4E', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Avance de Meta */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Avance hacia el Objetivo
              </CardTitle>
              <CardDescription>
                Meta activa:{' '}
                <span className="font-medium text-foreground">
                  {paciente.objetivo}
                </span>
              </CardDescription>
            </div>
            <span className="font-mono text-2xl font-bold text-[#2F6B4E]">
              {paciente.progreso}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={paciente.progreso} className="h-3 bg-muted" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Inicio: {paciente.pesoInicial} kg</span>
            <span>Meta final: {paciente.pesoMeta} kg</span>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Consultas */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="size-4 text-[#2F6B4E]" />
                Historial de Consultas y Evaluaciones
              </CardTitle>
              <CardDescription>
                Registro cronológico de evolución y notas clínicas de cada sesión
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalAbierto(true)}
              className="gap-1.5 text-xs border-[#2F6B4E]/30 text-[#2F6B4E] hover:bg-[#2F6B4E]/10"
            >
              <PlusCircle className="size-3.5" />
              <span>Añadir Sesión</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {historial.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No hay consultas registradas para este paciente.
            </p>
          ) : (
            <div className="relative border-l border-border/80 ml-3 space-y-6 pl-6 py-2">
              {historial.map((consulta, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-background bg-[#2F6B4E]" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-mono text-xs font-semibold text-foreground bg-muted/60 px-2 py-0.5 rounded w-fit">
                      {consulta.fecha}
                    </span>
                    <span className="text-xs font-mono font-medium text-muted-foreground">
                      Peso registrado:{' '}
                      <strong className="text-foreground">
                        {consulta.peso} kg
                      </strong>
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90 leading-relaxed">
                    {consulta.nota}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para registrar sesión */}
      <RegistrarSesionModal
        open={modalAbierto}
        onOpenChange={setModalAbierto}
        paciente={paciente}
        onGuardarSesion={handleGuardarSesion}
      />
    </div>
  )
}
