import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search, User } from 'lucide-react'

/**
 * Columna lateral con el buscador y la lista directa de todos los pacientes del nutriólogo.
 */
export function ChatListaConversaciones({
  pacientes = [],
  conversaciones = [],
  pacienteActivoId,
  onSeleccionarPaciente,
  busqueda,
  onCambiarBusqueda,
}) {
  // Mapa de conversaciones por pacienteId
  const mapaConversaciones = useMemo(() => {
    const mapa = {}
    conversaciones.forEach((c) => {
      mapa[c.pacienteId] = c
    })
    return mapa
  }, [conversaciones])

  // Filtrado de pacientes por nombre
  const pacientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pacientes
    const query = busqueda.toLowerCase()
    return pacientes.filter((p) => p.nombre.toLowerCase().includes(query))
  }, [pacientes, busqueda])

  return (
    <div className="flex flex-col h-full border-r border-border/70 bg-card">
      {/* Cabecera de la lista con buscador */}
      <div className="p-4 border-b border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Mensajes
          </h2>
          <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {pacientes.length} pacientes
          </span>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar paciente..."
            value={busqueda}
            onChange={(e) => onCambiarBusqueda(e.target.value)}
            className="pl-9 text-xs h-9 bg-background"
            aria-label="Buscar paciente para chatear"
          />
        </div>
      </div>

      {/* Lista de pacientes */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {pacientesFiltrados.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No se encontraron pacientes con &quot;{busqueda}&quot;
          </div>
        ) : (
          pacientesFiltrados.map((paciente) => {
            const conv = mapaConversaciones[paciente.id]
            const esActivo = paciente.id === pacienteActivoId
            const iniciales = paciente.nombre
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)

            const ultimoMensaje =
              conv?.ultimoMensaje || 'Sin mensajes previos'
            const hora = conv?.fechaHoraUltimoMensaje || ''

            return (
              <button
                key={paciente.id}
                type="button"
                onClick={() => onSeleccionarPaciente(paciente.id)}
                className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-muted/40 ${
                  esActivo ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                {/* Avatar del paciente */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-heading font-semibold text-xs border border-primary/20">
                  {iniciales ? (
                    <span>{iniciales}</span>
                  ) : (
                    <User className="size-4" />
                  )}
                </div>

                {/* Detalles de la conversación */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {paciente.nombre}
                    </h3>
                    {hora && (
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {hora}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {ultimoMensaje}
                  </p>

                  <span className="inline-block text-[10px] text-muted-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded mt-1.5 font-medium truncate max-w-full">
                    {paciente.objetivo}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
