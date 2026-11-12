import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useSmaeFoods } from '@/hooks/useSmaeFoods'
import { getImageUrl } from '@/lib/image-url'

/**
 * Panel con los alimentos del mismo grupo del SMAE que un ingrediente.
 * Cada uno es una porción equivalente: se puede cambiar uno por otro.
 */
export function EquivalentesSheet({ food, onClose }) {
  const { foods, loading, error } = useSmaeFoods(food?.groupKey)

  return (
    <Sheet open={Boolean(food)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Equivalentes</SheetTitle>
          <SheetDescription>
            {food && `Puedes cambiar ${food.equivalents ?? 1} porción(es) de ${food.name} por la misma cantidad de porciones de cualquiera de estos alimentos.`}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <ul className="divide-y divide-border/50">
              {foods.map((item) => (
                <li key={item._id} className="flex items-center gap-3 py-2.5">
                  {item.imageUrl ? (
                    <img src={getImageUrl(item.imageUrl)} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="size-10 shrink-0 rounded-lg bg-muted" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      1 porción = {item.suggestedQuantity} {item.unit}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{Math.round(item.energyKcal)} kcal</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
