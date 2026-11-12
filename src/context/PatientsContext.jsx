import { createContext, useContext, useEffect, useState } from 'react'
import { getPatientsRequest, createPatientRequest, updatePatientRequest } from '@/api/patients'

const PatientsContext = createContext(null)

export function PatientsProvider({ children }) {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Cargar pacientes del nutriólogo
    useEffect(() => {
        async function loadPatients() {
            setLoading(true)
            setError(null)
            try {
                const data = await getPatientsRequest()
                setPatients(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadPatients()
    }, [])

    async function addPatient(patientData) {
        const data = await createPatientRequest(patientData)
        setPatients(await getPatientsRequest())
        return data
    }

    async function editPatient(id, patientData) {
        await updatePatientRequest(id, patientData)
        setPatients(await getPatientsRequest())
    }

    const value = { patients, loading, error, addPatient, editPatient }

    return <PatientsContext value={value}>{children}</PatientsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePatients() {
    return useContext(PatientsContext)
}