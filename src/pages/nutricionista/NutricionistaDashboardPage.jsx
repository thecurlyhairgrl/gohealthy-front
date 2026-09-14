import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import CitasDelDia from '@/features/nutricionista/components/CitasDelDia'
import PacienteCard from '@/features/nutricionista/components/PacienteCard'
import BuscadorPacientes from '@/features/nutricionista/components/BuscadorPacientes'
import {
  nutriologoMock,
  pacientesMock,
  citasDelDiaMock,
} from '@/features/nutricionista/data/mock-data'

/**
 * Página principal del Dashboard del Nutriólogo.
 * Muestra un saludo, las citas del día, un buscador de pacientes,
 * un botón para registrar pacientes y un grid de tarjetas de pacientes.
 */
function NutricionistaDashboardPage() {
  const [busqueda, setBusqueda] = useState('')

  // Filtra pacientes por nombre en tiempo real
  const pacientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pacientesMock
    const termino = busqueda.toLowerCase()
    return pacientesMock.filter((p) =>
      p.nombre.toLowerCase().includes(termino)
    )
  }, [busqueda])

  // Formatea la fecha actual en español
  const fechaHoy = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleClickPaciente = (paciente) => {
    // TODO: Navegar al detalle del paciente cuando exista la ruta
    console.log('Paciente seleccionado:', paciente)
  }

  const handleRegistrarPaciente = () => {
    // TODO: Conectar con el formulario de registro cuando se implemente
    alert('Funcionalidad de registro de pacientes en desarrollo.')
  }

  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          Bienvenido, Dr. {nutriologoMock.nombre}
        </h1>
        <p className="mt-1 text-sm capitalize text-muted-foreground">
          {fechaHoy}
        </p>
      </div>

      {/* Citas del día */}
      <section>
        <h2 className="mb-3 text-lg font-medium">Citas de hoy</h2>
        <CitasDelDia citas={citasDelDiaMock} />
      </section>

      {/* Buscador + botón registrar */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium">Mis pacientes</h2>
          <div className="flex flex-1 items-center gap-3 sm:max-w-sm">
            <BuscadorPacientes valor={busqueda} onChange={setBusqueda} />
            <Button
              id="btn-registrar-paciente"
              onClick={handleRegistrarPaciente}
              className="shrink-0"
            >
              <UserPlus className="size-4" data-icon="inline-start" />
              <span className="hidden sm:inline">Registrar paciente</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>
        </div>

        {/* Grid de tarjetas de pacientes */}
        {pacientesFiltrados.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pacientesFiltrados.map((paciente) => (
              <PacienteCard
                key={paciente.id}
                paciente={paciente}
                onClick={handleClickPaciente}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-muted-foreground">
            <p className="text-sm">
              No se encontraron pacientes con &quot;{busqueda}&quot;
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default NutricionistaDashboardPage
