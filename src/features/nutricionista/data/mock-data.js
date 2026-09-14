// Datos mock temporales para el dashboard del nutriólogo.
// Se reemplazarán por llamadas a la API cuando los endpoints estén listos.

export const nutriologoMock = {
  id: 1,
  nombre: 'Carlos Mendoza',
  especialidad: 'Nutrición deportiva',
}

export const pacientesMock = [
  {
    id: 1,
    nombre: 'Ana García',
    edad: 28,
    objetivo: 'Perder peso',
    ultimaConsulta: '2026-09-10',
    progreso: 65,
  },
  {
    id: 2,
    nombre: 'Roberto López',
    edad: 35,
    objetivo: 'Ganar masa muscular',
    ultimaConsulta: '2026-09-08',
    progreso: 40,
  },
  {
    id: 3,
    nombre: 'María Fernández',
    edad: 42,
    objetivo: 'Mejorar hábitos alimenticios',
    ultimaConsulta: '2026-09-12',
    progreso: 80,
  },
  {
    id: 4,
    nombre: 'Luis Ramírez',
    edad: 23,
    objetivo: 'Ganar masa muscular',
    ultimaConsulta: '2026-09-05',
    progreso: 55,
  },
  {
    id: 5,
    nombre: 'Sofía Torres',
    edad: 31,
    objetivo: 'Perder peso',
    ultimaConsulta: '2026-09-11',
    progreso: 90,
  },
  {
    id: 6,
    nombre: 'Diego Morales',
    edad: 29,
    objetivo: 'Definición muscular',
    ultimaConsulta: '2026-09-07',
    progreso: 35,
  },
  {
    id: 7,
    nombre: 'Valentina Cruz',
    edad: 26,
    objetivo: 'Alimentación balanceada',
    ultimaConsulta: '2026-09-09',
    progreso: 70,
  },
  {
    id: 8,
    nombre: 'Andrés Herrera',
    edad: 38,
    objetivo: 'Control de diabetes',
    ultimaConsulta: '2026-09-06',
    progreso: 50,
  },
]

export const citasDelDiaMock = [
  {
    id: 1,
    hora: '09:00',
    paciente: 'Ana García',
    tipo: 'Seguimiento',
  },
  {
    id: 2,
    hora: '11:30',
    paciente: 'Roberto López',
    tipo: 'Primera consulta',
  },
  {
    id: 3,
    hora: '14:00',
    paciente: 'Sofía Torres',
    tipo: 'Revisión de plan',
  },
  {
    id: 4,
    hora: '16:00',
    paciente: 'María Fernández',
    tipo: 'Seguimiento',
  },
]
