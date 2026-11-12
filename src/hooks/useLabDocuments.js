import { useEffect, useState } from 'react'
import { getLabDocumentsRequest } from '@/api/lab-documents'

// Documentos de laboratorio de un paciente
export function useLabDocuments(patientId) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setDocuments(await getLabDocumentsRequest(patientId))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [patientId, version])

  const reload = () => setVersion((current) => current + 1)

  return { documents, loading, error, reload }
}
