import PacienteProgreso from '@/features/paciente/components/PacienteProgreso'
import { progresoPacienteMock } from '@/features/paciente/data/mock-data'

/**
 * Página de Progreso del Paciente (/paciente/progreso).
 * Página delgada que pasa los datos de progreso al componente de feature.
 */
function PacienteProgresoPage() {
  return <PacienteProgreso datosProgreso={progresoPacienteMock} />
}

export default PacienteProgresoPage
