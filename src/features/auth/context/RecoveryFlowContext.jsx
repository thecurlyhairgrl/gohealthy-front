import { useMemo, useState } from 'react'
import { RecoveryFlowContext } from './recovery-flow-context'

// Comparte el correo y el estado de verificación entre los 3 pasos del flujo
// de recuperación de contraseña. Vive solo en memoria (sin localStorage):
// si el usuario recarga la página, el flujo se reinicia (spec-auth.md §5.7).
export function RecoveryFlowProvider({ children }) {
  const [recoveryEmail, setRecoveryEmail] = useState(null)
  const [otpVerified, setOtpVerified] = useState(false)

  const value = useMemo(
    () => ({
      recoveryEmail,
      setRecoveryEmail,
      otpVerified,
      setOtpVerified,
      resetRecoveryFlow: () => {
        setRecoveryEmail(null)
        setOtpVerified(false)
      },
    }),
    [recoveryEmail, otpVerified]
  )

  return <RecoveryFlowContext.Provider value={value}>{children}</RecoveryFlowContext.Provider>
}
