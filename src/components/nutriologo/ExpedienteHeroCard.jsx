import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Mail, Phone, Ruler, Calendar, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

/**
 * Hero Card del Expediente del Paciente.
 * Muestra avatar, nombre, edad, sexo, estatura, objetivo, datos de contacto
 * y acceso directo para enviar mensaje por Chat.
 */
export default function ExpedienteHeroCard({ paciente }) {
  const navigate = useNavigate()

  const iniciales = paciente.nombre
    ? paciente.nombre
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'PA'

  return (
    <div className="space-y-4">
      {/* Botón Volver al Dashboard */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/nutriologo/dashboard')}
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 -ml-2"
        >
          <ArrowLeft className="size-4" />
          <span>Volver al Dashboard</span>
        </Button>
      </div>

      {/* Card principal del paciente */}
      <Card className="overflow-hidden border border-border/60 bg-card/80 backdrop-blur-xs shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Lado izquierdo: Avatar + Datos principales */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar className="size-20 ring-4 ring-[#2F6B4E]/20 bg-[#2F6B4E]/10 text-[#2F6B4E] font-heading font-bold text-2xl">
                <AvatarFallback className="bg-[#2F6B4E]/15 text-[#2F6B4E]">
                  {iniciales}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {paciente.nombre}
                  </h1>
                  <Badge
                    variant="outline"
                    className="border-[#2F6B4E]/30 bg-[#2F6B4E]/10 text-[#2F6B4E] font-medium"
                  >
                    <Target className="mr-1 size-3.5" />
                    {paciente.objetivo}
                  </Badge>
                </div>

                {/* Subdatos: Edad, Sexo, Estatura */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-muted-foreground">
                  <span>{paciente.edad} años</span>
                  <span className="text-border">•</span>
                  <span>{paciente.sexo}</span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Ruler className="size-3.5 text-[#2F6B4E]" />
                    Estatura: {paciente.estatura}
                  </span>
                  {paciente.ultimaConsulta && (
                    <>
                      <span className="text-border">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        Última consulta: {paciente.ultimaConsulta}
                      </span>
                    </>
                  )}
                </div>

                {/* Contacto */}
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground pt-0.5">
                  {paciente.email && (
                    <span className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <Mail className="size-3.5" />
                      {paciente.email}
                    </span>
                  )}
                  {paciente.telefono && (
                    <span className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <Phone className="size-3.5" />
                      {paciente.telefono}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Lado derecho: Métricas rápidas + Botón Enviar Mensaje */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:border-l lg:border-border/60 lg:pl-6">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div className="flex flex-col justify-between items-center rounded-lg bg-muted/40 px-3 py-2.5 text-center min-w-[76px] sm:min-w-[86px] h-[64px]">
                  <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none flex items-center justify-center">
                    Peso Actual
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono text-foreground leading-none flex items-baseline justify-center gap-0.5">
                    {paciente.pesoActual}
                    <span className="text-[11px] font-normal font-sans text-muted-foreground">kg</span>
                  </span>
                </div>

                <div className="flex flex-col justify-between items-center rounded-lg bg-muted/40 px-3 py-2.5 text-center min-w-[76px] sm:min-w-[86px] h-[64px]">
                  <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none flex items-center justify-center">
                    Meta
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono text-foreground leading-none flex items-baseline justify-center gap-0.5">
                    {paciente.pesoMeta}
                    <span className="text-[11px] font-normal font-sans text-muted-foreground">kg</span>
                  </span>
                </div>

                <div className="flex flex-col justify-between items-center rounded-lg bg-muted/40 px-3 py-2.5 text-center min-w-[76px] sm:min-w-[86px] h-[64px]">
                  <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap leading-none flex items-center justify-center">
                    Progreso
                  </span>
                  <span className="text-base sm:text-lg font-bold font-mono text-[#2F6B4E] leading-none flex items-baseline justify-center gap-0.5">
                    {paciente.progreso}
                    <span className="text-[11px] font-normal font-sans text-[#2F6B4E]">%</span>
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigate('/nutriologo/chat')}
                className="bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white shadow-xs gap-2 shrink-0 h-10 px-4"
              >
                <MessageSquare className="size-4" />
                <span>Enviar Mensaje</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
