import { formatDate, formatDateOnly } from './dates'

export const WEIGHT_SOURCE = {
  patient: { label: 'Registro del paciente', color: '#ABB748' },
  consultation: { label: 'En consulta', color: '#2F6B4E' },
}

// Los registros de peso que regresa el back (progress.weights) listos para la gráfica.
// Las mediciones del paciente son fechas sin hora (UTC); las consultas tienen hora
export const toWeightPoints = (weights = []) => {
  return weights.map((record, index) => {
    const previous = weights[index - 1]
    return {
      ...record,
      label: record.source === 'patient' ? formatDateOnly(record.date) : formatDate(record.date),
      // Diferencia contra el registro anterior, sin importar de dónde venga
      change: previous ? Math.round((record.weightKg - previous.weightKg) * 10) / 10 : null,
    }
  })
}
