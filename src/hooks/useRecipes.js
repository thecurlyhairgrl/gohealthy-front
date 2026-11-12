import { useEffect, useState } from 'react'
import { getRecipesRequest } from '@/api/recipes'

// Recetas compartidas y propias del nutriólogo
export function useRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        setRecipes(await getRecipesRequest())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [version])

  const reload = () => setVersion((current) => current + 1)

  return { recipes, loading, error, reload }
}
