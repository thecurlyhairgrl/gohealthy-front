import { useEffect, useState } from 'react'
import { getMeasurementsRequest } from '@/api/measurements'

// Mediciones que registró el paciente, de la más nueva a la más vieja
export function useMeasurements() {
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setMeasurements(await getMeasurementsRequest())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [version])

  const reload = () => setVersion((current) => current + 1)

  return { measurements, loading, error, reload }
}
