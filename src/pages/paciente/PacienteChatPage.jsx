import PacienteChat from '@/features/paciente/components/PacienteChat'
import { chatPacienteMock } from '@/features/paciente/data/mock-data'

/**
 * Página de Chat del paciente (/paciente/chat).
 * Página delgada que compone el componente de feature con los datos mock de conversación.
 */
function PacienteChatPage() {
  return <PacienteChat chat={chatPacienteMock} />
}

export default PacienteChatPage
