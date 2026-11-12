import { apiFetch } from './client'

export function getFollowUpReportRequest() {
  return apiFetch('/reports/patient-follow-up')
}

export function getWeightReportRequest(days) {
  return apiFetch(`/reports/weight-progress?days=${days}`)
}

export function getWellnessReportRequest(days) {
  return apiFetch(`/reports/wellness-by-condition?days=${days}`)
}

export function getTopFoodsReportRequest() {
  return apiFetch('/reports/top-foods')
}
