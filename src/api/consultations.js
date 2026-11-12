import { apiFetch } from './client'

// De la más reciente a la más antigua
export function getConsultationsRequest(patientId) {
  return apiFetch(`/consultations?patientId=${patientId}`)
}

// Con appointmentId, la cita queda completada
export function createConsultationRequest(consultationData) {
  return apiFetch('/consultations', { method: 'POST', body: consultationData })
}
