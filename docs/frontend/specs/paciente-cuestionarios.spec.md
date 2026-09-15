# Spec: Página de Cuestionarios del Paciente (`PacienteCuestionariosPage`)

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟢 Implementado  
> **Autor:** Leo  
> **Fecha:** 2026-09-14  
> **Depende de:** [paciente-sidebar.spec.md](./paciente-sidebar.spec.md) ✅

---

## 1. Objetivo

Crear la página de **Cuestionarios del Paciente** (`/paciente/cuestionarios`), permitiendo al paciente responder evaluaciones periódicas diseñadas para que su nutriólogo (Dr. Carlos Mendoza) monitoree su bienestar psicológico, relación con la comida y satisfacción con el plan nutricional asignado.

La página presenta:
1. **Selector de cuestionarios:** Dos opciones principales (**Cuestionario Psicológico y Bienestar** y **Cuestionario Alimenticio y Hábitos**).
2. **Flujo interactivo de respuesta:** Al seleccionar uno, se despliegan sus **5 preguntas estructuradas** con opciones de respuesta claras, barra de avance y botón de envío.
3. **Confirmación de envío:** Estado de éxito con retroalimentación visual informando que las respuestas se compartieron con el nutriólogo.

---

## 2. Contexto y Experiencia de Usuario

En el tratamiento nutricional de GoHealthy, el éxito del paciente depende tanto del aspecto físico como del bienestar emocional y la adherencia alimenticia. Esta pantalla permite levantar información cualitativa periódica sin abrumar al paciente, dividiendo la evaluación en dos ejes temáticos claros de 5 preguntas cada uno.

### Flujo de Estados de la Vista

```mermaid
graph TD
    A[Selector de Cuestionarios] -->|Click en Psicológico| B[Formulario: Cuestionario Psicológico (5 preguntas)]
    A -->|Click en Alimenticio| C[Formulario: Cuestionario Alimenticio (5 preguntas)]
    B -->|Volver sin enviar| A
    C -->|Volver sin enviar| A
    B -->|Completar y Enviar| D[Pantalla de Confirmación y Éxito]
    C -->|Completar y Enviar| D
    D -->|Finalizar| A
```

---

## 3. Especificación de la Interfaz

### 3.1 Vista Inicial: Selector de Cuestionarios

- **Encabezado:**
  - Título: `"Cuestionarios de Seguimiento"`
  - Subtítulo: `"Selecciona una evaluación para compartir tus sensaciones, hábitos y estado de ánimo con tu nutriólogo"`
- **Grid de 2 Tarjetas Interactivas:**

| Cuestionario | Ícono | Descripción | Preguntas | Botón de Acción |
|---|---|---|---|---|
| **Cuestionario Psicológico y Bienestar** | `Brain` | Evalúa tu relación con la comida, niveles de ansiedad, estrés diario y motivación durante tu proceso. | 5 preguntas (~3 min) | `"Comenzar Cuestionario"` |
| **Cuestionario Alimenticio y Hábitos** | `UtensilsCrossed` | Evalúa tu saciedad, qué alimentos consumes con mayor frecuencia y cómo te sientes con las comidas asignadas. | 5 preguntas (~3 min) | `"Comenzar Cuestionario"` |

---

### 3.2 Vista del Cuestionario Activo (5 Preguntas)

- **Barra Superior de Navegación:**
  - Botón `"Volver a cuestionarios"` con ícono `ArrowLeft`.
  - Título del cuestionario en curso e insignia con el contador de preguntas contestadas (`X de 5 respondidas`).
  - Barra de progreso interactiva (`Progress` de shadcn) que avanza conforme el paciente responde.
- **Formulario de Preguntas:**
  - Cada pregunta se presenta dentro de una tarjeta (`Card`) con borde sutil y tipografía legible.
  - Opciones de selección en formato de botones tipo tarjeta o pills con estados `hover` y `active` destacados en verde GoHealthy (`#2F6B4E`).

#### Preguntas del Cuestionario Psicológico:
1. **Ansiedad y hambre emocional:** *¿Con qué frecuencia experimentas deseos de comer motivados por estrés, aburrimiento o ansiedad en lugar de hambre física?*  
   - Opciones: `Nunca o casi nunca` | `Raras veces (1-2 veces por semana)` | `Frecuentemente (3-4 veces)` | `Casi todos los días`
2. **Nivel de energía y ánimo:** *¿Cómo describirías tu nivel de energía y estado de ánimo general a lo largo de esta semana?*  
   - Opciones: `Excelente y constante` | `Bueno con altibajos normales` | `Regular, me siento cansado(a)` | `Bajo, con poca motivación`
3. **Estrés asociado al plan:** *¿Qué tanto estrés o presión te genera seguir las porciones y horarios del plan alimenticio?*  
   - Opciones: `Ningún estrés, es muy fácil de llevar` | `Estrés leve o manejable` | `Moderado, me cuesta organizarme` | `Mucho estrés o frustración`
4. **Respuesta ante días difíciles:** *Cuando enfrentas un día emocionalmente pesado, ¿cómo reaccionas respecto a tu alimentación?*  
   - Opciones: `Mantengo mi plan sin problemas` | `Como un poco más de lo habitual` | `Busco alimentos dulces o ultraprocesados` | `Pierdo el apetito por completo`
5. **Satisfacción con tus avances:** *¿Qué tan motivado(a) y satisfecho(a) te sientes con los cambios físicos y emocionales experimentados hasta hoy?*  
   - Opciones: `Muy motivado(a) y satisfecho(a)` | `Satisfecho(a), voy a buen ritmo` | `Poco satisfecho(a), esperaba más` | `Desmotivado(a)`

#### Preguntas del Cuestionario Alimenticio:
1. **Sensación de saciedad:** *¿Cómo calificarías tu nivel de saciedad después de las comidas principales?*  
   - Opciones: `Quedo perfectamente satisfecho(a)` | `Quedo bien, pero con antojo ligero` | `Siento que me quedo con hambre` | `Quedo demasiado lleno(a)`
2. **Aceptación de alimentos:** *¿Qué tan atractivos y apetecibles te resultan los platillos e ingredientes recomendados en tu plan?*  
   - Opciones: `Me encantan todos los platillos` | `La mayoría me gustan` | `Algunos no son de mi agrado` | `Me cuesta mucho tolerar las comidas`
3. **Tiempos de comida con mayor apetito:** *¿En qué momento del día sueles experimentar mayor apetito o dificultad para controlar porciones?*  
   - Opciones: `Por la mañana (Desayuno)` | `A media mañana (Colación 1)` | `Por la tarde (Comida/Colación 2)` | `Por la noche (Cena)`
4. **Alimentos más consumidos fuera de plan:** *Si has consumido alimentos adicionales a los marcados en tu plan, ¿cuáles han sido con mayor frecuencia?*  
   - Opciones: `No he comido nada fuera del plan` | `Frutas, nueces o semillas extras` | `Pan dulce, galletas o botanas saladas` | `Bebidas azucaradas o alcohol`
5. **Preparación y practicidad:** *¿Qué tan práctica te ha parecido la preparación de tus comidas en tu día a día?*  
   - Opciones: `Muy práctica y rápida` | `Manejable con algo de planeación` | `Complicada por falta de tiempo` | `Muy difícil de compaginar con mi trabajo/estudio`

- **Botón de Envío:**
  - Botón `"Enviar respuestas a mi nutriólogo"` con ícono `CheckCircle`.
  - Deshabilitado o con advertencia visual si faltan preguntas por responder.

---

### 3.3 Vista de Confirmación y Éxito
- Tarjeta de éxito centrada con ícono decorativo `Sparkles` / `CheckCircle` en verde corporativo (`#2F6B4E`).
- Título: `"¡Cuestionario completado con éxito!"`
- Mensaje: `"Tus respuestas se han guardado y sincronizado con el expediente del Dr. Carlos Mendoza. Serán tomadas en cuenta para los ajustes de tu próxima consulta."`
- Botón `"Volver a cuestionarios"` para regresar al selector inicial.

---

## 4. Estructura de Archivos

```
src/
  features/
    paciente/
      components/
        PacienteCuestionarios.jsx       # [NUEVO] Componente con selector, formularios y estado de éxito
      data/
        mock-data.js                    # [MODIFICAR] Agregar cuestionariosPacienteMock con preguntas y opciones

  pages/
    paciente/
      PacienteCuestionariosPage.jsx     # [NUEVO] Página delgada que inyecta los datos mock

  app/
    router.jsx                          # [MODIFICAR] Reemplazar placeholder por PacienteCuestionariosPage
```

---

## 5. Datos Mock (`src/features/paciente/data/mock-data.js`)

```javascript
export const cuestionariosPacienteMock = {
  psicologico: {
    id: 'psicologico',
    titulo: 'Cuestionario Psicológico y Bienestar',
    descripcion: 'Monitorea tu relación con la comida, estrés, niveles de energía y motivación.',
    tiempoMinutos: 3,
    preguntas: [
      {
        id: 'p1',
        pregunta: '¿Con qué frecuencia experimentas deseos de comer motivados por estrés, aburrimiento o ansiedad en lugar de hambre física?',
        opciones: ['Nunca o casi nunca', 'Raras veces (1-2 veces por semana)', 'Frecuentemente (3-4 veces)', 'Casi todos los días'],
      },
      {
        id: 'p2',
        pregunta: '¿Cómo describirías tu nivel de energía y estado de ánimo general a lo largo de esta semana?',
        opciones: ['Excelente y constante', 'Bueno con altibajos normales', 'Regular, me siento cansado(a)', 'Bajo, con poca motivación'],
      },
      {
        id: 'p3',
        pregunta: '¿Qué tanto estrés o presión te genera seguir las porciones y horarios del plan alimenticio?',
        opciones: ['Ningún estrés, es muy fácil de llevar', 'Estrés leve o manejable', 'Moderado, me cuesta organizarme', 'Mucho estrés o frustración'],
      },
      {
        id: 'p4',
        pregunta: 'Cuando enfrentas un día emocionalmente pesado, ¿cómo reaccionas respecto a tu alimentación?',
        opciones: ['Mantengo mi plan sin problemas', 'Como un poco más de lo habitual', 'Busco alimentos dulces o ultraprocesados', 'Pierdo el apetito por completo'],
      },
      {
        id: 'p5',
        pregunta: '¿Qué tan motivado(a) y satisfecho(a) te sientes con los cambios físicos y emocionales experimentados hasta hoy?',
        opciones: ['Muy motivado(a) y satisfecho(a)', 'Satisfecho(a), voy a buen ritmo', 'Poco satisfecho(a), esperaba más', 'Desmotivado(a)'],
      },
    ],
  },
  alimenticio: {
    id: 'alimenticio',
    titulo: 'Cuestionario Alimenticio y Hábitos',
    descripcion: 'Evalúa tu saciedad, preferencias de alimentos y practicidad en la preparación de platillos.',
    tiempoMinutos: 3,
    preguntas: [
      {
        id: 'a1',
        pregunta: '¿Cómo calificarías tu nivel de saciedad después de las comidas principales?',
        opciones: ['Quedo perfectamente satisfecho(a)', 'Quedo bien, pero con antojo ligero', 'Siento que me quedo con hambre', 'Quedo demasiado lleno(a)'],
      },
      {
        id: 'a2',
        pregunta: '¿Qué tan atractivos y apetecibles te resultan los platillos e ingredientes recomendados en tu plan?',
        opciones: ['Me encantan todos los platillos', 'La mayoría me gustan', 'Algunos no son de mi agrado', 'Me cuesta mucho tolerar las comidas'],
      },
      {
        id: 'a3',
        pregunta: '¿En qué momento del día sueles experimentar mayor apetito o dificultad para controlar porciones?',
        opciones: ['Por la mañana (Desayuno)', 'A media mañana (Colación 1)', 'Por la tarde (Comida/Colación 2)', 'Por la noche (Cena)'],
      },
      {
        id: 'a4',
        pregunta: 'Si has consumido alimentos adicionales a los marcados en tu plan, ¿cuáles han sido con mayor frecuencia?',
        opciones: ['No he comido nada fuera del plan', 'Frutas, nueces o semillas extras', 'Pan dulce, galletas o botanas saladas', 'Bebidas azucaradas o alcohol'],
      },
      {
        id: 'a5',
        pregunta: '¿Qué tan práctica te ha parecido la preparación de tus comidas en tu día a día?',
        opciones: ['Muy práctica y rápida', 'Manejable con algo de planeación', 'Complicada por falta de tiempo', 'Muy difícil de compaginar con mi trabajo/estudio'],
      },
    ],
  },
}
```

---

## 6. Cambios en `router.jsx`

Reemplazar la ruta placeholder de `cuestionarios`:

```diff
- import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacienteCuestionariosPage from '@/pages/paciente/PacienteCuestionariosPage'

  // En children de /paciente:
- { path: 'cuestionarios', element: <PacientePlaceholderPage titulo="Cuestionarios" /> },
+ { path: 'cuestionarios', element: <PacienteCuestionariosPage /> },
```

---

## 7. Qué NO hacer

- **No inventar endpoints reales ni dependencias externas para formularios.** Se resuelve de manera nativa y reactiva con React y `useState`.
- **No mezclar ambos cuestionarios en un solo formulario largo.** El usuario debe poder elegir cuál responder independientemente.
- **No romper la coherencia cromática.** Utilizar la paleta de tokens oficial (`#2F6B4E`, `#ABB748`, `#EFEBE7`, `bg-card`, etc.).
- **No modificar archivos de la feature del nutriólogo** (`src/features/nutricionista/*`).
- **No modificar componentes base de `src/components/ui/*`.**

---

## 8. Criterios de Aceptación

- [x] La página se renderiza en `/paciente/cuestionarios` con el sidebar del paciente activo y la opción "Cuestionarios" resaltada.
- [x] La vista inicial muestra las 2 opciones claramente diferenciadas (Psicológico y Alimenticio).
- [x] Al hacer clic en "Comenzar Cuestionario", se despliega la pantalla con las 5 preguntas del cuestionario seleccionado.
- [x] La barra superior incluye botón para volver al menú de cuestionarios y un contador con barra de progreso.
- [x] Cada pregunta permite seleccionar una opción mediante una interfaz accesible y con feedback visual de selección.
- [x] El botón de enviar valida que las 5 preguntas estén respondidas.
- [x] Al enviar, se muestra la pantalla de confirmación/éxito con mensaje de agradecimiento y botón para volver.
- [x] La página es responsiva y respeta la paleta beige y verde de GoHealthy.
- [x] `pnpm lint` pasa con 0 errores.
- [x] `pnpm build` compila con éxito.

---

## 9. Verificación

```bash
pnpm lint
pnpm build
```

**Verificación visual:**
Navegar a `http://localhost:5173/paciente/cuestionarios` para validar:
1. Selector de los 2 cuestionarios.
2. Navegación al cuestionario psicológico (5 preguntas) y respuesta interactiva.
3. Navegación al cuestionario alimenticio (5 preguntas) y respuesta interactiva.
4. Flujo de envío y pantalla de éxito.
