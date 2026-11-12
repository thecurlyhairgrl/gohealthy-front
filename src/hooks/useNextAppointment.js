import { useEffect, useState } from 'react'
import { getAppointmentsRequest } from '@/api/appointments'

// La próxima cita del paciente (o null si no tiene). Las canceladas no cuentan
export function useNextAppointment() {
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const appointments = await getAppointmentsRequest({ from: new Date() })
        const upcoming = appointments
          .filter((item) => item.status === 'scheduled' || item.status === 'rescheduled')
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        setAppointment(upcoming[0] || null)
      } catch {
        // Si falla, simplemente no se muestra la tarjeta
        setAppointment(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return { appointment, loading }
}
