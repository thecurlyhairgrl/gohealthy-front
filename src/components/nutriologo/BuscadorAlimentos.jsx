import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { searchFoodsRequest } from '@/api/smae'
import { getImageUrl } from '@/lib/image-url'

/**
 * Buscador de alimentos del SMAE. Al elegir uno llama a onSelect(alimento).
 * Busca en la API después de que el usuario deja de escribir un momento.
 */
export function BuscadorAlimentos({ onSelect, placeholder = 'Buscar alimento del SMAE...' }) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (search.trim().length < 2) return

    // Esperamos 300 ms para no pedir en cada tecla
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        setResults(await searchFoodsRequest(search.trim()))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Con menos de 2 letras no se muestran resultados
  const isSearching = search.trim().length >= 2
  const visibleResults = isSearching ? results : []

  function handleSelect(food) {
    onSelect(food)
    setSearch('')
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} className="pl-9" aria-label="Buscar alimento" />
        {loading && <Spinner className="absolute top-1/2 right-3 size-4 -translate-y-1/2" />}
      </div>
      {visibleResults.length > 0 && (
        <ul className="max-h-56 divide-y divide-border/50 overflow-y-auto rounded-xl border bg-card">
          {visibleResults.map((food) => (
            <li key={food._id}>
              <button type="button" onClick={() => handleSelect(food)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted/50">
                {food.imageUrl ? (
                  <img src={getImageUrl(food.imageUrl)} alt="" className="size-8 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="size-8 shrink-0 rounded-md bg-muted" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{food.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    1 eq. = {food.suggestedQuantity} {food.unit} · {Math.round(food.energyKcal)} kcal
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!loading && isSearching && results.length === 0 && (
        <p className="text-xs text-muted-foreground">No se encontró "{search}" en el SMAE.</p>
      )}
    </div>
  )
}
