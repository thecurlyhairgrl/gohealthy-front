# AGENTS.md

## Qué es este proyecto

GoHealthy conecta nutriólogos con sus pacientes: seguimiento de alimentación, ejercicio y evolución física en un solo lugar, reemplazando papel, Excel y WhatsApp. Este repo es la SPA de React que usan los dos tipos de usuario (nutriólogo y paciente). La API está en el repo `gohealthy-back`.

## Lee esto antes de trabajar

1. [`docs/backend/README.md`](docs/backend/README.md): cómo funciona la API, sus modelos y las reglas que el front debe respetar.
2. [`docs/frontend/specs/conexion-api-back.spec.md`](docs/frontend/specs/conexion-api-back.spec.md): el contrato de cada endpoint.
3. [`docs/frontend/GUIA-FRONT.md`](docs/frontend/GUIA-FRONT.md): el plan de trabajo, paso por paso. Si te piden "el paso 2.3", es de esa guía.

**El back es la fuente de verdad.** Si una pantalla no coincide con la API, se cambia la pantalla. No inventes endpoints, campos ni valores: si falta algo en la API, dilo en lugar de suponer su forma o usar datos de prueba.

## Estado del proyecto

El front se está reorganizando con la guía. Hasta terminar la Parte 1, conviven la estructura vieja (`src/app/`, `src/features/`) y la nueva. **Todo el código nuevo va en la estructura nueva**, y lo viejo se mueve a ella con `git mv`.

## Stack

- **React 19 + react-router-dom**: rutas declaradas en `src/router.jsx`, con `ProtectedRoute` por rol.
- **Vite**: bundler y servidor de desarrollo.
- **Tailwind CSS v4**: configuración en `src/index.css` (`@theme`).
- **shadcn/ui + base-ui**: componentes en `src/components/ui/`, generados con `npx shadcn add <componente>`.
- **TanStack Query**: todas las peticiones a la API pasan por hooks de `src/hooks/`.
- **React Hook Form + Zod** (con `@hookform/resolvers`): formularios. Los esquemas van en `src/schemas/`.
- **axios**: un solo cliente, `src/api/client.js`, que agrega el token y maneja el `401`.
- **Recharts**: gráficas.
- **pnpm**: gestor de paquetes. Usar siempre `pnpm`.

La sesión vive en `src/context/AuthContext.jsx`, un contexto sencillo como el del proyecto de clase. **No se usa Zustand.**

## Estructura

```
src/
├── api/          Una función por endpoint, un archivo por recurso
├── components/   Compartidos (FormField, ProtectedRoute, ConfirmDialog) y por área:
│                 landing/, auth/, nutriologo/, paciente/. ui/ es shadcn: no se edita
├── context/      AuthContext
├── hooks/        Consultas y cambios de TanStack Query, un archivo por recurso
├── layouts/      AuthLayout, NutritionistLayout, PatientLayout
├── lib/          query-client, notify, fechas, textos, imágenes, horarios
├── pages/        Una página por ruta: landing/, auth/, primer-ingreso/, nutriologo/, paciente/
├── schemas/      Esquemas de Zod
├── data/         Textos fijos de la landing y de auth
├── router.jsx
├── providers.jsx
└── main.jsx
```

Las páginas son delgadas: arman componentes y usan hooks. No llaman a axios directamente.

## Reglas

- **Avisos:** nada de `alert()`, `confirm()` ni `prompt()`. Usa `notifySuccess` y `notifyError` de `src/lib/notify.js` (toasts), y `ConfirmDialog` para confirmar.
- **Estados:** toda pantalla con datos muestra carga, error y vacío.
- **Errores de la API:** el mensaje en español sale de `getErrorMessage(error)` (`src/api/client.js`).
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
