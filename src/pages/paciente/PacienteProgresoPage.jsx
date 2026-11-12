import PacienteProgreso from '@/components/paciente/PacienteProgreso'
import { progresoPacienteMock } from '@/mocks/paciente'

/**
 * Página de Progreso del Paciente (/paciente/progreso).
 * Página delgada que pasa los datos de progreso al componente de feature.
 */
function PacienteProgresoPage() {
  return <PacienteProgreso datosProgreso={progresoPacienteMock} />
}

export default PacienteProgresoPage
