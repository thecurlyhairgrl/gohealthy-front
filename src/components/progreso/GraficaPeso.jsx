import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { WEIGHT_SOURCE } from '@/lib/weights'

// Cada punto se pinta del color de su origen: registro del paciente o consulta
function SourceDot({ cx, cy, payload }) {
  return <circle cx={cx} cy={cy} r={5} fill={WEIGHT_SOURCE[payload.source].color} stroke="white" strokeWidth={2} />
}

/**
 * Gráfica del peso contra la meta. La usan el expediente (nutriólogo) y el progreso (paciente).
 * `points` sale de toWeightPoints()
 */
export function GraficaPeso({ points, weightGoalKg }) {
  if (points.length < 2) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Se necesitan al menos dos registros de peso para la gráfica.</p>
  }

  const values = points.map((point) => point.weightKg).concat(weightGoalKg ? [weightGoalKg] : [])
  const minY = Math.floor(Math.min(...values) - 2)
  const maxY = Math.ceil(Math.max(...values) + 2)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(WEIGHT_SOURCE).map(([key, source]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: source.color }} />
            {source.label}
          </span>
        ))}
        {weightGoalKg && (
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-t-2 border-dashed border-[#ABB748]" />
            Meta ({weightGoalKg} kg)
          </span>
        )}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis domain={[minY, maxY]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit="kg" />
            <Tooltip formatter={(value, _name, item) => [`${value} kg`, WEIGHT_SOURCE[item.payload.source].label]} />
            {weightGoalKg && <ReferenceLine y={weightGoalKg} stroke="#ABB748" strokeDasharray="4 4" strokeWidth={2} />}
            <Line type="monotone" dataKey="weightKg" stroke="#2F6B4E" strokeWidth={2} dot={<SourceDot />} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
