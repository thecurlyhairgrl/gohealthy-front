import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RecoveryEmailForm } from '@/features/auth/components/RecoveryEmailForm'
import { authContent } from '@/features/auth/data/auth-content'

export default function RecoveryEmailPage() {
  return (
    <AuthLayout {...authContent.recoveryEmail}>
      <RecoveryEmailForm />
    </AuthLayout>
  )
}
