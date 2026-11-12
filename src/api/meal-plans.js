import { apiFetch } from './client'

// Responde 404 si el paciente no tiene plan activo
export function getActiveMealPlanRequest(patientId) {
  return apiFetch(`/meal-plans/active?patientId=${patientId}`)
}
