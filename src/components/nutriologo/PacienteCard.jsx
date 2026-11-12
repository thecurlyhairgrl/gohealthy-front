import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Scale, Target } from 'lucide-react'
import { ADHERENCE_STATUS, fullName } from '@/lib/labels'
import { formatDate } from '@/lib/dates'

/**
 * Tarjeta de un paciente: semáforo de apego, última consulta, peso actual y meta.
 */
function PacienteCard({ paciente, onClick }) {
  const adherence = ADHERENCE_STATUS[paciente.adherence?.status || 'no-data']

  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        paciente.active ? '' : 'opacity-60'
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onClick(paciente)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick(paciente)
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{fullName(paciente)}</CardTitle>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{paciente.email}</p>
          </div>
          {paciente.active ? (
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`size-2.5 rounded-full ${adherence.className}`} />
              {adherence.label}
            </span>
          ) : (
            <Badge variant="outline">Inactivo</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-3.5 shrink-0" />
          {paciente.lastConsultation ? `Última consulta: ${formatDate(paciente.lastConsultation)}` : 'Sin consultas todavía'}
        </p>
        <p className="flex items-center gap-2">
          <Scale className="size-3.5 shrink-0" />
          Peso actual: {paciente.currentWeightKg ? `${paciente.currentWeightKg} kg` : 'sin registro'}
        </p>
        <p className="flex items-center gap-2">
          <Target className="size-3.5 shrink-0" />
          Meta: {paciente.weightGoalKg ? `${paciente.weightGoalKg} kg` : 'sin definir'}
        </p>
      </CardContent>
    </Card>
  )
}

export default PacienteCard
