import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { authContent } from '@/features/auth/data/auth-content'

export default function LoginPage() {
  return (
    <AuthLayout {...authContent.login}>
      <LoginForm />
    </AuthLayout>
  )
}
