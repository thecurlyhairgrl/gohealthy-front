import { BookOpen, ImageOff, Minus, Plus, Trash2, Utensils, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { BuscadorAlimentos } from '@/components/nutriologo/BuscadorAlimentos'
import { countEquivalents } from '@/lib/meal-plan'
import { getImageUrl } from '@/lib/image-url'
import { groupLabel, groupsByKey, quantityFor } from '@/lib/smae'

// Nueva cantidad al cambiar los equivalentes, con la misma proporción
const scaleQuantity = (food, equivalents) => {
  if (!food.quantity || !food.equivalents) return food.quantity
  return Math.round((food.quantity / food.equivalents) * equivalents * 100) / 100
}

/**
 * Una comida de un día en el constructor: receta o alimentos sueltos.
 * Las porciones se ajustan solo para este paciente; la receta original no cambia.
 * El contador compara los equivalentes de la comida con la distribución: avisa, pero no bloquea.
 */
export function PlanComidaEditor({ mealTime, meal, planned, groups, onChange, onElegirReceta }) {
  const byKey = groupsByKey(groups)

  if (!meal) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{mealTime.label}</p>
            <p className="text-xs text-muted-foreground">
              {mealTime.start} – {mealTime.end} · Sin asignar
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onElegirReceta}>
              <BookOpen data-icon="inline-start" />
              Elegir receta
            </Button>
            <Button size="sm" variant="outline" onClick={() => onChange({ mealTime: mealTime.key, title: '', foods: [], preparation: '' })}>
              <Utensils data-icon="inline-start" />
              Alimentos sueltos
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const assigned = countEquivalents(meal)
  // Grupos que aparecen en la distribución o en la comida
  const groupKeys = [...new Set([...Object.keys(planned).filter((key) => planned[key] > 0), ...Object.keys(assigned)])]

  function updateFood(index, changes) {
    onChange({ ...meal, foods: meal.foods.map((food, i) => (i === index ? { ...food, ...changes } : food)) })
  }

  function changeEquivalents(index, delta) {
    const food = meal.foods[index]
    const equivalents = Math.max(0.5, (food.equivalents || 0) + delta)
    updateFood(index, { equivalents, quantity: scaleQuantity(food, equivalents) })
  }

  function addFood(food) {
    onChange({
      ...meal,
      foods: [
        ...meal.foods,
        { food: food._id, name: food.name, groupKey: food.groupKey, equivalents: 1, quantity: quantityFor(food.suggestedQuantity, 1), unit: food.unit },
      ],
    })
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {meal.imageUrl ? (
            <img src={getImageUrl(meal.imageUrl)} alt="" className="aspect-4/3 w-full rounded-lg object-cover sm:w-32" />
          ) : (
            <div className="flex aspect-4/3 w-full items-center justify-center rounded-lg bg-muted sm:w-32">
              <ImageOff className="size-6 text-muted-foreground/60" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {mealTime.label} · {mealTime.start} – {mealTime.end}
              {meal.recipe && ' · Receta'}
            </p>
            <Input value={meal.title} placeholder="Nombre de la comida" aria-label={`Nombre de ${mealTime.label}`} onChange={(event) => onChange({ ...meal, title: event.target.value })} />
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={onElegirReceta}>
              Cambiar receta
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label={`Quitar ${mealTime.label}`} onClick={() => onChange(null)}>
              <X />
            </Button>
          </div>
        </div>

        {/* Contador: equivalentes asignados contra los planeados */}
        {groupKeys.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {groupKeys.map((key) => {
              const have = assigned[key] || 0
              const want = planned[key] || 0
              const className = have === want ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : have < want ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-red-300 bg-red-50 text-red-800'
              return (
                <Badge key={key} variant="outline" className={className}>
                  {byKey.get(key) ? groupLabel(byKey.get(key)) : key}: {have} de {want}
                </Badge>
              )
            })}
          </div>
        )}

        <ul className="divide-y divide-border/50 rounded-lg border">
          {meal.foods.map((food, index) => (
            <li key={`${food.name}-${index}`} className="flex items-center gap-2 px-3 py-1.5 text-sm">
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">
                  {food.quantity} {food.unit}
                </span>{' '}
                · {food.name}
              </span>
              <Button size="icon-xs" variant="outline" aria-label={`Menos de ${food.name}`} onClick={() => changeEquivalents(index, -0.5)}>
                <Minus />
              </Button>
              <span className="w-16 text-center font-mono text-xs whitespace-nowrap">{food.equivalents} eq.</span>
              <Button size="icon-xs" variant="outline" aria-label={`Más de ${food.name}`} onClick={() => changeEquivalents(index, 0.5)}>
                <Plus />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                aria-label={`Quitar ${food.name}`}
                onClick={() => onChange({ ...meal, foods: meal.foods.filter((_, i) => i !== index) })}
              >
                <Trash2 className="text-destructive" />
              </Button>
            </li>
          ))}
          {meal.foods.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Agrega alimentos con el buscador.</li>}
        </ul>
        <BuscadorAlimentos onSelect={addFood} placeholder="Agregar alimento..." />

        {meal.steps?.length > 0 ? (
          <p className="text-xs text-muted-foreground">{meal.steps.length} pasos de preparación (los de la receta).</p>
        ) : (
          <Textarea
            rows={2}
            placeholder="Preparación (opcional)"
            aria-label={`Preparación de ${mealTime.label}`}
            value={meal.preparation || ''}
            onChange={(event) => onChange({ ...meal, preparation: event.target.value })}
          />
        )}
      </CardContent>
    </Card>
  )
}
