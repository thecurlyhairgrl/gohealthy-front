import { apiFetch } from './client'

// Alimentos de un grupo del SMAE (sus equivalentes)
export function getFoodsRequest(groupKey) {
  return apiFetch(`/smae/foods?groupKey=${groupKey}&limit=200`)
}
