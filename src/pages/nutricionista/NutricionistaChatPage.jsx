import { useState } from 'react'
import {
  pacientesMock,
  conversacionesMock,
} from '@/features/nutricionista/data/mock-data'
import { ChatListaConversaciones } from '@/features/nutricionista/components/ChatListaConversaciones'
import { ChatVentanaConversacion } from '@/features/nutricionista/components/ChatVentanaConversacion'
import { ChatEstadoVacio } from '@/features/nutricionista/components/ChatEstadoVacio'

/**
 * Página principal de Chat del Nutriólogo con sus pacientes.
 * Inicia en estado vacío solicitando seleccionar una conversación,
 * permite buscar pacientes, consultar mensajes y enviar respuestas instantáneas.
 */
export function NutricionistaChatPage() {
  const [pacienteActivoId, setPacienteActivoId] = useState(null)
  const [conversaciones, setConversaciones] = useState(conversacionesMock)
  const [busqueda, setBusqueda] = useState('')

  // Paciente y conversación activos
  const pacienteActivo = pacientesMock.find((p) => p.id === pacienteActivoId)
  const conversacionActiva = conversaciones.find(
    (c) => c.pacienteId === pacienteActivoId
  )

  const handleEnviarMensaje = (texto) => {
    if (!pacienteActivoId) return

    const ahora = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const nuevoMensaje = {
      id: Date.now(),
      remitente: 'nutriologo',
      texto,
      hora: ahora,
    }

    setConversaciones((prev) => {
      const existe = prev.some((c) => c.pacienteId === pacienteActivoId)
      if (existe) {
        return prev.map((c) => {
          if (c.pacienteId === pacienteActivoId) {
            return {
              ...c,
              ultimoMensaje: texto,
              fechaHoraUltimoMensaje: ahora,
              mensajes: [...c.mensajes, nuevoMensaje],
            }
          }
          return c
        })
      }

      // Si es una conversación nueva
      return [
        ...prev,
        {
          pacienteId: pacienteActivoId,
          ultimoMensaje: texto,
          fechaHoraUltimoMensaje: ahora,
          mensajes: [nuevoMensaje],
        },
      ]
    })
  }

  return (
    <div className="h-[calc(100svh-6rem)] md:h-[calc(100svh-4.5rem)] rounded-2xl md:rounded-3xl border border-border/70 bg-card shadow-xs overflow-hidden flex flex-col md:flex-row">
      {/* Columna Izquierda: Lista de Pacientes (visible siempre en desktop; en móvil solo si no hay chat activo) */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 h-full ${
          pacienteActivoId ? 'hidden md:block' : 'block'
        }`}
      >
        <ChatListaConversaciones
          pacientes={pacientesMock}
          conversaciones={conversaciones}
          pacienteActivoId={pacienteActivoId}
          onSeleccionarPaciente={setPacienteActivoId}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
        />
      </div>

      {/* Columna Derecha: Ventana de Conversación o Estado Vacío */}
      <div
        className={`flex-1 h-full overflow-hidden ${
          !pacienteActivoId ? 'hidden md:block' : 'block'
        }`}
      >
        {pacienteActivo ? (
          <ChatVentanaConversacion
            paciente={pacienteActivo}
            conversacion={conversacionActiva}
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
