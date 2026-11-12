import { useEffect, useRef } from 'react'
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { ChatInputMensaje } from '@/components/chat/ChatInputMensaje'
import { fullName, initials } from '@/lib/labels'
import { formatDate, formatTime } from '@/lib/dates'
import { getImageUrl } from '@/lib/image-url'

/**
 * Conversación entre el paciente y su nutriólogo. Funciona como bandeja de correo:
 * los mensajes nuevos aparecen al abrirla, al enviar o con el botón de actualizar.
 * - contacto: la otra persona (se muestra en la cabecera)
 * - myRole: el rol de quien la ve, para saber qué mensajes son suyos
 * - onVolverALista: opcional; en celular regresa a la lista de conversaciones
 */
export function ChatVentanaConversacion({ contacto, myRole, mensajes, loading, error, onActualizar, onVolverALista, onEnviarMensaje }) {
  const scrollRef = useRef(null)

  // Baja al último mensaje cada vez que cambian
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes])

  return (
    <div className="flex h-full flex-col bg-background/50">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-card p-3.5 sm:p-4">
        <div className="flex items-center gap-3">
          {onVolverALista && (
            <Button variant="ghost" size="icon-xs" onClick={onVolverALista} className="md:hidden" aria-label="Volver a la lista">
              <ArrowLeft className="size-4" />
            </Button>
          )}
          <Avatar className="size-10">
            <AvatarImage src={getImageUrl(contacto.avatarUrl)} alt="" />
            <AvatarFallback className="bg-primary/20 text-xs text-primary">{initials(contacto)}</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-semibold">{fullName(contacto)}</h3>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onActualizar} aria-label="Actualizar mensajes">
          <RefreshCw />
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {loading && mensajes.length === 0 ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <p className="py-12 text-center text-sm text-destructive">{error}</p>
        ) : mensajes.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Aún no hay mensajes en esta conversación.
            <p className="mt-1 text-[11px]">Escribe un mensaje para iniciar el seguimiento.</p>
          </div>
        ) : (
          mensajes.map((mensaje) => {
            const esMio = mensaje.sender.role === myRole
            return (
              <div key={mensaje._id} className={`flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] space-y-1 rounded-2xl p-3 shadow-2xs sm:max-w-[70%] ${
                    esMio ? 'rounded-tr-xs bg-primary text-primary-foreground' : 'rounded-tl-xs border border-border/60 bg-card'
                  }`}
                >
                  {mensaje.subject && <p className="text-xs font-semibold">{mensaje.subject}</p>}
                  <p className="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">{mensaje.body}</p>
                  <div
                    className={`flex items-center justify-end gap-1 font-mono text-[10px] ${esMio ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}
                  >
                    <Clock className="size-2.5" />
                    <span>
                      {formatDate(mensaje.createdAt)} {formatTime(mensaje.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <ChatInputMensaje nombre={contacto.firstName} onEnviarMensaje={onEnviarMensaje} />
    </div>
  )
}
