import PacienteChat from '@/components/paciente/PacienteChat'
import { chatPacienteMock } from '@/mocks/paciente'

/**
 * Página de Chat del paciente (/paciente/chat).
 * Página delgada que compone el componente de feature con los datos mock de conversación.
 */
function PacienteChatPage() {
  return <PacienteChat chat={chatPacienteMock} />
}

export default PacienteChatPage
