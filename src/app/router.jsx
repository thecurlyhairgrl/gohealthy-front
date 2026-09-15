import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import RootLayout from '@/app/layouts/RootLayout'
import NutricionistaLayout from '@/app/layouts/NutricionistaLayout'
import LandingPage from '@/pages/landing/LandingPage'
import PacienteLayout from '@/app/layouts/PacienteLayout'
import NotFoundPage from '@/pages/NotFoundPage'
import { RecoveryFlowProvider } from '@/features/auth/context/RecoveryFlowContext'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import RecoveryEmailPage from '@/pages/auth/RecoveryEmailPage'
import RecoveryOtpPage from '@/pages/auth/RecoveryOtpPage'
import RecoveryNewPasswordPage from '@/pages/auth/RecoveryNewPasswordPage'
import NutricionistaDashboardPage from '@/pages/nutricionista/NutricionistaDashboardPage'
import { NutricionistaCalendarioPage } from '@/pages/nutricionista/NutricionistaCalendarioPage'
import { NutricionistaPerfilPage } from '@/pages/nutricionista/NutricionistaPerfilPage'
import { NutricionistaChatPage } from '@/pages/nutricionista/NutricionistaChatPage'
import { NutricionistaPacienteDetallePage } from '@/pages/nutricionista/NutricionistaPacienteDetallePage'
import PacientePlanAlimenticioPage from '@/pages/paciente/PacientePlanAlimenticioPage'
import PacienteCumplimientoPage from '@/pages/paciente/PacienteCumplimientoPage'
import PacienteChatPage from '@/pages/paciente/PacienteChatPage'
import PacienteProgresoPage from '@/pages/paciente/PacienteProgresoPage'
import PacienteCuestionariosPage from '@/pages/paciente/PacienteCuestionariosPage'

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
    path: '/auth',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signin', element: <SignupPage /> },
      {
        path: 'recovery',
        element: (
          <RecoveryFlowProvider>
            <Outlet />
          </RecoveryFlowProvider>
        ),
        children: [
          { index: true, element: <RecoveryEmailPage /> },
          { path: 'otp', element: <RecoveryOtpPage /> },
          { path: 'new-password', element: <RecoveryNewPasswordPage /> },
        ],
      },
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
  {
    path: '/paciente',
    element: <PacienteLayout />,
    children: [
      { index: true, element: <Navigate to="plan-alimenticio" replace /> },
      // Rutas placeholder — se reemplazarán por sus páginas reales en specs individuales
      { path: 'plan-alimenticio', element: <PacientePlanAlimenticioPage /> },
      { path: 'cumplimiento', element: <PacienteCumplimientoPage /> },
      { path: 'cuestionarios', element: <PacienteCuestionariosPage /> },
      { path: 'progreso', element: <PacienteProgresoPage /> },
      { path: 'chat', element: <PacienteChatPage /> },
    ],
  },
])

