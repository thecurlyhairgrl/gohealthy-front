import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarPlus, KeyRound, Mail, MessageSquare, Pencil, Phone, Power, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ADHERENCE_STATUS, SEX, fullName, initials } from '@/lib/labels'
import { formatDate, getAge } from '@/lib/dates'
import { getImageUrl } from '@/lib/image-url'

// Un dato rápido: peso actual, meta o apego
function Metric({ label, value, unit }) {
  return (
    <div className="flex h-16 min-w-20 flex-col items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5 text-center">
      <span className="text-[11px] font-medium whitespace-nowrap text-muted-foreground">{label}</span>
      <span className="flex items-baseline gap-0.5 font-mono text-lg font-bold">
        {value ?? '—'}
        {value !== null && value !== undefined && <span className="font-sans text-[11px] font-normal text-muted-foreground">{unit}</span>}
      </span>
    </div>
  )
}

/**
 * Tarjeta principal del expediente: datos del paciente, semáforo de apego y acciones.
 */
export default function ExpedienteHeroCard({ detail, currentWeightKg, lastConsultationDate, onEdit, onSchedule, onResendAccess, onToggleActive }) {
  const navigate = useNavigate()
  const { patient, clinicalHistory, adherence } = detail
  const identification = clinicalHistory.identification || {}
  const age = getAge(identification.birthDate)
  const adherenceStatus = ADHERENCE_STATUS[adherence?.status || 'no-data']

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate('/nutriologo/pacientes')} className="-ml-2 text-muted-foreground">
        <ArrowLeft data-icon="inline-start" />
        Volver a pacientes
      </Button>

      <Card className="border border-border/60 shadow-xs">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Avatar className="size-20 text-2xl font-bold">
                <AvatarImage src={getImageUrl(patient.avatarUrl)} alt="" />
                <AvatarFallback className="bg-primary/15 text-primary">{initials(patient)}</AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">{fullName(patient)}</h1>
                  {!patient.active && <Badge variant="outline">Inactivo</Badge>}
                  {clinicalHistory.goals?.[0] && (
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      <Target className="mr-1 size-3.5" />
                      {clinicalHistory.goals[0]}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {age !== null && <span>{age} años</span>}
                  {identification.sex && <span>{SEX[identification.sex]}</span>}
                  <span>{lastConsultationDate ? `Última consulta: ${formatDate(lastConsultationDate)}` : 'Sin consultas todavía'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    {patient.email}
                  </span>
                  {patient.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="size-3.5" />
                      {patient.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <div className="flex gap-2.5">
                <Metric label="Peso actual" value={currentWeightKg} unit="kg" />
                <Metric label="Meta" value={clinicalHistory.weightGoalKg} unit="kg" />
                <Metric label="Apego" value={adherence?.score} unit="%" />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`size-2.5 rounded-full ${adherenceStatus.className}`} />
                {adherenceStatus.label}
                {adherence && ` · ${adherence.surveysCount} de ${adherence.days} días con cuestionario`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button onClick={() => navigate(`/nutriologo/chat?paciente=${patient._id}`)}>
              <MessageSquare data-icon="inline-start" />
              Enviar mensaje
            </Button>
            {patient.active && (
              <Button variant="outline" onClick={onSchedule}>
                <CalendarPlus data-icon="inline-start" />
                Agendar cita
              </Button>
            )}
            <Button variant="outline" onClick={onEdit}>
              <Pencil data-icon="inline-start" />
              Editar datos
            </Button>
            {patient.active && (
              <Button variant="outline" onClick={onResendAccess}>
                <KeyRound data-icon="inline-start" />
                Reenviar acceso
              </Button>
            )}
            <Button variant="ghost" className={patient.active ? 'text-destructive hover:bg-destructive/10' : ''} onClick={onToggleActive}>
              <Power data-icon="inline-start" />
              {patient.active ? 'Desactivar' : 'Reactivar'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
