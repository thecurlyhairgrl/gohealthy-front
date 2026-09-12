import axios from 'axios'

// Instancia central de axios. Las llamadas a la API de cada dominio viven en
// src/features/<dominio>/api/ e importan este cliente en vez de usar axios
// directamente, para que interceptors (auth, manejo de errores, etc.) queden
// en un solo lugar.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
