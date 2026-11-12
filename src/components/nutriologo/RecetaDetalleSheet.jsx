import { Pencil, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MEAL_TIME } from '@/lib/labels'
import { getImageUrl } from '@/lib/image-url'

/**
 * Detalle de una receta. Las propias se pueden editar o borrar; las compartidas solo se ven.
 */
export function RecetaDetalleSheet({ receta, kcal, onClose, onEditar, onEliminar }) {
  return (
    <Sheet open={Boolean(receta)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {receta && (
          <>
            <SheetHeader>
              <SheetTitle className="font-heading text-xl">{receta.name}</SheetTitle>
              <SheetDescription>
                {receta.mealTimes.map((mealTime) => MEAL_TIME[mealTime]).join(', ')} · {kcal} kcal
                {receta.prepMinutes && ` · ${receta.prepMinutes} min`}
                {!receta.nutritionist && ' · Receta compartida'}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5 px-4">
              {receta.imageUrl && <img src={getImageUrl(receta.imageUrl)} alt="" className="aspect-4/3 w-full rounded-xl object-cover" />}
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Ingredientes</p>
                <ul className="space-y-1 text-sm">
                  {receta.ingredients.map((ingredient) => (
                    <li key={ingredient.name} className="flex justify-between gap-2">
                      <span>
                        {ingredient.quantity} {ingredient.unit} · {ingredient.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{ingredient.equivalents} eq.</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">Preparación</p>
                <ol className="list-decimal space-y-1 pl-5 text-sm">
                  {receta.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            {receta.nutritionist && (
              <SheetFooter>
                <Button onClick={() => onEditar(receta)}>
                  <Pencil data-icon="inline-start" />
                  Editar
                </Button>
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => onEliminar(receta)}>
                  <Trash2 data-icon="inline-start" />
                  Eliminar
                </Button>
              </SheetFooter>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
