import { apiFetch } from './client'

// { days, measurements, surveys, summary, goals }
export function getProgressRequest(patientId, days = 180) {
  return apiFetch(`/dashboard/progress?patientId=${patientId}&days=${days}`)
}
