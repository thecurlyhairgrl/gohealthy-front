import { apiFetch } from './client'

// Un elemento por paciente: { patient, lastMessage, unread }
export function getConversationsRequest() {
  return apiFetch('/messages/conversations')
}

// Del más viejo al más nuevo. El paciente no manda patientId: solo tiene una conversación
export function getMessagesRequest(patientId) {
  return apiFetch(patientId ? `/messages?patientId=${patientId}` : '/messages')
}

export function sendMessageRequest(messageData) {
  return apiFetch('/messages', { method: 'POST', body: messageData })
}

export function markAsReadRequest(patientId) {
  return apiFetch(patientId ? `/messages/read?patientId=${patientId}` : '/messages/read', { method: 'PUT' })
}

// { unread }
export function getUnreadCountRequest() {
  return apiFetch('/messages/unread-count')
}
