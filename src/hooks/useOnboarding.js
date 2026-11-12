import { useEffect, useState } from 'react'
import { getOnboardingRequest } from '@/api/onboarding'

// Expediente que el nutriólogo ya llenó, para mostrarlo en el onboarding
export function useOnboarding() {
  const [clinicalHistory, setClinicalHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadOnboarding() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOnboardingRequest()
        setClinicalHistory(data.clinicalHistory)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadOnboarding()
  }, [])

  return { clinicalHistory, loading, error }
}
