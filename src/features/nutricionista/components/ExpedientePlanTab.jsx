import { useState } from 'react'
import {
  Utensils,
  Flame,
  Droplets,
  Edit3,
  Check,
  X,
  Coffee,
  Apple,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

/**
 * Pestaña del Plan Alimenticio del Paciente.
 * Permite visualizar y editar directamente en pantalla las calorías, requerimiento hídrico,
 * tiempos de comida y recomendaciones nutricionales.
 */
export default function ExpedientePlanTab({ planInicial }) {
  const [isEditing, setIsEditing] = useState(false)
  const [plan, setPlan] = useState(
    planInicial || {
      calorias: '2,000 kcal',
      agua: '2.0 L al día',
      desayuno: '',
      colacion1: '',
      comida: '',
      colacion2: '',
      cena: '',
      recomendaciones: '',
    }
  )
  const [tempPlan, setTempPlan] = useState(plan)
  const [mostrarExito, setMostrarExito] = useState(false)

  const handleStartEdit = () => {
    setTempPlan({ ...plan })
    setIsEditing(true)
    setMostrarExito(false)
  }

  const handleCancelEdit = () => {
    setTempPlan({ ...plan })
    setIsEditing(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setPlan({ ...tempPlan })
    setIsEditing(false)
    setMostrarExito(true)
    setTimeout(() => setMostrarExito(false), 4000)
  }

  const handleChange = (field, value) => {
    setTempPlan((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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

  return (
    <div className="space-y-6">
      {/* Barra de estado y acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold font-heading">Plan Nutricional Asignado</h2>
          <p className="text-xs text-muted-foreground">
            Diseñado según los objetivos calóricos y requerimientos clínicos del paciente
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mostrarExito && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md">
              <Check className="size-3.5" /> Cambios guardados correctamente
            </span>
          )}

          {!isEditing ? (
            <Button
              onClick={handleStartEdit}
              variant="outline"
              size="sm"
              className="gap-2 border-[#2F6B4E]/30 text-[#2F6B4E] hover:bg-[#2F6B4E]/10"
            >
              <Edit3 className="size-3.5" />
              <span>Editar Plan</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
                <span>Cancelar</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="gap-1.5 bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white"
              >
                <Check className="size-3.5" />
                <span>Guardar Cambios</span>
              </Button>
            </div>
          )}
        </div>
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
              {isEditing ? (
                <Input
                  value={tempPlan.calorias}
                  onChange={(e) => handleChange('calorias', e.target.value)}
                  placeholder="ej. 1,800 kcal"
                  className="mt-1 h-9 font-mono font-semibold"
                />
              ) : (
                <p className="text-xl font-bold font-mono text-foreground">{plan.calorias}</p>
              )}
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
              {isEditing ? (
                <Input
                  value={tempPlan.agua}
                  onChange={(e) => handleChange('agua', e.target.value)}
                  placeholder="ej. 2.2 L al día"
                  className="mt-1 h-9 font-mono font-semibold"
                />
              ) : (
                <p className="text-xl font-bold font-mono text-foreground">{plan.agua}</p>
              )}
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
                  {isEditing ? (
                    <Textarea
                      value={tempPlan[comida.id]}
                      onChange={(e) => handleChange(comida.id, e.target.value)}
                      rows={3}
                      placeholder={`Detalle del menú para ${comida.titulo.toLowerCase()}...`}
                      className="text-sm leading-relaxed"
                    />
                  ) : (
                    <div className="rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground">
                      {plan[comida.id] || (
                        <span className="italic text-muted-foreground">
                          Sin opciones asignadas para este horario.
                        </span>
                      )}
                    </div>
                  )}
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
          {isEditing ? (
            <Textarea
              value={tempPlan.recomendaciones}
              onChange={(e) => handleChange('recomendaciones', e.target.value)}
              rows={3}
              placeholder="Escribe recomendaciones, advertencias o consejos generales..."
              className="text-sm leading-relaxed"
            />
          ) : (
            <div className="rounded-lg bg-muted/40 p-3.5 text-sm leading-relaxed text-foreground">
              {plan.recomendaciones || (
                <span className="italic text-muted-foreground">
                  No hay recomendaciones adicionales registradas.
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
