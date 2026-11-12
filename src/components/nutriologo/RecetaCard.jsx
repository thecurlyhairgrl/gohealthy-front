import { Clock, Flame, ImageOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MEAL_TIME } from '@/lib/labels'
import { getImageUrl } from '@/lib/image-url'

/**
 * Tarjeta de una receta: foto, nombre, comidas en las que va, kcal y tiempo.
 */
export function RecetaCard({ receta, kcal, onClick }) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === 'Enter' && onClick()}
      className="cursor-pointer overflow-hidden pt-0 transition-shadow hover:shadow-lg"
    >
      {receta.imageUrl ? (
        <img src={getImageUrl(receta.imageUrl)} alt="" className="aspect-4/3 w-full object-cover" />
      ) : (
        <div className="flex aspect-4/3 w-full items-center justify-center bg-muted">
          <ImageOff className="size-8 text-muted-foreground/60" />
        </div>
      )}
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold leading-tight">{receta.name}</h3>
          {!receta.nutritionist && (
            <Badge variant="outline" className="shrink-0">
              Compartida
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {receta.mealTimes.map((mealTime) => (
            <Badge key={mealTime} variant="secondary" className="text-[11px]">
              {MEAL_TIME[mealTime]}
            </Badge>
          ))}
        </div>
        <p className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className="size-3.5" />
            {kcal} kcal
          </span>
          {receta.prepMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {receta.prepMinutes} min
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
