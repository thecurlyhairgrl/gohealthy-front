import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { getImageUrl } from '@/lib/image-url'
import { getKcal } from '@/lib/smae'

/**
 * Diálogo para elegir la receta de una comida. Por defecto muestra solo las de ese tiempo de comida.
 */
export function RecetaPickerDialog({ mealTime, recipes, groups, onSelect, onClose }) {
  return (
    <Dialog open={Boolean(mealTime)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {mealTime && <RecetaPicker mealTime={mealTime} recipes={recipes} groups={groups} onSelect={onSelect} />}
      </DialogContent>
    </Dialog>
  )
}

function RecetaPicker({ mealTime, recipes, groups, onSelect }) {
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const term = search.trim().toLowerCase()
  const visible = recipes.filter(
    (recipe) => recipe.name.toLowerCase().includes(term) && (showAll || recipe.mealTimes.includes(mealTime.key)),
  )

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Elegir receta · {mealTime.label}</DialogTitle>
        <DialogDescription>Se copia al plan: después puedes ajustar sus porciones para este paciente.</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input placeholder="Buscar receta..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar receta" />
        <div className="flex shrink-0 items-center gap-2">
          <Switch id="show-all-recipes" checked={showAll} onCheckedChange={setShowAll} />
          <Label htmlFor="show-all-recipes">Todas las comidas</Label>
        </div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {visible.map((recipe) => (
          <li key={recipe._id}>
            <button type="button" onClick={() => onSelect(recipe)} className="flex w-full items-center gap-3 rounded-xl border p-2 text-left hover:bg-muted/50">
              {recipe.imageUrl ? (
                <img src={getImageUrl(recipe.imageUrl)} alt="" className="aspect-4/3 w-20 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex aspect-4/3 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ImageOff className="size-5 text-muted-foreground/60" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-sm font-medium">{recipe.name}</span>
                <span className="block text-xs text-muted-foreground">{getKcal(recipe.ingredients, groups)} kcal</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="text-center text-sm text-muted-foreground">No hay recetas que coincidan.</p>}
    </div>
  )
}
