import { useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Clock } from 'lucide-react'
import { ChatInputMensaje } from '@/features/nutricionista/components/ChatInputMensaje'

/**
 * Ventana activa de conversación con el paciente: cabecera, lista de mensajes con burbujas
 * diferenciadas y barra inferior para enviar nuevos mensajes.
 */
export function ChatVentanaConversacion({
  paciente,
  conversacion,
  onVolverALista,
  onEnviarMensaje,
}) {
  const scrollRef = useRef(null)
  const mensajes = useMemo(
    () => conversacion?.mensajes || [],
    [conversacion?.mensajes]
  )

  // Auto-scroll al último mensaje al cambiar de chat o al enviar nuevo mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes])

  const iniciales = paciente?.nombre
    ? paciente.nombre
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'P'

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Cabecera del chat */}
      <div className="p-3.5 sm:p-4 border-b border-border/60 bg-card flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Botón volver solo visible en pantallas móviles */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onVolverALista}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Volver a la lista de pacientes"
          >
            <ArrowLeft className="size-4" />
          </Button>

          {/* Avatar del paciente */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-heading font-semibold text-xs border border-primary/30">
            {iniciales ? <span>{iniciales}</span> : <User className="size-4" />}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {paciente?.nombre}
            </h3>
            <p className="text-xs text-muted-foreground">
              {paciente?.objetivo || 'Paciente de GoHealthy'}
            </p>
          </div>
        </div>
      </div>

      {/* Historial de Mensajes con Scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Separador de fecha */}
        <div className="flex justify-center">
          <span className="text-[11px] font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/40">
            Hoy
          </span>
        </div>

        {mensajes.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Aún no hay mensajes en esta conversación.
            <p className="mt-1 text-[11px]">
              Escribe un mensaje para iniciar el seguimiento.
            </p>
          </div>
        ) : (
          mensajes.map((msg) => {
            const esNutriologo = msg.remitente === 'nutriologo'
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  esNutriologo ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-2xs space-y-1 ${
                    esNutriologo
                      ? 'bg-primary text-primary-foreground rounded-tr-xs'
                      : 'bg-card border border-border/60 text-foreground rounded-tl-xs'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.texto}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-mono justify-end ${
                      esNutriologo
                        ? 'text-primary-foreground/75'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Clock className="size-2.5" />
                    <span>{msg.hora}</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Entrada para redactar mensajes */}
      <ChatInputMensaje
        pacienteNombre={paciente?.nombre}
        onEnviarMensaje={onEnviarMensaje}
      />
    </div>
  )
}
