import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useRecoveryFlow } from '@/features/auth/context/recovery-flow-context'

const MIN_PASSWORD_LENGTH = 8

export function RecoveryNewPasswordForm() {
  const navigate = useNavigate()
  const { otpVerified, resetRecoveryFlow } = useRecoveryFlow()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  // Se captura una sola vez, al montar: entrar directo a la URL sin haber
  // verificado el OTP redirige al inicio del flujo. Usar el valor "en vivo"
  // de otpVerified aquí causaría que el resetRecoveryFlow() del submit exitoso
  // (que también pone otpVerified en false) dispare este mismo guard y pise
  // la navegación a /auth/login.
  const [wasFlowValidOnMount] = useState(() => otpVerified)

  useEffect(() => {
    if (!wasFlowValidOnMount) {
      navigate('/auth/recovery', { replace: true })
    }
  }, [wasFlowValidOnMount, navigate])

  if (!wasFlowValidOnMount) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // TODO: reemplazar por actualización real de contraseña
    resetRecoveryFlow()
    navigate('/auth/login')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Ingresa tu nueva contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Asegúrate de usar caracteres seguros para proteger tu cuenta.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </Field>

        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="confirmPassword">Confirmar contraseña</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            aria-invalid={!!error}
            required
          />
          <FieldError>{error}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        Guardar contraseña
      </Button>
    </form>
  )
}
