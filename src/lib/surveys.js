import { toDateInput } from './dates'

export const MOODS = {
  1: { label: 'Muy mal', emoji: '😞' },
  2: { label: 'Mal', emoji: '🙁' },
  3: { label: 'Regular', emoji: '😐' },
  4: { label: 'Bien', emoji: '🙂' },
  5: { label: 'Muy bien', emoji: '😄' },
}

// Meta de agua que usa el back para el semáforo de apego
export const WATER_GOAL_GLASSES = 8

// La encuesta de hoy, o undefined. La fecha se guarda sin hora: se compara el texto AAAA-MM-DD
export const findTodaySurvey = (surveys) => surveys.find((survey) => survey.date.slice(0, 10) === toDateInput())

// Días seguidos con encuesta, contando hacia atrás desde hoy (o desde ayer, si hoy aún no contesta)
export const getStreak = (surveys) => {
  const answered = new Set(surveys.map((survey) => survey.date.slice(0, 10)))
  const day = new Date()
  if (!answered.has(toDateInput(day))) {
    day.setDate(day.getDate() - 1)
  }

  let streak = 0
  while (answered.has(toDateInput(day))) {
    streak += 1
    day.setDate(day.getDate() - 1)
  }
  return streak
}
