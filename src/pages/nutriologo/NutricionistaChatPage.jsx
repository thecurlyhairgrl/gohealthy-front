import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from '@/components/ui/toast'
import { ChatListaConversaciones } from '@/components/nutriologo/ChatListaConversaciones'
import { ChatVentanaConversacion } from '@/components/chat/ChatVentanaConversacion'
import { ChatEstadoVacio } from '@/components/nutriologo/ChatEstadoVacio'
import { useConversations } from '@/hooks/useConversations'
import { useMessages } from '@/hooks/useMessages'
import { sendMessageRequest } from '@/api/messages'

/**
 * Mensajes del nutriólogo con sus pacientes, como bandeja de correo (no es en tiempo real).
 * Se puede abrir directo una conversación con /nutriologo/chat?paciente=<id>
 */
function NutricionistaChatPage() {
  const [searchParams] = useSearchParams()
  const [pacienteActivoId, setPacienteActivoId] = useState(searchParams.get('paciente'))
  const [busqueda, setBusqueda] = useState('')
  const { conversations, error: conversationsError, reload: reloadConversations } = useConversations()
  const { messages, loading, error, reload: reloadMessages } = useMessages(pacienteActivoId)

  const conversacionActiva = conversations.find((conversacion) => conversacion.patient._id === pacienteActivoId)

  async function handleEnviarMensaje(body) {
    try {
      await sendMessageRequest({ patientId: pacienteActivoId, body })
      reloadMessages()
      reloadConversations()
      return true
    } catch (err) {
      toast.add({ title: 'No se pudo enviar el mensaje', description: err.message, type: 'error' })
      return false
    }
  }

  return (
    <div className="flex h-[calc(100svh-6rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs md:h-[calc(100svh-4.5rem)] md:flex-row md:rounded-3xl">
      <div className={`h-full w-full shrink-0 md:w-80 lg:w-96 ${pacienteActivoId ? 'hidden md:block' : 'block'}`}>
        {conversationsError && <p className="p-4 text-sm text-destructive">{conversationsError}</p>}
        <ChatListaConversaciones
          conversaciones={conversations}
          pacienteActivoId={pacienteActivoId}
          onSeleccionarPaciente={setPacienteActivoId}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
        />
      </div>

      <div className={`h-full flex-1 overflow-hidden ${pacienteActivoId ? 'block' : 'hidden md:block'}`}>
        {conversacionActiva ? (
          <ChatVentanaConversacion
            contacto={conversacionActiva.patient}
            myRole="nutritionist"
            mensajes={messages}
            loading={loading}
            error={error}
            onActualizar={reloadMessages}
            onVolverALista={() => setPacienteActivoId(null)}
            onEnviarMensaje={handleEnviarMensaje}
          />
        ) : (
          <ChatEstadoVacio />
        )}
      </div>
    </div>
  )
}

export default NutricionistaChatPage
