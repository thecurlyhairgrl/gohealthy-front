import { MapPin, Video } from 'lucide-react'
import { APPOINTMENT_STATUS, fullName } from '@/lib/labels'
import { formatTime, isSameDay } from '@/lib/dates'
import { GRID_HOURS, HOUR_HEIGHT, getAppointmentBox } from '@/lib/week-grid'

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Cada hora tiene dos espacios de 30 minutos en los que se puede agendar
const HALF_HOURS = GRID_HOURS.flatMap((hour) => [
  { hour, minutes: 0 },
  { hour, minutes: 30 },
])

/**
 * Calendario de la semana por horas (8:00 a 20:00).
 * El fondo es el espacio libre: al hacer clic en él se agenda una cita a esa hora.
 * Cada cita es un bloque del color de su estado, con la altura de su duración.
 * Las canceladas solo aparecen en las citas de hoy.
 */
export function CalendarioSemanal({ weekDays, citas, onAgendarEn, onSeleccionarCita }) {
  const now = new Date()

  return (
    <div className="space-y-3">
      {/* Leyenda de colores */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm border border-border bg-card" />
          Libre
        </span>
        {Object.entries(APPOINTMENT_STATUS)
          .filter(([key]) => key !== 'cancelled')
          .map(([key, status]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className={`size-3 rounded-sm border ${status.className}`} />
            {status.label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm bg-muted/70" />
          Ya pasó
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card shadow-xs">
        <div className="min-w-[760px]">
          {/* Encabezado con los 7 días */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-border/70 bg-muted/40 py-2 text-center">
            <span />
            {weekDays.map((day, index) => {
              const isToday = isSameDay(day, now)
              return (
                <div key={day.toISOString()} className="flex flex-col items-center gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {DAY_NAMES[index]}
                  </span>
                  <span
                    className={`inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Cuadrícula */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)]">
            {/* Columna de las horas */}
            <div>
              {GRID_HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{ height: HOUR_HEIGHT }}
                  className="border-r border-border/50 pr-2 pt-1 text-right font-mono text-xs text-muted-foreground"
                >
                  {String(hour).padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {weekDays.map((day) => {
              // Las canceladas no ocupan el horario, así que no se dibujan
              const citasDelDia = citas.filter((cita) => cita.status !== 'cancelled' && isSameDay(cita.dateTime, day))
              return (
                <div key={day.toISOString()} className="relative border-r border-border/40 last:border-r-0">
                  {/* Espacios de 30 minutos: libres (se puede agendar) o ya pasados */}
                  {HALF_HOURS.map(({ hour, minutes }) => {
                    const start = new Date(day)
                    start.setHours(hour, minutes, 0, 0)
                    const isPast = start <= now
                    const label = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
                    return (
                      <button
                        key={label}
                        type="button"
                        disabled={isPast}
                        onClick={() => onAgendarEn(start)}
                        aria-label={`Agendar el ${day.toLocaleDateString('es-MX')} a las ${label}`}
                        style={{ height: HOUR_HEIGHT / 2 }}
                        className={`block w-full ${minutes === 0 ? 'border-t border-border/50' : 'border-t border-dashed border-border/30'} ${
                          isPast ? 'cursor-default bg-muted/70' : 'hover:bg-primary/10'
                        }`}
                      />
                    )
                  })}

                  {/* Citas del día */}
                  {citasDelDia.map((cita) => {
                    const box = getAppointmentBox(cita)
                    const status = APPOINTMENT_STATUS[cita.status]
                    const ModalityIcon = cita.modality === 'video-call' ? Video : MapPin
                    return (
                      <button
                        key={cita._id}
                        type="button"
                        onClick={() => onSeleccionarCita(cita)}
                        style={{ top: box.top + 1, height: box.height - 2 }}
                        className={`absolute inset-x-1 overflow-hidden rounded-md border px-1.5 py-1 text-left text-[11px] shadow-2xs transition-shadow hover:shadow-md ${status.className}`}
                      >
                        <span className="flex items-center gap-1 font-semibold">
                          <ModalityIcon className="size-3 shrink-0" />
                          {formatTime(cita.dateTime)}
                        </span>
                        <span className="block truncate font-medium">{fullName(cita.patient)}</span>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
