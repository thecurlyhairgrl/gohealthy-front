# GoHealthy Front · Guía para terminar el front

Esta guía reorganiza el front y lo conecta con la API. Está repartida por persona, igual que la guía de clase. Al terminar habremos entregado:

- [ ] El proyecto limpio: sin Podman y con una estructura de carpetas como la de clase
- [ ] La sesión real: login, registro, recuperación de contraseña y primer ingreso del paciente
- [ ] Las pantallas del nutriólogo conectadas a la API, con las correcciones del profesor
- [ ] Las pantallas del paciente conectadas a la API, con el plan alimenticio como receta
- [ ] La biblioteca de recetas, el constructor del plan y los reportes
- [ ] Ningún `alert()` ni `confirm()` del navegador: todo con toasts y diálogos de shadcn
- [ ] Ningún archivo `mock-data.js`

**El back manda.** Cuando una pantalla no coincida con lo que responde la API, se cambia la pantalla. El contrato de cada endpoint está en `docs/frontend/specs/conexion-api-back.spec.md`; en esta guía se cita como "el spec".

---

## 0. Antes de empezar

### 0.1 Decisiones que ya tomamos

| Tema | Decisión |
|---|---|
| Estructura | Como la del proyecto de clase: `api/`, `context/`, `components/`, `hooks/`, `layouts/`, `pages/` y `schemas/` |
| Sesión | Un `AuthContext` sencillo, como en clase. Se quita Zustand |
| Datos de la API | TanStack Query, que ya está instalado |
| Formularios | React Hook Form + Zod |
| Rutas | React Router (`react-router-dom`), con rutas protegidas por rol |
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
| 2 | Leo | Pantallas del nutriólogo | Parte 1 |
| 3 | Fer | Pantallas del paciente | Parte 1 |
| 4 | Dante | Recetas, constructor del plan y reportes | Parte 1 |
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
pnpm remove zustand
```

- **`@hookform/resolvers`** conecta React Hook Form con Zod. Ya tenemos las dos librerías, pero falta esta.
- **Zustand** se quita porque la sesión vive en un contexto, como en clase.

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
│   ├── client.js        axios con el token y el manejo del 401
│   ├── auth.js
│   ├── patients.js
│   └── ...
├── components/
│   ├── ui/              shadcn (no editar)
│   ├── FormField.jsx    Campo de formulario reutilizable
│   ├── ProtectedRoute.jsx
│   ├── ConfirmDialog.jsx
│   ├── landing/         Componentes de la página de inicio
│   ├── auth/            Componentes de login y recuperación
│   ├── nutriologo/      Componentes del nutriólogo
│   └── paciente/        Componentes del paciente
├── context/
│   └── AuthContext.jsx  Sesión: usuario, login y logout
├── hooks/               Un archivo por recurso con sus consultas de TanStack Query
├── layouts/             AuthLayout, NutritionistLayout, PatientLayout
├── lib/                 Utilidades: query-client, notify, fechas, textos, imágenes
├── pages/
│   ├── landing/
│   ├── auth/
│   ├── primer-ingreso/
│   ├── nutriologo/
│   ├── paciente/
│   └── NotFoundPage.jsx
├── schemas/             Esquemas de Zod de los formularios
├── data/                Textos fijos de la landing y de auth
├── router.jsx
├── providers.jsx
├── main.jsx
└── index.css
```

De dónde sale cada cosa:

| Hoy | Pasa a |
|---|---|
| `app/router.jsx`, `app/providers.jsx` | `router.jsx`, `providers.jsx` |
| `app/layouts/*` | `layouts/` |
| `features/auth/components/*` | `components/auth/` |
| `features/auth/data/*`, `features/landing/data/*` | `data/` |
| `features/landing/components/*` | `components/landing/` |
| `features/nutricionista/components/*` | `components/nutriologo/` |
| `features/paciente/components/*` | `components/paciente/` |
| `pages/nutricionista/*` | `pages/nutriologo/` |
| `lib/api-client.js` | `api/client.js` |
| `features/*/data/mock-data.js` | Se borran al final (Parte 5) |
| `pages/HomePage.jsx`, `pages/HomePage.css`, `pages/paciente/PacientePlaceholderPage.jsx` | Se borran: no se usan |

Muévelos con `git mv` para conservar su historial, y corrige los `import` con el alias `@/`. Al terminar, `pnpm build` debe pasar. **Este paso no cambia nada visual: es solo mover archivos.** Conviene hacerlo en un commit aparte.

## Paso 1.4 — Avisos con toasts

`components/ui/toast.jsx` ya trae un administrador global de toasts. Estas dos funciones son lo único que usaremos en toda la app:

Archivo: `src/lib/notify.js`

```js
import { toast } from '@/components/ui/toast'

export const notifySuccess = (title, description) => {
  toast.add({ title, description, type: 'success' })
}

export const notifyError = (title, description) => {
  toast.add({ title, description, type: 'error' })
}
```

Se pueden llamar desde cualquier lugar, incluso fuera de un componente:

```js
notifySuccess('Cita agendada')
notifyError('No se pudo guardar', 'Revisa tu conexión')
```

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

// Reemplaza a confirm(): <ConfirmDialog open={open} onOpenChange={setOpen} title="..." onConfirm={borrar} />
export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Confirmar', onConfirm }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Paso 1.5 — Cliente de la API

El cliente agrega el token a cada petición y, si la sesión venció, lleva al login. Es lo mismo que `apiFetch` en clase, pero con axios.

Archivo: `src/api/client.js`

```js
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Un login con contraseña incorrecta también responde 401: ese error lo muestra el formulario
    const isLogin = error.config?.url === '/auth/login'

    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.assign('/auth/login')
    }

    return Promise.reject(error)
  }
)

// El back siempre manda { message } en español
export const getErrorMessage = (error) => {
  return error.response?.data?.message ?? 'No se pudo conectar con el servidor'
}
```

Cada recurso tiene su archivo con una función por endpoint. Todas regresan directamente `data`:

Archivo: `src/api/auth.js`

```js
import { apiClient } from './client'

export const loginRequest = (credentials) => apiClient.post('/auth/login', credentials).then((response) => response.data)

export const registerRequest = (data) => apiClient.post('/auth/register', data).then((response) => response.data)

export const getMeRequest = () => apiClient.get('/auth/me').then((response) => response.data)

export const updateMeRequest = (data) => apiClient.put('/auth/me', data).then((response) => response.data)

export const changePasswordRequest = (data) => apiClient.put('/auth/change-password', data).then((response) => response.data)

export const forgotPasswordRequest = (email) => apiClient.post('/auth/forgot-password', { email }).then((response) => response.data)

export const verifyOtpRequest = (data) => apiClient.post('/auth/verify-otp', data).then((response) => response.data)

export const resetPasswordRequest = (data) => apiClient.post('/auth/reset-password', data).then((response) => response.data)
```

Los demás archivos de `api/` siguen el mismo formato, con las rutas de la sección 5 del spec. Por ejemplo:

Archivo: `src/api/patients.js`

```js
import { apiClient } from './client'

export const getPatientsRequest = (search) => apiClient.get('/patients', { params: { search } }).then((response) => response.data)

export const getPatientRequest = (id) => apiClient.get(`/patients/${id}`).then((response) => response.data)

export const createPatientRequest = (data) => apiClient.post('/patients', data).then((response) => response.data)

export const updatePatientRequest = (id, data) => apiClient.put(`/patients/${id}`, data).then((response) => response.data)
```

## Paso 1.6 — Sesión con `AuthContext`

Igual que en clase: el contexto guarda al usuario y lo copia en `localStorage` para que sobreviva a un refresh. El token lo lee directo el cliente de la API.

Archivo: `src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState } from 'react'
import { loginRequest, registerRequest, getMeRequest } from '@/api/auth'
import { queryClient } from '@/lib/query-client'

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
    queryClient.clear()
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

`queryClient.clear()` borra los datos guardados en caché, para que al cambiar de usuario no se vean los del anterior.

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

Igual que el `ProtectedRoute` de clase, pero revisa también el rol. Un paciente que aún no termina su primer ingreso solo puede entrar a esas pantallas.

Archivo: `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getHomePath } from '@/lib/home-path'

export function ProtectedRoute({ role, firstAccess = false }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={getHomePath(user)} replace />
  }

  // El paciente pasa primero por el cambio de contraseña y el onboarding
  const home = getHomePath(user)
  const isFirstAccessPending = home.startsWith('/primer-ingreso')
  if (role === 'patient' && isFirstAccessPending !== firstAccess) {
    return <Navigate to={home} replace />
  }

  return <Outlet />
}
```

**Es solo para la experiencia de uso.** La seguridad real está en el back: aunque alguien entre a una ruta que no le toca, la API le responde `403`.

## Paso 1.8 — Providers y router

Archivo: `src/providers.jsx`

```jsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toast'

function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster>{children}</Toaster>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Providers
```

En `main.jsx` solo cambian los imports: `Providers` desde `@/providers` y `router` desde `@/router`.

El router declara todas las pantallas. Las que todavía no existen se crean en las Partes 1 a 4; mientras tanto, puede apuntar a una página vacía.

Archivo: `src/router.jsx`

```jsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import NutritionistLayout from '@/layouts/NutritionistLayout'
import PatientLayout from '@/layouts/PatientLayout'
import LandingPage from '@/pages/landing/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import RecoveryPage from '@/pages/auth/RecoveryPage'
import ChangeTemporaryPasswordPage from '@/pages/primer-ingreso/ChangeTemporaryPasswordPage'
import OnboardingPage from '@/pages/primer-ingreso/OnboardingPage'
import NutritionistDashboardPage from '@/pages/nutriologo/DashboardPage'
import PatientsPage from '@/pages/nutriologo/PatientsPage'
import PatientDetailPage from '@/pages/nutriologo/PatientDetailPage'
import MealPlanBuilderPage from '@/pages/nutriologo/MealPlanBuilderPage'
import RecipesPage from '@/pages/nutriologo/RecipesPage'
import ReportsPage from '@/pages/nutriologo/ReportsPage'
import NutritionistChatPage from '@/pages/nutriologo/ChatPage'
import NutritionistProfilePage from '@/pages/nutriologo/ProfilePage'
import MealPlanPage from '@/pages/paciente/MealPlanPage'
import CompliancePage from '@/pages/paciente/CompliancePage'
import DailySurveyPage from '@/pages/paciente/DailySurveyPage'
import ProgressPage from '@/pages/paciente/ProgressPage'
import DocumentsPage from '@/pages/paciente/DocumentsPage'
import PatientChatPage from '@/pages/paciente/ChatPage'
import PatientProfilePage from '@/pages/paciente/ProfilePage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth/login', element: <LoginPage /> },
  { path: '/auth/signin', element: <SignupPage /> },
  { path: '/auth/recovery', element: <RecoveryPage /> },
  {
    path: '/primer-ingreso',
    element: <ProtectedRoute role="patient" firstAccess />,
    children: [
      { path: 'contrasena', element: <ChangeTemporaryPasswordPage /> },
      { path: 'datos', element: <OnboardingPage /> },
    ],
  },
  {
    path: '/nutriologo',
    element: <ProtectedRoute role="nutritionist" />,
    children: [
      {
        element: <NutritionistLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <NutritionistDashboardPage /> },
          { path: 'pacientes', element: <PatientsPage /> },
          { path: 'pacientes/:id', element: <PatientDetailPage /> },
          { path: 'pacientes/:id/plan', element: <MealPlanBuilderPage /> },
          { path: 'recetas', element: <RecipesPage /> },
          { path: 'reportes', element: <ReportsPage /> },
          { path: 'chat', element: <NutritionistChatPage /> },
          { path: 'perfil', element: <NutritionistProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '/paciente',
    element: <ProtectedRoute role="patient" />,
    children: [
      {
        element: <PatientLayout />,
        children: [
          { index: true, element: <Navigate to="plan-alimenticio" replace /> },
          { path: 'plan-alimenticio', element: <MealPlanPage /> },
          { path: 'cumplimiento', element: <CompliancePage /> },
          { path: 'cuestionario', element: <DailySurveyPage /> },
          { path: 'progreso', element: <ProgressPage /> },
          { path: 'documentos', element: <DocumentsPage /> },
          { path: 'chat', element: <PatientChatPage /> },
          { path: 'perfil', element: <PatientProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
```

**Cambios respecto a hoy:**

- Se quita `/nutriologo/calendario`, porque el calendario pasa al dashboard.
- Se agregan Pacientes, Recetas, Reportes, Documentos del paciente y los dos perfiles.
- `/paciente/cuestionarios` pasa a `/paciente/cuestionario` (ver el paso 3.2).

Actualiza los menús laterales (`NutricionistaSidebar` y `PacienteSidebar`) con estas rutas, y agrega un botón de **Cerrar sesión** que llame a `logout()` y lleve a `/auth/login`.

## Paso 1.9 — Consultas con TanStack Query

Cada recurso tiene un archivo en `hooks/` con sus consultas y sus cambios. Las pantallas solo usan estos hooks: no llaman a axios directamente.

Archivo: `src/hooks/usePatients.js`

```js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPatientsRequest, getPatientRequest, createPatientRequest } from '@/api/patients'
import { getErrorMessage } from '@/api/client'
import { notifySuccess, notifyError } from '@/lib/notify'

export const usePatients = (search) => {
  return useQuery({
    queryKey: ['patients', search],
    queryFn: () => getPatientsRequest(search),
  })
}

export const usePatient = (id) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => getPatientRequest(id),
  })
}

export const useCreatePatient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatientRequest,
    onSuccess: (data) => {
      // Recarga la lista para que aparezca el paciente nuevo
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      if (data.emailSent) {
        notifySuccess('Paciente creado', 'Le enviamos su contraseña temporal por correo')
      } else {
        notifyError('Paciente creado, pero no se envió el correo', 'Usa "Reenviar acceso" más tarde')
      }
    },
    onError: (error) => notifyError('No se pudo crear el paciente', getErrorMessage(error)),
  })
}
```

En una pantalla:

```jsx
const { data: patients = [], isLoading, isError } = usePatients(search)
const createPatient = useCreatePatient()

createPatient.mutate(formData) // y createPatient.isPending para deshabilitar el botón
```

**Reglas:**

- Toda pantalla muestra tres estados: carga (`Skeleton` o `Spinner`), error y vacío (`Empty`).
- Después de guardar, se invalida la consulta afectada para que se recargue sola. Así no hace falta copiar datos a un estado local.
- Los toasts de éxito y de error van en los hooks, no en las pantallas.

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

El diseño del login se conserva; las correcciones que pidió el profesor se aplican aquí cuando las revisemos. La lógica queda así:

Archivo: `src/components/auth/LoginForm.jsx`

```jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/FormField'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/api/client'
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
      navigate(getHomePath(user), { replace: true })
    } catch (error) {
      setApiError(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FormField label="Correo" htmlFor="email" error={errors.email}>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
      </FormField>

      <FormField label="Contraseña" htmlFor="password" error={errors.password}>
        <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>

      <p className="text-center text-sm">
        <Link to="/auth/recovery">¿Olvidaste tu contraseña?</Link>
      </p>
    </form>
  )
}
```

- El error del login (correo o contraseña incorrectos) se muestra en el formulario, no en un toast, porque es parte de llenarlo.
- `getHomePath` lleva a cada usuario a su lugar, incluido el primer ingreso del paciente.
- Si el usuario ya tiene sesión y abre `/auth/login`, redirígelo con `getHomePath(user)`.

## Paso 1.12 — Registro, recuperación y primer ingreso

| Pantalla | Qué cambia | API (sección 5.1 del spec) |
|---|---|---|
| Registro (`/auth/signin`) | Pedir nombre, apellido paterno, apellido materno (opcional) y cédula, en lugar de un solo `fullName`. Al registrarse queda con sesión iniciada | `POST /auth/register` con `register()` del contexto |
| Recuperación (`/auth/recovery`) | Un solo `RecoveryPage` con los tres pasos: correo, código y contraseña nueva. Guarda el correo y el código en el estado de la página y borra `RecoveryFlowContext` | `forgot-password`, `verify-otp`, `reset-password` |
| Cambio de contraseña temporal (`/primer-ingreso/contrasena`) | Pantalla nueva, sin menú lateral. Al guardar, `refreshUser()` y navegar con `getHomePath` | `PUT /auth/change-password` |
| Onboarding (`/primer-ingreso/datos`) | Pantalla nueva. Cargar con `GET /onboarding` y mandar `identification` completo. Al guardar, `refreshUser()` | `GET` y `PUT /onboarding` |

**Error de lint pendiente:** `components/auth/AuthLayout.jsx` elige la imagen con `Math.random()` dentro de `useMemo`, y React no lo permite durante el render. Elige la imagen una sola vez fuera del componente:

```js
// Fuera del componente: se elige una vez al cargar la página
const randomImage = authImages[Math.floor(Math.random() * authImages.length)]
```

Al terminar la Parte 1: alguien que no ha iniciado sesión no puede entrar a `/nutriologo` ni a `/paciente`, cada rol entra solo a lo suyo, y un paciente nuevo pasa por los dos pasos de primer ingreso.

---

# Parte 2 — Leo: pantallas del nutriólogo

Los componentes que ya existen se reutilizan; lo que cambia es de dónde vienen los datos y lo que pidió el profesor.

## Paso 2.1 — Utilidades compartidas

Estas utilidades las usan varias partes. Créalas al empezar (o Dante, si va primero).

Archivo: `src/lib/labels.js`

```js
// La API usa valores en inglés; esto es lo que se muestra
export const APPOINTMENT_STATUS = {
  scheduled: { label: 'Programada', className: 'bg-sky-100 text-sky-800 border-sky-300' },
  rescheduled: { label: 'Reprogramada', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  completed: { label: 'Completada', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  cancelled: { label: 'Cancelada', className: 'bg-muted text-muted-foreground border-border line-through' },
}

export const APPOINTMENT_MODALITY = {
  'in-person': 'Presencial',
  'video-call': 'En línea',
}

export const SEX = {
  female: 'Femenino',
  male: 'Masculino',
}

export const ADHERENCE_STATUS = {
  green: { label: 'Buen apego', className: 'bg-emerald-500' },
  yellow: { label: 'Apego regular', className: 'bg-amber-400' },
  red: { label: 'Bajo apego', className: 'bg-red-500' },
  'no-data': { label: 'Sin datos', className: 'bg-muted-foreground/40' },
}

export const fullName = (person) => {
  return [person.firstName, person.paternalLastName, person.maternalLastName].filter(Boolean).join(' ')
}
```

Archivo: `src/lib/dates.js`

```js
const pad = (value) => String(value).padStart(2, '0')

// Fecha local en AAAA-MM-DD (para encuestas y mediciones). Nunca uses toISOString() para esto
export const toDateInput = (date = new Date()) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Fechas sin hora que guarda el back (encuestas, mediciones): se muestran en UTC para no perder un día
export const formatDateOnly = (value) => {
  return new Date(value).toLocaleDateString('es-MX', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' })
}

// Fechas con hora (citas, mensajes): se muestran en la hora local
export const formatTime = (value) => {
  return new Date(value).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}
```

Archivo: `src/lib/image-url.js`

```js
// Las imágenes no están bajo /api: la API regresa rutas como /images/recipes/tacos.webp
const API_ORIGIN = new URL(import.meta.env.VITE_API_URL).origin

export const getImageUrl = (path) => (path ? `${API_ORIGIN}${path}` : null)
```

## Paso 2.2 — Dashboard: citas del día y semana por horas

El dashboard queda con dos cosas: las **citas de hoy** y el **calendario de la semana**. La lista de pacientes se va a su propia página (paso 2.4).

**Citas de hoy** (`CitasDelDia`): la hora es lo primero que se ve, en grande (`text-2xl font-semibold`), con el nombre del paciente, la modalidad y el estado debajo.

**Calendario semanal** (reutiliza `CalendarioSemanal`):

- Columnas de lunes a domingo y filas por hora, de 8:00 a 20:00.
- Cada cita es un bloque en su día, desde su hora de inicio, con la altura de su duración (`durationMin`).
- **Paleta:** el fondo de la cuadrícula es el espacio libre, y cada cita usa el color de su estado (`APPOINTMENT_STATUS`). Agrega una leyenda con los colores arriba del calendario.
- Botones de semana anterior, siguiente y "Hoy".
- Al hacer clic en un espacio libre, abre "Agendar cita" con ese día y esa hora.
- Pide solo la semana visible: `GET /appointments?from=<lunes>&to=<domingo>`.

Para ubicar cada bloque en la cuadrícula:

Archivo: `src/lib/week-grid.js`

```js
export const GRID_START_HOUR = 8
export const GRID_END_HOUR = 20
export const HOUR_HEIGHT = 64 // píxeles por hora

// Posición y altura de una cita dentro de su columna del día
export const getAppointmentBox = (appointment) => {
  const start = new Date(appointment.dateTime)
  const minutesFromTop = (start.getHours() - GRID_START_HOUR) * 60 + start.getMinutes()
  return {
    top: (minutesFromTop / 60) * HOUR_HEIGHT,
    height: (appointment.durationMin / 60) * HOUR_HEIGHT,
  }
}

// Lunes a domingo de la semana de una fecha
export const getWeekDays = (date) => {
  const monday = new Date(date)
  const day = monday.getDay()
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day))
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(monday)
    next.setDate(monday.getDate() + index)
    return next
  })
}
```

Al terminar, borra `NutricionistaCalendarioPage`, `CalendarioMensual` y la opción de vista mensual de `CalendarioHeader`. `CalendarioDiaSheet` se puede quitar o reutilizar para ver el detalle de una cita.

## Paso 2.3 — Agendar cita

Reutiliza `AgendarCitaModal` con tres cambios:

1. **Paciente con búsqueda:** cambia el `<select>` por el `Combobox` de shadcn (`components/ui/combobox.jsx`), con los pacientes de `usePatients()`.
2. **Horarios disponibles:** quita el `<input type="time">`. Al elegir el día, muestra botones con los horarios cada 30 minutos; los que se cruzan con otra cita aparecen deshabilitados.
3. **Modalidad:** `Presencial` y `Online` se mandan como `modality: 'in-person'` y `'video-call'`.

Archivo: `src/lib/schedule.js`

```js
export const WORK_START_HOUR = 8
export const WORK_END_HOUR = 20
export const SLOT_MINUTES = 30

// Horarios de un día; un horario está ocupado si se cruza con una cita que no está cancelada
export const getDaySlots = (day, appointments, durationMin = 60) => {
  const slots = []
  const now = new Date()

  for (let minutes = WORK_START_HOUR * 60; minutes + durationMin <= WORK_END_HOUR * 60; minutes += SLOT_MINUTES) {
    const start = new Date(day)
    start.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0)
    const end = new Date(start.getTime() + durationMin * 60000)

    const isTaken = appointments.some((appointment) => {
      if (appointment.status === 'cancelled') {
        return false
      }
      const otherStart = new Date(appointment.dateTime)
      const otherEnd = new Date(otherStart.getTime() + appointment.durationMin * 60000)
      return start < otherEnd && otherStart < end
    })

    slots.push({
      label: start.toTimeString().slice(0, 5),
      dateTime: start.toISOString(),
      available: !isTaken && start > now,
    })
  }

  return slots
}
```

Para saber qué está ocupado, pide las citas de ese día (`GET /appointments?from=&to=`). El `dateTime` del horario elegido es lo que se manda en `POST /appointments`.

## Paso 2.4 — Página de pacientes

Página nueva `/nutriologo/pacientes`, con lo que hoy está en el dashboard:

- `BuscadorPacientes` y `PacienteCard`, con `usePatients(search)`.
- La tarjeta muestra el semáforo (`adherence.status`), la última consulta, el peso actual y la meta. Todo viene en `GET /patients` (sección 5.2 del spec).
- El botón **Nuevo paciente** abre un diálogo con su formulario (React Hook Form + Zod) y usa `useCreatePatient()`. Esto reemplaza el único `alert()` que tiene hoy el proyecto.
- Un interruptor para ver también a los inactivos (`includeInactive=true`).

## Paso 2.5 — Expediente del paciente

`/nutriologo/pacientes/:id` reutiliza los componentes del expediente:

| Pestaña | Qué hace | API |
|---|---|---|
| `ExpedienteHeroCard` | Datos y semáforo, con botones Editar, Desactivar (con `ConfirmDialog`) y Reenviar acceso | `GET /patients/:id`, `PUT /patients/:id`, `POST /patients/:id/resend-access` |
| `ExpedienteClinicoTab` | Historia clínica. Las intolerancias van dentro de `allergies` (por ejemplo "Intolerancia a la lactosa"). Agrega peso meta y grasa meta | `GET` y `PUT /patients/:id/clinical-history` |
| `ExpedienteProgresoTab` | Gráficas, metas y mediciones | `GET /dashboard/progress?patientId=` |
| Consultas (pestaña nueva) | Historial de consultas. `RegistrarSesionModal` crea una consulta, con su calculadora energética | `/consultations` |
| `ExpedienteDocumentosTab` | Lista, descarga y subida de documentos | `/lab-documents` |
| `ExpedientePlanTab` | Resumen del plan activo, con un botón que lleva al constructor (Parte 4) | `GET /meal-plans/active?patientId=` |

**La descarga de documentos se hace con `fetch` o axios, no con un enlace.** Un `<a href>` no manda el token:

```js
const { data } = await apiClient.get(`/lab-documents/${document._id}/file`, { responseType: 'blob' })
const url = URL.createObjectURL(data)
const link = window.document.createElement('a')
link.href = url
link.download = document.originalName
link.click()
URL.revokeObjectURL(url)
```

## Paso 2.6 — Chat y perfil

- **Chat:** `ChatListaConversaciones` usa `GET /messages/conversations`, que ya trae el último mensaje y los no leídos. Funciona como bandeja de correo: los mensajes se recargan al abrir la conversación y después de enviar. Al abrir una conversación, `PUT /messages/read?patientId=`. Quita el indicador "en línea".
- **Perfil:** `EditarPerfilModal` usa `PUT /auth/me` y luego `saveUser()` del contexto, con `specialty`, `university`, `officeAddress` y `bio`. La foto sube con `POST /auth/me/avatar`. Quita sexo y fecha de nacimiento, que el back no tiene. `CambiarPasswordModal` usa `PUT /auth/change-password`.

---

# Parte 3 — Fer: pantallas del paciente

## Paso 3.1 — Plan alimenticio como receta y por horas

Lo que pidió el profesor: **las comidas del día ordenadas por hora**, que la página **se ubique sola en la comida que toca según la hora**, y que cada comida **se vea como receta**.

Los horarios son fijos para todos los pacientes:

Archivo: `src/lib/meal-times.js`

```js
export const MEAL_TIMES = [
  { key: 'breakfast', label: 'Desayuno', start: '07:30', end: '08:30' },
  { key: 'morning-snack', label: 'Colación matutina', start: '11:00', end: '11:30' },
  { key: 'lunch', label: 'Comida', start: '14:00', end: '15:00' },
  { key: 'afternoon-snack', label: 'Colación vespertina', start: '17:30', end: '18:00' },
  { key: 'dinner', label: 'Cena', start: '20:30', end: '21:30' },
]

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// La comida que toca: la última que ya empezó o que empieza en menos de una hora
export const getCurrentMealKey = (now = new Date()) => {
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  let current = MEAL_TIMES[0].key

  for (const meal of MEAL_TIMES) {
    if (minutesNow >= toMinutes(meal.start) - 60) {
      current = meal.key
    }
  }

  return current
}

// El día de hoy como lo guarda el plan: 'monday' ... 'sunday'
export const getTodayKey = (now = new Date()) => {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
}
```

La pantalla:

1. **Datos:** `GET /meal-plans/active`. Si responde `404`, muestra un estado vacío ("Tu nutriólogo aún no te asigna un plan"), no un error.
2. **Pestañas por día**, de lunes a domingo, con el día de hoy (`getTodayKey`) seleccionado. Los días sin comidas muestran un estado vacío.
3. **Línea de tiempo del día:** una tarjeta por comida, en el orden de `MEAL_TIMES`, con la **hora grande a la izquierda** (`07:30 – 08:30`) y la comida a la derecha.
4. **Ubicarse en la comida actual:** al cargar, haz scroll a la tarjeta de `getCurrentMealKey()` y resáltala con un borde. Cada tarjeta lleva `id={meal.mealTime}`:

   ```js
   useEffect(() => {
     document.getElementById(getCurrentMealKey())?.scrollIntoView({ behavior: 'smooth', block: 'center' })
   }, [plan])
   ```

5. **Cada comida como receta:**
   - Foto (`getImageUrl(meal.imageUrl)`; si no hay, un ícono) y título (`meal.title`).
   - **Ingredientes** con su cantidad: `2 pieza · Tortilla de maíz`.
   - **Pasos numerados** (`meal.steps`). Si la comida no tiene receta, muestra `meal.preparation`.
   - Un botón **Ver equivalentes** en cada ingrediente, que abre un `Sheet` con los alimentos del mismo grupo: `GET /smae/foods?groupKey=`.
6. **Arriba:** las metas del día (`targetKcal` y `waterLiters`); **abajo:** las recomendaciones (`notes`).

`ExpedientePlanTab` del nutriólogo puede reutilizar el mismo componente de comida para el resumen.

## Paso 3.2 — Cuestionario diario y cumplimiento

El back guarda **una sola encuesta por día** con cinco respuestas (sección 5.5 del spec). Por eso:

| Pantalla | Qué hace |
|---|---|
| **Cuestionario** (`/paciente/cuestionario`) | El formulario del día: ánimo (1 a 5), horas de sueño, vasos de agua, minutos de actividad y cuánto cumplió el plan (0 a 100%). Se manda una vez al día con `POST /wellness-surveys`. Si ya contestó hoy, se muestra como contestado (`409` si lo intenta otra vez) |
| **Cumplimiento** (`/paciente/cumplimiento`) | Solo muestra resultados: el cumplimiento del plan por día, la racha de días seguidos con encuesta y el agua de hoy. Datos de `GET /wellness-surveys` |

- La fecha se manda con `toDateInput()`, la fecha **local** del paciente.
- Los cuestionarios psicológico y alimenticio que hoy están en el mock se quitan: el back no los tiene.
- La lista de comidas con casillas de `PacienteCumplimiento` se quita o se cambia por la pregunta de cumplimiento del plan.

## Paso 3.3 — Progreso y documentos

- **Progreso:** `GET /dashboard/progress` trae las gráficas y las metas (`goals`): peso inicial, actual y meta, y el porcentaje de avance. El paciente registra sus mediciones con `POST /measurements`. Al editar, `PUT /measurements/:id` necesita **todos** los campos, incluida la fecha.
- **Documentos** (página nueva): lista, subida con `FormData` (campo `file`), descarga como en el paso 2.5, y borrar los que subió el paciente, con `ConfirmDialog`. También ve, sin poder borrarlos, los que subió el nutriólogo.

## Paso 3.4 — Chat y perfil

- **Chat:** `GET /messages` (sin parámetros), `POST /messages` solo con `body` y `subject`, y `PUT /messages/read` al abrir. Se recarga al entrar y después de enviar.
- **Perfil** (página nueva): nombre, apellidos, teléfono y foto, con `PUT /auth/me` y `POST /auth/me/avatar`, y cambio de contraseña.

---

# Parte 4 — Dante: recetas, constructor del plan y reportes

## Paso 4.1 — Biblioteca de recetas

`/nutriologo/recetas`, con la sección 5.10 del spec:

- Tarjetas con foto, nombre, comidas y kcal. Las kcal se calculan con los equivalentes y `/smae/groups`.
- Búsqueda y filtro por comida.
- Crear y editar recetas propias. Las compartidas (`nutritionist: null`) solo se ven.
- La foto se sube después de crear la receta: `POST /recipes/:id/image`.

## Paso 4.2 — Constructor del plan

`/nutriologo/pacientes/:id/plan`, como lo describe la sección 7 del spec:

1. **Meta:** kcal (de la última consulta, editable) y agua.
2. **Distribución:** equivalentes por grupo en cada comida, con las kcal calculadas al momento.
3. **Menú:** pestañas por día; en cada comida se elige una receta (`GET /recipes?mealTime=`) o alimentos sueltos (`GET /smae/foods`). Un contador compara lo asignado con lo planeado y **avisa, pero no bloquea**.
4. **Copiar día** a otros días.
5. **Guardar:** `POST /meal-plans` la primera vez y `PUT /meal-plans/:id` después, pidiendo el motivo del cambio.
6. **Historial:** lista de versiones y comparación lado a lado.

Al asignar una receta, se **copian** al plan su nombre (`title`), su id (`recipe`), `imageUrl`, sus ingredientes (`foods`) y sus pasos (`steps`).

## Paso 4.3 — Reportes

`/nutriologo/reportes`, con los cuatro reportes de la sección 5.12 del spec, usando las gráficas de Recharts que ya están instaladas:

| Reporte | Cómo mostrarlo |
|---|---|
| Seguimiento de pacientes | Tabla; primero los que necesitan seguimiento |
| Evolución de peso | Barras con el cambio de cada paciente |
| Bienestar por padecimiento | Tabla o barras por padecimiento |
| Alimentos más usados | Lista con su grupo |

---

# Parte 5 — Todos: limpieza y prueba final

## Paso 5.1 — Limpieza

- [ ] Borrar `features/nutricionista/data/mock-data.js` y `features/paciente/data/mock-data.js`, y que ningún import los use.
- [ ] Borrar la carpeta `features/`, que debe quedar vacía.
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
