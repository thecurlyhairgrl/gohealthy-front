import { useEffect, useState } from 'react'
import { getConsultationsRequest } from '@/api/consultations'

// Consultas de un paciente, de la más reciente a la más antigua
export function useConsultations(patientId) {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setConsultations(await getConsultationsRequest(patientId))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [patientId, version])

  const reload = () => setVersion((current) => current + 1)

  return { consultations, loading, error, reload }
}
