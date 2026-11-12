import { useEffect, useState } from 'react'
import { getMessagesRequest, markAsReadRequest } from '@/api/messages'

// Mensajes con un paciente. Al abrir la conversación se marcan como leídos
export function useMessages(patientId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!patientId) return

    async function load() {
      setLoading(true)
      setError(null)
      try {
        setMessages(await getMessagesRequest(patientId))
        await markAsReadRequest(patientId)
        // Avisa al menú lateral para que actualice el contador de no leídos
        window.dispatchEvent(new Event('messages-read'))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [patientId, version])

  const reload = () => setVersion((current) => current + 1)

  return { messages, loading, error, reload }
}
