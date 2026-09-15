# Spec: Página de Cumplimiento de Actividades (`PacienteCumplimientoPage`)

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟢 Implementado  
> **Autor:** Leo  
> **Fecha:** 2026-09-14  
> **Depende de:** [paciente-sidebar.spec.md](./paciente-sidebar.spec.md) ✅

---

## 1. Objetivo

Crear la página de **Cumplimiento de Actividades y Hábitos** (`/paciente/cumplimiento`), diseñada para que el paciente registre y monitoree diariamente qué tan apegado está a su plan alimenticio, a sus metas de hidratación y a las recomendaciones de estilo de vida proporcionadas por su nutriólogo (Dr. Carlos Mendoza).

La página ofrece:
1. **Métricas de resumen del día:** Nivel de apego general (`%`), progreso de comidas e hidratación acumulada.
2. **Checklist interactivo de tiempos de comida:** Registro de los 5 tiempos asignados (Desayuno, Colación 1, Comida, Colación 2, Cena) con recálculo dinámico de apego.
3. **Control interactivo de hidratación:** Registro visual de vasos de agua para alcanzar el requerimiento hídrico diario (ej. 2.2 L).
4. **Seguimiento de hábitos y recomendaciones:** Checklist de hábitos saludables específicos prescritos por el nutriólogo.
5. **Historial de consistencia semanal:** Vista rápida de cumplimiento de los 7 días de la semana en curso (Lunes a Domingo).

---

## 2. Contexto y Experiencia de Usuario

En el tratamiento nutricional, el paciente necesita retroalimentación diaria tangible sobre si está cumpliendo con lo acordado en consulta. Esta página funciona como un registro diario ágil (de 1-2 minutos) donde el paciente puede marcar lo que ha comido o bebido y ver su porcentaje de apego reflejado en tiempo real con colores motivadores y de refuerzo positivo.

### Flujo de Interacción Diaria

```mermaid
graph TD
    A[Vista de Cumplimiento] --> B[Checklist de 5 Comidas]
    A --> C[Contador de Hidratación (+ / - vasos)]
    A --> D[Checklist de Hábitos Recomendados]
    B -->|Marcar/Desmarcar Comida| E[Recálculo Reactivo de % de Apego]
    C -->|Añadir Vaso| E
    D -->|Marcar Hábito| E
    E --> F[Actualización de Cards y Barra de Resumen Diario]
```

---

## 3. Especificación de la Interfaz

### 3.1 Encabezado y Fecha Activa
- **Título:** `"Cumplimiento de Actividades"`
- **Subtítulo:** `"Registra tu apego diario al plan alimenticio, metas de hidratación y hábitos saludables recomendados"`
- **Insignia de fecha:** Badge con la fecha actual del sistema (ej. `"Hoy: Lunes 14 de Septiembre, 2026"`).

---

### 3.2 Tarjetas de Resumen Diario (Grid de 3 Cards)

| Métrica | Ícono | Valor Ejemplo | Detalle | Color |
|---|---|---|---|---|
| **Apego General** | `TrendingUp` | `85%` | `Excelente constancia hoy` | Verde GoHealthy (`#2F6B4E`) |
| **Comidas del Día** | `Utensils` | `4 / 5` | `Falta registrar Cena` | Lima (`#ABB748`) |
| **Hidratación** | `Droplets` | `1.8 / 2.2 L` | `82% de tu meta hídrica` | Azul / Celeste (`sky-600`) |

---

### 3.3 Checklist Diario de Comidas del Plan
Cada tiempo de comida del plan cuenta con una tarjeta interactiva:
- **Desayuno** (`07:30 - 08:30`)
- **Colación Matutina** (`11:00 - 11:30`)
- **Comida** (`14:00 - 15:00`)
- **Colación Vespertina** (`17:30 - 18:00`)
- **Cena** (`20:30 - 21:30`)

**Elementos de cada tarjeta:**
- Ícono distintivo del tiempo de comida (`Coffee`, `Apple`, `Sun`, `Utensils`, `Moon`).
- Nombre del tiempo y horario sugerido.
- Resumen del menú asignado por el nutriólogo en un bloque `bg-muted/40`.
- **Botón/Checkbox de estado:**
  - Alterna entre `Cumplido conforme al plan` (marcado con verde y check) y `Pendiente` (desmarcado).
  - Al interactuar, actualiza inmediatamente el porcentaje de apego del día.

---

### 3.4 Registro Interactivo de Hidratación (Consumo de Agua)
- Card destacada con título `"Requerimiento Hídrico Diario"`.
- Meta asignada por el nutriólogo: `2.2 L al día` (~9 vasos de 250 ml).
- Cantidad actual consumida (ej. `1.75 L / 2.2 L`).
- Barra de progreso visual con porcentaje.
- Botones de acción rápida:
  - `+1 Vaso (250 ml)`: Añade un vaso al contador.
  - `-1 Vaso (250 ml)`: Resta un vaso en caso de corrección.
  - Mensaje motivacional cuando se alcanza o supera la meta (ej. `"¡Meta de agua completada! 💧"`).

---

### 3.5 Hábitos y Recomendaciones del Nutriólogo
Checklist interactivo de hábitos específicos asignados por el Dr. Carlos Mendoza:
1. `Caminata de 15 a 20 minutos después de comer` (`Footprints`)
2. `Evitar alimentos ultraprocesados y refrescos` (`ShieldCheck`)
3. `Consumir ensalada verde antes del plato fuerte` (`Salad`)
4. `Dormir mínimo 7 horas de descanso reparador` (`Moon`)

Cada hábito puede marcarse como completado en el día, sumando puntos al apego general.

---

### 3.6 Resumen Semanal de Consistencia (Mini Calendario)
- Barra visual que muestra los 7 días de la semana actual (Lunes a Domingo).
- Cada día muestra:
  - Inicial del día (L, M, M, J, V, S, D).
  - Porcentaje de apego alcanzado en ese día.
  - Color distintivo: Verde oscuro (`>= 80%`), Verde lima (`60% - 79%`), Amarillo (`< 60%`), Gris (`Días futuros`).

---

## 4. Estructura de Archivos

```
src/
  features/
    paciente/
      components/
        PacienteCumplimiento.jsx      # [NUEVO] Componente con checklist de comidas, hidratación y hábitos
      data/
        mock-data.js                  # [MODIFICAR] Agregar cumplimientoPacienteMock con actividades y datos diarios

  pages/
    paciente/
      PacienteCumplimientoPage.jsx    # [NUEVO] Página delgada que inyecta los datos de actividades

  app/
    router.jsx                        # [MODIFICAR] Reemplazar placeholder por PacienteCumplimientoPage
```

---

## 5. Datos Mock (`src/features/paciente/data/mock-data.js`)

```javascript
export const cumplimientoPacienteMock = {
  fechaHoy: '14 de Septiembre, 2026',
  rachaDias: 6,
  metaAguaLitros: 2.2,
  comidas: [
    {
      id: 'desayuno',
      titulo: 'Desayuno',
      horario: '07:30 - 08:30',
      menu: 'Omelette de 2 claras y 1 huevo entero con espinacas y jitomate + 1 rebanada de pan integral tostado + 1/2 taza de papaya.',
      completado: true,
    },
    {
      id: 'colacion1',
      titulo: 'Colación Matutina',
      horario: '11:00 - 11:30',
      menu: '1 manzana verde con 10 almendras naturales.',
      completado: true,
    },
    {
      id: 'comida',
      titulo: 'Comida',
      horario: '14:00 - 15:00',
      menu: '150g de pechuga de pollo a la plancha + 1 taza de quinoa o arroz integral + ensalada verde abundante con 1 cda de aceite de oliva.',
      completado: true,
    },
    {
      id: 'colacion2',
      titulo: 'Colación Vespertina',
      horario: '17:30 - 18:00',
      menu: '1 taza de yogur griego sin azúcar con 1 cucharada de semillas de chía.',
      completado: true,
    },
    {
      id: 'cena',
      titulo: 'Cena',
      horario: '20:30 - 21:30',
      menu: 'Ensalada de atún en agua con nopales, jitomate, cebolla morada y 1/3 de aguacate.',
      completado: false,
    },
  ],
  vasosAguaConsumidos: 7, // 7 * 0.25 = 1.75 L
  habitos: [
    { id: 'h1', titulo: 'Caminata de 15 a 20 minutos después de comer', completado: true },
    { id: 'h2', titulo: 'Evitar alimentos ultraprocesados y refrescos azucarados', completado: true },
    { id: 'h3', titulo: 'Consumir ensalada verde o verduras antes de la proteína', completado: true },
    { id: 'h4', titulo: 'Dormir al menos 7 horas de descanso reparador', completado: false },
  ],
  consistenciaSemanal: [
    { dia: 'Lun', fecha: '08 Sep', apego: 88, estado: 'alto' },
    { dia: 'Mar', fecha: '09 Sep', apego: 92, estado: 'alto' },
    { dia: 'Mié', fecha: '10 Sep', apego: 85, estado: 'alto' },
    { dia: 'Jue', fecha: '11 Sep', apego: 78, estado: 'medio' },
    { dia: 'Vie', fecha: '12 Sep', apego: 90, estado: 'alto' },
    { dia: 'Sáb', fecha: '13 Sep', apego: 82, estado: 'alto' },
    { dia: 'Dom', fecha: '14 Sep', apego: 85, estado: 'hoy' },
  ],
}
```

---

## 6. Cambios en `router.jsx`

Reemplazar la ruta placeholder de `cumplimiento`:

```diff
- import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacienteCumplimientoPage from '@/pages/paciente/PacienteCumplimientoPage'

  // En children de /paciente:
- { path: 'cumplimiento', element: <PacientePlaceholderPage titulo="Cumplimiento de Actividades" /> },
+ { path: 'cumplimiento', element: <PacienteCumplimientoPage /> },
```

---

## 7. Qué NO hacer

- **No inventar endpoints reales.** Toda la interactividad de marcar casillas y agregar agua se maneja de forma reactiva con el estado de React (`useState`).
- **No romper la coherencia cromática de GoHealthy.** Respetar los colores corporativos (`#2F6B4E`, `#ABB748`, `#EFEBE7`, `bg-card`, etc.).
- **No modificar archivos de la feature del nutriólogo** (`src/features/nutricionista/*`).
- **No modificar componentes base de `src/components/ui/*`.**

---

## 8. Criterios de Aceptación

- [x] La página se renderiza en `/paciente/cumplimiento` con el sidebar del paciente activo y la opción "Cumplimiento de Actividades" resaltada.
- [x] Muestra las 3 tarjetas de resumen diario con indicadores de Apego General (%), Comidas completadas e Hidratación.
- [x] El checklist de las 5 comidas permite marcar y desmarcar cada tiempo, recalculando el porcentaje de apego en tiempo real.
- [x] La sección de hidratación cuenta con contador visual de vasos, barra de progreso y botones para sumar o restar agua (250 ml por vaso).
- [x] El checklist de hábitos recomendados permite marcar hábitos cumplidos con actualización visual inmediata.
- [x] El bloque de consistencia semanal muestra el progreso de los 7 días de la semana con colores acordes al porcentaje.
- [x] La página es responsiva y se visualiza correctamente en dispositivos móviles y de escritorio.
- [x] `pnpm lint` pasa con 0 errores.
- [x] `pnpm build` compila con éxito.

---

## 9. Verificación

```bash
pnpm lint
pnpm build
```

**Verificación visual:**
Navegar a `http://localhost:5173/paciente/cumplimiento` para validar:
1. Renderizado de las 4 tarjetas de resumen y su cálculo de apego.
2. Interacción con los checkboxes de comidas y hábitos.
3. Botones para agregar vasos de agua e incremento de la barra de hidratación.
4. Coherencia de colores de la paleta GoHealthy.
