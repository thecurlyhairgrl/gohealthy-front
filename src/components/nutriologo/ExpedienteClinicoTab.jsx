import { useState } from 'react'
import { Activity, AlertTriangle, ClipboardList, Pencil, Pill, Target, User, Utensils } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import EditarHistoriaClinicaModal from '@/components/nutriologo/EditarHistoriaClinicaModal'
import { ALCOHOL_CONSUMPTION, SEX } from '@/lib/labels'
import { formatDateOnly, getAge } from '@/lib/dates'
import { toText } from '@/lib/lists'

// Un renglón "Etiqueta: valor"; si no hay valor muestra "Sin registrar"
function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value === '' || value === null || value === undefined ? 'Sin registrar' : value}</span>
    </div>
  )
}

/**
 * Historia clínica del paciente por secciones, con un botón para editarla.
 */
export default function ExpedienteClinicoTab({ patientId, clinicalHistory, onSaved }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const identification = clinicalHistory.identification || {}
  const pathological = clinicalHistory.pathologicalHistory || {}
  const nonPathological = clinicalHistory.nonPathologicalHistory || {}
  const eating = clinicalHistory.eatingHabits || {}
  const age = getAge(identification.birthDate)

  const sections = [
    {
      title: 'Identificación',
      icon: User,
      rows: [
        ['Fecha de nacimiento', identification.birthDate ? `${formatDateOnly(identification.birthDate)} (${age} años)` : ''],
        ['Sexo', SEX[identification.sex]],
        ['Ocupación', identification.occupation],
      ],
    },
    {
      title: 'Motivo y metas',
      icon: Target,
      rows: [
        ['Motivo de consulta', clinicalHistory.reasonForVisit],
        ['Metas', toText(clinicalHistory.goals)],
        ['Peso meta', clinicalHistory.weightGoalKg ? `${clinicalHistory.weightGoalKg} kg` : ''],
        ['Grasa meta', clinicalHistory.bodyFatGoalPct ? `${clinicalHistory.bodyFatGoalPct} %` : ''],
      ],
    },
    {
      title: 'Alergias e intolerancias',
      icon: AlertTriangle,
      rows: [['Alergias e intolerancias', toText(pathological.allergies)]],
    },
    {
      title: 'Antecedentes patológicos',
      icon: Pill,
      rows: [
        ['Enfermedades', toText(pathological.diseases)],
        ['Cirugías', toText(pathological.surgeries)],
        ['Medicamentos', toText(pathological.medications)],
      ],
    },
    {
      title: 'Estilo de vida',
      icon: Activity,
      rows: [
        ['Fuma', nonPathological.smoking === undefined ? '' : nonPathological.smoking ? 'Sí' : 'No'],
        ['Alcohol', ALCOHOL_CONSUMPTION[nonPathological.alcoholConsumption]],
        ['Actividad física', nonPathological.physicalActivity],
        ['Horas de sueño', nonPathological.sleepHours],
      ],
    },
    {
      title: 'Hábitos de alimentación',
      icon: Utensils,
      rows: [
        ['Comidas al día', eating.mealsPerDay],
        ['Le gustan', toText(eating.preferredFoods)],
        ['No le gustan', toText(eating.dislikedFoods)],
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <ClipboardList className="size-5 text-primary" />
            Historia clínica
          </h2>
          <p className="text-xs text-muted-foreground">Lo que llenó el paciente en su primer ingreso y lo que agregues en consulta</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditOpen(true)}>
          <Pencil data-icon="inline-start" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="border-border/60">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <section.icon className="size-4 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              {section.rows.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <EditarHistoriaClinicaModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        patientId={patientId}
        clinicalHistory={clinicalHistory}
        onSaved={onSaved}
      />
    </div>
  )
}
