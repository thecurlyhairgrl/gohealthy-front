import { ShieldAlert, AlertCircle, HeartPulse, Pill, Dumbbell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Pestaña de Datos Clínicos y Antecedentes del Paciente.
 * Muestra alergias, intolerancias alimentarias, condiciones de salud,
 * medicamentos actuales y nivel de actividad física.
 */
export default function ExpedienteClinicoTab({ antecedentes = {} }) {
  const secciones = [
    {
      id: 'alergias',
      titulo: 'Alergias Conocidas',
      valor: antecedentes.alergias || 'Sin alergias reportadas',
      icono: ShieldAlert,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
      borde: 'border-rose-500/20',
    },
    {
      id: 'intolerancias',
      titulo: 'Intolerancias Alimentarias',
      valor: antecedentes.intolerancias || 'Sin intolerancias reportadas',
      icono: AlertCircle,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      borde: 'border-amber-500/20',
    },
    {
      id: 'padecimientos',
      titulo: 'Padecimientos y Diagnósticos',
      valor: antecedentes.padecimientos || 'Sin diagnósticos previos relevantes',
      icono: HeartPulse,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
      borde: 'border-indigo-500/20',
    },
    {
      id: 'medicamentos',
      titulo: 'Medicación y Suplementos',
      valor: antecedentes.medicamentos || 'No consume medicamentos habituales',
      icono: Pill,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      borde: 'border-emerald-500/20',
    },
    {
      id: 'actividadFisica',
      titulo: 'Nivel de Actividad Física y Ejercicio',
      valor: antecedentes.actividadFisica || 'Sedentario / Sin actividad regular reportada',
      icono: Dumbbell,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10',
      borde: 'border-sky-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-heading">Historial y Antecedentes Clínicos</h2>
        <p className="text-xs text-muted-foreground">
          Información de salud declarada por el paciente e identificada en evaluaciones previas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secciones.map((sec) => {
          const Icon = sec.icono
          return (
            <Card key={sec.id} className="border-border/60 bg-card/80">
              <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${sec.bg} ${sec.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {sec.titulo}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6">
                <div className="rounded-md bg-muted/40 p-3 text-sm text-foreground/90 leading-relaxed">
                  {sec.valor}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
