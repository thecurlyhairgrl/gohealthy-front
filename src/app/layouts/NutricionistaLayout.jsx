import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import NutricionistaSidebar from '@/features/nutricionista/components/NutricionistaSidebar'

// Layout compartido por todas las rutas del nutriólogo (/nutriologo/*).
// Envuelve el contenido con el SidebarProvider de shadcn y renderiza el
// sidebar específico del nutriólogo a la izquierda.
function NutricionistaLayout() {
  return (
    <SidebarProvider>
      <NutricionistaSidebar />
      <SidebarInset>
        {/* Botón hamburguesa para abrir/cerrar el sidebar (visible en mobile
            y cuando el sidebar está colapsado en desktop). */}
        <header className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
          <SidebarTrigger />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default NutricionistaLayout
