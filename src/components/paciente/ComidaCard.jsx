import { Apple, Coffee, ImageOff, Moon, Sun, Utensils } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/lib/image-url'

// Ícono y colores de cada tiempo de comida
const MEAL_STYLE = {
  breakfast: { icon: Coffee, className: 'bg-amber-500/10 text-amber-600' },
  'morning-snack': { icon: Apple, className: 'bg-emerald-500/10 text-emerald-600' },
  lunch: { icon: Sun, className: 'bg-orange-500/10 text-orange-600' },
  'afternoon-snack': { icon: Utensils, className: 'bg-emerald-500/10 text-emerald-600' },
  dinner: { icon: Moon, className: 'bg-indigo-500/10 text-indigo-600' },
}

/**
 * Una comida del plan como receta: la hora grande a la izquierda y, a la derecha,
 * la foto, los ingredientes con su cantidad y los pasos.
 * - mealTime: el horario fijo de MEAL_TIMES
 * - meal: la comida del plan, o undefined si ese día no la tiene
 * - isCurrent: la comida que toca ahora; se resalta
 */
export function ComidaCard({ mealTime, meal, isCurrent, onVerEquivalentes }) {
  const style = MEAL_STYLE[mealTime.key]

  return (
    <Card id={mealTime.key} className={`scroll-mt-24 transition-shadow ${isCurrent ? 'border-2 border-primary shadow-md' : 'border-border/60'}`}>
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row">
        {/* Hora */}
        <div className="flex shrink-0 items-center gap-3 sm:w-36 sm:flex-col sm:items-start">
          <div className={`rounded-lg p-2 ${style.className}`}>
            <style.icon className="size-5" />
          </div>
          <div>
            <p className="font-heading text-2xl font-semibold tabular-nums">{mealTime.start}</p>
            <p className="text-xs text-muted-foreground">hasta {mealTime.end}</p>
            <p className="mt-1 text-sm font-medium">{mealTime.label}</p>
          </div>
          {isCurrent && <Badge className="sm:mt-1">Ahora</Badge>}
        </div>

        {/* Receta */}
        {!meal ? (
          <p className="self-center text-sm text-muted-foreground">Tu nutriólogo no asignó esta comida para este día.</p>
        ) : (
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              {meal.imageUrl ? (
                <img src={getImageUrl(meal.imageUrl)} alt={meal.title} className="aspect-4/3 w-full rounded-xl object-cover sm:w-48" />
              ) : (
                <div className="flex aspect-4/3 w-full items-center justify-center rounded-xl bg-muted sm:w-48">
                  <ImageOff className="size-8 text-muted-foreground/60" />
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <h3 className="font-heading text-lg font-semibold">{meal.title || 'Comida'}</h3>
                {meal.foods.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Ingredientes</p>
                    <ul className="space-y-1">
                      {meal.foods.map((food) => (
                        <li key={food.name} className="flex items-center justify-between gap-2 text-sm">
                          <span>
                            {food.quantity !== undefined && (
                              <span className="font-medium">
                                {food.quantity} {food.unit} ·{' '}
                              </span>
                            )}
                            {food.name}
                          </span>
                          {food.groupKey && (
                            <Button variant="ghost" size="xs" onClick={() => onVerEquivalentes(food)}>
                              Ver equivalentes
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {meal.steps?.length > 0 ? (
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Preparación</p>
                <ol className="list-decimal space-y-1 pl-5 text-sm">
                  {meal.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : (
              meal.preparation && (
                <div>
                  <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Preparación</p>
                  <p className="text-sm whitespace-pre-wrap">{meal.preparation}</p>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
