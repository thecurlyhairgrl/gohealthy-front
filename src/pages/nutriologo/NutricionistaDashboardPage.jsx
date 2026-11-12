import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import CitasDelDia from '@/components/nutriologo/CitasDelDia'
import { CalendarioHeader } from '@/components/nutriologo/CalendarioHeader'
import { CalendarioSemanal } from '@/components/nutriologo/CalendarioSemanal'
import { CitaDetalleSheet } from '@/components/nutriologo/CitaDetalleSheet'
import AgendarCitaModal from '@/components/nutriologo/AgendarCitaModal'
import RegistrarConsultaModal from '@/components/nutriologo/RegistrarConsultaModal'
import { useAuth } from '@/context/AuthContext'
import { useAppointments } from '@/context/AppointmentsContext'

/**
 * Dashboard del nutriólogo: las citas de hoy y el calendario de la semana por horas.
 * La lista de pacientes está en su propia página.
 */
function NutricionistaDashboardPage() {
  const { user } = useAuth()
  const { weekDays, appointments, todayAppointments, loading, error, moveWeek } = useAppointments()

  // Cita abierta en el panel lateral
  const [selected, setSelected] = useState(null)
  // Diálogo de agendar: { initialDate, appointment } o null si está cerrado
  const [scheduling, setScheduling] = useState(null)
  // Cita de la que se registra la consulta
  const [consulting, setConsulting] = useState(null)

  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Hola, {user.firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">{today}</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Citas de hoy</h2>
        {loading && todayAppointments.length === 0 ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <CitasDelDia citas={todayAppointments} onSeleccionarCita={setSelected} />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Calendario</h2>
        <CalendarioHeader weekDays={weekDays} onMoverSemana={moveWeek} onAgendar={() => setScheduling({})} />
        <CalendarioSemanal
          weekDays={weekDays}
          citas={appointments}
          onAgendarEn={(date) => setScheduling({ initialDate: date })}
          onSeleccionarCita={setSelected}
        />
      </section>

      <CitaDetalleSheet
        cita={selected}
        onClose={() => setSelected(null)}
        onReprogramar={(cita) => {
          setSelected(null)
          setScheduling({ appointment: cita })
        }}
        onRegistrarConsulta={(cita) => {
          setSelected(null)
          setConsulting(cita)
        }}
      />

      <AgendarCitaModal
        open={Boolean(scheduling)}
        onOpenChange={(open) => !open && setScheduling(null)}
        initialDate={scheduling?.initialDate}
        appointment={scheduling?.appointment}
      />

      <RegistrarConsultaModal
        open={Boolean(consulting)}
        onOpenChange={(open) => !open && setConsulting(null)}
        patientId={consulting?.patient._id}
        appointment={consulting}
      />
    </div>
  )
}

export default NutricionistaDashboardPage
