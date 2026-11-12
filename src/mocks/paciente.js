// Datos mock del paciente — se reemplazarán por datos reales del backend
// cuando el sistema de autenticación esté implementado.
export const pacienteMock = {
  id: 'pac-001',
  nombre: 'María García López',
  email: 'maria.garcia@email.com',
  fotoPerfil: null, // Se usará un placeholder o iniciales
}

// Plan alimenticio asignado por el nutriólogo — solo lectura para el paciente.
export const planAlimenticioMock = {
  calorias: '1,800 kcal',
  agua: '2.2 L al día',
  desayuno:
    'Omelette de 2 claras y 1 huevo entero con espinacas y jitomate + 1 rebanada de pan integral tostado + 1/2 taza de papaya.',
  colacion1: '1 manzana verde con 10 almendras naturales.',
  comida:
    '150g de pechuga de pollo a la plancha + 1 taza de quinoa o arroz integral + ensalada verde abundante con 1 cda de aceite de oliva.',
  colacion2:
    '1 taza de yogur griego sin azúcar con 1 cucharada de semillas de chía.',
  cena:
    'Ensalada de atún en agua con nopales, jitomate, cebolla morada y 1/3 de aguacate.',
  recomendaciones:
    'Evitar alimentos ultraprocesados, mantener hidratación constante y realizar caminata de 15 minutos después de comer.',
}

// Conversación mock entre el paciente actual y su nutriólogo
export const chatPacienteMock = {
  nutriologo: {
    nombre: 'Dr. Carlos Mendoza',
    especialidad: 'Nutrición Clínica y Deportiva',
    iniciales: 'CM',
    enLinea: true,
  },
  mensajes: [
    {
      id: 1,
      remitente: 'nutriologo',
      texto: '¡Hola María! ¿Cómo te has sentido estos primeros días con tu nuevo plan alimenticio?',
      hora: '09:15 AM',
    },
    {
      id: 2,
      remitente: 'paciente',
      texto: 'Hola Dr. Carlos, bastante bien. Solo tenía una duda con la colación vespertina.',
      hora: '09:30 AM',
    },
    {
      id: 3,
      remitente: 'paciente',
      texto: '¿Puedo sustituir el yogur griego por kéfir sin azúcar si no encuentro en el súper?',
      hora: '09:31 AM',
    },
    {
      id: 4,
      remitente: 'nutriologo',
      texto: '¡Sin problema! El kéfir natural sin azúcar tiene un aporte probiótico y proteico muy similar. Adelante con ese cambio.',
      hora: '09:42 AM',
    },
  ],
}

// Datos de progreso y evolución del paciente
export const progresoPacienteMock = {
  meta: {
    objetivo: 'Pérdida de grasa y recomposición corporal',
    pesoInicial: 72.0,
    pesoActual: 64.2,
    pesoMeta: 58.0,
    grasaInicial: 29.8,
    grasaActual: 24.5,
    grasaMeta: 20.0,
    progresoPorcentaje: 65,
    imcActual: '23.6 (Normal)',
    apegoPromedio: '94%',
  },
  metricasComparativa: {
    cambioPesoSemana: -0.8,
    cambioGrasaSemana: -1.2,
    cambioApegoSemana: 6,
  },
  evolucionTemporal: [
    { fecha: '14 Jul', peso: 72.0, grasa: 29.8, apego: 85, nota: 'Inicio de plan alimenticio y hábitos saludables' },
    { fecha: '28 Jul', peso: 70.5, grasa: 28.6, apego: 88, nota: 'Buena adaptación, reducción de sodio y azúcar' },
    { fecha: '11 Ago', peso: 68.8, grasa: 27.2, apego: 90, nota: 'Aumento progresivo y sostenido de hidratación' },
    { fecha: '25 Ago', peso: 66.7, grasa: 26.0, apego: 92, nota: 'Mayor energía y constancia en colaciones' },
    { fecha: '08 Sep', peso: 65.0, grasa: 25.7, apego: 88, nota: 'Mantenimiento del ritmo metabólico y actividad' },
    { fecha: '14 Sep', peso: 64.2, grasa: 24.5, apego: 94, nota: 'Excelente apego a los horarios y requerimiento hídrico' },
  ],
}

// Cuestionarios de seguimiento para el paciente (Psicológico y Alimenticio)
export const cuestionariosPacienteMock = {
  psicologico: {
    id: 'psicologico',
    titulo: 'Cuestionario Psicológico y Bienestar',
    descripcion: 'Monitorea tu relación con la comida, estrés, niveles de energía y motivación durante tu proceso.',
    tiempoMinutos: 3,
    preguntas: [
      {
        id: 'p1',
        numero: 1,
        pregunta: '¿Con qué frecuencia experimentas deseos de comer motivados por estrés, aburrimiento o ansiedad en lugar de hambre física?',
        opciones: ['Nunca o casi nunca', 'Raras veces (1-2 veces por semana)', 'Frecuentemente (3-4 veces)', 'Casi todos los días'],
      },
      {
        id: 'p2',
        numero: 2,
        pregunta: '¿Cómo describirías tu nivel de energía y estado de ánimo general a lo largo de esta semana?',
        opciones: ['Excelente y constante', 'Bueno con altibajos normales', 'Regular, me siento cansado(a)', 'Bajo, con poca motivación'],
      },
      {
        id: 'p3',
        numero: 3,
        pregunta: '¿Qué tanto estrés o presión te genera seguir las porciones y horarios del plan alimenticio?',
        opciones: ['Ningún estrés, es muy fácil de llevar', 'Estrés leve o manejable', 'Moderado, me cuesta organizarme', 'Mucho estrés o frustración'],
      },
      {
        id: 'p4',
        numero: 4,
        pregunta: 'Cuando enfrentas un día emocionalmente pesado, ¿cómo reaccionas respecto a tu alimentación?',
        opciones: ['Mantengo mi plan sin problemas', 'Como un poco más de lo habitual', 'Busco alimentos dulces o ultraprocesados', 'Pierdo el apetito por completo'],
      },
      {
        id: 'p5',
        numero: 5,
        pregunta: '¿Qué tan motivado(a) y satisfecho(a) te sientes con los cambios físicos y emocionales experimentados hasta hoy?',
        opciones: ['Muy motivado(a) y satisfecho(a)', 'Satisfecho(a), voy a buen ritmo', 'Poco satisfecho(a), esperaba más', 'Desmotivado(a)'],
      },
    ],
  },
  alimenticio: {
    id: 'alimenticio',
    titulo: 'Cuestionario Alimenticio y Hábitos',
    descripcion: 'Evalúa tu saciedad, preferencias de alimentos y practicidad en la preparación de platillos recomendados.',
    tiempoMinutos: 3,
    preguntas: [
      {
        id: 'a1',
        numero: 1,
        pregunta: '¿Cómo calificarías tu nivel de saciedad después de las comidas principales?',
        opciones: ['Quedo perfectamente satisfecho(a)', 'Quedo bien, pero con antojo ligero', 'Siento que me quedo con hambre', 'Quedo demasiado lleno(a)'],
      },
      {
        id: 'a2',
        numero: 2,
        pregunta: '¿Qué tan atractivos y apetecibles te resultan los platillos e ingredientes recomendados en tu plan?',
        opciones: ['Me encantan todos los platillos', 'La mayoría me gustan', 'Algunos no son de mi agrado', 'Me cuesta mucho tolerar las comidas'],
      },
      {
        id: 'a3',
        numero: 3,
        pregunta: '¿En qué momento del día sueles experimentar mayor apetito o dificultad para controlar porciones?',
        opciones: ['Por la mañana (Desayuno)', 'A media mañana (Colación 1)', 'Por la tarde (Comida/Colación 2)', 'Por la noche (Cena)'],
      },
      {
        id: 'a4',
        numero: 4,
        pregunta: 'Si has consumido alimentos adicionales a los marcados en tu plan, ¿cuáles han sido con mayor frecuencia?',
        opciones: ['No he comido nada fuera del plan', 'Frutas, nueces o semillas extras', 'Pan dulce, galletas o botanas saladas', 'Bebidas azucaradas o alcohol'],
      },
      {
        id: 'a5',
        numero: 5,
        pregunta: '¿Qué tan práctica te ha parecido la preparación de tus comidas en tu día a día?',
        opciones: ['Muy práctica y rápida', 'Manejable con algo de planeación', 'Complicada por falta de tiempo', 'Muy difícil de compaginar con mi trabajo/estudio'],
      },
    ],
  },
}

// Datos mock para la página de Cumplimiento de Actividades y Hábitos
export const cumplimientoPacienteMock = {
  fechaHoy: 'Lunes 14 de Septiembre, 2026',
  rachaDias: 6,
  metaAguaLitros: 2.2,
  comidas: [
    {
      id: 'desayuno',
      titulo: 'Desayuno',
      horario: '07:30 - 08:30',
      menu: 'Omelette de 2 claras y 1 huevo entero con espinacas y jitomate + 1 rebanada de pan integral tostado + 1/2 taza de papaya.',
      completado: true,
    },
    {
      id: 'colacion1',
      titulo: 'Colación Matutina',
      horario: '11:00 - 11:30',
      menu: '1 manzana verde con 10 almendras naturales.',
      completado: true,
    },
    {
      id: 'comida',
      titulo: 'Comida',
      horario: '14:00 - 15:00',
      menu: '150g de pechuga de pollo a la plancha + 1 taza de quinoa o arroz integral + ensalada verde abundante con 1 cda de aceite de oliva.',
      completado: true,
    },
    {
      id: 'colacion2',
      titulo: 'Colación Vespertina',
      horario: '17:30 - 18:00',
      menu: '1 taza de yogur griego sin azúcar con 1 cucharada de semillas de chía.',
      completado: true,
    },
    {
      id: 'cena',
      titulo: 'Cena',
      horario: '20:30 - 21:30',
      menu: 'Ensalada de atún en agua con nopales, jitomate, cebolla morada y 1/3 de aguacate.',
      completado: false,
    },
  ],
  vasosAguaConsumidos: 7, // 7 * 0.25 = 1.75 L
  habitos: [
    { id: 'h1', titulo: 'Caminata de 15 a 20 minutos después de comer', tipo: 'caminata', completado: true },
    { id: 'h2', titulo: 'Evitar alimentos ultraprocesados y refrescos azucarados', tipo: 'procesados', completado: true },
    { id: 'h3', titulo: 'Consumir ensalada verde o verduras antes de la proteína', tipo: 'ensalada', completado: true },
    { id: 'h4', titulo: 'Dormir al menos 7 horas de descanso reparador', tipo: 'sueno', completado: false },
  ],
  consistenciaSemanal: [
    { dia: 'Lun', fecha: '08 Sep', apego: 88, estado: 'alto' },
    { dia: 'Mar', fecha: '09 Sep', apego: 92, estado: 'alto' },
    { dia: 'Mié', fecha: '10 Sep', apego: 85, estado: 'alto' },
    { dia: 'Jue', fecha: '11 Sep', apego: 78, estado: 'medio' },
    { dia: 'Vie', fecha: '12 Sep', apego: 90, estado: 'alto' },
    { dia: 'Sáb', fecha: '13 Sep', apego: 82, estado: 'alto' },
    { dia: 'Dom', fecha: '14 Sep', apego: 85, estado: 'hoy' },
  ],
}

