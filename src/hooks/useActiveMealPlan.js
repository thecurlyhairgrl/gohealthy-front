import { useEffect, useState } from 'react'
import { getActiveMealPlanRequest } from '@/api/meal-plans'

// Plan activo de un paciente. Si no tiene plan, mealPlan queda en null (no es un error)
export function useActiveMealPlan(patientId) {
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setMealPlan(await getActiveMealPlanRequest(patientId))
      } catch (err) {
        // El back responde 404 cuando no hay plan activo
        if (err.status === 404) {
          setMealPlan(null)
        } else {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [patientId])

  return { mealPlan, loading, error }
}
