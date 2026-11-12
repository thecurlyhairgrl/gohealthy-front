import { apiFetch } from './client'

// Con includeInactive también llegan los pacientes desactivados
export function getPatientsRequest(includeInactive = false) {
  return apiFetch(`/patients${includeInactive ? '?includeInactive=true' : ''}`)
}

// { patient, clinicalHistory, adherence }
export function getPatientRequest(id) {
  return apiFetch(`/patients/${id}`)
}

// { patient, clinicalHistory, emailSent }
export function createPatientRequest(patientData) {
  return apiFetch('/patients', { method: 'POST', body: patientData })
}

// Solo firstName, paternalLastName, maternalLastName, phone y active
export function updatePatientRequest(id, patientData) {
  return apiFetch(`/patients/${id}`, { method: 'PUT', body: patientData })
}

export function resendAccessRequest(id) {
  return apiFetch(`/patients/${id}/resend-access`, { method: 'POST' })
}

export function updateClinicalHistoryRequest(id, clinicalHistory) {
  return apiFetch(`/patients/${id}/clinical-history`, { method: 'PUT', body: clinicalHistory })
}
