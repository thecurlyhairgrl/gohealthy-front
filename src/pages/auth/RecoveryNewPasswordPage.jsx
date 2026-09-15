import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RecoveryNewPasswordForm } from '@/features/auth/components/RecoveryNewPasswordForm'
import { authContent } from '@/features/auth/data/auth-content'

export default function RecoveryNewPasswordPage() {
  return (
    <AuthLayout {...authContent.recoveryNewPassword}>
      <RecoveryNewPasswordForm />
    </AuthLayout>
  )
}
