import { useEffect, useState } from 'react'
import { getPatientRequest } from '@/api/patients'

// Expediente de un paciente: { patient, clinicalHistory, adherence }
export function usePatientDetail(id) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function loadDetail() {
      setLoading(true)
      setError(null)
      try {
        setDetail(await getPatientRequest(id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [id, version])

  const reload = () => setVersion((current) => current + 1)

  return { detail, loading, error, reload }
}