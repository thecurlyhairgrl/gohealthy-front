import { apiFetch } from './client'

// { days, measurements, weights, surveys, summary, goals }. El paciente no manda patientId
export function getProgressRequest(patientId, days = 180) {
  return apiFetch(patientId ? `/dashboard/progress?patientId=${patientId}&days=${days}` : `/dashboard/progress?days=${days}`)
}
