import { apiFetch } from './client'

// Compartidas y propias. Se filtran en la página
export function getRecipesRequest() {
  return apiFetch('/recipes?limit=200')
}

export function createRecipeRequest(recipeData) {
  return apiFetch('/recipes', { method: 'POST', body: recipeData })
}

// Solo cambia lo que se manda. Las compartidas responden 404
export function updateRecipeRequest(id, recipeData) {
  return apiFetch(`/recipes/${id}`, { method: 'PUT', body: recipeData })
}

export function deleteRecipeRequest(id) {
  return apiFetch(`/recipes/${id}`, { method: 'DELETE' })
}

// La foto se sube después de crear la receta
export function uploadRecipeImageRequest(id, file) {
  const formData = new FormData()
  formData.append('image', file)
  return apiFetch(`/recipes/${id}/image`, { method: 'POST', body: formData })
}
