import { createContext, useContext } from 'react'

export const RecoveryFlowContext = createContext(null)

export function useRecoveryFlow() {
  const context = useContext(RecoveryFlowContext)

  if (!context) {
    throw new Error('useRecoveryFlow debe usarse dentro de un RecoveryFlowProvider')
  }

  return context
}
