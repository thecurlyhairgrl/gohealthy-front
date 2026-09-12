import { Outlet } from 'react-router-dom'

// Layout compartido por todas las rutas públicas. Cuando exista un layout de
// dashboard distinto para nutriólogos/pacientes, agregarlo como
// src/app/layouts/DashboardLayout.jsx y anidarlo en src/app/router.jsx.
function RootLayout() {
  return <Outlet />
}

export default RootLayout
