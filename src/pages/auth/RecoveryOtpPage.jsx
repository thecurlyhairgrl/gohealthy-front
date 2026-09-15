import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RecoveryOtpForm } from '@/features/auth/components/RecoveryOtpForm'
import { authContent } from '@/features/auth/data/auth-content'

export default function RecoveryOtpPage() {
  return (
    <AuthLayout {...authContent.recoveryOtp}>
      <RecoveryOtpForm />
    </AuthLayout>
  )
}
