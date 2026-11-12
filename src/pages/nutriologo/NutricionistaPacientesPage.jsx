import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import BuscadorPacientes from '@/components/nutriologo/BuscadorPacientes'
import PacienteCard from '@/components/nutriologo/PacienteCard'
import NuevoPacienteModal from '@/components/nutriologo/NuevoPacienteModal'
import { usePatients } from '@/context/PatientsContext'
import { fullName } from '@/lib/labels'

/**
 * Página de pacientes: búsqueda, alta y tarjetas con el semáforo de apego.
 */
function NutricionistaPacientesPage() {
  const navigate = useNavigate()
  const { patients, loading, error, includeInactive, setIncludeInactive } = usePatients()
  const [search, setSearch] = useState('')
  const [isNewOpen, setIsNewOpen] = useState(false)

  // La búsqueda se hace aquí mismo, sin volver a pedir la lista
  const term = search.trim().toLowerCase()
  const visible = patients.filter(
    (patient) => fullName(patient).toLowerCase().includes(term) || patient.email.toLowerCase().includes(term),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Pacientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {patients.length} {patients.length === 1 ? 'paciente' : 'pacientes'}
          </p>
        </div>
        <Button onClick={() => setIsNewOpen(true)}>
          <UserPlus data-icon="inline-start" />
          Nuevo paciente
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:w-80">
          <BuscadorPacientes valor={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="include-inactive" checked={includeInactive} onCheckedChange={setIncludeInactive} />
          <Label htmlFor="include-inactive">Mostrar inactivos</Label>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>{patients.length === 0 ? 'Aún no tienes pacientes' : 'Sin resultados'}</EmptyTitle>
            <EmptyDescription>
              {patients.length === 0 ? 'Da de alta a tu primer paciente con "Nuevo paciente".' : `Ningún paciente coincide con "${search}".`}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((patient) => (
            <PacienteCard key={patient._id} paciente={patient} onClick={() => navigate(`/nutriologo/pacientes/${patient._id}`)} />
          ))}
        </div>
      )}

      <NuevoPacienteModal open={isNewOpen} onOpenChange={setIsNewOpen} />
    </div>
  )
}

export default NutricionistaPacientesPage
