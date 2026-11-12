import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MEAL_TIMES } from '@/lib/meal-times'
import { groupLabel } from '@/lib/smae'

/**
 * Distribución de equivalentes: una fila por grupo del SMAE y una columna por comida.
 * Abajo, las kcal de cada comida y el total contra la meta.
 */
export function PlanDistribucionTabla({ distribution, groups, targetKcal, onChange }) {
  // Kcal de una comida: equivalentes × kcal del grupo
  const mealKcal = (mealKey) =>
    groups.reduce((sum, group) => sum + (distribution[mealKey][group.key] || 0) * group.energyKcal, 0)

  const totalKcal = Math.round(MEAL_TIMES.reduce((sum, meal) => sum + mealKcal(meal.key), 0))
  const difference = targetKcal ? totalKcal - Number(targetKcal) : null

  function handleChange(mealKey, groupKey, value) {
    const quantity = value === '' ? 0 : Number(value)
    onChange({ ...distribution, [mealKey]: { ...distribution[mealKey], [groupKey]: quantity } })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium">Total: {totalKcal} kcal</span>
        {targetKcal && <span className="text-muted-foreground">de {targetKcal} kcal meta</span>}
        {difference !== null && (
          <Badge variant="outline" className={Math.abs(difference) <= 100 ? 'border-emerald-300 text-emerald-700' : 'border-amber-300 text-amber-700'}>
            {difference > 0 ? '+' : ''}
            {difference} kcal
          </Badge>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Grupo (kcal por equivalente)</th>
              {MEAL_TIMES.map((meal) => (
                <th key={meal.key} className="px-2 py-2 text-center font-medium">
                  {meal.label}
                </th>
              ))}
              <th className="px-3 py-2 text-center font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {groups.map((group) => {
              const rowTotal = MEAL_TIMES.reduce((sum, meal) => sum + (distribution[meal.key][group.key] || 0), 0)
              return (
                <tr key={group.key} className={rowTotal > 0 ? 'bg-primary/5' : ''}>
                  <td className="px-3 py-1.5">
                    {groupLabel(group)} <span className="text-xs text-muted-foreground">({group.energyKcal})</span>
                  </td>
                  {MEAL_TIMES.map((meal) => (
                    <td key={meal.key} className="px-2 py-1">
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        aria-label={`${groupLabel(group)} en ${meal.label}`}
                        className="mx-auto h-8 w-16 text-center"
                        value={distribution[meal.key][group.key] || ''}
                        onChange={(event) => handleChange(meal.key, group.key, event.target.value)}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-center font-mono">{rowTotal || ''}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-muted/50 font-medium">
            <tr>
              <td className="px-3 py-2">Kcal por comida</td>
              {MEAL_TIMES.map((meal) => (
                <td key={meal.key} className="px-2 py-2 text-center font-mono">
                  {Math.round(mealKcal(meal.key))}
                </td>
              ))}
              <td className="px-3 py-2 text-center font-mono">{totalKcal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
