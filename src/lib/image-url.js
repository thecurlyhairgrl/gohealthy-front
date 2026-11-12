// Las imágenes no están bajo /api: la API regresa rutas como /images/avatars/abc.webp
const API_ORIGIN = new URL(import.meta.env.VITE_API_URL).origin

export const getImageUrl = (path) => (path ? `${API_ORIGIN}${path}` : null)
