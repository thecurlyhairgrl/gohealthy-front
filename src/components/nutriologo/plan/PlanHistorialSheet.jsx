import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { getMealPlanHistoryRequest, getMealPlanVersionRequest } from '@/api/meal-plans'
import { MEAL_TIMES } from '@/lib/meal-times'
import { MEAL_TIME, WEEK_DAY, fullName } from '@/lib/labels'
import { formatDate, formatTime } from '@/lib/dates'
import { DAYS } from '@/lib/meal-plan'

/**
 * Historial de versiones del plan. Al elegir una, se compara lado a lado con la actual.
 */
export function PlanHistorialSheet({ planId, open, onClose }) {
  const [history, setHistory] = useState(null)
  const [comparing, setComparing] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return

    getMealPlanHistoryRequest(planId)
      .then(setHistory)
      .catch((err) => setError(err.message))
  }, [open, planId])

  async function handleCompare(version) {
    try {
      setComparing(await getMealPlanVersionRequest(planId, version))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl">Historial del plan</SheetTitle>
            <SheetDescription>{history ? `Versión actual: ${history.currentVersion}` : 'Cargando...'}</SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!history ? (
              <Spinner />
            ) : history.history.length === 0 ? (
              <p className="text-sm text-muted-foreground">El plan no se ha modificado desde que se creó.</p>
            ) : (
              <ul className="space-y-2">
                {history.history.map((entry) => (
                  <li key={entry._id}>
                    <button type="button" onClick={() => handleCompare(entry.version)} className="w-full rounded-xl border p-3 text-left hover:bg-muted/50">
                      <p className="text-sm font-medium">
                        Versión {entry.version} → {entry.version + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(entry.createdAt)} {formatTime(entry.createdAt)} · {fullName(entry.modifiedBy)}
                      </p>
                      {entry.reason && <p className="mt-1 text-sm">“{entry.reason}”</p>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(comparing)} onOpenChange={(value) => !value && setComparing(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl">
          {comparing && <Comparacion data={comparing} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Lo que se compara de cada versión
const summary = (plan) => ({
  general: [
    ['Nombre', plan.name],
    ['Energía', plan.targetKcal ? `${plan.targetKcal} kcal` : '—'],
    ['Agua', plan.waterLiters ? `${plan.waterLiters} L` : '—'],
  ],
  meals: Object.fromEntries(
    DAYS.map((day) => {
      const menuDay = (plan.menu || []).find((item) => item.day === day)
      return [day, Object.fromEntries(MEAL_TIMES.map((meal) => [meal.key, menuDay?.meals.find((item) => item.mealTime === meal.key)]))]
    }),
  ),
})

// Una comida en texto: título y alimentos con sus equivalentes
const mealText = (meal) => (meal ? `${meal.title || 'Sin nombre'} (${meal.foods.map((food) => `${food.name} ${food.equivalents ?? ''}`).join(', ')})` : '—')

function Comparacion({ data }) {
  const before = summary(data.previous)
  const after = summary(data.current)

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          Versión {data.version} contra la actual (versión {data.current.version})
        </DialogTitle>
        <DialogDescription>{data.reason ? `Motivo: ${data.reason}` : 'Sin motivo'} · Lo que cambió está resaltado.</DialogDescription>
      </DialogHeader>

      <table className="w-full text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr>
            <th className="w-40 py-1 text-left font-medium" />
            <th className="py-1 text-left font-medium">Versión {data.version}</th>
            <th className="py-1 text-left font-medium">Actual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {before.general.map(([label, value], index) => {
            const changed = value !== after.general[index][1]
            return (
              <tr key={label} className={changed ? 'bg-amber-50' : ''}>
                <td className="py-1.5 pr-2 text-muted-foreground">{label}</td>
                <td className="py-1.5 pr-2">{value}</td>
                <td className="py-1.5">{after.general[index][1]}</td>
              </tr>
            )
          })}
          {DAYS.flatMap((day) =>
            MEAL_TIMES.map((meal) => {
              const old = mealText(before.meals[day][meal.key])
              const now = mealText(after.meals[day][meal.key])
              if (old === '—' && now === '—') return null
              return (
                <tr key={`${day}-${meal.key}`} className={old !== now ? 'bg-amber-50' : ''}>
                  <td className="py-1.5 pr-2 text-muted-foreground">
                    {WEEK_DAY[day]} · {MEAL_TIME[meal.key]}
                  </td>
                  <td className="py-1.5 pr-2">{old}</td>
                  <td className="py-1.5">{now}</td>
                </tr>
              )
            }),
          )}
        </tbody>
      </table>
    </div>
  )
}
