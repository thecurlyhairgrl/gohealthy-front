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
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  User,
  LogOut,
  Heart,
} from 'lucide-react'
import { nutriologoMock } from '@/features/nutricionista/data/mock-data'

// Links de navegación del sidebar del nutriólogo.
// Cuando se agreguen nuevas secciones, solo hay que añadir un objeto aquí.
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
 * Sidebar específico para las páginas del nutriólogo.
 * Usa los componentes de shadcn/ui Sidebar y NavLink de react-router-dom
 * para resaltar el link activo automáticamente.
 */
function NutricionistaSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      {/* Header: Logo y nombre del nutriólogo */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">GoHealthy</p>
            <p className="truncate text-xs text-muted-foreground">
              {nutriologoMock.nombre}
            </p>
          </div>
        </div>
      </SidebarHeader>


      {/* Contenido: links de navegación */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
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

      {/* Footer: botón de cerrar sesión */}
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            // TODO: Conectar con sistema de autenticación cuando exista
            console.log('Cerrar sesión (pendiente de implementar)')
          }}
        >
          <LogOut className="size-4" />
          <span>Cerrar sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default NutricionistaSidebar
