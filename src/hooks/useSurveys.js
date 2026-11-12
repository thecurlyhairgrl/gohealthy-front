import { useEffect, useState } from 'react'
import { getSurveysRequest } from '@/api/wellness-surveys'

// Encuestas diarias del paciente, de la más nueva a la más vieja
export function useSurveys() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setSurveys(await getSurveysRequest())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [version])

  const reload = () => setVersion((current) => current + 1)

  return { surveys, loading, error, reload }
}
