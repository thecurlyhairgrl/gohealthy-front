import PacienteCuestionarios from '@/features/paciente/components/PacienteCuestionarios'
import { cuestionariosPacienteMock } from '@/features/paciente/data/mock-data'

/**
 * Página de Cuestionarios del Paciente (/paciente/cuestionarios).
 * Página delgada que pasa los cuestionarios mock al componente de feature.
 */
function PacienteCuestionariosPage() {
  return <PacienteCuestionarios cuestionarios={cuestionariosPacienteMock} />
}

export default PacienteCuestionariosPage
