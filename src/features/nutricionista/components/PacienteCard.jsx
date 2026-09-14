import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'
import { CalendarDays, Target } from 'lucide-react'

/**
 * Tarjeta individual de un paciente.
 * Muestra nombre, edad, objetivo, última consulta y progreso.
 */
function PacienteCard({ paciente, onClick }) {
  // Determina el color del badge según el progreso
  const getBadgeVariant = (progreso) => {
    if (progreso >= 70) return 'default'
    if (progreso >= 40) return 'secondary'
    return 'outline'
  }

  // Formatea la fecha de última consulta a formato legible
  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00')
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(paciente)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.(paciente)
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{paciente.nombre}</CardTitle>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {paciente.edad} años
            </p>
          </div>
          <Badge variant={getBadgeVariant(paciente.progreso)} className="font-mono">
            {paciente.progreso}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="size-3.5 shrink-0" />
          <span className="truncate">{paciente.objetivo}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" />
          <span>Última consulta: {formatFecha(paciente.ultimaConsulta)}</span>
        </div>
        <Progress value={paciente.progreso}>
          <ProgressLabel className="text-xs">Progreso</ProgressLabel>
          <ProgressValue />
        </Progress>
      </CardContent>
    </Card>
  )
}

export default PacienteCard
