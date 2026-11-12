import { useEffect, useState } from 'react'
import { getGroupsRequest } from '@/api/smae'

// Los grupos del SMAE (para calcular kcal y armar la distribución)
export function useSmaeGroups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setGroups(await getGroupsRequest())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [version])

  const reload = () => setVersion((current) => current + 1)

  return { groups, loading, error, reload }
}
