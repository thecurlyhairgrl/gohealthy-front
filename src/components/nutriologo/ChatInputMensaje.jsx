import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

/**
 * Barra de entrada inferior para redactar y enviar mensajes en el chat.
 */
export function ChatInputMensaje({ onEnviarMensaje, pacienteNombre }) {
  const [texto, setTexto] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    onEnviarMensaje(texto.trim())
    setTexto('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-border/60 bg-card flex items-center gap-2"
    >
      <Input
        type="text"
        placeholder={`Escribe un mensaje para ${pacienteNombre || 'el paciente'}...`}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        className="flex-1 text-xs sm:text-sm h-10 bg-background"
        aria-label="Campo para escribir mensaje"
      />
      <Button
        type="submit"
        disabled={!texto.trim()}
        size="icon"
        className="shrink-0 size-10 rounded-lg cursor-pointer"
        aria-label="Enviar mensaje"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}
