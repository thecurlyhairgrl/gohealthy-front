import { Badge } from '@/components/ui/badge'
import { WEIGHT_SOURCE } from '@/lib/weights'

/**
 * Lista de registros de peso, del más nuevo al más viejo, con su origen
 * y la diferencia contra el registro anterior.
 */
export function HistorialPeso({ points }) {
  if (points.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Todavía no hay registros de peso.</p>
  }

  return (
    <div className="divide-y divide-border/50">
      {[...points].reverse().map((point) => (
        <div key={`${point.source}-${point.date}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-24 text-muted-foreground">{point.label}</span>
            <Badge variant="outline" style={{ borderColor: WEIGHT_SOURCE[point.source].color, color: WEIGHT_SOURCE[point.source].color }}>
              {WEIGHT_SOURCE[point.source].label}
            </Badge>
          </div>
          <div className="flex items-baseline gap-3">
            {point.change !== null && (
              <span className={`text-xs ${point.change > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                {point.change > 0 ? '+' : ''}
                {point.change} kg
              </span>
            )}
            <span className="font-mono font-semibold">{point.weightKg} kg</span>
          </div>
        </div>
      ))}
    </div>
  )
}
