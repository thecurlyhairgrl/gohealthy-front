import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import logoGoHealthy from '@/assets/GoHealthyLogo.png'

/**
 * Layout de las pantallas de primer ingreso del paciente (sin menú lateral).
 * Muestra el paso actual y deja cerrar sesión por si entró con otra cuenta.
 */
function PrimerIngresoLayout({ step, title, description, children }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <img src={logoGoHealthy} alt="GoHealthy" className="h-7 w-auto object-contain" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-primary">Paso {step} de 2</p>
          <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-xs">{children}</div>
      </div>
    </div>
  )
}

export default PrimerIngresoLayout
