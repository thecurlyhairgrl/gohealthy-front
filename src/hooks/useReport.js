import { useEffect, useState } from 'react'

// Datos de un reporte. `request` es la función de api/reports.js y `days` el periodo (si aplica)
export function useReport(request, days) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setReport(await request(days))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [request, days, version])

  const reload = () => setVersion((current) => current + 1)

  return { report, loading, error, reload }
}
