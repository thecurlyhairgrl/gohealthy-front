import {
  Utensils,
  Flame,
  Droplets,
  Coffee,
  Apple,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// Configuración de los 5 tiempos de comida con íconos y colores
// (mismos que usa ExpedientePlanTab del nutriólogo).
const comidasInfo = [
  {
    id: 'desayuno',
    titulo: 'Desayuno',
    horaSugerida: '07:30 - 08:30',
    icono: Coffee,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    id: 'colacion1',
    titulo: 'Colación Matutina',
    horaSugerida: '11:00 - 11:30',
    icono: Apple,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'comida',
    titulo: 'Comida',
    horaSugerida: '14:00 - 15:00',
    icono: Sun,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    id: 'colacion2',
    titulo: 'Colación Vespertina',
    horaSugerida: '17:30 - 18:00',
    icono: Utensils,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'cena',
    titulo: 'Cena',
    horaSugerida: '20:30 - 21:30',
    icono: Moon,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
]

/**
 * Vista de solo lectura del Plan Alimenticio del paciente.
 * Muestra las metas calóricas/hídricas, los 5 tiempos de comida
 * y las recomendaciones asignadas por el nutriólogo.
 *
 * Visualmente idéntico a ExpedientePlanTab del nutriólogo,
 * pero sin controles de edición (sin botón "Editar Plan", sin inputs/textareas).
 */
export default function PacientePlanAlimenticio({ plan }) {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-lg font-semibold font-heading">Mi Plan Alimenticio</h1>
        <p className="text-xs text-muted-foreground">
          Plan diseñado por tu nutriólogo según tus objetivos y requerimientos
        </p>
      </div>

      {/* Metas Generales: Calorías y Agua */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border/60 bg-card/70">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 shrink-0">
              <Flame className="size-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Aporte Calórico Diario
              </p>
              <p className="text-xl font-bold font-mono text-foreground">{plan.calorias}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 shrink-0">
              <Droplets className="size-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Requerimiento Hídrico
              </p>
              <p className="text-xl font-bold font-mono text-foreground">{plan.agua}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menú por Tiempos de Comida */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Tiempos de Comida del Día
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {comidasInfo.map((comida) => {
            const Icon = comida.icono
            return (
              <Card key={comida.id} className="border-border/60 bg-card/80">
                <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${comida.bg} ${comida.color}`}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {comida.titulo}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Horario recomendado: {comida.horaSugerida}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 sm:px-6">
                  <div className="rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground">
                    {plan[comida.id] || (
                      <span className="italic text-muted-foreground">
                        Sin opciones asignadas para este horario.
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recomendaciones Generales */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Sparkles className="size-4 text-[#ABB748]" />
            <span>Recomendaciones y Hábitos Saludables</span>
          </div>
          <CardDescription className="text-xs">
            Pautas clave sobre suplementación, actividad y descanso
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6">
          <div className="rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground">
            {plan.recomendaciones || (
              <span className="italic text-muted-foreground">
                No hay recomendaciones adicionales registradas.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
