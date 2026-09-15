import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useRecoveryFlow } from '@/features/auth/context/recovery-flow-context'

const OTP_LENGTH = 6
const RESEND_COOLDOWN_SECONDS = 30

export function RecoveryOtpForm() {
  const navigate = useNavigate()
  const { recoveryEmail, setOtpVerified } = useRecoveryFlow()
  const [otp, setOtp] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Se captura una sola vez, al montar: entrar directo a la URL sin haber
  // pasado por el paso de correo redirige al inicio del flujo. Un guard
  // basado en el valor "en vivo" de recoveryEmail podría dispararse de nuevo
  // si el contexto llegara a limpiarse mientras este formulario sigue montado.
  const [wasFlowValidOnMount] = useState(() => !!recoveryEmail)

  useEffect(() => {
    if (!wasFlowValidOnMount) {
      navigate('/auth/recovery', { replace: true })
    }
  }, [wasFlowValidOnMount, navigate])

  useEffect(() => {
    if (resendCooldown === 0) return

    const timer = setInterval(() => {
      setResendCooldown((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  if (!wasFlowValidOnMount) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // TODO: validar el OTP real contra el backend
    setOtpVerified(true)
    navigate('/auth/recovery/new-password')
  }

  const handleResend = () => {
    // TODO: integrar reenvío real de OTP por correo
    setResendCooldown(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Ingresa tu código</h1>
        <p className="text-sm text-muted-foreground">
          Enviamos un código de verificación a <span className="font-medium text-foreground">{recoveryEmail}</span>
        </p>
      </div>

      <FieldGroup>
        <Field className="items-center">
          <FieldLabel htmlFor="otp" className="sr-only">
            Código de verificación
          </FieldLabel>
          <InputOTP id="otp" maxLength={OTP_LENGTH} value={otp} onChange={setOtp} required>
            <InputOTPGroup>
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription className="text-center">
            Revisa tu bandeja de entrada o spam.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={otp.length !== OTP_LENGTH}>
        Verificar código
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
