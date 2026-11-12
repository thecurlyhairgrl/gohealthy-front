import { apiFetch } from './client'

// Encuestas del paciente, de la más nueva a la más vieja
export function getSurveysRequest() {
  return apiFetch('/wellness-surveys')
}

// Una por día: si ya contestó ese día responde 409
export function createSurveyRequest(surveyData) {
  return apiFetch('/wellness-surveys', { method: 'POST', body: surveyData })
}
