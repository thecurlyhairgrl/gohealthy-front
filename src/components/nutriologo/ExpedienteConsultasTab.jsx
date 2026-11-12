import { ClipboardList, ClipboardPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ENERGY_FORMULAS } from '@/lib/energy'
import { formatDate } from '@/lib/dates'

// Un dato de la consulta; si no hay valor no se muestra
function Data({ label, value, unit }) {
  if (value === undefined || value === null) return null
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-mono text-sm font-semibold">
        {value} {unit}
      </p>
    </div>
  )
}

/**
 * Historial de consultas, de la más reciente a la más antigua, con el botón para registrar una nueva.
 */
export default function ExpedienteConsultasTab({ consultations, loading, error, canRegister, onRegister }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <ClipboardList className="size-5 text-primary" />
            Consultas
          </h2>
          <p className="text-xs text-muted-foreground">Medidas, cálculo energético e indicaciones de cada consulta</p>
        </div>
        {canRegister && (
          <Button onClick={onRegister}>
            <ClipboardPlus data-icon="inline-start" />
            Registrar consulta
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : consultations.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardList />
            </EmptyMedia>
            <EmptyTitle>Sin consultas</EmptyTitle>
            <EmptyDescription>Registra la primera consulta para empezar el seguimiento.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {consultations.map((consultation) => {
            const measurements = consultation.measurements || {}
            const energy = consultation.energyCalculation
            const pressure =
              measurements.systolicPressure && measurements.diastolicPressure
                ? `${measurements.systolicPressure}/${measurements.diastolicPressure}`
                : null
            return (
              <Card key={consultation._id} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{formatDate(consultation.date)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                    <Data label="Peso" value={measurements.weightKg} unit="kg" />
                    <Data label="Estatura" value={measurements.heightCm} unit="cm" />
                    <Data label="IMC" value={measurements.bmi} />
                    <Data label="Grasa" value={measurements.bodyFatPct} unit="%" />
                    <Data label="Cintura" value={measurements.waistCm} unit="cm" />
                    <Data label="Cadera" value={measurements.hipCm} unit="cm" />
                    <Data label="Presión" value={pressure} unit="mmHg" />
                    {energy && <Data label="Kcal meta" value={energy.targetKcal} unit="kcal" />}
                  </div>
                  {energy && (
                    <p className="text-xs text-muted-foreground">
                      {ENERGY_FORMULAS[energy.formula]} · GEB {energy.basalEnergyExpenditure} kcal · factor {energy.activityFactor} · GET{' '}
                      {energy.totalEnergyExpenditure} kcal
                    </p>
                  )}
                  {[
                    ['Diagnóstico', consultation.diagnosis],
                    ['Indicaciones', consultation.instructions],
                    ['Notas', consultation.notes],
                  ]
                    .filter(([, text]) => text)
                    .map(([label, text]) => (
                      <div key={label}>
                        <p className="text-xs font-medium text-muted-foreground">{label}</p>
                        <p className="whitespace-pre-wrap text-sm">{text}</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
