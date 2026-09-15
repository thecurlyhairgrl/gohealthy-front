import { useState } from 'react'
import {
  Brain,
  UtensilsCrossed,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

/**
 * Componente principal de Cuestionarios del Paciente.
 * Permite seleccionar entre Cuestionario Psicológico y Alimenticio,
 * responder sus 5 preguntas interactivas y recibir confirmación de envío.
 */
export default function PacienteCuestionarios({ cuestionarios }) {
  const [cuestionarioActivoId, setCuestionarioActivoId] = useState(null)
  const [respuestas, setRespuestas] = useState({})
  const [enviado, setEnviado] = useState(false)

  const cuestionarioActivo = cuestionarioActivoId
    ? cuestionarios[cuestionarioActivoId]
    : null

  const handleSeleccionarCuestionario = (id) => {
    setCuestionarioActivoId(id)
    setRespuestas({})
    setEnviado(false)
  }

  const handleVolverAlMenu = () => {
    setCuestionarioActivoId(null)
    setRespuestas({})
    setEnviado(false)
  }

  const handleSeleccionarOpcion = (preguntaId, opcion) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: opcion,
    }))
  }

  const handleEnviarRespuestas = (e) => {
    e.preventDefault()
    if (!cuestionarioActivo) return
    const totalPreguntas = cuestionarioActivo.preguntas.length
    const respondidas = Object.keys(respuestas).length

    if (respondidas === totalPreguntas) {
      setEnviado(true)
    }
  }

  // Si ya se enviaron las respuestas, mostrar la pantalla de éxito
  if (enviado && cuestionarioActivo) {
    return (
      <div className="py-8 max-w-2xl mx-auto space-y-6">
        <Card className="border-border/60 bg-card/80 shadow-md text-center p-6 sm:p-10">
          <CardContent className="space-y-5">
            <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                ¡Cuestionario completado con éxito!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Tus respuestas para el <strong>{cuestionarioActivo.titulo}</strong> se han registrado y sincronizado con el Dr. Carlos Mendoza.
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-background/60 p-4 text-xs text-muted-foreground flex items-center justify-center gap-2 max-w-md mx-auto">
              <Sparkles className="size-4 text-[#ABB748] shrink-0" />
              <span>
                Esta información será evaluada en tu próxima consulta para ajustar tus metas y preparaciones.
              </span>
            </div>

            <Button
              onClick={handleVolverAlMenu}
              className="bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white gap-2 px-6 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="size-4" />
              <span>Volver a Cuestionarios</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vista 2: Formulario con las 5 preguntas del cuestionario activo
  if (cuestionarioActivo) {
    const totalPreguntas = cuestionarioActivo.preguntas.length
    const respondidasCount = Object.keys(respuestas).length
    const porcentajeAvance = Math.round((respondidasCount / totalPreguntas) * 100)
    const todasRespondidas = respondidasCount === totalPreguntas

    return (
      <div className="space-y-6">
        {/* Barra superior de navegación y progreso */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVolverAlMenu}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Volver a Cuestionarios</span>
          </Button>

          <Card className="border-border/60 bg-card/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold font-heading text-foreground">
                    {cuestionarioActivo.titulo}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {cuestionarioActivo.descripcion}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
                    {respondidasCount} de {totalPreguntas} respondidas
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={porcentajeAvance} className="h-2 bg-muted" />
            </CardContent>
          </Card>
        </div>

        {/* Listado de las 5 preguntas */}
        <form onSubmit={handleEnviarRespuestas} className="space-y-4">
          {cuestionarioActivo.preguntas.map((p, index) => {
            const respuestaSeleccionada = respuestas[p.id]
            const respondida = Boolean(respuestaSeleccionada)

            return (
              <Card
                key={p.id}
                className={`border transition-colors shadow-xs ${
                  respondida
                    ? 'border-[#2F6B4E]/40 bg-card/90'
                    : 'border-border/60 bg-card/70'
                }`}
              >
                <CardContent className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                        respondida
                          ? 'bg-[#2F6B4E] text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <h2 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                      {p.pregunta}
                    </h2>
                  </div>

                  {/* Grid de opciones de respuesta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                    {p.opciones.map((opcion) => {
                      const esSeleccionada = respuestaSeleccionada === opcion

                      return (
                        <button
                          key={opcion}
                          type="button"
                          onClick={() => handleSeleccionarOpcion(p.id, opcion)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            esSeleccionada
                              ? 'border-[#2F6B4E] bg-[#2F6B4E]/10 text-foreground ring-1 ring-[#2F6B4E]/30 font-medium'
                              : 'border-border/60 bg-background/50 hover:bg-muted/40 hover:border-border text-foreground/80'
                          }`}
                        >
                          <span>{opcion}</span>
                          {esSeleccionada && (
                            <CheckCircle2 className="size-4 text-[#2F6B4E] shrink-0" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Barra de acción para enviar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-border/60 bg-card/90">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              {todasRespondidas
                ? '¡Has respondido todas las preguntas! Ya puedes enviar tu evaluación.'
                : `Faltan ${totalPreguntas - respondidasCount} preguntas por responder para habilitar el envío.`}
            </p>

            <Button
              type="submit"
              disabled={!todasRespondidas}
              className="bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white gap-2 px-6 shadow-xs cursor-pointer w-full sm:w-auto"
            >
              <CheckCircle2 className="size-4" />
              <span>Enviar respuestas a mi nutriólogo</span>
            </Button>
          </div>
        </form>
      </div>
    )
  }

  // Vista 1: Selector de Cuestionarios (Vista Inicial)
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
          Cuestionarios de Seguimiento
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Selecciona una evaluación para compartir tus sensaciones, hábitos y estado de ánimo con tu nutriólogo
        </p>
      </div>

      {/* Grid con las 2 opciones de cuestionarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Opción 1: Cuestionario Psicológico */}
        <Card className="border-border/60 bg-card/80 hover:border-[#2F6B4E]/50 transition-all shadow-xs flex flex-col justify-between group">
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
                <Brain className="size-6" />
              </div>
              <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
                <Clock className="size-3 text-[#ABB748]" />
                <span>5 preguntas • ~3 min</span>
              </span>
            </div>

            <div>
              <CardTitle className="text-lg font-bold font-heading text-foreground group-hover:text-[#2F6B4E] transition-colors">
                {cuestionarios.psicologico.titulo}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-1">
                {cuestionarios.psicologico.descripcion}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
              <p className="font-medium text-foreground flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-[#2F6B4E]" />
                Temas incluidos:
              </p>
              <ul className="list-disc list-inside pl-1 space-y-0.5 text-[11px]">
                <li>Hambre emocional y momentos de ansiedad</li>
                <li>Estrés y practicidad al seguir las porciones</li>
                <li>Energía, motivación y satisfacción personal</li>
              </ul>
            </div>

            <Button
              onClick={() => handleSeleccionarCuestionario('psicologico')}
              className="w-full bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white gap-2 shadow-xs cursor-pointer"
            >
              <span>Comenzar Cuestionario</span>
              <ChevronRight className="size-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Opción 2: Cuestionario Alimenticio */}
        <Card className="border-border/60 bg-card/80 hover:border-[#2F6B4E]/50 transition-all shadow-xs flex flex-col justify-between group">
          <CardHeader className="space-y-3 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ABB748]/20 text-[#2F6B4E] border border-[#ABB748]/30">
                <UtensilsCrossed className="size-6" />
              </div>
              <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/40">
                <Clock className="size-3 text-[#ABB748]" />
                <span>5 preguntas • ~3 min</span>
              </span>
            </div>

            <div>
              <CardTitle className="text-lg font-bold font-heading text-foreground group-hover:text-[#2F6B4E] transition-colors">
                {cuestionarios.alimenticio.titulo}
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed mt-1">
                {cuestionarios.alimenticio.descripcion}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
              <p className="font-medium text-foreground flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-[#2F6B4E]" />
                Temas incluidos:
              </p>
              <ul className="list-disc list-inside pl-1 space-y-0.5 text-[11px]">
                <li>Nivel de saciedad y sabor de los platillos</li>
                <li>Tiempos de comida donde sientes más apetito</li>
                <li>Alimentos consumidos con mayor frecuencia</li>
              </ul>
            </div>

            <Button
              onClick={() => handleSeleccionarCuestionario('alimenticio')}
              className="w-full bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white gap-2 shadow-xs cursor-pointer"
            >
              <span>Comenzar Cuestionario</span>
              <ChevronRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
