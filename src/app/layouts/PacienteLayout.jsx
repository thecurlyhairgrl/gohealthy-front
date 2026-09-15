import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import PacienteSidebar from '@/features/paciente/components/PacienteSidebar'
import { Heart } from 'lucide-react'

/**
 * Layout compartido para las páginas del paciente (/paciente/*).
 * Integra el Sidebar flotante/colapsable y el área principal de contenido.
 */
function PacienteLayout() {
  return (
    <SidebarProvider>
      <PacienteSidebar />
      <SidebarInset className="min-h-svh bg-background">
        {/* Cabecera solo en móviles para abrir el menú offcanvas */}
        <header className="flex md:hidden h-14 items-center justify-between border-b border-border/60 px-4 bg-card/80 backdrop-blur-xs sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <span className="font-heading font-semibold text-sm">GoHealthy</span>
          </div>
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-3.5" />
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default PacienteLayout
