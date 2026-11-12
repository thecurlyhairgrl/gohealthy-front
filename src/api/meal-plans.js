import { apiFetch } from './client'

// Responde 404 si el paciente no tiene plan activo. El paciente no manda patientId
export function getActiveMealPlanRequest(patientId) {
  return apiFetch(patientId ? `/meal-plans/active?patientId=${patientId}` : '/meal-plans/active')
}

export function createMealPlanRequest(planData) {
  return apiFetch('/meal-plans', { method: 'POST', body: planData })
}

// Sube la versión; se manda `reason` con el motivo del cambio
export function updateMealPlanRequest(id, planData) {
  return apiFetch(`/meal-plans/${id}`, { method: 'PUT', body: planData })
}

// { currentVersion, history }
export function getMealPlanHistoryRequest(id) {
  return apiFetch(`/meal-plans/${id}/history`)
}

// { version, reason, modifiedAt, previous, current }
export function getMealPlanVersionRequest(id, version) {
  return apiFetch(`/meal-plans/${id}/history/${version}`)
}
