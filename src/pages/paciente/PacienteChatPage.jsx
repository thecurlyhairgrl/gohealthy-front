import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { ChatVentanaConversacion } from '@/components/chat/ChatVentanaConversacion'
import { useMyNutritionist } from '@/hooks/useMyNutritionist'
import { useMessages } from '@/hooks/useMessages'
import { sendMessageRequest } from '@/api/messages'

/**
 * Mensajes del paciente con su nutriólogo. Es una sola conversación y funciona
 * como bandeja de correo: se recarga al entrar, al enviar y con el botón de actualizar.
 */
function PacienteChatPage() {
  const { nutritionist, loading: loadingNutritionist, error: nutritionistError } = useMyNutritionist()
  // El paciente no manda patientId: solo tiene una conversación
  const { messages, loading, error, reload } = useMessages(null, true)

  async function handleEnviarMensaje(body) {
    try {
      await sendMessageRequest({ body })
      reload()
      return true
    } catch (err) {
      toast.add({ title: 'No se pudo enviar el mensaje', description: err.message, type: 'error' })
      return false
    }
  }

  if (loadingNutritionist) return <Skeleton className="h-[70vh] w-full" />
  if (nutritionistError) return <p className="text-sm text-destructive">{nutritionistError}</p>

  return (
    <div className="h-[calc(100svh-6rem)] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs md:h-[calc(100svh-4.5rem)] md:rounded-3xl">
      <ChatVentanaConversacion
        contacto={nutritionist}
        myRole="patient"
        mensajes={messages}
        loading={loading}
        error={error}
        onActualizar={reload}
        onEnviarMensaje={handleEnviarMensaje}
      />
    </div>
  )
}

export default PacienteChatPage
