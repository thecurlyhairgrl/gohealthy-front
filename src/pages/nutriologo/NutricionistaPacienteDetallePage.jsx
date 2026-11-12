import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Activity, ClipboardList, FileText, HeartPulse, Utensils } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import ExpedienteHeroCard from '@/components/nutriologo/ExpedienteHeroCard'
import ExpedienteClinicoTab from '@/components/nutriologo/ExpedienteClinicoTab'
import ExpedienteConsultasTab from '@/components/nutriologo/ExpedienteConsultasTab'
import ExpedienteProgresoTab from '@/components/nutriologo/ExpedienteProgresoTab'
import ExpedienteDocumentosTab from '@/components/nutriologo/ExpedienteDocumentosTab'
import ExpedientePlanTab from '@/components/nutriologo/ExpedientePlanTab'
import EditarPacienteModal from '@/components/nutriologo/EditarPacienteModal'
import AgendarCitaModal from '@/components/nutriologo/AgendarCitaModal'
import RegistrarConsultaModal from '@/components/nutriologo/RegistrarConsultaModal'
import { usePatients } from '@/context/PatientsContext'
import { usePatientDetail } from '@/hooks/usePatientDetail'
import { useConsultations } from '@/hooks/useConsultations'
import { useProgress } from '@/hooks/useProgress'
import { resendAccessRequest } from '@/api/patients'
import { fullName } from '@/lib/labels'
import { getWeightHistory } from '@/lib/weights'

const TABS = [
  { value: 'clinico', label: 'Historia clínica', icon: HeartPulse },
  { value: 'consultas', label: 'Consultas', icon: ClipboardList },
  { value: 'progreso', label: 'Progreso', icon: Activity },
  { value: 'documentos', label: 'Documentos', icon: FileText },
  { value: 'plan', label: 'Plan', icon: Utensils },
]

/**
 * Expediente de un paciente.
 */
function NutricionistaPacienteDetallePage() {
  const { id } = useParams()
  const { editPatient } = usePatients()
  const { detail, loading, error, reload } = usePatientDetail(id)
  const consultationsState = useConsultations(id)
  const progressState = useProgress(id)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const [confirmToggle, setConfirmToggle] = useState(false)

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    )
  }
  if (error) return <p className="text-sm text-destructive">{error}</p>

  const { patient, clinicalHistory } = detail
  const lastConsultation = consultationsState.consultations[0]
  // El peso actual es el registro más reciente, sea de una consulta o del paciente
  const weights = getWeightHistory(consultationsState.consultations, progressState.progress?.measurements || [])

  async function handleResendAccess() {
    try {
      await resendAccessRequest(patient._id)
      toast.add({ title: 'Acceso reenviado', description: 'Le enviamos una contraseña temporal nueva', type: 'success' })
    } catch (err) {
      toast.add({ title: 'No se pudo reenviar el acceso', description: err.message, type: 'error' })
    }
  }

  async function handleToggleActive() {
    try {
      await editPatient(patient._id, { active: !patient.active })
      toast.add({ title: patient.active ? 'Paciente desactivado' : 'Paciente reactivado', type: 'success' })
      reload()
    } catch (err) {
      toast.add({ title: 'No se pudo cambiar el estado', description: err.message, type: 'error' })
    }
  }

  // Después de una consulta cambian el historial, el peso y la última consulta
  function handleConsultationSaved() {
    consultationsState.reload()
    progressState.reload()
    reload()
  }

  return (
    <div className="space-y-6">
      <ExpedienteHeroCard
        detail={detail}
        currentWeightKg={weights.at(-1)?.weight}
        lastConsultationDate={lastConsultation?.date}
        onEdit={() => setIsEditOpen(true)}
        onSchedule={() => setIsScheduleOpen(true)}
        onResendAccess={handleResendAccess}
        onToggleActive={() => setConfirmToggle(true)}
      />

      <Tabs defaultValue="clinico">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <tab.icon />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="clinico" className="pt-4">
          <ExpedienteClinicoTab patientId={id} clinicalHistory={clinicalHistory} onSaved={reload} />
        </TabsContent>
        <TabsContent value="consultas" className="pt-4">
          <ExpedienteConsultasTab
            consultations={consultationsState.consultations}
            loading={consultationsState.loading}
            error={consultationsState.error}
            canRegister={patient.active}
            onRegister={() => setIsConsultationOpen(true)}
          />
        </TabsContent>
        <TabsContent value="progreso" className="pt-4">
          <ExpedienteProgresoTab
            progress={progressState.progress}
            weights={weights}
            loading={progressState.loading || consultationsState.loading}
            error={progressState.error}
            weightGoalKg={clinicalHistory.weightGoalKg}
          />
        </TabsContent>
        <TabsContent value="documentos" className="pt-4">
          <ExpedienteDocumentosTab patientId={id} />
        </TabsContent>
        <TabsContent value="plan" className="pt-4">
          <ExpedientePlanTab patientId={id} />
        </TabsContent>
      </Tabs>

      <EditarPacienteModal open={isEditOpen} onOpenChange={setIsEditOpen} patient={patient} onSaved={reload} />
      <AgendarCitaModal open={isScheduleOpen} onOpenChange={setIsScheduleOpen} patientId={patient._id} />
      <RegistrarConsultaModal
        open={isConsultationOpen}
        onOpenChange={setIsConsultationOpen}
        patientId={patient._id}
        onSaved={handleConsultationSaved}
      />
      <ConfirmDialog
        open={confirmToggle}
        onOpenChange={setConfirmToggle}
        title={patient.active ? `¿Desactivar a ${fullName(patient)}?` : `¿Reactivar a ${fullName(patient)}?`}
        description={
          patient.active
            ? 'Ya no podrá iniciar sesión ni aparecerá en tu lista. Su expediente se conserva y puedes reactivarlo.'
            : 'Podrá volver a iniciar sesión y aparecerá en tu lista.'
        }
        confirmLabel={patient.active ? 'Desactivar' : 'Reactivar'}
        onConfirm={handleToggleActive}
      />
    </div>
  )
}

export default NutricionistaPacienteDetallePage
