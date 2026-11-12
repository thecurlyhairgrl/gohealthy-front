const pad = (value) => String(value).padStart(2, '0')

// Fecha local en AAAA-MM-DD (para encuestas y mediciones). Nunca uses toISOString() para esto
export const toDateInput = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Fechas sin hora que guarda el back (nacimiento, encuestas, mediciones): se muestran en UTC para no perder un día
export const formatDateOnly = (value) => {
  return new Date(value).toLocaleDateString('es-MX', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' })
}

// Fechas con hora (citas, mensajes, consultas): se muestran en la hora local
export const formatDate = (value) => {
  return new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatTime = (value) => {
  return new Date(value).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

export const formatLongDate = (value) => {
  return new Date(value).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
}

// ¿Las dos fechas caen en el mismo día local?
export const isSameDay = (a, b) => toDateInput(new Date(a)) === toDateInput(new Date(b))

// Edad cumplida. Acepta "AAAA-MM-DD" o la fecha ISO que regresa el back
export const getAge = (birthDate) => {
  if (!birthDate) return null
  const [year, month, day] = String(birthDate).slice(0, 10).split('-').map(Number)
  const today = new Date()
  const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day)
  return today.getFullYear() - year - (hadBirthday ? 0 : 1)
}
