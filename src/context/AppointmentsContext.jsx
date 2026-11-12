import { createContext, useContext, useEffect, useState } from 'react'
import { getAppointmentsRequest, createAppointmentRequest, updateAppointmentRequest } from '@/api/appointments'
import { getDayRange, getWeekDays } from '@/lib/week-grid'

const AppointmentsContext = createContext(null)

// Citas de la semana que se ve en el calendario y las de hoy.
// Lo usan el dashboard, el detalle de una cita y "Agendar cita"
export function AppointmentsProvider({ children }) {
  // Cualquier día de la semana que se está viendo
  const [weekDate, setWeekDate] = useState(() => new Date())
  const [appointments, setAppointments] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar las citas
  const [version, setVersion] = useState(0)

  const weekDays = getWeekDays(weekDate)

  useEffect(() => {
    async function loadAppointments() {
      setLoading(true)
      setError(null)
      const days = getWeekDays(weekDate)
      const today = getDayRange(new Date())
      try {
        const [week, todayList] = await Promise.all([
          getAppointmentsRequest({ from: days[0], to: getDayRange(days[6]).to }),
          getAppointmentsRequest(today),
        ])
        setAppointments(week)
        setTodayAppointments(todayList)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [weekDate, version])

  const reloadAppointments = () => setVersion((current) => current + 1)

  // Mover el calendario: -1 semana anterior, 1 siguiente, 0 la semana de hoy
  function moveWeek(direction) {
    if (direction === 0) {
      setWeekDate(new Date())
      return
    }
    const next = new Date(weekDate)
    next.setDate(next.getDate() + direction * 7)
    setWeekDate(next)
  }

  async function addAppointment(appointmentData) {
    const appointment = await createAppointmentRequest(appointmentData)
    reloadAppointments()
    return appointment
  }

  async function editAppointment(id, appointmentData) {
    const appointment = await updateAppointmentRequest(id, appointmentData)
    reloadAppointments()
    return appointment
  }

  const value = {
    weekDays,
    appointments,
    todayAppointments,
    loading,
    error,
    moveWeek,
    addAppointment,
    editAppointment,
    reloadAppointments,
  }

  return <AppointmentsContext value={value}>{children}</AppointmentsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppointments() {
  return useContext(AppointmentsContext)
}
