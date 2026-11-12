import { apiFetch } from './client'

// Un elemento por paciente: { patient, lastMessage, unread }
export function getConversationsRequest() {
  return apiFetch('/messages/conversations')
}

// Del más viejo al más nuevo
export function getMessagesRequest(patientId) {
  return apiFetch(`/messages?patientId=${patientId}`)
}

export function sendMessageRequest(messageData) {
  return apiFetch('/messages', { method: 'POST', body: messageData })
}

export function markAsReadRequest(patientId) {
  return apiFetch(`/messages/read?patientId=${patientId}`, { method: 'PUT' })
}

// { unread }
export function getUnreadCountRequest() {
  return apiFetch('/messages/unread-count')
}
