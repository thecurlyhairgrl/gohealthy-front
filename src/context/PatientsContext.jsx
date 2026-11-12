import { createContext, useContext, useEffect, useState } from 'react'
import { getPatientsRequest, createPatientRequest, updatePatientRequest } from '@/api/patients'

const PatientsContext = createContext(null)

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Si es true, la lista también trae a los pacientes desactivados
  const [includeInactive, setIncludeInactive] = useState(false)

  // Al entrar al área del nutriólogo cargamos sus pacientes
  useEffect(() => {
    async function loadPatients() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPatientsRequest(includeInactive)
        setPatients(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [includeInactive])

  // Después de cambiar algo volvemos a pedir la lista, porque el back calcula el semáforo
  async function reloadPatients() {
    setPatients(await getPatientsRequest(includeInactive))
  }

  async function addPatient(patientData) {
    const data = await createPatientRequest(patientData) // { patient, clinicalHistory, emailSent }
    await reloadPatients()
    return data
  }

  async function editPatient(id, patientData) {
    const patient = await updatePatientRequest(id, patientData)
    await reloadPatients()
    return patient
  }

  const value = { patients, loading, error, includeInactive, setIncludeInactive, addPatient, editPatient, reloadPatients }

  return <PatientsContext value={value}>{children}</PatientsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePatients() {
  return useContext(PatientsContext)
}
