# Spec: Página de Progreso del Paciente (`PacienteProgresoPage`)

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟢 Implementado  
> **Autor:** Leo  
> **Fecha:** 2026-09-14  
> **Depende de:** [paciente-sidebar.spec.md](./paciente-sidebar.spec.md) ✅

---

## 1. Objetivo

Crear la página de **Progreso del Paciente** (`/paciente/progreso`), que permita al paciente consultar de manera clara y visual su evolución física y cumplimiento del tratamiento nutricional.

La vista debe incluir:
- **Métricas clave con comparativas temporales** (peso, porcentaje de grasa corporal, apego a la dieta, IMC).
- **Indicadores de cambio respecto a la semana/sesión anterior** (deltas positivos/negativos con colores de avance).
- **Gráficas interactivas de evolución** utilizando `recharts` con la paleta visual de GoHealthy (verde bosque `#2F6B4E`, verde lima `#ABB748`, fondos beige `#EFEBE7`).
- **Barra de avance hacia el objetivo acordado.**
- **Historial cronológico de evaluaciones y recomendaciones del nutriólogo.**

---

## 2. Contexto y Referencia Visual

El nutriólogo cuenta actualmente con una pestaña de progreso en el expediente clínico ([`ExpedienteProgresoTab.jsx`](../../../src/features/nutricionista/components/ExpedienteProgresoTab.jsx)). La vista del paciente toma como base este diseño, adaptándolo al punto de vista del paciente (enfoque de consulta, logro y motivación personal).

### Diferencias clave: Vista Nutriólogo vs Vista Paciente

| Aspecto | Vista Nutriólogo (`/nutriologo/pacientes/:id`) | Vista Paciente (`/paciente/progreso`) |
|---------|-----------------------------------------------|---------------------------------------|
| **Modo** | Clínico y de captura (botones para añadir sesión / modal de registro) | **Solo consulta y motivación** (sin modales de captura clínica) |
| **Comparativas** | Historial tabular de consultas | **Indicadores delta semana a semana** (+/- kg, +/- % grasa, % apego a la dieta) |
| **Métricas de hábitos** | Peso e IMC | **Peso, % Grasa, IMC y Cumplimiento del Plan Nutricional (%)** |
| **Gráficas** | Evolución de peso vs meta con Recharts | **Gráfica de evolución de peso y composición corporal** (con filtro o vista combinada) |
| **Comentarios** | Notas clínicas | **Feedback y notas de aliento dejadas por el nutriólogo** |

---

## 3. Especificación de la Interfaz

### 3.1 Encabezado de la Página
- **Título:** `"Mi Progreso y Evolución"`
- **Subtítulo:** `"Monitoreo de tus métricas corporales, cumplimiento de metas y evolución semana a semana"`

### 3.2 Tarjetas de Métricas Principales (Grid de 4 o 5 Cards)
Cada tarjeta muestra el valor actual y una insignia (badge) de comparación con la semana anterior:

| Métrica | Ícono (lucide-react) | Valor Ejemplo | Comparativa vs Semana Anterior | Color Indicador |
|---------|----------------------|---------------|---------------------------------|-----------------|
| **Peso Actual** | `Scale` | `64.2 kg` | `-0.8 kg vs sem. anterior` | Verde éxito (`text-emerald-600 bg-emerald-500/10`) |
| **% Grasa Corporal** | `Activity` | `24.5%` | `-1.2% vs sem. anterior` | Verde éxito (`text-emerald-600 bg-emerald-500/10`) |
| **Apego al Plan** | `Utensils` | `94%` | `+6% vs sem. anterior` | Verde lima (`text-[#2F6B4E] bg-[#ABB748]/15`) |
| **Índice IMC** | `Heart` | `23.6` (Normal) | `Saludable` | Esmeralda / Neutral |
| **Meta Acordada** | `TrendingDown` | `58.0 kg` | `6.2 kg restantes` | Azul / Muted |

### 3.3 Barra de Avance Global hacia el Objetivo
- Card con título `"Avance hacia tu Meta Final"`.
- Porcentaje global completado (ej. `65%`) con tipografía mono destacada.
- Barra de progreso (`Progress` component de shadcn) con estilo de color temático.
- Información de contexto: `Inicio: 72.0 kg`, `Actual: 64.2 kg`, `Meta: 58.0 kg`.

### 3.4 Gráfica de Evolución Temporal (`Recharts`)
- Implementada con `AreaChart` / `ResponsiveContainer` de `recharts`.
- Gradiente suave con el color corporativo `#2F6B4E`.
- Línea de referencia horizontal (`ReferenceLine`) discontinua para la **Meta acordada** en color `#ABB748`.
- Puntos de datos (`dots`) en cada registro semanal/mensual.
- Tooltip interactivo con tarjeta flotante (`CustomChartTooltip`) que muestra:
  - Fecha de la evaluación.
  - Peso y diferencia.
  - % Grasa registrado.
  - Comentario breve del nutriólogo para esa semana.

### 3.5 Historial Comparativo Semana a Semana
- Tarjeta que lista las evaluaciones recientes en orden cronológico inverso:
  - Fecha de la sesión / semana.
  - Peso registrado y delta con respecto a la sesión previa.
  - Porcentaje de grasa.
  - Nivel de apego a la dieta (badge con estrellas o porcentaje).
  - Nota o mensaje de retroalimentación redactado por el Dr. Carlos Mendoza.

---

## 4. Estructura de Archivos

```
src/
  features/
    paciente/
      components/
        PacienteProgreso.jsx          # [NUEVO] Componente con métricas, gráficas e historial
      data/
        mock-data.js                  # [MODIFICAR] Agregar progresoPacienteMock con historial de semanas

  pages/
    paciente/
      PacienteProgresoPage.jsx        # [NUEVO] Página delgada que inyecta progresoPacienteMock

  app/
    router.jsx                        # [MODIFICAR] Reemplazar placeholder por PacienteProgresoPage
```

---

## 5. Datos Mock (`src/features/paciente/data/mock-data.js`)

```javascript
export const progresoPacienteMock = {
  meta: {
    objetivo: 'Pérdida de grasa y recomposición corporal',
    pesoInicial: 72.0,
    pesoActual: 64.2,
    pesoMeta: 58.0,
    grasaInicial: 29.8,
    grasaActual: 24.5,
    grasaMeta: 20.0,
    progresoPorcentaje: 65,
    imcActual: '23.6 (Normal)',
    apegoPromedio: '94%',
  },
  metricasComparativa: {
    cambioPesoSemana: -0.8,
    cambioGrasaSemana: -1.2,
    cambioApegoSemana: +6,
  },
  evolucionTemporal: [
    { fecha: '14 Jul', peso: 72.0, grasa: 29.8, apego: 85, nota: 'Inicio de plan alimenticio y hábitos' },
    { fecha: '28 Jul', peso: 70.5, grasa: 28.6, apego: 88, nota: 'Buena adaptación, reducción de sodio' },
    { fecha: '11 Ago', peso: 68.8, grasa: 27.2, apego: 90, nota: 'Aumento progresivo de hidratación' },
    { fecha: '25 Ago', peso: 66.7, grasa: 26.0, apego: 92, nota: 'Mayor energía y consistencia en colaciones' },
    { fecha: '08 Sep', peso: 65.0, grasa: 25.7, apego: 88, nota: 'Mantenimiento del ritmo metabólico' },
    { fecha: '14 Sep', peso: 64.2, grasa: 24.5, apego: 94, nota: 'Excelente apego a los horarios de comida' },
  ],
}
```

---

## 6. Cambios en `router.jsx`

Reemplazar la ruta placeholder de `progreso`:

```diff
- import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacienteProgresoPage from '@/pages/paciente/PacienteProgresoPage'

  // En children de /paciente:
- { path: 'progreso', element: <PacientePlaceholderPage titulo="Progreso" /> },
+ { path: 'progreso', element: <PacienteProgresoPage /> },
```

---

## 7. Qué NO hacer

- **No incluir formularios ni modales para añadir sesiones clínicas.** Las métricas médicas oficiales las registra el nutriólogo.
- **No instalar dependencias de gráficas externas adicionales.** `recharts` ya está instalado en el proyecto y configurado.
- **No alterar los estilos de temas ni colores globales.** Utilizar la paleta de tokens oficial (`#2F6B4E`, `#ABB748`, `#EFEBE7`, `bg-card`, etc.).
- **No modificar archivos de la feature del nutriólogo** (`src/features/nutricionista/*`).
- **No modificar componentes base de `src/components/ui/*`.**

---

## 8. Criterios de Aceptación

- [x] La página se renderiza en `/paciente/progreso` con el sidebar del paciente activo y la opción "Progreso" resaltada.
- [x] Muestra las tarjetas de métricas principales (Peso Actual, % Grasa, Apego al Plan, IMC, Meta).
- [x] Cada tarjeta muestra el delta de avance respecto a la semana previa con colores coherentes de progreso.
- [x] Muestra la barra de avance global hacia la meta final con cálculo de porcentaje completado.
- [x] Renderiza la gráfica de evolución temporal con `recharts` usando gradiente verde `#2F6B4E`, línea de meta `#ABB748` y tooltip personalizado al posar el cursor.
- [x] Despliega el historial cronológico comparativo de evaluaciones con fechas, valores de peso, grasa y notas del nutriólogo.
- [x] La página es responsiva (se adapta a pantallas móviles y escritorio).
- [x] `pnpm lint` pasa con 0 errores.
- [x] `pnpm build` compila con éxito.

---

## 9. Verificación

```bash
pnpm lint
pnpm build
```

**Verificación visual:**
Navegar a `http://localhost:5173/paciente/progreso` para validar:
1. Renderizado de las cards de métricas y deltas semanales.
2. Comportamiento interactivo de la gráfica de evolución y tooltip al pasar el puntero.
3. Coherencia total de colores con el tema beige/verde de GoHealthy.
