import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

/**
 * Barra de entrada inferior para redactar y enviar mensajes en el chat.
 */
export function ChatInputMensaje({ onEnviarMensaje, nombre }) {
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Solo se limpia el campo si el mensaje se envió bien
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setEnviando(true)
    const enviado = await onEnviarMensaje(texto.trim())
    setEnviando(false)
    if (enviado) setTexto('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-border/60 bg-card flex items-center gap-2"
    >
      <Input
        type="text"
        placeholder={`Escribe un mensaje para ${nombre}...`}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="flex-1 text-xs sm:text-sm h-10 bg-background"
        aria-label="Campo para escribir mensaje"
      />
      <Button
        type="submit"
        disabled={!texto.trim() || enviando}
        size="icon"
        className="shrink-0 size-10 rounded-lg cursor-pointer"
        aria-label="Enviar mensaje"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}
