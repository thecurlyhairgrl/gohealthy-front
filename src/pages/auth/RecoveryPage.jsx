import { useState } from 'react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { RecoveryEmailForm } from '@/components/auth/RecoveryEmailForm'
import { RecoveryOtpForm } from '@/components/auth/RecoveryOtpForm'
import { RecoveryNewPasswordForm } from '@/components/auth/RecoveryNewPasswordForm'
import { authContent } from '@/data/auth-content'

// Los tres pasos de la recuperación viven en esta página.
// El correo y el código se guardan aquí y se pasan al siguiente paso
function RecoveryPage() {
  const [step, setStep] = useState('email') // 'email' | 'code' | 'password'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  function handleCodeSent(sentEmail) {
    setEmail(sentEmail)
    setStep('code')
  }

  function handleVerified(verifiedCode) {
    setCode(verifiedCode)
    setStep('password')
  }

  if (step === 'code') {
    return (
      <AuthLayout {...authContent.recoveryOtp}>
        <RecoveryOtpForm email={email} onVerified={handleVerified} />
      </AuthLayout>
    )
  }

  if (step === 'password') {
    return (
      <AuthLayout {...authContent.recoveryNewPassword}>
        <RecoveryNewPasswordForm email={email} code={code} />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout {...authContent.recoveryEmail}>
      <RecoveryEmailForm onCodeSent={handleCodeSent} />
    </AuthLayout>
  )
}

export default RecoveryPage
