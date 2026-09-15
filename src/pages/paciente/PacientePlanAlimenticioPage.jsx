import PacientePlanAlimenticio from '@/features/paciente/components/PacientePlanAlimenticio'
import { planAlimenticioMock } from '@/features/paciente/data/mock-data'

/**
 * Página del Plan Alimenticio del paciente (/paciente/plan-alimenticio).
 * Página delgada que compone el componente de feature con los datos mock.
 */
function PacientePlanAlimenticioPage() {
  return <PacientePlanAlimenticio plan={planAlimenticioMock} />
}

export default PacientePlanAlimenticioPage
