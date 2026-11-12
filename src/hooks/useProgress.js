import { useEffect, useState } from 'react'
import { getProgressRequest } from '@/api/progress'

// Progreso de un paciente: { days, measurements, surveys, summary, goals }
export function useProgress(patientId) {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setProgress(await getProgressRequest(patientId))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [patientId, version])

  const reload = () => setVersion((current) => current + 1)

  return { progress, loading, error, reload }
}
