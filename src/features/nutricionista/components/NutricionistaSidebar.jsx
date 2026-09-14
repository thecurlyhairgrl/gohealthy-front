import { NavLink, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { nutriologoMock } from '@/features/nutricionista/data/mock-data'

// Links de navegación del sidebar del nutriólogo.
const navItems = [
  {
    label: 'Dashboard',
    href: '/nutriologo/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Calendario',
    href: '/nutriologo/calendario',
    icon: Calendar,
  },
  {
    label: 'Chat',
    href: '/nutriologo/chat',
    icon: MessageSquare,
  },
  {
    label: 'Mi Perfil',
    href: '/nutriologo/perfil',
    icon: User,
  },
]

/**
 * Sidebar flotante y colapsable (modo icon/minimalista) para las páginas del nutriólogo.
 * - variant="floating": Flota separado de los bordes de la pantalla con esquinas suaves y redondeadas.
 * - collapsible="icon": Al colapsar, mantiene visibles los íconos de navegación en modo compacto.
 * - Botón circular flotante en el borde para alternar entre expandido y minimalista.
 */
function NutricionistaSidebar() {
  const location = useLocation()
  const { state, toggleSidebar } = useSidebar()

  return (
    <Sidebar variant="floating" collapsible="icon" className="relative">
      {/* Botón circular de colapso/expansión flotante en el borde derecho (estilo píldora) */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={
          state === 'expanded'
            ? 'Colapsar menú lateral'
            : 'Expandir menú lateral'
        }
        className="hidden md:flex absolute -right-3 top-6 z-30 size-6 items-center justify-center rounded-full bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-0"
      >
        {state === 'expanded' ? (
          <ChevronLeft className="size-3.5" />
        ) : (
          <ChevronRight className="size-3.5" />
        )}
      </button>

      {/* Header: Logo y marca */}
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
            <Heart className="size-4" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-foreground">
              GoHealthy
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Dr. {nutriologoMock.nombre}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido: links de navegación */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-xs font-medium text-muted-foreground">
            Menú
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<NavLink to={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: botón de cerrar sesión colapsable */}
      <SidebarFooter className="p-2 border-t border-black/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Cerrar sesión"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => {
                // TODO: Conectar con sistema de autenticación cuando exista
                console.log('Cerrar sesión (pendiente de implementar)')
              }}
            >
              <LogOut className="size-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default NutricionistaSidebar
