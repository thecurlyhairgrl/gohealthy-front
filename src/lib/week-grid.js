export const GRID_START_HOUR = 8
export const GRID_END_HOUR = 20
export const HOUR_HEIGHT = 64 // píxeles por hora

// Horas que se dibujan en la cuadrícula: 8, 9, ..., 19
export const GRID_HOURS = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, index) => GRID_START_HOUR + index)

// Posición y altura de una cita dentro de su columna del día
export const getAppointmentBox = (appointment) => {
  const start = new Date(appointment.dateTime)
  const minutesFromTop = (start.getHours() - GRID_START_HOUR) * 60 + start.getMinutes()
  return {
    top: (minutesFromTop / 60) * HOUR_HEIGHT,
    height: (appointment.durationMin / 60) * HOUR_HEIGHT,
  }
}

// Lunes a domingo de la semana de una fecha
export const getWeekDays = (date) => {
  const monday = new Date(date)
  const day = monday.getDay()
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day))
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(monday)
    next.setDate(monday.getDate() + index)
    return next
  })
}

// Inicio y fin de un día, para pedir sus citas con ?from=&to=
export const getDayRange = (date) => {
  const from = new Date(date)
  from.setHours(0, 0, 0, 0)
  const to = new Date(date)
  to.setHours(23, 59, 59, 999)
  return { from, to }
}
