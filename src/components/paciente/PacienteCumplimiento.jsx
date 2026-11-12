import { useState, useMemo } from 'react'
import {
  TrendingUp,
  Utensils,
  Droplets,
  Calendar,
  Coffee,
  Apple,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  Footprints,
  ShieldCheck,
  Salad,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

// Íconos y colores temáticos para los 5 tiempos de comida
const iconosComida = {
  desayuno: { icono: Coffee, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  colacion1: { icono: Apple, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  comida: { icono: Sun, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
  colacion2: { icono: Utensils, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  cena: { icono: Moon, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
}

// Íconos temáticos para los hábitos
const iconosHabito = {
  caminata: Footprints,
  procesados: ShieldCheck,
  ensalada: Salad,
  sueno: Moon,
}

/**
 * Componente interactivo de Cumplimiento de Actividades y Hábitos del Paciente.
 * Permite marcar comidas del día, registrar hidratación y hábitos, recalculando
 * el porcentaje de apego en tiempo real.
 */
export default function PacienteCumplimiento({ datosCumplimiento }) {
  const [comidas, setComidas] = useState(datosCumplimiento.comidas)
  const [vasosAgua, setVasosAgua] = useState(datosCumplimiento.vasosAguaConsumidos)
  const [habitos, setHabitos] = useState(datosCumplimiento.habitos)

  const metaAgua = datosCumplimiento.metaAguaLitros

  // Cálculos reactivos de apego e hidratación
  const comidasCompletadas = useMemo(
    () => comidas.filter((c) => c.completado).length,
    [comidas]
  )

  const habitosCompletados = useMemo(
    () => habitos.filter((h) => h.completado).length,
    [habitos]
  )

  const litrosAgua = useMemo(
    () => (vasosAgua * 0.25).toFixed(2),
    [vasosAgua]
  )

  const porcentajeAgua = useMemo(
    () => Math.min(100, Math.round(((vasosAgua * 0.25) / metaAgua) * 100)),
    [vasosAgua, metaAgua]
  )

  // Apego ponderado: 55% comidas, 25% hidratación, 20% hábitos
  const apegoGeneral = useMemo(() => {
    const parteComidas = (comidasCompletadas / comidas.length) * 55
    const parteAgua = Math.min(1, (vasosAgua * 0.25) / metaAgua) * 25
    const parteHabitos = (habitosCompletados / habitos.length) * 20
    return Math.round(parteComidas + parteAgua + parteHabitos)
  }, [comidasCompletadas, comidas.length, vasosAgua, metaAgua, habitosCompletados, habitos.length])

  // Handlers interactivos
  const toggleComida = (id) => {
    setComidas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completado: !c.completado } : c))
    )
  }

  const toggleHabito = (id) => {
    setHabitos((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completado: !h.completado } : h))
    )
  }

  const sumarVaso = () => {
    setVasosAgua((prev) => prev + 1)
  }

  const restarVaso = () => {
    setVasosAgua((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="space-y-6">
      {/* Encabezado con Fecha */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            Cumplimiento de Actividades
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Registra tu apego diario al plan alimenticio, metas de hidratación y hábitos saludables
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-foreground bg-muted/60 px-3 py-1.5 rounded-lg border border-border/40 w-fit">
          <Calendar className="size-3.5 text-[#2F6B4E]" />
          <span>{datosCumplimiento.fechaHoy}</span>
        </div>
      </div>

      {/* Grid de Métricas de Resumen Diario */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Apego General */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Apego General
              </span>
              <TrendingUp className="size-4 text-[#2F6B4E]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#2F6B4E]">
              {apegoGeneral}%
            </div>
            <p className="text-[11px] text-muted-foreground">
              {apegoGeneral >= 85
                ? '¡Excelente apego hoy!'
                : apegoGeneral >= 70
                ? 'Buen ritmo, continúa así'
                : 'En progreso para hoy'}
            </p>
          </CardContent>
        </Card>

        {/* Comidas del Día */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Comidas
              </span>
              <Utensils className="size-4 text-[#ABB748]" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {comidasCompletadas} <span className="text-sm font-sans font-normal text-muted-foreground">/ {comidas.length}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {comidasCompletadas === comidas.length
                ? 'Todas registradas'
                : `${comidas.length - comidasCompletadas} pendientes`}
            </p>
          </CardContent>
        </Card>

        {/* Hidratación */}
        <Card className="border-border/60 bg-card/80 shadow-xs">
          <CardContent className="p-4 space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Agua
              </span>
              <Droplets className="size-4 text-sky-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {litrosAgua} <span className="text-sm font-sans font-normal text-muted-foreground">/ {metaAgua} L</span>
            </div>
            <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
              {porcentajeAgua}% de tu meta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección 1: Checklist Diario de Tiempos de Comida */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Utensils className="size-4 text-[#2F6B4E]" />
                <span>Tiempos de Comida del Plan</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Marca cada tiempo conforme vayas completando tus alimentos según el plan asignado
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
              {comidasCompletadas} de {comidas.length} listas
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-1">
          {comidas.map((c) => {
            const config = iconosComida[c.id] || { icono: Utensils, color: 'text-primary', bg: 'bg-primary/10' }
            const Icono = config.icono

            return (
              <div
                key={c.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  c.completado
                    ? 'border-[#2F6B4E]/30 bg-card/90 shadow-2xs'
                    : 'border-border/60 bg-background/50 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color}`}>
                    <Icono className="size-4.5" />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        {c.titulo}
                      </h3>
                      <span className="text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        {c.horario}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {c.menu}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleComida(c.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer self-end sm:self-center ${
                    c.completado
                      ? 'bg-[#2F6B4E] text-white shadow-2xs hover:bg-[#2F6B4E]/90'
                      : 'border border-border/80 bg-card hover:bg-muted/50 text-foreground'
                  }`}
                >
                  {c.completado ? (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      <span>Completado</span>
                    </>
                  ) : (
                    <>
                      <Circle className="size-3.5 text-muted-foreground" />
                      <span>Marcar como cumplido</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Sección 2: Control de Hidratación */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Droplets className="size-4 text-sky-500" />
                <span>Requerimiento Hídrico Diario</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Meta diaria recomendada: <strong className="text-foreground">{metaAgua} L</strong> (~9 vasos de 250 ml)
              </CardDescription>
            </div>
            {porcentajeAgua >= 100 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md w-fit">
                <Sparkles className="size-3.5" />
                <span>¡Meta de hidratación alcanzada!</span>
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-background/50">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-mono text-foreground">
                  {litrosAgua}
                </span>
                <span className="text-sm text-muted-foreground font-sans">
                  / {metaAgua} L consumidos ({vasosAgua} vasos)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cada vaso suma 250 ml a tu consumo diario.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={restarVaso}
                disabled={vasosAgua <= 0}
                className="size-9 p-0 rounded-lg cursor-pointer"
                aria-label="Restar un vaso de agua"
              >
                <Minus className="size-4" />
              </Button>
              <Button
                onClick={sumarVaso}
                size="sm"
                className="gap-1.5 bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white px-3.5 rounded-lg cursor-pointer"
              >
                <Plus className="size-4" />
                <span>+1 Vaso (250 ml)</span>
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>0.0 L</span>
              <span>{porcentajeAgua}% completado</span>
              <span>{metaAgua} L</span>
            </div>
            <Progress value={porcentajeAgua} className="h-2.5 bg-muted" />
          </div>
        </CardContent>
      </Card>

      {/* Sección 3: Hábitos y Recomendaciones del Nutriólogo */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sparkles className="size-4 text-[#ABB748]" />
                <span>Hábitos y Recomendaciones Prescritas</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Pautas de estilo de vida asignadas por el Dr. Carlos Mendoza
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
              {habitosCompletados} de {habitos.length} cumplidos
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-1">
          {habitos.map((h) => {
            const Icono = iconosHabito[h.tipo] || Sparkles

            return (
              <div
                key={h.id}
                onClick={() => toggleHabito(h.id)}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  h.completado
                    ? 'border-[#2F6B4E]/40 bg-[#2F6B4E]/5 shadow-2xs'
                    : 'border-border/60 bg-background/50 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      h.completado
                        ? 'bg-[#2F6B4E]/15 text-[#2F6B4E]'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icono className="size-4" />
                  </div>
                  <span
                    className={`text-xs sm:text-sm ${
                      h.completado
                        ? 'font-medium text-foreground'
                        : 'text-foreground/80'
                    }`}
                  >
                    {h.titulo}
                  </span>
                </div>

                <div
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    h.completado
                      ? 'border-[#2F6B4E] bg-[#2F6B4E] text-white'
                      : 'border-muted-foreground/40 bg-transparent'
                  }`}
                >
                  {h.completado && <CheckCircle2 className="size-3.5" />}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Sección 4: Consistencia Semanal */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="size-4 text-[#2F6B4E]" />
            <span>Consistencia de la Semana</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Historial de apego diario alcanzado en los últimos 7 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-3 text-center">
            {datosCumplimiento.consistenciaSemanal.map((diaInfo) => {
              const esHoy = diaInfo.estado === 'hoy'
              const apego = esHoy ? apegoGeneral : diaInfo.apego

              return (
                <div
                  key={diaInfo.dia}
                  className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-between gap-1.5 ${
                    esHoy
                      ? 'border-[#2F6B4E] bg-[#2F6B4E]/10 ring-1 ring-[#2F6B4E]/30 font-medium'
                      : 'border-border/50 bg-background/50'
                  }`}
                >
                  <span className="text-[11px] font-bold text-foreground uppercase">
                    {diaInfo.dia}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {diaInfo.fecha}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                      apego >= 85
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15'
                        : apego >= 70
                        ? 'text-[#2F6B4E] bg-[#ABB748]/20'
                        : 'text-muted-foreground bg-muted/60'
                    }`}
                  >
                    {apego}%
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
