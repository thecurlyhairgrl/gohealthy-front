import { formatDate, formatDateOnly } from './dates'

// Historial de peso del paciente, del más viejo al más nuevo.
// Junta las consultas (las registra el nutriólogo) y las mediciones (las registra el paciente)
export const getWeightHistory = (consultations, measurements) => {
  return [
    ...consultations
      .filter((consultation) => consultation.measurements?.weightKg)
      .map((consultation) => ({
        date: new Date(consultation.date),
        label: formatDate(consultation.date),
        weight: consultation.measurements.weightKg,
      })),
    // Las mediciones son fechas sin hora (UTC)
    ...measurements.map((measurement) => ({
      date: new Date(measurement.date),
      label: formatDateOnly(measurement.date),
      weight: measurement.weightKg,
    })),
  ].sort((a, b) => a.date - b.date)
}
