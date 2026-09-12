# Guía de Front-End

Convenciones específicas del proyecto de Front-End. Para el flujo de ramas, commits y Pull Requests, ver la [Guía de Contribución](../../CONTRIBUTING.md).

## Stack

* **React + React Router** — UI y ruteo del lado del cliente.
* **Vite** — bundler y entorno de desarrollo.
* **Tailwind CSS** — estilos. La configuración vive principalmente en `src/index.css` (tokens, `@theme`), `tailwind.config.js` solo define qué archivos escanear.
* **shadcn/ui + base-ui** — componentes base en `src/components/ui/`. Generados con la CLI de shadcn (`npx shadcn add <componente>`), no se editan a mano salvo necesidad puntual.
* **TanStack Query** — estado async / datos del servidor.
* **Zustand** — estado global de cliente.
* **React Hook Form + Zod** — formularios y validación de esquemas.
* **Recharts** — gráficos (seguimiento de pacientes, progreso, etc.).

## Estructura de carpetas

Usamos ruteo declarado en código (`react-router-dom`) combinado con **organización por features**: la lógica de cada dominio del negocio (auth, pacientes, nutriólogos, etc.) vive junta en su propia carpeta, en vez de repartirse entre carpetas globales de "components", "hooks" y "services".

```
src/
  app/                    Configuración global de la app (no lógica de negocio)
    router.jsx            Declaración de rutas (react-router-dom)
    providers.jsx         Providers globales (TanStack Query, etc.)
    layouts/
      RootLayout.jsx       Layout compartido por las rutas públicas

  pages/                  Componentes de ruta: delgados, solo componen features
    HomePage.jsx
    NotFoundPage.jsx
    # a futuro, agrupar por área, ej:
    # auth/LoginPage.jsx
    # dashboard/nutriologo/PacientesPage.jsx

  features/               Lógica de negocio agrupada por dominio
    # ejemplo de convención al crear una feature nueva, p.ej. "pacientes":
    # pacientes/
    #   api/               Hooks de TanStack Query + llamadas a apiClient
    #   components/        Componentes usados solo dentro de esta feature
    #   schemas/           Esquemas de Zod para sus formularios
    #   store/             Store de Zustand, si la feature necesita estado propio

  components/
    ui/                    Componentes generados por shadcn (no editar a mano salvo necesidad)
    # componentes compartidos entre features (Navbar, Sidebar, etc.) van aquí

  hooks/                   Hooks genéricos reutilizables en toda la app
  lib/
    api-client.js          Instancia de axios (baseURL desde VITE_API_URL)
    query-client.js        Instancia de QueryClient
    utils.js                Utilidades compartidas (ej. cn())
  stores/                  Stores de Zustand globales (sesión, UI). Estado propio
                           de una sola feature va en features/<dominio>/store/

  assets/                  Imágenes, íconos estáticos importados desde componentes
  main.jsx                 Punto de entrada: monta Providers + RouterProvider
  index.css                Tokens de Tailwind y estilos base
```

**Regla práctica:** si un componente, hook o llamada a API solo lo usa una feature, vive dentro de `features/<esa-feature>/`. Si lo usan dos o más features (o es parte del layout general), sube a `components/`, `hooks/` o `lib/` según corresponda.

Para agregar una pantalla nueva: crear la página en `src/pages/`, declarar su ruta en `src/app/router.jsx`, y si necesita lógica propia (llamadas a API, formularios, estado), crear/usar la carpeta correspondiente en `src/features/`.

## Alias de imports

El alias `@` apunta a `src/` (configurado en `vite.config.js` y `jsconfig.json`):

```js
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

Preferir siempre el alias `@/...` sobre rutas relativas largas (`../../../`).

## Componentes de shadcn/ui

* Se instalan con `npx shadcn add <componente>` (usa la config de [components.json](../../components.json)).
* Viven en `src/components/ui/` y **no se deben editar** salvo que sea necesario adaptarlos — en ese caso, documentar el motivo en el PR.
* Es normal que exporten el componente junto con sus variantes (ej. `Button` y `buttonVariants`) desde el mismo archivo; el lint ya está configurado para no marcar esto como error.

## Antes de un PR

Ver el checklist de la [Guía de Contribución](../../CONTRIBUTING.md#4-checklist-antes-de-abrir-un-pull-request).
