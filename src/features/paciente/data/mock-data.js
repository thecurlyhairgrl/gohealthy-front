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

