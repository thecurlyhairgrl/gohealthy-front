import { apiFetch } from './client'

// from y to son fechas (Date); patientId es opcional
export function getAppointmentsRequest({ from, to, patientId } = {}) {
  const params = new URLSearchParams()
  if (from) params.append('from', from.toISOString())
  if (to) params.append('to', to.toISOString())
  if (patientId) params.append('patientId', patientId)
  return apiFetch(`/appointments?${params}`)
}

export function createAppointmentRequest(appointmentData) {
  return apiFetch('/appointments', { method: 'POST', body: appointmentData })
}

// Cambiar dateTime la deja "rescheduled"; cancelar es { status: 'cancelled' }
export function updateAppointmentRequest(id, appointmentData) {
  return apiFetch(`/appointments/${id}`, { method: 'PUT', body: appointmentData })
}
