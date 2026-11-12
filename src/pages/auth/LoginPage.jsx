import { Navigate } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { authContent } from '@/data/auth-content'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'

function LoginPage() {
  const { user, isAuthenticated } = useAuth()

  // Si ya inició sesión, no tiene caso mostrarle el formulario
  if (isAuthenticated) {
    return <Navigate to={getHomePath(user)} replace />
  }

  return (
    <AuthLayout {...authContent.login}>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
