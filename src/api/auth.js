import { apiFetch } from './client'

export function loginRequest(credentials) {
    return apiFetch('/auth/login', { method: 'POST', body: credentials })
}

export function registerRequest(userData) {
    return apiFetch('/auth/register', { method: 'POST', body: userData })
}

export function getMeRequest() {
    return apiFetch('/auth/me')
}

// Datos públicos del nutriólogo (solo paciente)
export function getMyNutritionistRequest() {
  return apiFetch('/auth/me/nutritionist')
}

export function updateMeRequest(userData) {
    return apiFetch('/auth/me', { method: 'PUT', body: userData })
}

export function changePasswordRequest(passwords) {
    return apiFetch('/auth/change-password', { method: 'PUT', body: passwords })
}

export function forgotPasswordRequest(email) {
    return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } })
}

export function verifyOtpRequest(data) {
    return apiFetch('/auth/verify-otp', { method: 'POST', body: data })
}

export function resetPasswordRequest(data) {
    return apiFetch('/auth/reset-password', { method: 'POST', body: data })
}
export function uploadAvatarRequest(file) {
  const formData = new FormData()
  formData.append('image', file)
  return apiFetch('/auth/me/avatar', { method: 'POST', body: formData })
}
