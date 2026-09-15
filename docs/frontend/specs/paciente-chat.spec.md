# Spec: Página Chat del Paciente con el Nutriólogo (`PacienteChatPage`)

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟢 Implementado  
> **Autor:** Leo  
> **Fecha:** 2026-09-14  
> **Depende de:** [paciente-sidebar.spec.md](./paciente-sidebar.spec.md) ✅

---

## 1. Objetivo

Crear la página de **Chat del Paciente** (`/paciente/chat`) para permitir la comunicación bidireccional directa entre el paciente autenticado y su nutriólogo asignado (Dr. Carlos Mendoza).

A diferencia de la vista del nutriólogo (que gestiona múltiples conversaciones mediante una lista lateral), la vista del paciente consta **exclusivamente de una ventana de conversación directa a pantalla completa**, conservando la misma línea gráfica, esquema de colores (paleta GoHealthy con verdes y beige) y componentes reutilizables.

---

## 2. Contexto y Comparativa con el Chat del Nutriólogo

El nutriólogo cuenta actualmente con una vista de chat en [`NutricionistaChatPage.jsx`](../../../src/pages/nutricionista/NutricionistaChatPage.jsx) compuesta por:
- [`ChatListaConversaciones.jsx`](../../../src/features/nutricionista/components/ChatListaConversaciones.jsx) (columna lateral para buscar pacientes).
- [`ChatVentanaConversacion.jsx`](../../../src/features/nutricionista/components/ChatVentanaConversacion.jsx) (área de mensajes y cabecera del paciente).
- [`ChatInputMensaje.jsx`](../../../src/features/nutricionista/components/ChatInputMensaje.jsx) (barra inferior para escribir mensajes).
- [`ChatEstadoVacio.jsx`](../../../src/features/nutricionista/components/ChatEstadoVacio.jsx) (cuando no hay paciente seleccionado).

### Diferencias clave: Nutriólogo vs Paciente

| Aspecto | Vista Nutriólogo (`/nutriologo/chat`) | Vista Paciente (`/paciente/chat`) |
|---------|---------------------------------------|-----------------------------------|
| **Estructura** | 2 columnas (lista de chats + ventana) | **1 columna completa** (solo la ventana de chat) |
| **Lista de conversaciones** | Sí (con buscador y lista de pacientes) | **No** (el paciente solo habla con su nutriólogo) |
| **Cabecera** | Muestra datos del paciente seleccionado + botón "Volver" en móvil | Muestra datos del nutriólogo (Dr. Carlos Mendoza, especialidad) |
| **Remitente propio** | `nutriologo` (mensajes a la derecha en verde primary) | `paciente` (mensajes a la derecha en verde primary) |
| **Remitente externo** | `paciente` (mensajes a la izquierda en card beige) | `nutriologo` (mensajes a la izquierda en card beige) |
| **Botón Volver** | Presente en móviles (`md:hidden`) | **Innecesario** (no existe pantalla de lista a la que volver) |
| **Placeholder input** | "Escribe un mensaje para [Paciente]..." | "Escribe un mensaje para tu nutriólogo..." |

---

## 3. Especificación de la Interfaz

### 3.1 Contenedor Principal
- Altura adaptable consistente con el layout: `h-[calc(100svh-6rem)] md:h-[calc(100svh-4.5rem)]`.
- Contenedor con borde y esquinas redondeadas: `rounded-2xl md:rounded-3xl border border-border/70 bg-card shadow-xs overflow-hidden flex flex-col`.
- Ocupa el ancho completo disponible en el área de contenido (`<main>`).

### 3.2 Cabecera del Chat
- Fondo `bg-card` con borde inferior `border-b border-border/60`.
- **Avatar del Nutriólogo:**
  - Círculo de tamaño `size-10 shrink-0`.
  - Fondo `bg-primary/20 text-primary border border-primary/30 font-heading font-semibold text-xs`.
  - Iniciales `"CM"` o icono `UserCheck` / `User`.
- **Información del Nutriólogo:**
  - Nombre: `"Dr. Carlos Mendoza"` (`text-sm font-semibold text-foreground`).
  - Especialidad / Estado: `"Nutrición Clínica y Deportiva"` con un punto indicador verde o badge sutil (`text-xs text-muted-foreground`).

### 3.3 Historial de Mensajes (Área de scroll)
- Contenedor con `flex-1 overflow-y-auto p-4 space-y-4 bg-background/50`.
- Auto-scroll automático hacia abajo (`scrollTop = scrollHeight`) al cargar o enviar un nuevo mensaje.
- **Separador de fecha:**
  - Badge centrado con texto `"Hoy"` (`text-[11px] font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/40`).
- **Burbujas de Mensajes:**
  - **Mensajes enviados por el paciente (usuario actual):**
    - Alineados a la derecha (`items-end`).
    - Fondo verde olivo corporativo `bg-primary text-primary-foreground rounded-2xl rounded-tr-xs shadow-2xs`.
    - Hora en la esquina inferior derecha con icono `Clock` (`text-primary-foreground/75`).
  - **Mensajes recibidos del nutriólogo:**
    - Alineados a la izquierda (`items-start`).
    - Fondo de tarjeta beige claro `bg-card border border-border/60 text-foreground rounded-2xl rounded-tl-xs shadow-2xs`.
    - Hora en la esquina inferior derecha con icono `Clock` (`text-muted-foreground`).
- **Estado vacío (si no hubiera mensajes):**
  - Mensaje ilustrativo invitando al paciente a consultar cualquier duda con su nutriólogo.

### 3.4 Barra de Entrada de Mensajes
- Fijada en la parte inferior con borde superior `border-t border-border/60 bg-card p-3`.
- Input de texto con placeholder `"Escribe un mensaje para tu nutriólogo..."`.
- Botón de envío (`Button` con icono `Send`), habilitado únicamente cuando el input contiene texto no vacío.
- Soporte para enviar con la tecla `Enter`.

---

## 4. Estructura de Archivos

```
src/
  features/
    paciente/
      components/
        PacienteChat.jsx              # [NUEVO] Ventana completa de chat del paciente
      data/
        mock-data.js                  # [MODIFICAR] Agregar conversación mock con el nutriólogo

  pages/
    paciente/
      PacienteChatPage.jsx            # [NUEVO] Página delgada que envuelve PacienteChat

  app/
    router.jsx                        # [MODIFICAR] Reemplazar placeholder por PacienteChatPage
```

---

## 5. Datos Mock y Estado

### 5.1 Datos Mock en `src/features/paciente/data/mock-data.js`

```javascript
// Conversación mock entre el paciente actual y su nutriólogo
export const chatPacienteMock = {
  nutriologo: {
    nombre: 'Dr. Carlos Mendoza',
    especialidad: 'Nutrición Clínica y Deportiva',
    iniciales: 'CM',
    enLinea: true,
  },
  mensajes: [
    {
      id: 1,
      remitente: 'nutriologo',
      texto: '¡Hola María! ¿Cómo te has sentido estos primeros días con tu nuevo plan alimenticio?',
      hora: '09:15 AM',
    },
    {
      id: 2,
      remitente: 'paciente',
      texto: 'Hola Dr. Carlos, bastante bien. Solo tenía una duda con la colación vespertina.',
      hora: '09:30 AM',
    },
    {
      id: 3,
      remitente: 'paciente',
      texto: '¿Puedo sustituir el yogur griego por kéfir sin azúcar si no encuentro en el súper?',
      hora: '09:31 AM',
    },
    {
      id: 4,
      remitente: 'nutriologo',
      texto: '¡Sin problema! El kéfir natural sin azúcar tiene un aporte probiótico y proteico muy similar. Adelante con ese cambio.',
      hora: '09:42 AM',
    },
  ],
}
```

### 5.2 Manejo del Estado Local

El componente `PacienteChat` mantendrá un estado local para la lista de mensajes (`mensajes`), permitiendo añadir nuevos mensajes enviados por el paciente de forma reactiva con la hora actual:

```javascript
const [mensajes, setMensajes] = useState(chatInicial.mensajes)

const handleEnviarMensaje = (texto) => {
  const ahora = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const nuevo = {
    id: Date.now(),
    remitente: 'paciente',
    texto,
    hora: ahora,
  }

  setMensajes((prev) => [...prev, nuevo])
}
```

---

## 6. Cambios en `router.jsx`

Reemplazar la ruta placeholder de `chat`:

```diff
- import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacientePlaceholderPage from '@/pages/paciente/PacientePlaceholderPage'
+ import PacienteChatPage from '@/pages/paciente/PacienteChatPage'

  // En children de /paciente:
- { path: 'chat', element: <PacientePlaceholderPage titulo="Chat" /> },
+ { path: 'chat', element: <PacienteChatPage /> },
```

---

## 7. Qué NO hacer

- **No incluir lista de conversaciones ni buscador de pacientes.** El paciente no tiene múltiples chats.
- **No incluir botón de "Volver" ni pantallas condicionales.** Toda la página es la ventana activa de chat.
- **No inventar librerías de sockets ni dependencias nuevas.** Se gestiona con estado local de React (`useState`, `useRef`).
- **No modificar componentes de la feature del nutriólogo** (`src/features/nutricionista/*`).
- **No modificar componentes base de `src/components/ui/*`.**
- **No romper la consistencia de colores.** Utilizar las clases semánticas de Tailwind (`bg-card`, `bg-primary`, `text-primary-foreground`, `border-border/60`, etc.).

---

## 8. Criterios de Aceptación

- [x] La página se renderiza en `/paciente/chat` con el sidebar del paciente activo.
- [x] La interfaz se presenta en una sola ventana de chat a pantalla completa (sin lista de chats laterales).
- [x] La cabecera muestra el nombre del Dr. Carlos Mendoza, su especialidad e iniciales.
- [x] Los mensajes previos se visualizan con scroll vertical y diferenciación clara:
  - Mensajes del paciente a la derecha en color verde corporativo (`bg-primary`).
  - Mensajes del nutriólogo a la izquierda en color de tarjeta beige (`bg-card`).
- [x] El paciente puede escribir un mensaje en el campo inferior y enviarlo mediante el botón o la tecla Enter.
- [x] El nuevo mensaje se añade al final de la conversación y el scroll se desplaza automáticamente hacia el último mensaje.
- [x] `pnpm lint` pasa sin errores.
- [x] `pnpm build` pasa sin errores.

---

## 9. Verificación

```bash
pnpm lint
pnpm build
```

**Verificación visual:**
Navegar a `http://localhost:5173/paciente/chat` para validar:
1. Vista completa de la conversación sin barra lateral izquierda de selección de pacientes.
2. Cabecera correcta con los datos del Dr. Carlos Mendoza.
3. Envío funcional de mensajes y posicionamiento correcto de las burbujas.
4. Coherencia de colores con la paleta general de GoHealthy.
