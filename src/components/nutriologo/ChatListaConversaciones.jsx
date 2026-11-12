import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import { fullName, initials } from '@/lib/labels'
import { formatDate, formatTime, isSameDay } from '@/lib/dates'
import { getImageUrl } from '@/lib/image-url'

/**
 * Columna con el buscador y una conversación por paciente, ordenadas por el mensaje más reciente.
 */
export function ChatListaConversaciones({ conversaciones, pacienteActivoId, onSeleccionarPaciente, busqueda, onCambiarBusqueda }) {
  const term = busqueda.trim().toLowerCase()
  const visibles = conversaciones.filter((conversacion) => fullName(conversacion.patient).toLowerCase().includes(term))

  return (
    <div className="flex h-full flex-col border-r border-border/70 bg-card">
      <div className="space-y-3 border-b border-border/60 p-4">
        <h2 className="font-heading text-lg font-bold">Mensajes</h2>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar paciente..."
            value={busqueda}
            onChange={(event) => onCambiarBusqueda(event.target.value)}
            className="h-9 bg-background pl-9 text-xs"
            aria-label="Buscar paciente"
          />
        </div>
      </div>

      <div className="flex-1 divide-y divide-border/40 overflow-y-auto">
        {visibles.length === 0 ? (
          <p className="p-8 text-center text-xs text-muted-foreground">
            {conversaciones.length === 0 ? 'Aún no tienes pacientes activos' : `No se encontraron pacientes con "${busqueda}"`}
          </p>
        ) : (
          visibles.map(({ patient, lastMessage, unread }) => {
            const isActive = patient._id === pacienteActivoId
            // La conversación abierta ya se marcó como leída
            const pending = isActive ? 0 : unread
            return (
              <button
                key={patient._id}
                type="button"
                onClick={() => onSeleccionarPaciente(patient._id)}
                className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-muted/40 ${
                  isActive ? 'border-l-4 border-primary bg-primary/10' : ''
                }`}
              >
                <Avatar className="size-10">
                  <AvatarImage src={getImageUrl(patient.avatarUrl)} alt="" />
                  <AvatarFallback className="bg-primary/20 text-xs text-primary">{initials(patient)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className={`truncate text-sm ${pending > 0 ? 'font-bold' : 'font-semibold'}`}>{fullName(patient)}</h3>
                    {lastMessage && (
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {isSameDay(lastMessage.createdAt, new Date()) ? formatTime(lastMessage.createdAt) : formatDate(lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">
                      {lastMessage ? `${lastMessage.senderRole === 'nutritionist' ? 'Tú: ' : ''}${lastMessage.body}` : 'Sin mensajes'}
                    </p>
                    {pending > 0 && <Badge className="h-5 min-w-5 shrink-0 px-1.5">{pending}</Badge>}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
