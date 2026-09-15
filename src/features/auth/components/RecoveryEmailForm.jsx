import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { useRecoveryFlow } from '@/features/auth/context/recovery-flow-context'

export function RecoveryEmailForm() {
  const navigate = useNavigate()
  const { setRecoveryEmail } = useRecoveryFlow()
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // TODO: integrar envío real de OTP por correo
    setRecoveryEmail(email)
    navigate('/auth/recovery/otp')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Recupera tu cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico y te enviaremos un código para recuperar el acceso.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full">
        Enviar código
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Recordaste tu contraseña?{' '}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
