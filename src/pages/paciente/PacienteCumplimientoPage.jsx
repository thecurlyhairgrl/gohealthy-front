import PacienteCumplimiento from '@/features/paciente/components/PacienteCumplimiento'
import { cumplimientoPacienteMock } from '@/features/paciente/data/mock-data'

/**
 * Página de Cumplimiento de Actividades del Paciente (/paciente/cumplimiento).
 * Página delgada que pasa los datos de cumplimiento diario al componente de feature.
 */
function PacienteCumplimientoPage() {
  return <PacienteCumplimiento datosCumplimiento={cumplimientoPacienteMock} />
}

export default PacienteCumplimientoPage
