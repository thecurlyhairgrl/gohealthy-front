import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/app/layouts/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

// Rutas de la app. Al agregar una nueva pantalla: crear la página en
// src/pages/<area>/NombrePage.jsx y declarar aquí su ruta apuntando a ella.
// La lógica de negocio (llamadas a API, formularios, estado) vive en
// src/features/<dominio>/, no en el archivo de la página.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
