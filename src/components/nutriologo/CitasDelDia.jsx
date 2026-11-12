import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Video } from 'lucide-react'
import { APPOINTMENT_MODALITY, APPOINTMENT_STATUS, fullName } from '@/lib/labels'
import { formatTime } from '@/lib/dates'

/**
 * Citas de hoy. La hora es lo primero que se ve, en grande.
 * Al hacer clic en una cita se abre su detalle.
 */
function CitasDelDia({ citas, onSeleccionarCita }) {
  if (citas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Clock className="mb-2 size-8" />
          <p className="text-sm">No tienes citas programadas para hoy</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {citas.map((cita) => {
        const status = APPOINTMENT_STATUS[cita.status]
        const ModalityIcon = cita.modality === 'video-call' ? Video : MapPin
        return (
          <Card
            key={cita._id}
            size="sm"
            role="button"
            tabIndex={0}
            onClick={() => onSeleccionarCita(cita)}
            onKeyDown={(event) => event.key === 'Enter' && onSeleccionarCita(cita)}
            className="cursor-pointer transition-shadow hover:shadow-md"
          >
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-2xl font-semibold tabular-nums text-primary">{formatTime(cita.dateTime)}</span>
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
              </div>
              <p className="truncate font-medium">{fullName(cita.patient)}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ModalityIcon className="size-3" />
                {APPOINTMENT_MODALITY[cita.modality]}
                {cita.reason && ` · ${cita.reason}`}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default CitasDelDia
