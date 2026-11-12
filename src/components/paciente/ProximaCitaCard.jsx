import { CalendarClock, MapPin, Video } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useNextAppointment } from '@/hooks/useNextAppointment'
import { APPOINTMENT_MODALITY } from '@/lib/labels'
import { formatLongDate, formatTime } from '@/lib/dates'

/**
 * Tarjeta con la próxima cita del paciente. Si no tiene, no se muestra.
 */
export function ProximaCitaCard() {
  const { appointment } = useNextAppointment()

  if (!appointment) return null

  const ModalityIcon = appointment.modality === 'video-call' ? Video : MapPin

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <CalendarClock className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Tu próxima cita</p>
            <p className="font-medium first-letter:uppercase">
              {formatLongDate(appointment.dateTime)} · <span className="font-heading text-lg font-semibold">{formatTime(appointment.dateTime)}</span>
            </p>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground sm:ml-auto">
          <ModalityIcon className="size-4" />
          {APPOINTMENT_MODALITY[appointment.modality]}
          {appointment.reason && ` · ${appointment.reason}`}
        </p>
      </CardContent>
    </Card>
  )
}
