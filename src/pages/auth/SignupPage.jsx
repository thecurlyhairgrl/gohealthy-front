import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { authContent } from '@/features/auth/data/auth-content'

export default function SignupPage() {
  return (
    <AuthLayout {...authContent.signup}>
      <SignupForm />
    </AuthLayout>
  )
}
