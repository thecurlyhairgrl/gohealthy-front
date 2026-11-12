import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buttonVariants } from '@/components/ui/button'
import { useSurveys } from '@/hooks/useSurveys'
import { findTodaySurvey } from '@/lib/surveys'

/**
 * Aviso para contestar el cuestionario del día. Desaparece cuando ya lo contestó.
 */
export function AvisoCuestionario() {
  const { surveys, loading } = useSurveys()

  if (loading || findTodaySurvey(surveys)) return null

  return (
    <Alert>
      <ClipboardList />
      <AlertTitle>Aún no contestas tu cuestionario de hoy</AlertTitle>
      <AlertDescription>Son cinco preguntas y le ayudan a tu nutriólogo a ver cómo vas.</AlertDescription>
      <AlertAction>
        <Link to="/paciente/cuestionario" className={buttonVariants({ size: 'sm' })}>
          Contestar ahora
        </Link>
      </AlertAction>
    </Alert>
  )
}
