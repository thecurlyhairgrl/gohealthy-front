import { apiFetch } from './client'

export function getPatientsRequest() {
    return apiFetch('/patients')
}

export function getPatientRequest(id) {
    return apiFetch(`/patients/${id}`)
}

export function createPatientRequest(patientData) {
    return apiFetch('/patients', { method: 'POST', body: patientData })
}

export function updatePatientRequest(id, patientData) {
    return apiFetch(`/patients/${id}`, { method: 'PUT', body: patientData })
}