import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Encabezado del calendario: la semana que se ve, flechas para moverse y botón para agendar.
 */
export function CalendarioHeader({ weekDays, onMoverSemana, onAgendar }) {
  const first = weekDays[0]
  const last = weekDays[6]
  const sameMonth = first.getMonth() === last.getMonth()
  const rango = sameMonth
    ? `${first.getDate()} – ${last.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : `${first.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} – ${last.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}`

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={() => onMoverSemana(-1)} aria-label="Semana anterior">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onMoverSemana(0)}>
          Hoy
        </Button>
        <Button variant="outline" size="icon-sm" onClick={() => onMoverSemana(1)} aria-label="Semana siguiente">
          <ChevronRight />
        </Button>
        <h3 className="ml-2 font-heading text-base font-semibold">{rango}</h3>
      </div>
      <Button onClick={onAgendar}>
        <Plus data-icon="inline-start" />
        Agendar cita
      </Button>
    </div>
  )
}
