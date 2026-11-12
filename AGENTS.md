# AGENTS.md

## Qué es este proyecto

GoHealthy conecta nutriólogos con sus pacientes: seguimiento de alimentación, ejercicio y evolución física en un solo lugar, reemplazando papel, Excel y WhatsApp. Este repo es la SPA de React que usan los dos tipos de usuario (nutriólogo y paciente). La API está en el repo `gohealthy-back`.

## Lee esto antes de trabajar

1. [`docs/backend/README.md`](docs/backend/README.md): cómo funciona la API, sus modelos y las reglas que el front debe respetar.
2. [`docs/frontend/specs/conexion-api-back.spec.md`](docs/frontend/specs/conexion-api-back.spec.md): el contrato de cada endpoint.
3. [`docs/frontend/GUIA-FRONT.md`](docs/frontend/GUIA-FRONT.md): el plan de trabajo, paso por paso. Si te piden "el paso 2.3", es de esa guía.

**El back es la fuente de verdad.** Si una pantalla no coincide con la API, se cambia la pantalla. No inventes endpoints, campos ni valores: si falta algo en la API, dilo en lugar de suponer su forma o usar datos de prueba.

## Estado del proyecto

El front se está reorganizando con la guía. Ya están conectadas a la API la sesión (Parte 1) y las pantallas del nutriólogo (Parte 2). Las del paciente todavía usan los datos de prueba de `src/mocks/paciente.js`. **No agregues datos de prueba nuevos.** Antes de crear una utilidad, revisa `src/lib/` (fechas, textos, listas, horarios, pesos) y los componentes compartidos (`FormField`, `FormSelect`, `DatePicker`, `ConfirmDialog`).

## Stack

- **React 19 + react-router-dom**: como en el proyecto de clase, `BrowserRouter` en `src/main.jsx` y las rutas con `<Routes>`/`<Route>` en `src/App.jsx`. Las privadas van dentro de `<Route element={<ProtectedRoute />}>`, que también manda a cada usuario a su área según `getHomePath` (`src/lib/home-path.js`). Al crear una página, agrega su `<Route>` en `App.jsx` y su enlace en el menú lateral.
- **Vite**: bundler y servidor de desarrollo.
- **Tailwind CSS v4**: configuración en `src/index.css` (`@theme`).
- **shadcn/ui + base-ui**: componentes en `src/components/ui/`, generados con `npx shadcn add <componente>`.
- **React Hook Form + Zod** (con `@hookform/resolvers`): formularios. Los esquemas van en `src/schemas/`.
- **fetch**: con `apiFetch` de `src/api/client.js`, como en el proyecto de clase. Agrega el token y maneja el `401`. No se usan axios ni TanStack Query.
- **Recharts**: gráficas.
- **pnpm**: gestor de paquetes. Usar siempre `pnpm`.

La sesión vive en `src/context/AuthContext.jsx`, un contexto sencillo como el del proyecto de clase. **No se usa Zustand.** Los datos que comparten varias pantallas van en un contexto, como `BooksContext` de clase (`PatientsContext`, `AppointmentsContext`). Los de una sola pantalla, en un hook de `src/hooks/` con `useEffect`.

## Estructura

```
src/
├── api/          Una función por endpoint, un archivo por recurso
├── components/   Compartidos (FormField, DatePicker, ProtectedRoute, ConfirmDialog) y por área:
│                 landing/, auth/, nutriologo/, paciente/. ui/ es shadcn: no se edita
├── context/      AuthContext y los datos que comparten varias pantallas
├── hooks/        Datos de una sola pantalla, con useEffect
├── layouts/      NutricionistaLayout, PacienteLayout, PrimerIngresoLayout
├── lib/          fechas, textos, imágenes, horarios
├── mocks/        Datos de prueba mientras se conecta la API (se borran al final)
├── pages/        Una página por ruta: landing/, auth/, primer-ingreso/, nutriologo/, paciente/
├── schemas/      Esquemas de Zod
├── data/         Textos fijos de la landing y de auth
├── App.jsx       Rutas (<Routes> y <Route>)
└── main.jsx      BrowserRouter, AuthProvider y Toaster
```

Las páginas arman componentes y usan contextos o hooks. No llaman a `apiFetch` directamente. Todas se exportan con `export default`, como en clase.

## Reglas

- **Avisos:** nada de `alert()`, `confirm()` ni `prompt()`. Usa `toast.add({ title, type })` de `@/components/ui/toast`, y `ConfirmDialog` para confirmar.
- **Estados:** toda pantalla con datos muestra carga, error y vacío.
- **Errores de la API:** `apiFetch` lanza un `Error` con el mensaje en español del back en `error.message`, como en clase. Se muestra con un toast dentro de un `try/catch`.
- **Textos:** todo lo que ve el usuario va en español. Los valores de la API (`scheduled`, `breakfast`…) se traducen con `src/lib/labels.js`.
- **Fechas:** usa `src/lib/dates.js`. Nunca `new Date().toISOString()` para una fecha sin hora.
- **Imágenes de la API:** con `getImageUrl()` de `src/lib/image-url.js`.
- **Código:** sin punto y coma, comillas simples, alias `@/` en lugar de rutas relativas largas. Nombres de archivos de componentes en PascalCase.

## Comandos

- `pnpm install`: instalar dependencias.
- `pnpm dev`: servidor de desarrollo en `http://localhost:5173`. Necesita el back levantado.
- `pnpm lint` y `pnpm build`: **los dos deben pasar antes de dar una tarea por terminada.**

## Ramas y commits

- Ramas: `main` (producción), `develop` (integración) y `feature/<nombre>/<persona>`.
- Cada cambio va en su rama y se sube con un Pull Request contra `develop`.
- Commits con [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- Flujo completo en [CONTRIBUTING.md](CONTRIBUTING.md).

## Qué NO debe hacer un agente sin confirmarlo con el equipo

- Agregar dependencias que no estén en la guía.
- Cambiar el back o pedir endpoints nuevos sin señalarlo primero.
- Editar `src/components/ui/`.
- Commitear `.env` o credenciales.
- Hacer force-push o commitear directo en `main` o `develop`.
- Reactivar `minimum-release-age` en `.npmrc`: se desactivó a propósito, porque sin eso un `pnpm install` limpio puede fallar si una dependencia se publicó hace menos de 24 horas.
