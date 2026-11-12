export const WORK_START_HOUR = 8
export const WORK_END_HOUR = 20
export const SLOT_MINUTES = 30
export const APPOINTMENT_MINUTES = 60 // todas las citas duran una hora

// Horarios de un día; un horario está ocupado si se cruza con una cita que no está cancelada.
// Al reprogramar, `ignoreId` es la cita que se mueve, para que no choque consigo misma
export const getDaySlots = (day, appointments, ignoreId = null) => {
  const slots = []
  const now = new Date()

  for (let minutes = WORK_START_HOUR * 60; minutes + APPOINTMENT_MINUTES <= WORK_END_HOUR * 60; minutes += SLOT_MINUTES) {
    const start = new Date(day)
    start.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
    const end = new Date(start.getTime() + APPOINTMENT_MINUTES * 60000)

    const isTaken = appointments.some((appointment) => {
      if (appointment.status === 'cancelled' || appointment._id === ignoreId) {
        return false
      }
      const otherStart = new Date(appointment.dateTime)
      const otherEnd = new Date(otherStart.getTime() + appointment.durationMin * 60000)
      return start < otherEnd && otherStart < end
    })

    slots.push({
      label: start.toTimeString().slice(0, 5),
      dateTime: start.toISOString(),
      available: !isTaken && start > now,
    })
  }

  return slots
}
