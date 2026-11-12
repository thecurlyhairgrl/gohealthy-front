import { useEffect, useState } from 'react'
import { getAppointmentsRequest } from '@/api/appointments'
import { getDayRange } from '@/lib/week-grid'

// Citas de un día, para saber qué horarios están ocupados al agendar.
// `day` es un texto "AAAA-MM-DD"; si está vacío no pide nada
export function useDayAppointments(day) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!day) return

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [year, month, date] = day.split('-').map(Number)
        setAppointments(await getAppointmentsRequest(getDayRange(new Date(year, month - 1, date))))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [day])

  return { appointments, loading, error }
}
