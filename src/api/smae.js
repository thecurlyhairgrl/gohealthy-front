import { apiFetch } from './client'

// Los 19 grupos con sus kcal por equivalente
export function getGroupsRequest() {
  return apiFetch('/smae/groups')
}

// Alimentos de un grupo del SMAE (sus equivalentes)
export function getFoodsRequest(groupKey) {
  return apiFetch(`/smae/foods?groupKey=${groupKey}&limit=200`)
}

// Buscar alimentos por nombre
export function searchFoodsRequest(search) {
  return apiFetch(`/smae/foods?search=${encodeURIComponent(search)}&limit=30`)
}
