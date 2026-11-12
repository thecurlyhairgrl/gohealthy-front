import { useEffect, useState } from 'react'
import { getFoodsRequest } from '@/api/smae'

// Alimentos de un grupo del SMAE. Si no hay groupKey no pide nada
export function useSmaeFoods(groupKey) {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!groupKey) return

    async function load() {
      setLoading(true)
      setError(null)
      try {
        setFoods(await getFoodsRequest(groupKey))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [groupKey])

  return { foods, loading, error }
}
