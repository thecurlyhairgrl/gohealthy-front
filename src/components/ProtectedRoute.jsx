import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'

function ProtectedRoute() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // Sin sesión: lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Cada usuario solo entra a su área: el nutriólogo a /nutriologo, el paciente a /paciente,
  // y el paciente nuevo a /primer-ingreso hasta que cambie su contraseña y llene sus datos
  const home = getHomePath(user)
  if (!location.pathname.startsWith(home)) {
    return <Navigate to={home} replace />
  }

  // Con sesión y en su área: mostramos la ruta hija que se pidió
  return <Outlet />
}

export default ProtectedRoute
