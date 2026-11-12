import PacienteCumplimiento from '@/components/paciente/PacienteCumplimiento'
import { cumplimientoPacienteMock } from '@/mocks/paciente'

/**
 * Página de Cumplimiento de Actividades del Paciente (/paciente/cumplimiento).
 * Página delgada que pasa los datos de cumplimiento diario al componente de feature.
 */
function PacienteCumplimientoPage() {
  return <PacienteCumplimiento datosCumplimiento={cumplimientoPacienteMock} />
}

export default PacienteCumplimientoPage
