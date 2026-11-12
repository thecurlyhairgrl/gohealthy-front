import { apiFetch } from './client'

// De la más nueva a la más vieja
export function getMeasurementsRequest() {
  return apiFetch('/measurements')
}

export function createMeasurementRequest(measurementData) {
  return apiFetch('/measurements', { method: 'POST', body: measurementData })
}

// Reemplaza la medición completa: hay que mandar todos los campos, incluida la fecha
export function updateMeasurementRequest(id, measurementData) {
  return apiFetch(`/measurements/${id}`, { method: 'PUT', body: measurementData })
}

export function deleteMeasurementRequest(id) {
  return apiFetch(`/measurements/${id}`, { method: 'DELETE' })
}
