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

