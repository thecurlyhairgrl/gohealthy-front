# GoHealthy Front · Guía para terminar el front

Esta guía reorganiza el front y lo conecta con la API. Está repartida por persona, igual que la guía de clase. Al terminar habremos entregado:

- [x] El proyecto limpio: sin Podman y con una estructura de carpetas como la de clase
- [x] La sesión real: login, registro, recuperación de contraseña y primer ingreso del paciente
- [x] Las pantallas del nutriólogo conectadas a la API, con las correcciones del profesor
- [x] Las pantallas del paciente conectadas a la API, con el plan alimenticio como receta
- [x] La biblioteca de recetas, el constructor del plan y los reportes
- [x] Ningún `alert()` ni `confirm()` del navegador: todo con toasts y diálogos de shadcn
- [x] Ningún dato de prueba (`src/mocks/`)

**El back manda.** Cuando una pantalla no coincida con lo que responde la API, se cambia la pantalla. El contrato de cada endpoint está en `docs/frontend/specs/conexion-api-back.spec.md`; en esta guía se cita como "el spec".

---

## 0. Antes de empezar

### 0.1 Decisiones que ya tomamos

| Tema | Decisión |
|---|---|
| Estructura | Como la del proyecto de clase: `api/`, `context/`, `components/`, `hooks/`, `layouts/`, `pages/` y `schemas/` |
| Sesión | Un `AuthContext` sencillo, como en clase. Se quita Zustand |
| Datos de la API | `fetch` con el `apiFetch` de clase. Contextos, como `BooksContext`, para los datos que comparten varias pantallas, y hooks con `useEffect` para los de una sola. Se quitan axios y TanStack Query |
| Formularios | React Hook Form + Zod |
| Rutas | React Router (`react-router-dom`) como en clase: `BrowserRouter` en `main.jsx` y `<Routes>` en `App.jsx`, con un `ProtectedRoute` |
| Avisos | Toasts de shadcn. Nada de `alert()` ni `confirm()` |
| Podman | Se quita |
| Lista de pacientes | Sale del dashboard y pasa a una página **Pacientes** |
| Calendario | Va en el dashboard, por semana y por horas. Se quitan la página Calendario y la vista mensual |
| Hora al agendar | Botones con los horarios del día; los ocupados aparecen deshabilitados |
| Horarios de comida | Fijos en el front, iguales para todos los pacientes |

### 0.2 Reparto

| Parte | Quién | Qué | Depende de |
|---|---|---|---|
| 1 | Dante | Limpieza, estructura, sesión, rutas y pantallas de autenticación | Nada |
| 2 | Dante (hecha) | Pantallas del nutriólogo | Parte 1 |
| 3 | Dante (hecha) | Pantallas del paciente | Parte 1 |
| 4 | Dante (hecha) | Recetas, constructor del plan y reportes | Parte 1 |
| 5 | Todos | Limpieza final y prueba completa | Partes 1 a 4 |

**La Parte 1 va primero.** Mientras tanto, Leo y Fer pueden ir moviendo sus componentes a la estructura nueva (paso 1.3) y armando las pantallas con diseño, sin conectarlas todavía. Si quieren otro reparto, solo cambien los nombres: las partes no dependen de quién las haga.

### 0.3 Ramas

El front usa `develop` y Pull Requests, como dice `CONTRIBUTING.md`. `develop` y `main` ya están al día: incluyen el cambio de los íconos SVG, el spec, el contexto del back y esta guía. Todos empiezan desde `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/estructura-base/dante
```

Una rama por parte, y cada una con su Pull Request hacia `develop`.

### 0.4 Trabajar con un agente de código

El repo ya trae el contexto que necesita un agente: `AGENTS.md` (lo leen Codex, Cursor y la mayoría) y `CLAUDE.md` (lo lee Claude Code, y solo importa `AGENTS.md`). Desde ahí, el agente sabe que debe leer `docs/backend/README.md`, el spec y esta guía.

Para pedirle un paso, basta con decir cuál:

> Haz el paso 2.3 de `docs/frontend/GUIA-FRONT.md`.

Revisa lo que haga antes de subirlo, y corre `pnpm lint` y `pnpm build`.

### 0.5 Antes de cada Pull Request

```bash
pnpm lint
pnpm build
```

Los dos deben pasar sin errores. Hoy `pnpm build` funciona y `pnpm lint` marca 1 error, que se corrige en el paso 1.12.

---

# Parte 1 — Dante: limpieza, estructura y sesión

## Paso 1.1 — Quitar Podman

Borra estos archivos:

```bash
git rm Containerfile compose.yaml .containerignore .dockerignore
```

Después:

1. En `package.json`, borra los scripts `podman:up` y `podman:down`.
2. En `package.json`, cambia `"engines": { "node": ">=20 <21" }` por `"engines": { "node": ">=20" }`. Con el rango actual, Node 22 o superior marca advertencia.
3. En `vite.config.js`, borra el bloque `watch` con `usePolling`, que solo existía por Podman.
4. En `README.md`, `CONTRIBUTING.md` y `AGENTS.md`, borra las secciones y menciones de Podman.

Archivo: `vite.config.js`

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## Paso 1.2 — Dependencias y variables de entorno

```bash
pnpm add @hookform/resolvers
pnpm remove zustand axios @tanstack/react-query
```

- **`@hookform/resolvers`** conecta React Hook Form con Zod. Ya tenemos las dos librerías, pero falta esta.
- **Zustand, axios y TanStack Query** se quitan para trabajar como en clase: la sesión vive en un contexto, las peticiones usan `fetch` y los datos se cargan con contextos y hooks propios.

Al quitarlas, `src/app/providers.jsx`, `src/lib/api-client.js` y `src/lib/query-client.js` dejan de compilar. El cliente se reescribe en el paso 1.5, los providers pasan a `main.jsx` en el paso 1.8 y `src/lib/query-client.js` se borra:

```bash
git rm src/lib/query-client.js
```

En `.env` y `.env.example`:

```
VITE_API_URL=http://localhost:3000/api
```

Hoy dice `http://localhost:3000`, sin `/api`, y todas las peticiones darían 404. En el `.env` del back, `CLIENT_URL` debe ser `http://localhost:5173`.

## Paso 1.3 — Estructura de carpetas

Así queda `src/`. Los componentes de shadcn se quedan en `components/ui/` y no se tocan.

```
src/
├── api/                 Una función por endpoint, un archivo por recurso
│   ├── client.js        apiFetch: el token, los errores y el 401
│   ├── auth.js
│   ├── patients.js
│   └── ...
├── components/
│   ├── ui/              shadcn (no editar)
│   ├── FormField.jsx    Campo de formulario reutilizable
│   ├── DatePicker.jsx   Selector de fecha con el calendario de shadcn
│   ├── FormSelect.jsx   Select de shadcn conectado a React Hook Form
│   ├── ProtectedRoute.jsx
│   ├── ConfirmDialog.jsx
│   ├── landing/         Componentes de la página de inicio
│   ├── auth/            Componentes de login y recuperación
│   ├── nutriologo/      Componentes del nutriólogo
│   └── paciente/        Componentes del paciente
├── context/
│   ├── AuthContext.jsx  Sesión: usuario, login y logout
│   └── ...              Datos que comparten varias pantallas (pacientes, citas)
├── hooks/               Datos de una sola pantalla, con useEffect
├── layouts/             NutricionistaLayout, PacienteLayout, PrimerIngresoLayout
├── lib/                 Utilidades: fechas, textos, imágenes, horarios
├── pages/
│   ├── landing/
│   ├── auth/
│   ├── primer-ingreso/
│   ├── nutriologo/
│   ├── paciente/
│   └── NotFoundPage.jsx
├── schemas/             Esquemas de Zod de los formularios
├── data/                Textos fijos de la landing y de auth
├── mocks/               Datos de prueba, mientras se conecta la API (ya se borraron en la Parte 3)
├── App.jsx              Las rutas, con <Routes> y <Route>, como en clase
├── main.jsx             BrowserRouter y providers
└── index.css
```

De dónde sale cada cosa:

| Hoy | Pasa a |
|---|---|
| `app/router.jsx`, `app/providers.jsx`, `app/layouts/RootLayout.jsx` | Se borran: las rutas pasan a `App.jsx` y los providers a `main.jsx` (paso 1.8) |
| `app/layouts/*` | `layouts/` |
| `features/auth/components/*` | `components/auth/` |
| `features/auth/data/*`, `features/landing/data/*` | `data/` |
| `features/landing/components/*` | `components/landing/` |
| `features/nutricionista/components/*` | `components/nutriologo/` |
| `features/paciente/components/*` | `components/paciente/` |
| `pages/nutricionista/*` | `pages/nutriologo/` |
| `lib/api-client.js` | `api/client.js` |
| `features/*/data/mock-data.js` | `mocks/nutriologo.js` y `mocks/paciente.js`, como en el proyecto de clase. Se borran al final (Parte 5) |
| `pages/HomePage.jsx`, `pages/HomePage.css`, `pages/paciente/PacientePlaceholderPage.jsx` | Se borran: no se usan |

Muévelos con `git mv` para conservar su historial, y corrige los `import` con el alias `@/`. Al terminar, `pnpm build` debe pasar. **Este paso no cambia nada visual: es solo mover archivos.** Conviene hacerlo en un commit aparte.

## Paso 1.4 — Avisos con toasts

Usamos el componente de toast de shadcn que ya está instalado (`components/ui/toast.jsx`). Trae dos piezas:

- **`Toaster`:** donde aparecen los toasts. Se pone una sola vez, en `main.jsx` (paso 1.8).
- **`toast`:** con él se muestra un toast desde cualquier archivo, incluso fuera de un componente.

```js
import { toast } from '@/components/ui/toast'

toast.add({ title: 'Cita agendada', type: 'success' })
toast.add({ title: 'No se pudo guardar', description: 'Revisa tu conexión', type: 'error' })
```

`type` puede ser `success`, `error`, `warning`, `info` o `loading`, y cambia el ícono. **Nunca uses `alert()`**: en su lugar va un toast.

Para preguntar antes de borrar algo, en lugar de `confirm()`, usa este diálogo:

Archivo: `src/components/ConfirmDialog.jsx`

```jsx
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirmar', onConfirm }) {
    // El botón de confirmar no cierra el diálogo solo: lo cerramos y luego hacemos la acción
    function handleConfirm() {
        onOpenChange(false)
        onConfirm()
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm}>{confirmLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
```

## Paso 1.5 — Cliente de la API

Es el `apiFetch` del proyecto de clase, con tres cosas más que pide este back:

- **El token** sale de `localStorage`, así que no hay que pasarlo en cada llamada.
- **Los archivos** (`FormData`) se mandan tal cual, sin convertirlos a JSON.
- **Si la sesión vence** (`401`), borra la sesión y lleva al login.

Archivo: `src/api/client.js`

```js
const API_URL = import.meta.env.VITE_API_URL

export async function apiFetch(endpoint, { method = 'GET', body } = {}) {
  const headers = {}

  const token = localStorage.getItem('token')
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const isFile = body instanceof FormData
  if (body && !isFile) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }

  const response = await fetch(`${API_URL}${endpoint}`, { method, headers, body })

  // Sesión vencida: se borra y se regresa al login.
  if (response.status === 401 && endpoint !== '/auth/login') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.assign('/auth/login')
  }

  // Respuestas sin body
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(data?.message || 'Ocurrió un error en la petición')
    // El código HTTP, por si la pantalla necesita distinguir un 404 de otro error
    error.status = response.status
    throw error
  }
  return data
}

// Descarga de un archivo
export async function downloadFile(endpoint, fileName) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })
  if (!response.ok) {
    throw new Error('No se pudo descargar el archivo')
  }

  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
```

Igual que en clase, el mensaje en español que manda el back queda en `error.message`. Además, `error.status` trae el código HTTP, por si una pantalla necesita distinguir un `404` (por ejemplo, "este paciente no tiene plan") de un error real.

Cada recurso tiene su archivo, con una función por endpoint:

Archivo: `src/api/auth.js`

```js
import { apiFetch } from './client'

export function loginRequest(credentials) {
  return apiFetch('/auth/login', { method: 'POST', body: credentials })
}

export function registerRequest(userData) {
  return apiFetch('/auth/register', { method: 'POST', body: userData })
}

export function getMeRequest() {
  return apiFetch('/auth/me')
}

export function updateMeRequest(userData) {
  return apiFetch('/auth/me', { method: 'PUT', body: userData })
}

export function changePasswordRequest(passwords) {
  return apiFetch('/auth/change-password', { method: 'PUT', body: passwords })
}

export function forgotPasswordRequest(email) {
  return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } })
}

export function verifyOtpRequest(data) {
  return apiFetch('/auth/verify-otp', { method: 'POST', body: data })
}

export function resetPasswordRequest(data) {
  return apiFetch('/auth/reset-password', { method: 'POST', body: data })
}
```

Los demás archivos de `api/` siguen el mismo formato, con las rutas de la sección 5 del spec. Por ejemplo:

Archivo: `src/api/patients.js`

```js
import { apiFetch } from './client'

export function getPatientsRequest() {
  return apiFetch('/patients')
}

export function getPatientRequest(id) {
  return apiFetch(`/patients/${id}`)
}

export function createPatientRequest(patientData) {
  return apiFetch('/patients', { method: 'POST', body: patientData })
}

export function updatePatientRequest(id, patientData) {
  return apiFetch(`/patients/${id}`, { method: 'PUT', body: patientData })
}
```

Para subir un archivo, se arma un `FormData` y se manda como `body`:

```js
const formData = new FormData()
formData.append('file', archivo)
formData.append('description', 'Química sanguínea')

apiFetch('/lab-documents', { method: 'POST', body: formData })
```

## Paso 1.6 — Sesión con `AuthContext`

Igual que en clase: el contexto guarda al usuario y lo copia en `localStorage` para que sobreviva a un refresh. El token lo lee directo el cliente de la API.

Archivo: `src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'
import { loginRequest, registerRequest, getMeRequest } from '@/api/auth'

const AuthContext = createContext(null)

const readSavedUser = () => {
  const savedUser = localStorage.getItem('user')
  return savedUser ? JSON.parse(savedUser) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedUser)

  function saveSession(data) {
    localStorage.setItem('token', data.token)
    saveUser(data.user)
  }

  function saveUser(nextUser) {
    localStorage.setItem('user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  async function login(email, password) {
    const data = await loginRequest({ email, password })
    saveSession(data)
    return data.user
  }

  async function register(formData) {
    const data = await registerRequest(formData)
    saveSession(data)
    return data.user
  }

  // Después de cambiar la contraseña, el onboarding o el perfil
  async function refreshUser() {
    const freshUser = await getMeRequest()
    saveUser(freshUser)
    return freshUser
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = { user, isAuthenticated: Boolean(user), login, register, refreshUser, saveUser, logout }

  return <AuthContext value={value}>{children}</AuthContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
```

A dónde va cada usuario según su estado. Lo usan el login y las rutas protegidas:

Archivo: `src/lib/home-path.js`

```js
export const getHomePath = (user) => {
  if (!user) {
    return '/auth/login'
  }
  if (user.role === 'nutritionist') {
    return '/nutriologo'
  }
  if (user.mustChangePassword) {
    return '/primer-ingreso/contrasena'
  }
  if (!user.onboardingCompleted) {
    return '/primer-ingreso/datos'
  }
  return '/paciente'
}
```

## Paso 1.7 — Rutas protegidas

Es el `ProtectedRoute` de clase: sin sesión, al login; con sesión, muestra la ruta hija con `<Outlet />`. Le agregamos una sola revisión más: **cada usuario solo entra a su área**. Para saber cuál es, usamos `getHomePath(user)` (paso 1.6):

| Usuario | Su área |
|---|---|
| Nutriólogo | `/nutriologo` |
| Paciente que no ha cambiado su contraseña temporal | `/primer-ingreso/contrasena` |
| Paciente que no ha llenado sus datos | `/primer-ingreso/datos` |
| Paciente que ya terminó su primer ingreso | `/paciente` |

Si la ruta que pidió no empieza con su área, lo mandamos a ella. Así un paciente no entra a `/nutriologo`, un nutriólogo no entra a `/paciente` y un paciente nuevo no se salta el primer ingreso.

Archivo: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'

function ProtectedRoute() {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // Sin sesión: lo mandamos al login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  // Cada usuario solo entra a su área: el nutriólogo a /nutriologo, el paciente a /paciente,
  // y el paciente nuevo a /primer-ingreso hasta que cambie su contraseña y llene sus datos
  const home = getHomePath(user)
  if (!location.pathname.startsWith(home)) {
    return <Navigate to={home} replace />
  }

  // Con sesión y en su área: mostramos la ruta hija que se pidió
  return <Outlet />
}

export default ProtectedRoute
```

**Es solo para la experiencia de uso.** La seguridad real está en el back: aunque alguien entre a una ruta que no le toca, la API le responde `403`.

## Paso 1.8 — Rutas en `App.jsx`, como en clase

Igual que en el proyecto de clase, `main.jsx` pone el `BrowserRouter` y los providers, y `App.jsx` declara las rutas con `<Routes>` y `<Route>`. No usamos `createBrowserRouter`, ni `router.jsx`, ni `providers.jsx`.

Archivo: `src/main.jsx`

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster>
          <App />
        </Toaster>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

`Toaster` va aquí una sola vez, para que los toasts se vean en todas las pantallas. Los contextos de datos del nutriólogo (pacientes, citas) **no** van aquí, sino en su layout (paso 1.9).

Archivo: `src/App.jsx`

```jsx
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
import NutricionistaCalendarioPage from '@/pages/nutriologo/NutricionistaCalendarioPage'
import NutricionistaPacienteDetallePage from '@/pages/nutriologo/NutricionistaPacienteDetallePage'
import NutricionistaChatPage from '@/pages/nutriologo/NutricionistaChatPage'
import NutricionistaPerfilPage from '@/pages/nutriologo/NutricionistaPerfilPage'
import PacientePlanAlimenticioPage from '@/pages/paciente/PacientePlanAlimenticioPage'
import PacienteCumplimientoPage from '@/pages/paciente/PacienteCumplimientoPage'
import PacienteCuestionariosPage from '@/pages/paciente/PacienteCuestionariosPage'
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

      {/* Rutas privadas: solo con sesión iniciada */}
      <Route element={<ProtectedRoute />}>
        {/* Primer ingreso del paciente: sin menú lateral */}
        <Route path="/primer-ingreso/contrasena" element={<ChangeTemporaryPasswordPage />} />
        <Route path="/primer-ingreso/datos" element={<OnboardingPage />} />

        {/* Nutriólogo */}
        <Route path="/nutriologo" element={<NutricionistaLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<NutricionistaDashboardPage />} />
          <Route path="calendario" element={<NutricionistaCalendarioPage />} />
          <Route path="pacientes/:id" element={<NutricionistaPacienteDetallePage />} />
          <Route path="chat" element={<NutricionistaChatPage />} />
          <Route path="perfil" element={<NutricionistaPerfilPage />} />
        </Route>

        {/* Paciente */}
        <Route path="/paciente" element={<PacienteLayout />}>
          <Route index element={<Navigate to="plan-alimenticio" replace />} />
          <Route path="plan-alimenticio" element={<PacientePlanAlimenticioPage />} />
          <Route path="cumplimiento" element={<PacienteCumplimientoPage />} />
          <Route path="cuestionarios" element={<PacienteCuestionariosPage />} />
          <Route path="progreso" element={<PacienteProgresoPage />} />
          <Route path="chat" element={<PacienteChatPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
```

Cómo se lee:

- Las rutas públicas van sueltas, como `/login` y `/register` en clase.
- `<Route element={<ProtectedRoute />}>` no tiene `path`: solo envuelve a las rutas privadas, igual que en clase.
- Las rutas del nutriólogo y del paciente van dentro de su layout, que pone el menú lateral y el `<Outlet />` donde se pinta cada página. `index` es lo que se muestra al entrar a `/nutriologo` o `/paciente`.
- Las de primer ingreso no tienen layout con menú: usan `PrimerIngresoLayout` dentro de la propia página.

**Cada quien agrega sus rutas a `App.jsx` cuando crea la página.** Las que faltan:

| Parte | Ruta | Página |
|---|---|---|
| 2 (Leo) | `/nutriologo/pacientes` | Pacientes |
| 2 (Leo) | quitar `/nutriologo/calendario` | El calendario pasa al dashboard |
| 3 (Fer) | `/paciente/cuestionarios` pasa a `/paciente/cuestionario` | Cuestionario diario (paso 3.2) |
| 3 (Fer) | `/paciente/documentos`, `/paciente/perfil` | Documentos y perfil del paciente |
| 4 (Dante) | `/nutriologo/pacientes/:id/plan`, `/nutriologo/recetas`, `/nutriologo/reportes` | Constructor, recetas y reportes |

Al agregar una ruta, agrega también su enlace en el menú lateral (`NutricionistaSidebar` o `PacienteSidebar`). Los dos menús ya muestran el nombre del usuario con sesión y su botón **Cerrar sesión** llama a `logout()` y lleva a `/auth/login`.

Todas las páginas se exportan igual que en clase:

```jsx
function PacientesPage() {
  // ...
}

export default PacientesPage
```

## Paso 1.9 — Datos de la API: contextos y hooks

Usamos las dos formas que vimos en clase, según quién necesita los datos:

| Los datos los usan… | Se cargan con… | Ejemplos |
|---|---|---|
| Varias pantallas | Un **contexto**, como `BooksContext` | La lista de pacientes (página de pacientes, agendar cita, chat) y las citas (dashboard y agendar) |
| Una sola pantalla | Un **hook** con `useEffect` | El expediente de un paciente, su progreso, la conversación abierta, el plan del paciente |

Las páginas no llaman a `apiFetch` directamente: usan un contexto o un hook.

### Contexto: la lista de pacientes

Es el mismo patrón que `BooksContext`. Al cambiar algo, vuelve a pedir la lista, porque el back es quien calcula el semáforo y los demás datos del panel:

Archivo: `src/context/PatientsContext.jsx`

```jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { getPatientsRequest, createPatientRequest, updatePatientRequest } from '@/api/patients'

const PatientsContext = createContext(null)

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Al entrar al área del nutriólogo cargamos sus pacientes
  useEffect(() => {
    async function loadPatients() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPatientsRequest()
        setPatients(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])

  async function addPatient(patientData) {
    const data = await createPatientRequest(patientData) // { patient, clinicalHistory, emailSent }
    setPatients(await getPatientsRequest())
    return data
  }

  async function editPatient(id, patientData) {
    await updatePatientRequest(id, patientData)
    setPatients(await getPatientsRequest())
  }

  const value = { patients, loading, error, addPatient, editPatient }

  return <PatientsContext value={value}>{children}</PatientsContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePatients() {
  return useContext(PatientsContext)
}
```

Los contextos de datos del nutriólogo van en su layout, no en `main.jsx`: así solo se cargan cuando entra un nutriólogo. `NutricionistaLayout` envuelve su contenido con `PatientsProvider` y `AppointmentsProvider`:

```jsx
<PatientsProvider>
  <AppointmentsProvider>
    {/* ...el SidebarProvider y lo demás que ya tiene el layout... */}
  </AppointmentsProvider>
</PatientsProvider>
```

La página que muestra la lista y crea pacientes maneja la carga, los errores y los toasts, igual que `BooksPage` en clase:

```jsx
const { patients, loading, error, addPatient } = usePatients()

async function handleCreate(patientData) {
  try {
    const data = await addPatient(patientData)
    if (data.emailSent) {
      toast.add({ title: 'Paciente creado', description: 'Le enviamos su contraseña temporal por correo', type: 'success' })
    } else {
      toast.add({ title: 'Paciente creado, pero no se envió el correo', description: 'Usa "Reenviar acceso" más tarde', type: 'warning' })
    }
  } catch (err) {
    toast.add({ title: 'No se pudo crear el paciente', description: err.message, type: 'error' })
  }
}
```

La búsqueda se hace en la misma página, filtrando `patients` por nombre o correo. No hace falta volver a pedirlos a la API.

### Hook: datos de una sola pantalla

Para lo que solo usa una pantalla, un hook con el mismo patrón. `reload` vuelve a cargar los datos después de guardar algo:

Archivo: `src/hooks/usePatientDetail.js`

```js
import { useEffect, useState } from 'react'
import { getPatientRequest } from '@/api/patients'

// Expediente de un paciente: { patient, clinicalHistory, adherence }
export function usePatientDetail(id) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Cada vez que cambia, el efecto vuelve a cargar los datos
  const [version, setVersion] = useState(0)

  useEffect(() => {
    async function loadDetail() {
      setLoading(true)
      setError(null)
      try {
        setDetail(await getPatientRequest(id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [id, version])

  const reload = () => setVersion((current) => current + 1)

  return { detail, loading, error, reload }
}
```

En la página:

```jsx
const { id } = useParams()
const { detail, loading, error, reload } = usePatientDetail(id)
```

**Reglas:**

- Toda pantalla muestra tres estados: carga (`Skeleton` o `Spinner`), error y vacío (`Empty`).
- Después de guardar, se vuelve a cargar lo que cambió: con la función del contexto, o con `reload()` del hook.
- Los toasts de éxito y de error van en la página, junto al `try/catch`, como el `alert` de `BooksPage` en clase.

## Paso 1.10 — Formularios con React Hook Form y Zod

Un componente reutilizable, como el `FormInput` de clase, para no repetir la etiqueta y el error:

Archivo: `src/components/FormField.jsx`

```jsx
import { Field, FieldError, FieldLabel } from '@/components/ui/field'

export function FormField({ label, htmlFor, error, children }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      <FieldError errors={error ? [error] : undefined} />
    </Field>
  )
}
```

El esquema de cada formulario vive en `schemas/`, con los mensajes en español:

Archivo: `src/schemas/auth.js`

```js
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Escribe tu correo').email('El correo no es válido'),
  password: z.string().min(1, 'Escribe tu contraseña'),
})

export const passwordSchema = z
  .object({
    newPassword: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
```

El mínimo de 8 caracteres es el mismo que pide el back.

## Paso 1.11 — Login

Se conserva el diseño del login (título, enlace de "¿Olvidaste tu contraseña?" junto a la etiqueta y enlace al registro); lo que cambia es que ahora usa React Hook Form, Zod y el `login()` del contexto.

Archivo: `src/components/auth/LoginForm.jsx`

```jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'
import { loginSchema } from '@/schemas/auth'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit({ email, password }) {
    setApiError(null)
    try {
      const user = await login(email, password)
      // Cada usuario va a su inicio (el paciente nuevo, a su primer ingreso)
      navigate(getHomePath(user), { replace: true })
    } catch (error) {
      setApiError(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Bienvenido de nuevo</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar.</p>
      </div>

      {apiError && <p className="text-center text-sm text-destructive">{apiError}</p>}

      <FieldGroup>
        <FormField label="Correo electrónico" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        {/* Este campo no usa FormField porque lleva el enlace junto a la etiqueta */}
        <Field data-invalid={Boolean(errors.password)}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <Link to="/auth/recovery" className="text-sm font-medium text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to="/auth/signin" className="font-semibold text-primary hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}
```

- El error del login (correo o contraseña incorrectos) se muestra en el formulario, no en un toast, porque es parte de llenarlo.
- Igual que en clase, `error.message` trae el mensaje en español del back.
- `getHomePath` lleva a cada usuario a su lugar, incluido el primer ingreso del paciente.

Si el usuario ya tiene sesión y abre el login o el registro, la página lo manda a su inicio:

Archivo: `src/pages/auth/LoginPage.jsx`

```jsx
import { Navigate } from 'react-router-dom'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { authContent } from '@/data/auth-content'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'

function LoginPage() {
  const { user, isAuthenticated } = useAuth()

  // Si ya inició sesión, no tiene caso mostrarle el formulario
  if (isAuthenticated) {
    return <Navigate to={getHomePath(user)} replace />
  }

  return (
    <AuthLayout {...authContent.login}>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
```

## Paso 1.12 — Registro, recuperación y primer ingreso

| Pantalla | Archivos | API (sección 5.1 del spec) |
|---|---|---|
| Registro (`/auth/signin`) | `SignupForm` pide nombre, apellido paterno, apellido materno (opcional), cédula (opcional), correo y contraseña. Al registrarse queda con sesión iniciada. Solo se registran nutriólogos: a los pacientes los da de alta su nutriólogo | `POST /auth/register` con `register()` del contexto |
| Recuperación (`/auth/recovery`) | `pages/auth/RecoveryPage.jsx` guarda en su estado el paso (`email`, `code`, `password`), el correo y el código, y se los pasa a `RecoveryEmailForm`, `RecoveryOtpForm` y `RecoveryNewPasswordForm`. Ya no hay `RecoveryFlowContext` ni una ruta por paso | `forgot-password`, `verify-otp`, `reset-password` |
| Cambio de contraseña temporal (`/primer-ingreso/contrasena`) | `pages/primer-ingreso/ChangeTemporaryPasswordPage.jsx`. Al guardar, `refreshUser()` y navegar con `getHomePath` | `PUT /auth/change-password` |
| Onboarding (`/primer-ingreso/datos`) | `pages/primer-ingreso/OnboardingPage.jsx`, con `hooks/useOnboarding.js`, `api/onboarding.js` y `schemas/onboarding.js`. Empieza con lo que el nutriólogo ya llenó. Las listas (metas, alergias…) se escriben separadas por comas. Como el back reemplaza cada sección completa, se manda junto con lo que ya tenía. Al guardar, `refreshUser()` | `GET` y `PUT /onboarding` |

Para fechas y opciones se usan los componentes de shadcn, no los nativos del navegador:

- **Fechas:** `components/DatePicker.jsx` (un `Popover` con el `Calendar` de shadcn, en español y con selector de mes y año). Recibe y regresa la fecha como texto `"yyyy-MM-dd"`. Con React Hook Form se conecta con `<Controller>`.
- **Opciones:** el `Select` de shadcn, también con `<Controller>`. En el onboarding está el componente `FormSelect` como ejemplo.

Las dos pantallas de primer ingreso usan `layouts/PrimerIngresoLayout.jsx`: logo, "Paso 1 de 2", título y un botón para cerrar sesión, sin menú lateral.

En `components/auth/AuthLayout.jsx` la imagen aleatoria se elige fuera del componente, porque React no permite `Math.random()` durante el render:

```js
// Fuera del componente: se elige una vez al cargar la página
const randomImage = authImages[Math.floor(Math.random() * authImages.length)]
```

Al terminar la Parte 1: alguien que no ha iniciado sesión no puede entrar a `/nutriologo` ni a `/paciente`, cada rol entra solo a lo suyo, y un paciente nuevo pasa por los dos pasos de primer ingreso.

---

# Parte 2 — Pantallas del nutriólogo (hecha)

Esta parte ya está hecha (rama `feature/nutriologo/dante`). Aquí queda qué hace cada pantalla, qué se decidió y dónde está el código, para poder explicarlo y para que la Parte 3 reutilice lo mismo.

**Decisiones:**

| Tema | Decisión |
|---|---|
| Duración de las citas | Siempre 60 minutos. Los horarios se ofrecen cada 30 minutos |
| Clic en una cita del calendario | Abre un panel con el detalle y tres acciones: Registrar consulta, Reprogramar y Cancelar |
| Registrar consulta | Formulario completo: medidas, IMC automático, calculadora energética, diagnóstico, indicaciones y notas |
| Citas canceladas | No se dibujan en el calendario (no ocupan horario); sí aparecen en las citas de hoy |
| Peso actual | El registro más reciente, sea de una consulta o de una medición del paciente |
| Mensajes | Bandeja de correo: se recargan al abrir, al enviar y con el botón de actualizar |

## Paso 2.1 — Utilidades compartidas

Las usan varias partes. Están en `src/lib/`:

| Archivo | Qué tiene |
|---|---|
| `labels.js` | Textos en español de los valores de la API (`APPOINTMENT_STATUS`, `APPOINTMENT_MODALITY`, `SEX`, `ALCOHOL_CONSUMPTION`, `ADHERENCE_STATUS`, `MEAL_TIME`, `WEEK_DAY`), `fullName()` e `initials()` |
| `dates.js` | `toDateInput`, `formatDateOnly` (fechas sin hora, en UTC), `formatDate`, `formatTime`, `formatLongDate`, `isSameDay` y `getAge` |
| `lists.js` | `toList` y `toText` para las listas que se escriben separadas por comas, `toNumber` y `numberToText` |
| `image-url.js` | `getImageUrl()` para las imágenes del back (fotos de perfil, recetas) |
| `week-grid.js` | La cuadrícula del calendario: horas, posición de cada cita, días de la semana y `getDayRange` |
| `schedule.js` | `getDaySlots()`: los horarios de un día y cuáles están ocupados |
| `energy.js` | Fórmulas de Harris-Benedict y Mifflin-St Jeor, factores de actividad e IMC |
| `weights.js` | `getWeightHistory()`: junta el peso de las consultas y de las mediciones del paciente |

Componentes de formulario que sirven en cualquier parte (en `src/components/`): `FormField`, `DatePicker` (calendario de shadcn, con `fromDate` y `toDate` para limitar los días) y `FormSelect` (el `Select` de shadcn conectado a React Hook Form).

## Paso 2.2 — Dashboard: citas de hoy y semana por horas

`pages/nutriologo/NutricionistaDashboardPage.jsx`. Saluda con el nombre del usuario, y tiene dos secciones:

- **Citas de hoy** (`CitasDelDia`): la hora va en grande, con el paciente, la modalidad, el motivo y el estado.
- **Calendario** (`CalendarioHeader` y `CalendarioSemanal`): lunes a domingo, de 8:00 a 20:00. Cada cita es un bloque del color de su estado, con la altura de su duración. Arriba hay una leyenda de colores. El fondo libre se puede pulsar para agendar a esa hora; lo que ya pasó se ve gris.

Las citas vienen de `context/AppointmentsContext.jsx`, igual que `PatientsContext`: carga la semana visible y las de hoy, y tiene `moveWeek`, `addAppointment`, `editAppointment` y `reloadAppointments`. Va en `NutricionistaLayout`.

Al pulsar una cita se abre `CitaDetalleSheet`. Cancelar usa `ConfirmDialog` y `PUT /appointments/:id` con `{ status: 'cancelled' }`; el back le avisa al paciente por correo.

Se borraron `NutricionistaCalendarioPage`, `CalendarioMensual` y `CalendarioDiaSheet`.

## Paso 2.3 — Agendar y reprogramar

`components/nutriologo/AgendarCitaModal.jsx` sirve para las dos cosas:

1. **Paciente con búsqueda:** el `Combobox` de shadcn con los pacientes activos de `usePatients()`. Al reprogramar no se puede cambiar.
2. **Día:** `DatePicker`, desde hoy.
3. **Horario:** al elegir el día se piden sus citas (`hooks/useDayAppointments.js`) y `getDaySlots` arma los botones. Los ocupados o pasados aparecen deshabilitados. Como las citas duran una hora, si a las 9:00 hay cita, también se bloquean 8:30 y 9:30.
4. **Modalidad:** `ToggleGroup` con Presencial y En línea (`in-person` y `video-call`).

Si se abre desde un hueco del calendario, el día y la hora ya vienen elegidos. Antes de guardar se revisa que ese horario siga libre.

## Paso 2.4 — Página de pacientes

`pages/nutriologo/NutricionistaPacientesPage.jsx`, en `/nutriologo/pacientes`:

- Búsqueda por nombre o correo en la misma página, sin volver a pedir la lista.
- Interruptor "Mostrar inactivos": cambia `includeInactive` del contexto, que vuelve a pedir `GET /patients?includeInactive=true`.
- `PacienteCard` muestra el semáforo, la última consulta, el peso actual y la meta.
- **Nuevo paciente** (`NuevoPacienteModal`): React Hook Form + Zod (`schemas/patients.js`). Si el correo no salió, el toast avisa que use "Reenviar acceso".

## Paso 2.5 — Expediente del paciente

`pages/nutriologo/NutricionistaPacienteDetallePage.jsx`. Carga el expediente (`usePatientDetail`), las consultas (`useConsultations`) y el progreso (`useProgress`), y los reparte:

| Parte | Qué hace | API |
|---|---|---|
| `ExpedienteHeroCard` | Datos, peso actual, meta y apego con su semáforo. Botones: Enviar mensaje, Agendar cita, Editar datos (`EditarPacienteModal`), Reenviar acceso y Desactivar/Reactivar (con `ConfirmDialog`) | `PUT /patients/:id`, `POST /patients/:id/resend-access` |
| Historia clínica | Por secciones. "Editar" abre `EditarHistoriaClinicaModal`; ahí también van el peso y la grasa meta. Las intolerancias van en alergias | `PUT /patients/:id/clinical-history` |
| Consultas | Historial con medidas, cálculo energético e indicaciones. "Registrar consulta" abre `RegistrarConsultaModal` | `/consultations` |
| Progreso | Peso inicial, actual, meta y avance; gráfica del peso contra la meta y gráfica del cumplimiento que el paciente contesta en su cuestionario | `GET /dashboard/progress?patientId=` |
| Documentos | Subir (`SubirDocumentoModal`), descargar con `downloadFile` y borrar los que subió el nutriólogo | `/lab-documents` |
| Plan | Resumen del plan activo y botón al constructor (Parte 4). Si no hay plan, el back responde `404` y se muestra el estado vacío | `GET /meal-plans/active?patientId=` |

`RegistrarConsultaModal` carga solo lo que necesita (sexo, edad y la última estatura), así que funciona igual desde el expediente que desde una cita del dashboard. Si viene de una cita, la cita queda completada. El IMC, el gasto basal (GEB) y el gasto total (GET = GEB × factor) se calculan mientras se escribe; la kcal meta, si se deja vacía, es el GET.

Al desactivar a un paciente ya no puede iniciar sesión y deja de aparecer en la lista y en el chat; su expediente se conserva.

## Paso 2.6 — Chat y perfil

- **Chat** (`NutricionistaChatPage`): la lista sale de `GET /messages/conversations` (`useConversations`) y la conversación de `useMessages`, que la marca como leída al abrirla. Se puede abrir directo con `/nutriologo/chat?paciente=<id>`, como hace el botón "Enviar mensaje" del expediente. El menú lateral muestra los mensajes sin leer (`GET /messages/unread-count`).
- **Perfil** (`NutricionistaPerfilPage`): los datos salen de `useAuth()`. `EditarPerfilModal` usa `PUT /auth/me` y `saveUser()`; la foto sube con `POST /auth/me/avatar`; `CambiarPasswordModal` usa `PUT /auth/change-password`. Se quitaron sexo y fecha de nacimiento, que el back no tiene.

`mocks/nutriologo.js` ya no se usa y se borró.

---

# Parte 3 — Pantallas del paciente (hecha)

Esta parte ya está hecha (rama `feature/paciente/dante`). Con ella se borró `src/mocks/`: ninguna pantalla usa datos de prueba.

**Decisiones:**

| Tema | Decisión |
|---|---|
| Peso | El back junta el peso que registra el paciente y el que se anota en consulta (`weights` de `/dashboard/progress`, cada registro con su origen). La gráfica pinta cada punto del color de su origen y el historial muestra la diferencia contra el registro anterior |
| Citas del paciente | Una tarjeta "Tu próxima cita" arriba del plan. Sin página propia |
| Recordatorio | Si hoy no ha contestado el cuestionario, un aviso arriba del plan con "Contestar ahora" |
| Perfil | Sus datos, su foto, su contraseña y una tarjeta "Mi nutriólogo" (`GET /auth/me/nutritionist`, endpoint nuevo) |
| Cuestionarios del mock | Se quitaron: el back solo tiene la encuesta diaria |

**Componentes compartidos con el nutriólogo:** para no repetir código, el chat (`components/chat/`), el perfil (`components/perfil/`), los documentos (`components/documentos/`) y la gráfica e historial de peso (`components/progreso/`) los usan los dos roles. Cuando hace falta, revisan `user.role`.

## Paso 3.1 — Plan alimenticio como receta y por horas

`pages/paciente/PacientePlanAlimenticioPage.jsx`, con los horarios fijos de `lib/meal-times.js`:

1. Arriba: la próxima cita (`ProximaCitaCard`), el aviso del cuestionario (`AvisoCuestionario`) y las metas del día (`targetKcal`, `waterLiters`).
2. Pestañas de lunes a domingo; empieza en hoy (`getTodayKey`).
3. Una tarjeta por comida (`ComidaCard`) en el orden de `MEAL_TIMES`, con la hora grande a la izquierda. Si ese día no tiene la comida, la tarjeta lo dice.
4. Al cargar baja sola a la comida que toca (`getCurrentMealKey`) y la resalta con un borde y la etiqueta "Ahora". Cada tarjeta tiene `id={mealTime.key}`.
5. Cada comida como receta: foto, ingredientes con su cantidad y pasos numerados (o `preparation` si no tiene receta).
6. "Ver equivalentes" abre `EquivalentesSheet` con los alimentos del mismo grupo (`GET /smae/foods?groupKey=`).
7. Abajo, las recomendaciones (`notes`). Si no hay plan (`404`), un estado vacío.

## Paso 3.2 — Cuestionario diario y cumplimiento

- **Cuestionario** (`/paciente/cuestionario`, `PacienteCuestionarioPage`): ánimo (cinco botones), horas de sueño, vasos de agua, minutos de actividad, cumplimiento del plan (`Slider` de 0 a 100) y un comentario opcional. La fecha se manda con `toDateInput()`. Si ya contestó hoy, muestra sus respuestas; si el back responde `409`, también.
- **Cumplimiento** (`PacienteCumplimientoPage`): solo resultados: racha de días seguidos, promedio de la semana, agua y plan de hoy, los últimos 7 días y una gráfica de los últimos 14 cuestionarios.
- Las ayudas están en `lib/surveys.js` (`MOODS`, `findTodaySurvey`, `getStreak`).

## Paso 3.3 — Progreso y documentos

- **Progreso** (`PacienteProgresoPage`): metas (`goals`), gráfica y historial de peso, y "Mis mediciones" para registrar, editar o borrar (`MedicionModal`). Al editar se manda la medición completa, con la fecha.
- **Documentos** (`/paciente/documentos`): el mismo `DocumentosLaboratorio` del expediente, sin `patientId`. Ve también los que subió su nutriólogo, pero solo puede borrar los suyos.

## Paso 3.4 — Chat y perfil

- **Mensajes** (`PacienteChatPage`): una sola conversación con su nutriólogo, con `ChatVentanaConversacion` (`myRole="patient"`). Se recarga al entrar, al enviar y con el botón de actualizar. El menú muestra los mensajes sin leer.
- **Perfil** (`/paciente/perfil`): los mismos componentes del perfil del nutriólogo; el paciente solo edita su nombre y su teléfono. Abajo, "Mi nutriólogo".

---

# Parte 4 — Recetas, constructor del plan y reportes (hecha)

Esta parte ya está hecha (rama `feature/recetas-plan-reportes/dante`).

**Decisiones:**

| Tema | Decisión |
|---|---|
| Distribución | Tabla completa: los 19 grupos del SMAE (con subgrupos) por las 5 comidas, con kcal por comida y total contra la meta |
| Porciones | Al asignar una receta se copia al plan; cada ingrediente tiene − / + para sus equivalentes (la cantidad se recalcula) y se puede quitar. La receta original no cambia |
| Plantillas | Fuera por ahora; para repetir comidas está "Copiar día" |
| Reportes de peso | "Seguimiento" y "Evolución de peso" toman el peso de mediciones **y** consultas, igual que el resto del sistema (cambio en el back) |

Ayudas en `src/lib/`: `smae.js` (`groupLabel`, `getKcal`, `quantityFor`) y `meal-plan.js` (pasa el plan de la forma de la API a la del constructor y de regreso, copia una receta al plan y cuenta los equivalentes de una comida). El buscador de alimentos del SMAE es `components/nutriologo/BuscadorAlimentos.jsx`.

## Paso 4.1 — Biblioteca de recetas

`/nutriologo/recetas` (`NutricionistaRecetasPage`):

- Tarjetas con foto, nombre, comidas, kcal y minutos. Las kcal se calculan con los equivalentes y `/smae/groups`.
- Búsqueda por nombre y filtro por comida, en la misma página.
- Al tocar una receta se abre su detalle. Las propias tienen Editar y Eliminar; las compartidas (`nutritionist: null`) solo se ven.
- `RecetaFormModal` (crear y editar): nombre, minutos, comidas, ingredientes buscados en el SMAE con sus equivalentes, pasos y foto. La foto se sube después de guardar la receta (`POST /recipes/:id/image`).

## Paso 4.2 — Constructor del plan

`/nutriologo/pacientes/:id/plan` (`NutricionistaPlanBuilderPage`), con sus componentes en `components/nutriologo/plan/`:

1. **Datos:** nombre, kcal (si hay, de la última consulta con cálculo energético), agua y recomendaciones.
2. **Distribución** (`PlanDistribucionTabla`).
3. **Menú:** pestañas por día. Cada comida (`PlanComidaEditor`) puede ser una receta (`RecetaPickerDialog`, filtrado por esa comida) o alimentos sueltos con su preparación. El contador compara con la distribución ("Cereales 1.5 de 2"): verde si coincide, ámbar si falta, rojo si sobra. **Avisa, pero no bloquea.**
4. **Copiar día** (`CopiarDiaDialog`): reemplaza las comidas de los días elegidos.
5. **Guardar:** `POST /meal-plans` la primera vez; después `PUT /meal-plans/:id` con el motivo (`MotivoCambioDialog`). Pide nombre y al menos una comida.
6. **Historial** (`PlanHistorialSheet`): las versiones con su fecha, quién y por qué; al elegir una se compara lado a lado con la actual, resaltando lo que cambió.

## Paso 4.3 — Reportes

`/nutriologo/reportes` (`NutricionistaReportesPage`), en pestañas:

| Reporte | Cómo se muestra |
|---|---|
| Seguimiento | Tabla; primero los que no tienen cita próxima. Etiqueta "Agendar cita" o "Con cita" |
| Evolución de peso | Barras con el cambio de cada paciente (verde si bajó) y tabla. Periodo de 30, 90 o 180 días |
| Bienestar | Barras del cumplimiento del plan por padecimiento y tabla con los promedios. Periodo seleccionable |
| Alimentos | Los 10 más usados en los planes activos, con su grupo |

---

# Parte 5 — Todos: limpieza y prueba final

## Paso 5.1 — Limpieza

- [x] Borrar la carpeta `src/mocks/`, y que ningún import la use (se hizo en la Parte 3).
- [ ] Buscar que no quede ningún aviso del navegador: `grep -rnE "alert\(|confirm\(|prompt\(" src --exclude-dir=ui` no debe encontrar nada.
- [ ] Actualizar `docs/frontend/README.md` con la estructura nueva, y revisar que `AGENTS.md` y `docs/backend/README.md` sigan siendo ciertos.
- [ ] `pnpm lint` y `pnpm build` sin errores.

## Paso 5.2 — Prueba completa

Con el back levantado y el catálogo cargado, recorran este flujo en el navegador:

1. Registrar un nutriólogo e iniciar sesión.
2. Crear un paciente. Si el correo no llega, la contraseña temporal aparece en la terminal del back.
3. Iniciar sesión como paciente: cambiar la contraseña y completar el onboarding.
4. Como nutriólogo: agendar una cita (con los horarios disponibles), registrar una consulta y armar un plan con recetas.
5. Como paciente: ver el plan del día, contestar el cuestionario, registrar una medición, subir un documento y mandar un mensaje.
6. Como nutriólogo: ver el semáforo, el mensaje, los reportes y el calendario de la semana.
7. Con un segundo nutriólogo, comprobar que no ve a los pacientes del primero.

En ningún momento debe aparecer un aviso del navegador ni un error sin mensaje.
