import { apiFetch } from './client'

// { mustChangePassword, onboardingCompleted, clinicalHistory }
export function getOnboardingRequest() {
  return apiFetch('/onboarding')
}

export function completeOnboardingRequest(onboardingData) {
  return apiFetch('/onboarding', { method: 'PUT', body: onboardingData })
}
