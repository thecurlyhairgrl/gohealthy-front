import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '@/app/layouts/RootLayout'
import NutricionistaLayout from '@/app/layouts/NutricionistaLayout'
import LandingPage from '@/pages/landing/LandingPage'
import NotFoundPage from '@/pages/NotFoundPage'
import NutricionistaDashboardPage from '@/pages/nutricionista/NutricionistaDashboardPage'
import { NutricionistaCalendarioPage } from '@/pages/nutricionista/NutricionistaCalendarioPage'
import { NutricionistaPerfilPage } from '@/pages/nutricionista/NutricionistaPerfilPage'
import { NutricionistaChatPage } from '@/pages/nutricionista/NutricionistaChatPage'
import { NutricionistaPacienteDetallePage } from '@/pages/nutricionista/NutricionistaPacienteDetallePage'

// Rutas de la app. Al agregar una nueva pantalla: crear la página en
// src/pages/<area>/NombrePage.jsx y declarar aquí su ruta apuntando a ella.
// La lógica de negocio (llamadas a API, formularios, estado) vive en
// src/features/<dominio>/, no en el archivo de la página.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/nutriologo',
    element: <NutricionistaLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <NutricionistaDashboardPage /> },
      { path: 'calendario', element: <NutricionistaCalendarioPage /> },
      { path: 'perfil', element: <NutricionistaPerfilPage /> },
      { path: 'chat', element: <NutricionistaChatPage /> },
      { path: 'pacientes/:id', element: <NutricionistaPacienteDetallePage /> },
    ],
  },
])
