import { useEffect, useState } from 'react'
import { getMyNutritionistRequest } from '@/api/auth'

// Datos públicos del nutriólogo del paciente
export function useMyNutritionist() {
  const [nutritionist, setNutritionist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setNutritionist(await getMyNutritionistRequest())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [version])

  const reload = () => setVersion((current) => current + 1)

  return { nutritionist, loading, error, reload }
}
