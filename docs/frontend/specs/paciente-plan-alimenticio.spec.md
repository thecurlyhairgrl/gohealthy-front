# Spec: Página Plan Alimenticio del Paciente (`PacientePlanAlimenticioPage`)

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟢 Implementado  
> **Autor:** Leo  
> **Fecha:** 2026-09-14  
> **Depende de:** [paciente-sidebar.spec.md](./paciente-sidebar.spec.md) ✅

---

## 1. Objetivo

Crear la página de **Plan Alimenticio** para la vista del paciente (`/paciente/plan-alimenticio`). Esta página muestra al paciente su plan nutricional asignado por el nutriólogo, incluyendo el aporte calórico diario, requerimiento hídrico, los 5 tiempos de comida y las recomendaciones generales.

---

## 2. Contexto

El nutriólogo ya cuenta con una vista de Plan Alimenticio dentro del expediente del paciente ([`ExpedientePlanTab.jsx`](../../../src/features/nutricionista/components/ExpedientePlanTab.jsx)). La vista del paciente debe mostrar **la misma información**, pero en modo **solo lectura** (sin botón "Editar Plan", sin inputs ni textareas).

### Referencia visual

La estructura visual es idéntica a la pestaña "Plan Alimenticio" de la vista del nutriólogo:

![Vista superior del plan alimenticio del nutriólogo](C:/Users/leogg/.gemini/antigravity-ide/brain/8d75f317-7c25-4532-826f-5c8914a6c6ed/plan_alimenticio_top_1789420788125.png)

![Tiempos de comida](C:/Users/leogg/.gemini/antigravity-ide/brain/8d75f317-7c25-4532-826f-5c8914a6c6ed/plan_alimenticio_meals_1789420797069.png)

![Recomendaciones](C:/Users/leogg/.gemini/antigravity-ide/brain/8d75f317-7c25-4532-826f-5c8914a6c6ed/plan_alimenticio_bottom_1789420817195.png)

### Diferencias clave con la vista del nutriólogo

| Aspecto | Vista Nutriólogo | Vista Paciente |
|---------|-----------------|----------------|
| Modo | Lectura + Edición (botón "Editar Plan") | **Solo lectura** |
| Encabezado | "Plan Nutricional Asignado" + botón editar | "Mi Plan Alimenticio" (sin botón editar) |
| Datos | Viene de `paciente.planAlimenticio` (mock del nutriólogo) | Viene de `planAlimenticioMock` (mock propio del paciente) |
| Contexto | Tab dentro del expediente de un paciente | **Página completa** dentro del layout del paciente |

---

## 3. Secciones de la página

### 3.1 Encabezado

- **Título:** "Mi Plan Alimenticio"
- **Subtítulo:** "Plan diseñado por tu nutriólogo según tus objetivos y requerimientos"
- Sin botón de edición (el paciente no edita su plan)

### 3.2 Metas generales (2 cards en grid)

| Card | Ícono | Label | Valor ejemplo | Color del ícono |
|------|-------|-------|---------------|----------------|
| Aporte Calórico Diario | `Flame` | `APORTE CALÓRICO DIARIO` | `1,800 kcal` | Orange |
| Requerimiento Hídrico | `Droplets` | `REQUERIMIENTO HÍDRICO` | `2.2 L al día` | Sky/Blue |

### 3.3 Tiempos de comida del día (5 cards verticales)

Cada card muestra:
- Ícono con color distintivo
- Nombre del tiempo de comida
- Horario recomendado
- Detalle de alimentos en un `div` con fondo `bg-muted/40`

| # | Tiempo | Ícono | Color | Horario |
|---|--------|-------|-------|---------|
| 1 | Desayuno | `Coffee` | Amber | 07:30 - 08:30 |
| 2 | Colación Matutina | `Apple` | Emerald | 11:00 - 11:30 |
| 3 | Comida | `Sun` | Orange | 14:00 - 15:00 |
| 4 | Colación Vespertina | `Utensils` | Emerald | 17:30 - 18:00 |
| 5 | Cena | `Moon` | Indigo | 20:30 - 21:30 |

### 3.4 Recomendaciones y hábitos saludables

- **Ícono:** `Sparkles` (color `#ABB748`)
- **Título:** "Recomendaciones y Hábitos Saludables"
- **Subtítulo:** "Pautas clave sobre suplementación, actividad y descanso"
- Contenido en un `div` con fondo `bg-muted/40`

---

## 4. Estructura de archivos

```
src/
  features/
    paciente/
      components/
        PacientePlanAlimenticio.jsx    # [NUEVO] Componente de solo lectura del plan
      data/
        mock-data.js                   # [MODIFICAR] Agregar planAlimenticioMock

  pages/
    paciente/
      PacientePlanAlimenticioPage.jsx  # [NUEVO] Página que importa el componente

  app/
    router.jsx                         # [MODIFICAR] Reemplazar placeholder por página real
```

---

## 5. Especificación del componente

### 5.1 `PacientePlanAlimenticio.jsx`

**Ubicación:** `src/features/paciente/components/PacientePlanAlimenticio.jsx`

**Props:**

```js
/**
 * @param {Object} plan - Objeto con los datos del plan alimenticio
 * @param {string} plan.calorias     - Ej. "1,800 kcal"
 * @param {string} plan.agua         - Ej. "2.2 L al día"
 * @param {string} plan.desayuno     - Detalle de alimentos
 * @param {string} plan.colacion1    - Detalle de alimentos
 * @param {string} plan.comida       - Detalle de alimentos
 * @param {string} plan.colacion2    - Detalle de alimentos
 * @param {string} plan.cena         - Detalle de alimentos
 * @param {string} plan.recomendaciones - Texto de recomendaciones
 */
```

**Comportamiento:**
- Componente **puramente de presentación** (sin estado, sin edición).
- Usa los mismos componentes de UI que `ExpedientePlanTab`: `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`.
- Mismos íconos de `lucide-react`: `Flame`, `Droplets`, `Coffee`, `Apple`, `Sun`, `Utensils`, `Moon`, `Sparkles`.
- Mismas clases de Tailwind para colores, espaciado y layout.
- Si un campo está vacío, muestra el placeholder en cursiva (ej. "Sin opciones asignadas para este horario.").

**Diferencias con `ExpedientePlanTab`:**
- **Sin `useState`** — no hay estado de edición.
- **Sin botones** de "Editar Plan", "Guardar Cambios", "Cancelar".
- **Sin `Input` ni `Textarea`** — solo muestra el contenido en `div` de lectura.
- **Título cambia** a "Mi Plan Alimenticio".

### 5.2 `PacientePlanAlimenticioPage.jsx`

**Ubicación:** `src/pages/paciente/PacientePlanAlimenticioPage.jsx`

**Comportamiento:**
- Página delgada que importa `PacientePlanAlimenticio` y le pasa los datos mock.

```jsx
import PacientePlanAlimenticio from '@/features/paciente/components/PacientePlanAlimenticio'
import { planAlimenticioMock } from '@/features/paciente/data/mock-data'

function PacientePlanAlimenticioPage() {
  return <PacientePlanAlimenticio plan={planAlimenticioMock} />
}

export default PacientePlanAlimenticioPage
```

### 5.3 Datos mock (agregar a `mock-data.js`)

Agregar al archivo existente `src/features/paciente/data/mock-data.js`:

```js
export const planAlimenticioMock = {
  calorias: '1,800 kcal',
  agua: '2.2 L al día',
  desayuno:
    'Omelette de 2 claras y 1 huevo entero con espinacas y jitomate + 1 rebanada de pan integral tostado + 1/2 taza de papaya.',
  colacion1: '1 manzana verde con 10 almendras naturales.',
  comida:
    '150g de pechuga de pollo a la plancha + 1 taza de quinoa o arroz integral + ensalada verde abundante con 1 cda de aceite de oliva.',
  colacion2:
    '1 taza de yogur griego sin azúcar con 1 cucharada de semillas de chía.',
  cena:
    'Ensalada de atún en agua con nopales, jitomate, cebolla morada y 1/3 de aguacate.',
  recomendaciones:
    'Evitar alimentos ultraprocesados, mantener hidratación constante y realizar caminata de 15 minutos después de comer.',
}
```

### 5.4 Cambios en `router.jsx`

Reemplazar la ruta placeholder de `plan-alimenticio`:

```diff
- import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacientePlanAlimenticioPage from '@/pages/paciente/PacientePlanAlimenticioPage'

  // En children de /paciente:
- { path: 'plan-alimenticio', element: <PacientePlaceholderPage titulo="Plan Alimenticio" /> },
+ { path: 'plan-alimenticio', element: <PacientePlanAlimenticioPage /> },
```

---

## 6. Qué NO hacer

- **No agregar funcionalidad de edición.** El paciente solo visualiza su plan; la edición es exclusiva del nutriólogo.
- **No agregar dependencias nuevas.** Todo se resuelve con `lucide-react` y `shadcn/ui` (ya instalados).
- **No inventar endpoints.** Solo datos mock.
- **No duplicar `ExpedientePlanTab`.** Se crea un componente nuevo y simplificado (sin lógica de edición), no un fork con código muerto.
- **No editar `ExpedientePlanTab` ni ningún componente del nutriólogo.**
- **No editar componentes de `src/components/ui/`.**

---

## 7. Criterios de aceptación

- [x] La página se renderiza en `/paciente/plan-alimenticio` con el sidebar del paciente visible.
- [x] Muestra el título "Mi Plan Alimenticio" sin botón de edición.
- [x] Muestra las 2 cards de metas generales (calorías e hidratación) con íconos y valores.
- [x] Muestra los 5 tiempos de comida con ícono, nombre, horario y detalle de alimentos.
- [x] Muestra la sección de recomendaciones y hábitos saludables.
- [x] Los campos vacíos muestran placeholder en cursiva ("Sin opciones asignadas...").
- [x] Es visualmente idéntica a la pestaña "Plan Alimenticio" del nutriólogo (sin controles de edición).
- [x] `pnpm lint` pasa sin errores.
- [x] `pnpm build` — error preexistente por `@fontsource-variable/jetbrains-mono` faltante, no relacionado con estos cambios.
- [x] La estructura sigue la convención `features/paciente/components/`.

---

## 8. Verificación

```bash
pnpm lint
pnpm build
```

Verificación visual: navegar a `http://localhost:5173/paciente/plan-alimenticio` y comparar con `http://localhost:5173/nutriologo/pacientes/1` (tab "Plan Alimenticio") — deben ser visualmente equivalentes salvo por la ausencia de controles de edición.
