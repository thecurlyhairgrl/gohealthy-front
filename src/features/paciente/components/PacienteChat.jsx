import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Clock, Send, User } from 'lucide-react'

/**
 * Ventana completa de chat para el paciente con su nutriólogo asignado.
 * Ocupa la pantalla completa del layout y maneja la conversación directa,
 * auto-scroll y envío reactivo de mensajes.
 */
export default function PacienteChat({ chat }) {
  const [mensajes, setMensajes] = useState(chat?.mensajes || [])
  const [nuevoTexto, setNuevoTexto] = useState('')
  const scrollRef = useRef(null)

  const nutriologo = chat?.nutriologo || {
    nombre: 'Dr. Carlos Mendoza',
    especialidad: 'Nutrición Clínica y Deportiva',
    iniciales: 'CM',
    enLinea: true,
  }

  // Auto-scroll al último mensaje al cargar o enviar mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes])

  const handleEnviar = (e) => {
    e.preventDefault()
    if (!nuevoTexto.trim()) return

    const ahora = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const nuevoMensaje = {
      id: Date.now(),
      remitente: 'paciente',
      texto: nuevoTexto.trim(),
      hora: ahora,
    }

    setMensajes((prev) => [...prev, nuevoMensaje])
    setNuevoTexto('')
  }

  return (
    <div className="h-[calc(100svh-6rem)] md:h-[calc(100svh-4.5rem)] rounded-2xl md:rounded-3xl border border-border/70 bg-card shadow-xs overflow-hidden flex flex-col">
      {/* Cabecera del Chat con datos del Nutriólogo */}
      <div className="p-3.5 sm:p-4 border-b border-border/60 bg-card flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar del Nutriólogo */}
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-heading font-semibold text-xs border border-primary/30">
            {nutriologo.iniciales ? (
              <span>{nutriologo.iniciales}</span>
            ) : (
              <User className="size-4" />
            )}
            {/* Indicador de estado en línea */}
            {nutriologo.enLinea && (
              <span
                className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
                title="En línea"
              />
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground leading-tight">
              {nutriologo.nombre}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {nutriologo.especialidad}
              </span>
              {nutriologo.enLinea && (
                <>
                  <span className="text-muted-foreground/40 text-[10px]">•</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    En línea
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Mensajes con Scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50"
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
              Escribe un mensaje para comunicarte con tu nutriólogo.
            </p>
          </div>
        ) : (
          mensajes.map((msg) => {
            const esPaciente = msg.remitente === 'paciente'
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  esPaciente ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl shadow-2xs space-y-1 ${
                    esPaciente
                      ? 'bg-primary text-primary-foreground rounded-tr-xs'
                      : 'bg-card border border-border/60 text-foreground rounded-tl-xs'
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.texto}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-mono justify-end ${
                      esPaciente
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

      {/* Barra de Entrada de Mensajes */}
      <form
        onSubmit={handleEnviar}
        className="p-3 border-t border-border/60 bg-card flex items-center gap-2 shrink-0"
      >
        <Input
          type="text"
          placeholder="Escribe un mensaje para tu nutriólogo..."
          value={nuevoTexto}
          onChange={(e) => setNuevoTexto(e.target.value)}
          className="flex-1 text-xs sm:text-sm h-10 bg-background"
          aria-label="Campo para escribir mensaje"
        />
        <Button
          type="submit"
          disabled={!nuevoTexto.trim()}
          size="icon"
          className="shrink-0 size-10 rounded-lg cursor-pointer"
          aria-label="Enviar mensaje"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
