import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { forgotPasswordRequest, verifyOtpRequest } from '@/api/auth'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 30

// Paso 2: revisa el código que llegó al correo
export function RecoveryOtpForm({ email, onVerified }) {
  const [code, setCode] = useState('')
  const [apiError, setApiError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS)

  // Cuenta regresiva para poder reenviar el código
  useEffect(() => {
    if (resendCooldown === 0) return

    const timer = setInterval(() => {
      setResendCooldown((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  async function handleSubmit(event) {
    event.preventDefault()
    setApiError(null)
    setIsSubmitting(true)
    try {
      await verifyOtpRequest({ email, code })
      onVerified(code)
    } catch (error) {
      setApiError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    setApiError(null)
    try {
      await forgotPasswordRequest(email)
      setCode('')
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
      toast.add({ title: 'Te enviamos un código nuevo', type: 'success' })
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Ingresa tu código</h1>
        <p className="text-sm text-muted-foreground">
          Enviamos un código de verificación a <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {apiError && <p className="text-center text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="otp" className="sr-only">
            Código de verificación
          </FieldLabel>
          {/* containerClassName centra las casillas en el formulario */}
          <InputOTP id="otp" maxLength={OTP_LENGTH} value={code} onChange={setCode} containerClassName="justify-center">
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot key={index} index={index} className="size-11 text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription className="text-center">
            Revisa tu bandeja de entrada o spam.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={code.length !== OTP_LENGTH || isSubmitting}>
        {isSubmitting ? 'Verificando...' : 'Verificar código'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No recibiste el correo?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {resendCooldown > 0 ? `Reenviar código (${resendCooldown}s)` : 'Reenviar código'}
        </button>
      </p>
    </form>
  )
}
