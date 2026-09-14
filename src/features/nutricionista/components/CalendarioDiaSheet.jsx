import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Video,
  User,
  MapPin,
  CalendarPlus,
  CalendarCheck2,
} from 'lucide-react'

/**
 * Panel lateral (Sheet) que muestra todas las citas asignadas a una fecha específica
 * con información detallada de cada paciente y botón para agendar en esa fecha.
 */
export function CalendarioDiaSheet({
  isOpen,
  onClose,
  fechaSeleccionada,
  citas = [],
  onAgendarEnFecha,
}) {
  // Formatear la fecha seleccionada para el título
  const fechaFormateada = fechaSeleccionada
    ? new Date(`${fechaSeleccionada}T00:00:00`).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return (
          <Badge
            variant="outline"
            className="border-green-600/40 bg-green-500/10 text-green-700 text-xs dark:text-green-400"
          >
            Confirmada
          </Badge>
        )
      case 'Pendiente':
        return (
          <Badge
            variant="outline"
            className="border-amber-600/40 bg-amber-500/10 text-amber-700 text-xs dark:text-amber-400"
          >
            Pendiente
          </Badge>
        )
      case 'Completada':
        return (
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary-foreground text-xs"
          >
            Completada
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col justify-between overflow-y-auto">
        <div>
          <SheetHeader className="pb-4 border-b border-border/60">
            <div className="flex items-center gap-2 text-primary">
              <CalendarCheck2 className="size-5 text-primary" />
              <SheetTitle className="capitalize text-lg">
                {fechaFormateada}
              </SheetTitle>
            </div>
            <SheetDescription>
              {citas.length === 0
                ? 'No hay consultas programadas para este día.'
                : `${citas.length} ${
                    citas.length === 1 ? 'consulta programada' : 'consultas programadas'
                  }`}
            </SheetDescription>
          </SheetHeader>

          {/* Listado de citas */}
          <div className="py-5 space-y-3">
            {citas.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-sm">Día libre de consultas.</p>
                <p className="text-xs mt-1">
                  Puedes agendar una nueva cita haciendo clic en el botón de abajo.
                </p>
              </div>
            ) : (
              citas.map((cita) => (
                <div
                  key={cita.id}
                  className="rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs">
                        <User className="size-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-foreground">
                          {cita.pacienteNombre}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                          <Clock className="size-3" />
                          <span>
                            {cita.hora} ({cita.duracion || '45 min'})
                          </span>
                        </div>
                      </div>
                    </div>
                    {getBadgeEstado(cita.estado)}
                  </div>

                  {/* Motivo */}
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
                    <span className="font-medium text-foreground">Motivo: </span>
                    {cita.motivo}
                  </div>

                  {/* Modalidad */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {cita.modalidad === 'Online' ? (
                        <>
                          <Video className="size-3.5 text-blue-500" />
                          <span>Consulta Virtual</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="size-3.5 text-primary" />
                          <span>Consulta Presencial</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer con botón para agendar */}
        <div className="pt-4 pb-2 border-t border-border/60">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              onClose()
              onAgendarEnFecha(fechaSeleccionada)
            }}
          >
            <CalendarPlus className="size-4" />
            <span>Agendar cita para este día</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
