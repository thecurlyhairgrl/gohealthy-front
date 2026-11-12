import PacientePlanAlimenticio from '@/components/paciente/PacientePlanAlimenticio'
import { planAlimenticioMock } from '@/mocks/paciente'

/**
 * Página del Plan Alimenticio del paciente (/paciente/plan-alimenticio).
 * Página delgada que compone el componente de feature con los datos mock.
 */
function PacientePlanAlimenticioPage() {
  return <PacientePlanAlimenticio plan={planAlimenticioMock} />
}

export default PacientePlanAlimenticioPage
