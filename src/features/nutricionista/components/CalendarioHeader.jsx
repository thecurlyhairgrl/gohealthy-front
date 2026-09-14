import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  LayoutGrid,
  CalendarDays,
} from 'lucide-react'

/**
 * Header del calendario con navegación temporal, toggle de vista (Mes/Semana)
 * y botón para abrir el modal de agendar cita.
 */
export function CalendarioHeader({
  tituloPeriodo,
  vista,
  onCambiarVista,
  onPeriodoAnterior,
  onPeriodoSiguiente,
  onIrAHoy,
  onAbrirAgendarCita,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Título de navegación y botones de anterior/hoy/siguiente */}
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground md:text-2xl capitalize">
          {tituloPeriodo}
        </h2>
        <div className="flex items-center rounded-lg border border-border/60 bg-card p-0.5 shadow-xs">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onPeriodoAnterior}
            aria-label="Período anterior"
            className="hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={onIrAHoy}
            className="px-2 text-xs font-medium hover:bg-muted"
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onPeriodoSiguiente}
            aria-label="Período siguiente"
            className="hover:bg-muted"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Controles de vista y botón de agendar */}
      <div className="flex items-center gap-3">
        {/* Toggle Mes / Semana */}
        <div className="flex items-center rounded-lg border border-border/60 bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => onCambiarVista('mes')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
              vista === 'mes'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="size-3.5" />
            Mes
          </button>
          <button
            type="button"
            onClick={() => onCambiarVista('semana')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all ${
              vista === 'semana'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarDays className="size-3.5" />
            Semana
          </button>
        </div>

        {/* Botón Agendar Cita */}
        <Button
          onClick={onAbrirAgendarCita}
          className="flex items-center gap-2 font-medium"
        >
          <Plus className="size-4" />
          <span>Agendar Cita</span>
        </Button>
      </div>
    </div>
  )
}
