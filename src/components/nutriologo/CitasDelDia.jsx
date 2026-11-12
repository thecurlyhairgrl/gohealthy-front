import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User } from 'lucide-react'

/**
 * Muestra la lista de citas programadas para el día actual.
 * Recibe un array de citas con hora, paciente y tipo.
 */
function CitasDelDia({ citas }) {
  if (!citas || citas.length === 0) {
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
    <div className="grid gap-3">
      {citas.map((cita) => (
        <Card key={cita.id} size="sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">{cita.hora}</span>
                <span className="text-sm text-muted-foreground">—</span>
                <span className="truncate text-sm font-medium">{cita.paciente}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="size-3" />
                <span>{cita.tipo}</span>
              </div>
            </div>
            <Badge variant="secondary">{cita.tipo}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CitasDelDia
