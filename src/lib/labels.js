// La API usa valores en inglés; esto es lo que se muestra
export const APPOINTMENT_STATUS = {
  scheduled: { label: 'Programada', className: 'bg-sky-100 text-sky-800 border-sky-300' },
  rescheduled: { label: 'Reprogramada', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  completed: { label: 'Completada', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  cancelled: { label: 'Cancelada', className: 'bg-muted text-muted-foreground border-border line-through' },
}

export const APPOINTMENT_MODALITY = {
  'in-person': 'Presencial',
  'video-call': 'En línea',
}

export const SEX = {
  female: 'Femenino',
  male: 'Masculino',
}

export const ALCOHOL_CONSUMPTION = {
  never: 'Nunca',
  occasional: 'Ocasionalmente',
  frequent: 'Frecuentemente',
}

export const ADHERENCE_STATUS = {
  green: { label: 'Buen apego', className: 'bg-emerald-500' },
  yellow: { label: 'Apego regular', className: 'bg-amber-400' },
  red: { label: 'Bajo apego', className: 'bg-red-500' },
  'no-data': { label: 'Sin datos', className: 'bg-muted-foreground/40' },
}

export const MEAL_TIME = {
  breakfast: 'Desayuno',
  'morning-snack': 'Colación matutina',
  lunch: 'Comida',
  'afternoon-snack': 'Colación vespertina',
  dinner: 'Cena',
}

export const WEEK_DAY = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

export const fullName = (person) => {
  if (!person) return ''
  return [person.firstName, person.paternalLastName, person.maternalLastName].filter(Boolean).join(' ')
}

// "Ana García" -> "AG"
export const initials = (person) => {
  if (!person) return ''
  return `${person.firstName?.[0] || ''}${person.paternalLastName?.[0] || ''}`.toUpperCase()
}
