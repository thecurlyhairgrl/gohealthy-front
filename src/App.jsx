import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import NutricionistaLayout from '@/layouts/NutricionistaLayout'
import PacienteLayout from '@/layouts/PacienteLayout'
import LandingPage from '@/pages/landing/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import RecoveryPage from '@/pages/auth/RecoveryPage'
import ChangeTemporaryPasswordPage from '@/pages/primer-ingreso/ChangeTemporaryPasswordPage'
import OnboardingPage from '@/pages/primer-ingreso/OnboardingPage'
import NutricionistaDashboardPage from '@/pages/nutriologo/NutricionistaDashboardPage'
import NutricionistaPacientesPage from '@/pages/nutriologo/NutricionistaPacientesPage'
import NutricionistaPacienteDetallePage from '@/pages/nutriologo/NutricionistaPacienteDetallePage'
import NutricionistaChatPage from '@/pages/nutriologo/NutricionistaChatPage'
import NutricionistaPerfilPage from '@/pages/nutriologo/NutricionistaPerfilPage'
import PacientePlanAlimenticioPage from '@/pages/paciente/PacientePlanAlimenticioPage'
import PacienteCumplimientoPage from '@/pages/paciente/PacienteCumplimientoPage'
import PacienteCuestionarioPage from '@/pages/paciente/PacienteCuestionarioPage'
import PacienteDocumentosPage from '@/pages/paciente/PacienteDocumentosPage'
import PacientePerfilPage from '@/pages/paciente/PacientePerfilPage'
import PacienteProgresoPage from '@/pages/paciente/PacienteProgresoPage'
import PacienteChatPage from '@/pages/paciente/PacienteChatPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signin" element={<SignupPage />} />
      <Route path="/auth/recovery" element={<RecoveryPage />} />
      <Route path="/primer-ingreso/contrasena" element={<ChangeTemporaryPasswordPage />} />
      <Route path="/primer-ingreso/datos" element={<OnboardingPage />} />
      {/* Rutas privadas: solo con sesión iniciada */}
      <Route element={<ProtectedRoute />}>
        {/* Primer ingreso del paciente: sin menú lateral */}
        <Route path="/primer-ingreso/contrasena" element={<ChangeTemporaryPasswordPage />} />
        <Route path="/primer-ingreso/datos" element={<OnboardingPage />} />

        {/* Nutriólogo */}
        <Route path="/nutriologo" element={<NutricionistaLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<NutricionistaDashboardPage />} />
          <Route path="pacientes" element={<NutricionistaPacientesPage />} />
          <Route path="pacientes/:id" element={<NutricionistaPacienteDetallePage />} />
          <Route path="chat" element={<NutricionistaChatPage />} />
          <Route path="perfil" element={<NutricionistaPerfilPage />} />
        </Route>

        {/* Paciente */}
        <Route path="/paciente" element={<PacienteLayout />}>
          <Route index element={<Navigate to="plan-alimenticio" replace />} />
          <Route path="plan-alimenticio" element={<PacientePlanAlimenticioPage />} />
          <Route path="cumplimiento" element={<PacienteCumplimientoPage />} />
          <Route path="cuestionario" element={<PacienteCuestionarioPage />} />
          <Route path="progreso" element={<PacienteProgresoPage />} />
          <Route path="documentos" element={<PacienteDocumentosPage />} />
          <Route path="chat" element={<PacienteChatPage />} />
          <Route path="perfil" element={<PacientePerfilPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
