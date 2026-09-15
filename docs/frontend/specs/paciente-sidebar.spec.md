# Spec: Sidebar del Paciente (`PacienteSidebar`)

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟢 Implementado  
> **Autor:** Leo  
> **Fecha:** 2026-09-14  

---

## 1. Objetivo

Crear el sidebar de navegación para las vistas del paciente (`/paciente/*`), replicando la misma estructura visual, comportamiento y patrones del [NutricionistaSidebar](../../../src/features/nutricionista/components/NutricionistaSidebar.jsx) existente, pero con las opciones de menú propias del rol de paciente.

---

## 2. Contexto

El proyecto GoHealthy ya cuenta con un sidebar flotante y colapsable para el nutriólogo. Las vistas del paciente necesitan su propio sidebar con opciones de navegación diferentes, pero manteniendo coherencia visual (misma librería `shadcn/ui Sidebar`, mismo estilo flotante, mismos patrones de colapso/expansión).

### Referencia visual

El componente debe verse y comportarse igual que `NutricionistaSidebar`:
- **variant:** `"floating"` (separado de los bordes con esquinas redondeadas)
- **collapsible:** `"icon"` (al colapsar mantiene los íconos visibles)
- Botón circular flotante en el borde derecho para alternar expandido/colapsado
- Header con logo GoHealthy y nombre del paciente
- Footer con botón "Cerrar sesión"

---

## 3. Opciones de navegación

| # | Label | Ruta | Ícono (lucide-react) | Descripción |
|---|-------|------|----------------------|-------------|
| 1 | Plan Alimenticio | `/paciente/plan-alimenticio` | `Utensils` | Ver el plan de alimentación asignado por el nutriólogo |
| 2 | Cumplimiento de Actividades | `/paciente/cumplimiento` | `ClipboardCheck` | Registro y seguimiento de actividades completadas |
| 3 | Cuestionarios | `/paciente/cuestionarios` | `FileQuestion` | Cuestionarios de salud/hábitos por responder |
| 4 | Progreso | `/paciente/progreso` | `TrendingUp` | Visualización del progreso físico y de salud |
| 5 | Chat | `/paciente/chat` | `MessageSquare` | Chat con el nutriólogo asignado |

> [!NOTE]
> Los íconos de `lucide-react` son sugeridos. Se pueden ajustar durante la implementación si el equipo lo considera más adecuado.

---

## 4. Estructura de archivos

Siguiendo la [organización por features](../../frontend/README.md) del proyecto:

```
src/
  features/
    paciente/                         # [NUEVO] Feature del paciente
      components/
        PacienteSidebar.jsx           # [NUEVO] Componente sidebar del paciente
      data/
        mock-data.js                  # [NUEVO] Datos mock del paciente (nombre, foto, etc.)

  app/
    layouts/
      PacienteLayout.jsx              # [NUEVO] Layout con sidebar + área de contenido

  pages/
    paciente/                         # [NUEVO] Carpetas de páginas del paciente
      (las páginas se crearán en specs separadas)

  app/
    router.jsx                        # [MODIFICAR] Agregar bloque de rutas /paciente/*
```

---

## 5. Especificación del componente

### 5.1 `PacienteSidebar.jsx`

**Ubicación:** `src/features/paciente/components/PacienteSidebar.jsx`

**Props:** Ninguna (obtiene datos del mock o futuro store de autenticación).

**Comportamiento:**
- Idéntico a `NutricionistaSidebar` en cuanto a:
  - Uso de los componentes `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem` de shadcn.
  - Uso de `useSidebar()` para obtener `state` y `toggleSidebar`.
  - Uso de `useLocation()` para determinar la ruta activa.
  - Botón circular flotante de colapso/expansión (ChevronLeft/ChevronRight).
  - Logo GoHealthy en el header con nombre del paciente (sin el prefijo "Dr.").
  - Botón de "Cerrar sesión" en el footer con estilo destructivo al hover.

**Array `navItems`:**
```js
const navItems = [
  { label: 'Plan Alimenticio',           href: '/paciente/plan-alimenticio', icon: Utensils        },
  { label: 'Cumplimiento de Actividades', href: '/paciente/cumplimiento',    icon: ClipboardCheck  },
  { label: 'Cuestionarios',              href: '/paciente/cuestionarios',    icon: FileQuestion    },
  { label: 'Progreso',                   href: '/paciente/progreso',        icon: TrendingUp      },
  { label: 'Chat',                       href: '/paciente/chat',            icon: MessageSquare   },
]
```

### 5.2 `PacienteLayout.jsx`

**Ubicación:** `src/app/layouts/PacienteLayout.jsx`

**Comportamiento:**
- Mismo patrón que `NutricionistaLayout`:
  - Envuelve en `<SidebarProvider>`
  - Renderiza `<PacienteSidebar />`
  - Usa `<SidebarInset>` con header mobile (con `<SidebarTrigger />`) y `<Outlet />` para el contenido.

### 5.3 Datos mock

**Ubicación:** `src/features/paciente/data/mock-data.js`

```js
export const pacienteMock = {
  id: 'pac-001',
  nombre: 'María García López',
  email: 'maria.garcia@email.com',
  fotoPerfil: null, // Se usará un placeholder o iniciales
}
```

### 5.4 Cambios en `router.jsx`

Agregar un nuevo bloque de rutas para `/paciente`:

```js
{
  path: '/paciente',
  element: <PacienteLayout />,
  children: [
    { index: true, element: <Navigate to="plan-alimenticio" replace /> },
    // Las rutas de cada página se agregarán en sus propias specs
  ],
}
```

> [!IMPORTANT]
> En esta spec solo se crea la ruta raíz `/paciente` con redirect a `plan-alimenticio`. Las páginas individuales (Plan Alimenticio, Cumplimiento, Cuestionarios, Progreso, Chat) se implementarán en specs separadas y se agregarán al router en ese momento.

---

## 6. Qué NO hacer

- **No agregar dependencias nuevas.** Todo se resuelve con `lucide-react` (ya instalado) y `shadcn/ui Sidebar` (ya instalado).
- **No inventar endpoints ni conectar a API.** Solo datos mock por ahora.
- **No crear las páginas de cada sección.** Esta spec cubre únicamente el sidebar, el layout y la estructura de rutas base. Cada página tendrá su propia spec.
- **No editar componentes de `src/components/ui/`.** Se usan tal cual.
- **No modificar el sidebar del nutriólogo.** Cada rol tiene su propio sidebar independiente.

---

## 7. Criterios de aceptación

- [x] El sidebar del paciente se renderiza en `/paciente` con las 5 opciones de navegación listadas.
- [x] El sidebar se ve visualmente idéntico al del nutriólogo (floating, colapsable a íconos, botón circular de toggle).
- [x] El header muestra el logo GoHealthy y el nombre del paciente (sin "Dr.").
- [x] La opción activa se resalta correctamente según la ruta actual.
- [x] El footer tiene el botón "Cerrar sesión" con hover destructivo.
- [x] Funciona responsivamente: en móvil se muestra como menú offcanvas con trigger.
- [x] `pnpm lint` pasa sin errores.
- [x] `pnpm build` — error preexistente por `@fontsource-variable/jetbrains-mono` faltante, no relacionado con estos cambios.
- [x] La estructura de carpetas sigue la convención `features/<dominio>/`.

---

## 8. Verificación

```bash
pnpm lint
pnpm build
```

Verificación visual: navegar a `http://localhost:5173/paciente` y confirmar que el sidebar se muestra correctamente, colapsa/expande, y las opciones reflejan las rutas esperadas.
