import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Activity, Utensils, FileText, HeartPulse, ArrowLeft } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ExpedienteHeroCard from '@/features/nutricionista/components/ExpedienteHeroCard'
import ExpedienteProgresoTab from '@/features/nutricionista/components/ExpedienteProgresoTab'
import ExpedientePlanTab from '@/features/nutricionista/components/ExpedientePlanTab'
import ExpedienteDocumentosTab from '@/features/nutricionista/components/ExpedienteDocumentosTab'
import ExpedienteClinicoTab from '@/features/nutricionista/components/ExpedienteClinicoTab'
import { pacientesMock } from '@/features/nutricionista/data/mock-data'

/**
 * Página de Detalle del Paciente / Expediente Clínico.
 * Agrupa la información en pestañas: Progreso, Plan Alimenticio, Documentos y Datos Clínicos.
 */
export function NutricionistaPacienteDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const pacienteInicial = pacientesMock.find((p) => String(p.id) === String(id))
  const [paciente, setPaciente] = useState(pacienteInicial)

  if (!paciente) {
    return (
      <div className="max-w-5xl mx-auto py-12">
        <Card className="border-border/60 text-center py-10">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Paciente no encontrado</h2>
            <p className="text-sm text-muted-foreground">
              El paciente con ID #{id} no existe o no está registrado en tu lista activa.
            </p>
            <Button
              onClick={() => navigate('/nutriologo/dashboard')}
              className="gap-2 bg-[#2F6B4E] text-white hover:bg-[#2F6B4E]/90"
            >
              <ArrowLeft className="size-4" />
              <span>Volver al Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleActualizarSesion = (nuevaSesion) => {
    setPaciente((prev) => {
      // 1. Recalcular IMC con estatura
      const alturaM = parseFloat(prev.estatura) || 1.70
      const imcNum = (nuevaSesion.peso / (alturaM * alturaM)).toFixed(1)
      let imcClasificacion = 'Normal'
      if (imcNum < 18.5) imcClasificacion = 'Bajo peso'
      else if (imcNum >= 25 && imcNum < 30) imcClasificacion = 'Sobrepeso'
      else if (imcNum >= 30) imcClasificacion = 'Obesidad'
      const nuevoImc = `${imcNum} (${imcClasificacion})`

      // 2. Recalcular porcentaje de avance hacia la meta
      let nuevoProgreso = prev.progreso
      const pInicial = Number(prev.pesoInicial)
      const pMeta = Number(prev.pesoMeta)
      const pNuevo = Number(nuevaSesion.peso)

      if (pInicial > pMeta) {
        // Pérdida de peso
        const totalReducir = pInicial - pMeta
        const reducido = pInicial - pNuevo
        nuevoProgreso = Math.min(100, Math.max(0, Math.round((reducido / totalReducir) * 100)))
      } else if (pInicial < pMeta) {
        // Aumento de peso
        const totalAumentar = pMeta - pInicial
        const aumentado = pNuevo - pInicial
        nuevoProgreso = Math.min(100, Math.max(0, Math.round((aumentado / totalAumentar) * 100)))
      }

      // 3. Añadir sesión al historial cronológico
      const nuevoHistorial = [
        {
          fecha: nuevaSesion.fecha,
          peso: nuevaSesion.peso,
          nota: nuevaSesion.nota,
        },
        ...(prev.antecedentes?.historialConsultas || []),
      ]

      return {
        ...prev,
        pesoActual: nuevaSesion.peso,
        progreso: nuevoProgreso,
        imc: nuevoImc,
        grasaCorporal: nuevaSesion.grasaCorporal || prev.grasaCorporal,
        ultimaConsulta: nuevaSesion.fecha,
        consultasTotales: (prev.consultasTotales || 0) + 1,
        antecedentes: {
          ...prev.antecedentes,
          historialConsultas: nuevoHistorial,
        },
      }
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Tarjeta Hero del Paciente con estatura, avatar, contacto y botón de chat */}
      <ExpedienteHeroCard paciente={paciente} />

      {/* Pestañas del Expediente Clínico */}
      <Tabs defaultValue="progreso" className="w-full space-y-6">
        <div className="border-b border-border/60 pb-3">
          <TabsList className="bg-muted/60 p-1 flex flex-wrap h-auto w-fit gap-1 rounded-xl">
            <TabsTrigger
              value="progreso"
              className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium data-active:bg-background data-active:text-[#2F6B4E] data-active:shadow-xs rounded-lg"
            >
              <Activity className="size-4" />
              <span>Resumen y Progreso</span>
            </TabsTrigger>

            <TabsTrigger
              value="plan"
              className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium data-active:bg-background data-active:text-[#2F6B4E] data-active:shadow-xs rounded-lg"
            >
              <Utensils className="size-4" />
              <span>Plan Alimenticio</span>
            </TabsTrigger>

            <TabsTrigger
              value="documentos"
              className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium data-active:bg-background data-active:text-[#2F6B4E] data-active:shadow-xs rounded-lg"
            >
              <FileText className="size-4" />
              <span>Documentos ({paciente.documentos?.length || 0})</span>
            </TabsTrigger>

            <TabsTrigger
              value="clinicos"
              className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium data-active:bg-background data-active:text-[#2F6B4E] data-active:shadow-xs rounded-lg"
            >
              <HeartPulse className="size-4" />
              <span>Datos Clínicos</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="progreso" className="focus-visible:outline-none">
          <ExpedienteProgresoTab
            paciente={paciente}
            onActualizarSesion={handleActualizarSesion}
          />
        </TabsContent>

        <TabsContent value="plan" className="focus-visible:outline-none">
          <ExpedientePlanTab planInicial={paciente.planAlimenticio} />
        </TabsContent>

        <TabsContent value="documentos" className="focus-visible:outline-none">
          <ExpedienteDocumentosTab documentos={paciente.documentos} />
        </TabsContent>

        <TabsContent value="clinicos" className="focus-visible:outline-none">
          <ExpedienteClinicoTab antecedentes={paciente.antecedentes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default NutricionistaPacienteDetallePage
