import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, ClipboardPlus, Clock, FileText, MapPin, Video, XCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useAppointments } from '@/context/AppointmentsContext'
import { APPOINTMENT_MODALITY, APPOINTMENT_STATUS, fullName } from '@/lib/labels'
import { formatLongDate, formatTime } from '@/lib/dates'

/**
 * Panel lateral con el detalle de una cita y sus acciones:
 * reprogramar, cancelar o registrar la consulta (que la deja completada).
 */
export function CitaDetalleSheet({ cita, onClose, onReprogramar, onRegistrarConsulta }) {
  const { editAppointment } = useAppointments()
  const [confirmCancel, setConfirmCancel] = useState(false)

  async function handleCancel() {
    try {
      await editAppointment(cita._id, { status: 'cancelled' })
      toast.add({ title: 'Cita cancelada', description: 'Le avisamos al paciente por correo', type: 'success' })
      onClose()
    } catch (error) {
      toast.add({ title: 'No se pudo cancelar la cita', description: error.message, type: 'error' })
    }
  }

  // Solo las citas pendientes se pueden cambiar
  const isPending = cita && (cita.status === 'scheduled' || cita.status === 'rescheduled')
  const status = cita ? APPOINTMENT_STATUS[cita.status] : null
  const ModalityIcon = cita?.modality === 'video-call' ? Video : MapPin

  return (
    <>
      <Sheet open={Boolean(cita)} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-full sm:max-w-md">
          {cita && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading text-xl">{fullName(cita.patient)}</SheetTitle>
                <SheetDescription className="first-letter:uppercase">{formatLongDate(cita.dateTime)}</SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4">
                <Badge variant="outline" className={status.className}>
                  {status.label}
                </Badge>
                <p className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-primary" />
                  <span className="font-heading text-2xl font-semibold">{formatTime(cita.dateTime)}</span>
                  <span className="text-muted-foreground">· {cita.durationMin} min</span>
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <ModalityIcon className="size-4 text-primary" />
                  {APPOINTMENT_MODALITY[cita.modality]}
                </p>
                {cita.reason && (
                  <p className="flex items-start gap-2 text-sm">
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                    {cita.reason}
                  </p>
                )}
                <Link to={`/nutriologo/pacientes/${cita.patient._id}`} className="inline-block text-sm font-medium text-primary hover:underline">
                  Ver expediente
                </Link>
              </div>

              {isPending && (
                <SheetFooter>
                  <Button onClick={() => onRegistrarConsulta(cita)}>
                    <ClipboardPlus data-icon="inline-start" />
                    Registrar consulta
                  </Button>
                  <Button variant="outline" onClick={() => onReprogramar(cita)}>
                    <CalendarClock data-icon="inline-start" />
                    Reprogramar
                  </Button>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => setConfirmCancel(true)}>
                    <XCircle data-icon="inline-start" />
                    Cancelar cita
                  </Button>
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="¿Cancelar la cita?"
        description="Le avisaremos al paciente por correo. El horario quedará libre."
        confirmLabel="Sí, cancelar"
        onConfirm={handleCancel}
      />
    </>
  )
}
