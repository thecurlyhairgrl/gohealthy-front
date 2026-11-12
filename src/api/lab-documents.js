import { apiFetch } from './client'

// El paciente no manda patientId: ve los suyos
export function getLabDocumentsRequest(patientId) {
  return apiFetch(patientId ? `/lab-documents?patientId=${patientId}` : '/lab-documents')
}

// formData lleva file, patientId y, si hay, description y studyDate
export function uploadLabDocumentRequest(formData) {
  return apiFetch('/lab-documents', { method: 'POST', body: formData })
}

// Solo puede borrarlo quien lo subió
export function deleteLabDocumentRequest(id) {
  return apiFetch(`/lab-documents/${id}`, { method: 'DELETE' })
}
