import { MessageSquare } from 'lucide-react'

/**
 * Estado inicial vacío que se muestra cuando no hay ninguna conversación seleccionada.
 */
export function ChatEstadoVacio() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-card/40">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-4 shadow-xs">
        <MessageSquare className="size-8" />
      </div>
      <h3 className="font-heading text-lg font-bold text-foreground">
        Selecciona una conversación
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-sm">
        Elige un paciente de la lista lateral para consultar su historial de
        mensajes, resolver dudas o realizar seguimiento nutricional.
      </p>
    </div>
  )
}
