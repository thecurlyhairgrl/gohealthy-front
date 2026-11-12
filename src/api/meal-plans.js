import { apiFetch } from './client'

// Responde 404 si el paciente no tiene plan activo. El paciente no manda patientId
export function getActiveMealPlanRequest(patientId) {
  return apiFetch(patientId ? `/meal-plans/active?patientId=${patientId}` : '/meal-plans/active')
}
