const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, { method = 'GET', body } = {}) {
  const headers = {}

  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const isFile = body instanceof FormData
  if (body && !isFile) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  const response = await fetch(`${API_URL}${endpoint}`, { method, headers, body })

  // Sesión vencida: se borra y se regresa al login.
  if (response.status === 401 && endpoint !== '/auth/login') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.assign('/auth/login')
  }

  // Respuestas sin body
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(data?.message || 'Ocurrió un error en la petición')
    // El código HTTP, por si la pantalla necesita distinguir un 404 de otro error
    error.status = response.status
    throw error
  }
  return data
}

// Descarga de un archivo
export async function downloadFile(endpoint, fileName) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  if (!response.ok) {
    throw new Error('No se pudo descargar el archivo')
  }

  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}