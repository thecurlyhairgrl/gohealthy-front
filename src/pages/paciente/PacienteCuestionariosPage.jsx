import PacienteCuestionarios from '@/components/paciente/PacienteCuestionarios'
import { cuestionariosPacienteMock } from '@/mocks/paciente'

/**
 * Página de Cuestionarios del Paciente (/paciente/cuestionarios).
 * Página delgada que pasa los cuestionarios mock al componente de feature.
 */
function PacienteCuestionariosPage() {
  return <PacienteCuestionarios cuestionarios={cuestionariosPacienteMock} />
}

export default PacienteCuestionariosPage
