# Spec: Conexión del front con la API de GoHealthy

> **Metodología:** SDD — Spec-First  
> **Estado:** 🟡 Pendiente (para la fase de arreglo del front)  
> **Fecha:** 2026-11-05  
> **Contrato basado en:** `main` de `gohealthy-back`. Si el back cambia, hay que actualizar este spec y `docs/backend/README.md`.

---

## 1. Objetivo

Reemplazar los datos mock por la API real, con una sola forma de autenticar, llamar a la API y manejar errores.

Hoy, en `develop`:

- Ninguna pantalla usa la API.
- Todos los datos salen de `features/*/data/mock-data.js`.
- `LoginForm` navega siempre a `/paciente`, sin validar credenciales.
- Las rutas `/nutriologo` y `/paciente` no están protegidas.
- `VITE_API_URL` no incluye `/api`.

### Qué NO hace este spec

- No rediseña pantallas ni define su aspecto final.
- No agrega más dependencias que `@hookform/resolvers`. Se usa `fetch`, como en clase.
- No inventa endpoints. Lo que falta está en la sección 9 y hay que decidirlo con el equipo.

---

## 2. Configuración

```
VITE_API_URL=http://localhost:3000/api
```

Actualizar también `.env.example`. El puerto debe coincidir con `PORT` en el `.env` del back, y `CLIENT_URL` del back debe ser la URL del front (`http://localhost:5173`).

Las imágenes **no** están bajo `/api`. La API regresa rutas relativas como `/images/recipes/tacos.webp`, así que hacen falta el host y esta función:

```js
// src/lib/image-url.js
const API_ORIGIN = new URL(import.meta.env.VITE_API_URL).origin

export const getImageUrl = (path) => (path ? `${API_ORIGIN}${path}` : null)
```

---

## 3. Sesión y cliente HTTP

### 3.1 Cliente

`apiFetch` en `src/api/client.js`, como el del proyecto de clase, es el único lugar que agrega el token y reacciona a una sesión vencida. El código está en el paso 1.5 de `docs/frontend/GUIA-FRONT.md`.

**El `401` del login es una excepción:** una contraseña incorrecta también responde `401`, y debe mostrarse como error del formulario, sin cerrar la sesión. `PUT /auth/change-password` con la contraseña actual incorrecta responde `400`, así que tampoco la cierra.

### 3.2 Estado de sesión

`AuthContext` en `src/context/AuthContext.jsx`, como en clase. Guarda el token y el usuario en `localStorage`:

```js
{ user, isAuthenticated, login, register, refreshUser, saveUser, logout }
```

Al recargar la página, si hay token, llamar a `GET /auth/me` para actualizar `user`. La sesión dura 8 horas por defecto.

### 3.3 A dónde lleva el login

`POST /auth/login` responde `{ token, user }`:

| Condición, en este orden | Destino |
|---|---|
| `user.role === 'nutritionist'` | `/nutriologo` |
| `user.mustChangePassword === true` | Pantalla nueva de cambio de contraseña |
| `user.onboardingCompleted === false` | Pantalla nueva de onboarding |
| Cualquier otro paciente | `/paciente` |

**El back solo exige el cambio de contraseña para completar el onboarding.** En los demás módulos, quien obliga a seguir este orden es el front.

### 3.4 Protección de rutas

Un `ProtectedRoute` como el de clase envuelve las rutas privadas en `App.jsx`:

- Sin sesión: lleva a `/auth/login`.
- Fuera de su área (otro rol, o un paciente que no ha terminado su primer ingreso): lleva a la página que le corresponde según `getHomePath`.

Es solo para la experiencia de uso. La seguridad real está en el back.

---

## 4. Convenciones de la API

### 4.1 Errores

Todos los errores traen `message` en español. Los de validación agregan `details`, cuyos textos vienen de Mongoose en inglés:

```json
{ "message": "Hay datos inválidos", "details": ["Path `weightKg` is required."] }
```

| Código | Significa | Qué hace el front |
|---|---|---|
| `400` | Datos inválidos | Mostrar `message` en el formulario |
| `401` | Sin sesión o vencida (o login incorrecto) | Ir al login (ver 3.1) |
| `403` | Ese rol no puede | Ocultar la acción. Si ocurre, mostrar `message` |
| `404` | No existe o no es de este usuario | Estado "no encontrado" |
| `409` | Duplicado (correo, encuesta del día) | Mostrar `message` |
| `502` | Falló el correo en *Reenviar acceso* | Mostrar `message` |
| `500` | Error del servidor | Mensaje genérico |

### 4.2 Trampas del contrato

1. **`id` y `_id`.** `user` de login, registro y `/auth/me` trae `id`. Todo lo demás trae `_id`.
2. **Los ids son texto.** Los mocks usan números. Quitar los `Number(pacienteId)`, como el de `AgendarCitaModal`.
3. **Fechas sin hora.** `date` de encuestas, y `birthDate` o `date` de mediciones si se mandan como `AAAA-MM-DD`, se guardan a las 00:00 UTC. Mostradas en hora local, en México aparecen **un día antes**. Formatearlas en UTC.
4. **Encuestas.** Mandar la fecha **local** del paciente como `AAAA-MM-DD`, nunca `new Date().toISOString()`, que en la noche ya da el día siguiente.
5. **Citas.** `dateTime` es un instante real: mandarlo en ISO con zona y mostrarlo en hora local.
6. **Reemplazos completos.** Mandar el objeto entero, porque lo que falte se borra:
   - `PUT /measurements/:id`: todos los campos, incluida la fecha.
   - `identification`, `pathologicalHistory` y similares en historia clínica y onboarding.
   - `measurements` en consultas.
   - `menu` y `distribution` en planes.
7. **Valores en inglés.** Traducir solo al mostrar:

| Campo | Valores en la API | En pantalla |
|---|---|---|
| `sex` | `female`, `male` | Femenino, Masculino |
| `appointment.status` | `scheduled`, `rescheduled`, `cancelled`, `completed` | Programada, Reprogramada, Cancelada, Completada |
| `mealTime` | `breakfast`, `morning-snack`, `lunch`, `afternoon-snack`, `dinner` | Desayuno, Colación Matutina, Comida, Colación Vespertina, Cena |
| `day` | `monday` … `sunday` | Lunes … Domingo |
| `adherence.status` | `green`, `yellow`, `red`, `no-data` | Verde, amarillo, rojo, gris |
| `alcoholConsumption` | `never`, `occasional`, `frequent` | Nunca, Ocasional, Frecuente |

### 4.3 Organización

Con la estructura de la guía (`docs/frontend/GUIA-FRONT.md`, paso 1.3):

- Una función por endpoint en `src/api/<recurso>.js`.
- Los datos que comparten varias pantallas, en un contexto de `src/context/`; los de una sola pantalla, en un hook de `src/hooks/` con `useEffect` (paso 1.9).
- Los formularios con React Hook Form y Zod, con los esquemas en `src/schemas/`.
- Las páginas siguen siendo delgadas.

---

## 5. Endpoints por módulo

"Nutri" es nutriólogo. Todo lo que no diga "Público" requiere token.

### 5.1 Autenticación

| Método y ruta | Quién | Cuerpo | Respuesta |
|---|---|---|---|
| `POST /auth/register` | Público | `firstName`, `paternalLastName`, `maternalLastName?`, `email`, `password`, `phone?`, `professionalLicense?` | `{ token, user }` |
| `POST /auth/login` | Público | `email`, `password` | `{ token, user }` |
| `GET /auth/me` | Ambos | — | `user` |
| `PUT /auth/me` | Ambos | Paciente: `firstName`, `paternalLastName`, `maternalLastName`, `phone`. El nutri además: `professionalLicense`, `specialty`, `university`, `officeAddress`, `bio` | `user` |
| `POST /auth/me/avatar` | Ambos | `FormData` con el campo `image` | `user` con `avatarUrl` |
| `GET /auth/me/nutritionist` | Paciente | — | Datos públicos de su nutriólogo: nombre, correo, teléfono, foto, cédula, especialidad, universidad, consultorio y biografía |
| `PUT /auth/change-password` | Ambos | `currentPassword`, `newPassword` | `{ message }` |
| `POST /auth/forgot-password` | Público | `email` | `{ message }` |
| `POST /auth/verify-otp` | Público | `email`, `code` | `{ message }` |
| `POST /auth/reset-password` | Público | `email`, `code`, `newPassword` | `{ message }` |

- La contraseña pide al menos 8 caracteres.
- El registro es solo para nutriólogos. `SignupForm` hoy pide `fullName`: debe separarlo en nombre y apellidos, y puede pedir la cédula.
- `PUT /auth/me` ignora cualquier otro campo, como `email`, `role` o `active`. Solo cambia lo que se manda.
- La foto de perfil acepta JPG, PNG o WebP de al menos 200x200 píxeles. Queda en 400x400, recortada al centro: conviene avisar que se recorta en cuadrado. Mostrarla con `getImageUrl(user.avatarUrl)`.
- El flujo de recuperación ya coincide con `/auth/recovery`. Hay que guardar el `code` para mandarlo también en `reset-password`.

### 5.2 Pacientes y expediente (solo nutri)

| Método y ruta | Uso | Respuesta |
|---|---|---|
| `GET /patients?search=&includeInactive=` | Panel | Lista de pacientes, cada uno con `adherence`, `lastConsultation`, `totalConsultations`, `currentWeightKg` y `weightGoalKg` |
| `POST /patients` | Alta | `{ patient, clinicalHistory, emailSent }` |
| `GET /patients/:id` | Expediente | `{ patient, clinicalHistory, adherence }` |
| `PUT /patients/:id` | Editar o desactivar | `patient` |
| `POST /patients/:id/resend-access` | Reenviar contraseña temporal | `{ message }` |
| `GET /patients/:id/clinical-history` | Historia clínica | `clinicalHistory` |
| `PUT /patients/:id/clinical-history` | Editar historia | `clinicalHistory` |
| `GET /patients/:id/adherence?days=7` | Semáforo | `{ score, status, days, surveysCount, components }` |

- **Alta:** `firstName`, `paternalLastName`, `maternalLastName?`, `email`, `phone?`, `birthDate?`, `sex?`, `reasonForVisit?`. Si `emailSent` es `false`, avisar y ofrecer *Reenviar acceso*.
- **Editar:** solo `firstName`, `paternalLastName`, `maternalLastName`, `phone`, `active`. Desactivar es `{ "active": false }`; no se borran pacientes.
- **Metas:** `weightGoalKg` y `bodyFatGoalPct` se editan con `PUT /patients/:id/clinical-history`. Solo el nutriólogo las pone; el onboarding las ignora.
- **Adherencia:** sin encuestas, `score` y `components` vienen `null`. Mostrar "basado en `surveysCount` de `days` días".

### 5.3 Onboarding (solo paciente)

| Método y ruta | Uso | Respuesta |
|---|---|---|
| `GET /onboarding` | Rellenar el formulario | `{ mustChangePassword, onboardingCompleted, clinicalHistory }` |
| `PUT /onboarding` | Guardar y completar | `{ message, clinicalHistory }` |

- Campos: `identification`, `goals`, `familyHistory`, `pathologicalHistory`, `nonPathologicalHistory`, `eatingHabits`, `gynecoObstetricHistory`.
- Responde `403` si aún tiene la contraseña temporal.
- Cargar con el `GET` y mandar `identification` completo, para no borrar lo que capturó el nutriólogo.
- Después de guardar, actualizar `user` con `GET /auth/me`.

### 5.4 Consultas (solo nutri)

| Método y ruta | Uso |
|---|---|
| `GET /consultations?patientId=` | Historial, de la más reciente a la más antigua |
| `GET /consultations/:id` | Detalle |
| `POST /consultations` | Registrar |
| `PUT /consultations/:id` | Editar |

Cuerpo: `patientId`, `appointmentId?`, `date?`, `measurements`, `energyCalculation`, `diagnosis`, `prognosis`, `instructions`, `notes`.

- El back calcula `measurements.bmi` si vienen `weightKg` y `heightCm`.
- Con `appointmentId`, la cita queda `completed` y ligada a la consulta.
- `energyCalculation` lo calcula el front: `formula` (`harris-benedict` o `mifflin-st-jeor`), `activityFactor`, `basalEnergyExpenditure`, `totalEnergyExpenditure`, `targetKcal`.
- `RegistrarSesionModal` debe mandar `peso` como `measurements.weightKg`, `grasaCorporal` como `measurements.bodyFatPct` y `nota` como `notes`.

### 5.5 Mediciones, encuestas y dashboard

El **paciente** nunca manda `patientId`: sale del token. El **nutriólogo** manda `?patientId=` para consultar, y solo funciona con sus pacientes.

| Método y ruta | Quién |
|---|---|
| `GET /measurements` | Ambos |
| `POST /measurements` | Paciente: `date?`, `weightKg`, `waistCm?`, `hipCm?`, `armCm?`, `bodyFatPct?`, `notes?` |
| `PUT /measurements/:id`, `DELETE /measurements/:id` | Paciente |
| `GET /wellness-surveys` | Ambos |
| `POST /wellness-surveys` | Paciente: `date`, `mood` (1–5), `sleepHours`, `waterGlasses`, `activityMinutes`, `planAdherence` (0–100), `comment?` |
| `GET /dashboard/progress?days=90` | Ambos |

- Una encuesta por día: la segunda responde `409`.
- El dashboard responde `{ days, measurements, weights, surveys, summary, goals }`, con las series ordenadas por fecha para Recharts:
  - `weights`: el peso de las mediciones del paciente **y** de las consultas, cada registro con `source` (`patient` o `consultation`). Es la serie para la gráfica de peso.
  - `summary`: `totalMeasurements`, `totalWeights`, `totalSurveys` y `weightChangeKg` del periodo (con `weights`).
  - `goals`: `initialWeightKg` (primer registro de peso de siempre, de medición o de consulta), `currentWeightKg` (el más reciente), `weightGoalKg`, `goalProgressPct` (0 a 100), `currentBodyFatPct` y `bodyFatGoalPct`. Lo que no exista viene en `null`.
- **Cumplimiento y cuestionarios usan esta misma encuesta.** *Cumplimiento* muestra cómo sigue el plan (`planAdherence`, más el semáforo de adherencia), y *Cuestionarios* el estado general (ánimo, sueño, agua, actividad). La racha de días se calcula en el front con las fechas de las encuestas.

### 5.6 Documentos de laboratorio

| Método y ruta | Quién | Nota |
|---|---|---|
| `GET /lab-documents` | Ambos | Nutri con `?patientId=` |
| `POST /lab-documents` | Ambos | `FormData`: `file`, `description?`, `studyDate?`. El nutri agrega `patientId` |
| `GET /lab-documents/:id/file` | Ambos | Binario |
| `DELETE /lab-documents/:id` | Ambos | Solo quien lo subió (`uploadedBy`) |

Se aceptan PDF, JPG y PNG de hasta 10 MB. **La descarga no funciona con un enlace**, porque `<a href>` no manda el token:

```js
await downloadFile(`/lab-documents/${doc._id}/file`, doc.originalName)
```

Usar `originalName` de la lista: el servidor no expone el nombre en los headers.

### 5.7 Citas

| Método y ruta | Quién | Nota |
|---|---|---|
| `GET /appointments?patientId=&from=&to=` | Ambos | Cada quien ve las suyas. Solo el nutri usa `patientId` |
| `GET /appointments/:id` | Ambos | |
| `POST /appointments` | Nutri | `patientId`, `dateTime`, `modality?`, `durationMin?`, `reason?`, `notes?` |
| `PUT /appointments/:id` | Nutri | `dateTime`, `modality`, `durationMin`, `reason`, `notes`, `status`. Solo cambia lo que se manda |

- `patient` y `nutritionist` vienen con su nombre en la lista y en el detalle. `POST` y `PUT` regresan solo sus ids.
- Cambiar `dateTime` deja la cita en `rescheduled` y avisa por correo. Cancelar es `{ "status": "cancelled" }`.
- Para el calendario, pedir solo el rango visible con `from` y `to`.
- El mock usa `fecha` y `hora` separadas: combinarlas en `dateTime` al enviar y separarlas al mostrar.
- `pacienteNombre` se arma con `patient.firstName` y `patient.paternalLastName`.

### 5.8 Mensajes

Funcionan como una bandeja de correo, no en tiempo real: los mensajes se guardan y aparecen al recargar o al volver a pedirlos.

`GET /messages/conversations` es la lista del nutriólogo: un elemento por paciente activo, con `patient` (nombre y `avatarUrl`), `lastMessage` (`body`, `subject`, `createdAt`, `senderRole`, o `null`) y `unread`. Viene ordenada por el mensaje más reciente.

| Método y ruta | Paciente | Nutri |
|---|---|---|
| `GET /messages` | Sin parámetros | `?patientId=` |
| `GET /messages/conversations` | — (`403`) | Sin parámetros |
| `GET /messages/unread-count` | Sin parámetros | Sin parámetros |
| `POST /messages` | `body`, `subject?` | `patientId`, `body`, `subject?` |
| `PUT /messages/read` | Sin parámetros | `?patientId=` |

El orden es del más viejo al más nuevo. Para saber de quién es cada mensaje, comparar `sender._id` con `user.id`, o usar `sender.role`. La hora sale de `createdAt`. Llamar a `PUT /messages/read` al abrir la conversación.

### 5.9 Catálogo SMAE

Ambos roles.

| Método y ruta | Respuesta |
|---|---|
| `GET /smae/groups` | 19 grupos: `key`, `category`, `name`, `subgroup`, `energyKcal`, `proteinG`, `lipidsG`, `carbohydratesG`, `imageUrl?` |
| `GET /smae/foods?search=&groupKey=&limit=` | Alimentos: `name`, `groupKey`, `suggestedQuantity`, `unit`, nutrientes, `imageUrl` |

- `limit`: 50 por defecto, 200 como máximo.
- **`imageUrl` de un alimento ya resuelve el respaldo:** si no tiene foto trae la de su grupo, y si tampoco hay, `null`. El front solo necesita un placeholder para `null`.

### 5.10 Recetas (solo nutri)

| Método y ruta | Uso |
|---|---|
| `GET /recipes?search=&mealTime=&limit=` | Compartidas y propias |
| `GET /recipes/:id` | Detalle |
| `POST /recipes` | Crear |
| `PUT /recipes/:id` | Editar. Solo cambia lo que se manda |
| `DELETE /recipes/:id` | Borrar |
| `POST /recipes/:id/image` | `FormData` con el campo `image` |

```json
{
  "name": "Tacos de pollo con nopales",
  "mealTimes": ["lunch", "dinner"],
  "prepMinutes": 20,
  "ingredients": [
    { "food": "<_id opcional del alimento>", "name": "Nopal cocido", "groupKey": "vegetables", "equivalents": 1, "quantity": 1, "unit": "pieza" }
  ],
  "steps": ["Corta el nopal en tiras.", "Caliéntalo por 2 minutos."]
}
```

- Se necesita al menos un ingrediente, cada uno con `groupKey` y `equivalents`, y al menos un paso.
- **Compartidas:** `nutritionist` es `null`. Solo se usan; editarlas o borrarlas responde `404`, así que hay que ocultar esos botones.
- **La imagen se sube después de crear la receta.** Acepta JPG, PNG o WebP, de al menos 600x450 píxeles y máximo 10 MB. El servidor la deja en 800x600 WebP, recortada al centro, así que conviene avisar que se recorta en proporción 4:3.

### 5.11 Planes alimenticios

| Método y ruta | Quién | Respuesta o nota |
|---|---|---|
| `GET /meal-plans/active` | Ambos | Nutri con `?patientId=`. `404` si no hay plan: mostrar estado vacío, no error |
| `GET /meal-plans?patientId=` | Nutri | Lista sin el menú |
| `GET /meal-plans/:id` | Nutri | Plan completo |
| `POST /meal-plans` | Nutri | Crea v1 y desactiva el plan anterior |
| `PUT /meal-plans/:id` | Nutri | Solo el plan activo. Sube la versión; mandar `reason` |
| `GET /meal-plans/:id/history` | Nutri | `{ currentVersion, history }` |
| `GET /meal-plans/:id/history/:version` | Nutri | `{ version, reason, modifiedAt, previous, current }` |

```json
{
  "patientId": "<id>",
  "name": "Plan de reducción",
  "targetKcal": 1900,
  "waterLiters": 2.4,
  "notes": "Recomendaciones generales",
  "distribution": [
    { "mealTime": "lunch", "equivalents": [{ "groupKey": "cereals-no-fat", "quantity": 2 }] }
  ],
  "menu": [
    {
      "day": "monday",
      "meals": [
        {
          "mealTime": "lunch",
          "title": "Tacos de pollo con nopales",
          "recipe": "<_id de la receta>",
          "imageUrl": "/images/recipes/tacos.webp",
          "foods": [{ "food": "<_id>", "name": "Tortilla de maíz", "groupKey": "cereals-no-fat", "equivalents": 2, "quantity": 2, "unit": "pieza" }],
          "steps": ["Calienta las tortillas."],
          "preparation": "Texto libre, para comidas sin receta"
        }
      ]
    }
  ]
}
```

**Al asignar una receta, el front copia al plan** `name` como `title`, `_id` como `recipe`, `imageUrl`, `ingredients` como `foods` y `steps`. Así se pueden ajustar las porciones para ese paciente, y borrar la receta no afecta al plan. No hay que pedir la receta otra vez para mostrarla: el paciente no tiene acceso a `/recipes`.

Los 7 días son opcionales, y un día puede tener solo algunas comidas.

**Cálculos en el front:**

- **Kcal de un plan o comida:** suma de `equivalents` por el `energyKcal` del grupo, tomado de `/smae/groups`.
- **Contador:** equivalentes del menú contra `distribution`. Avisa, pero no bloquea.
- **Equivalentes de un ingrediente:** `GET /smae/foods?groupKey=` con el `groupKey` del ingrediente.

### 5.12 Reportes (solo nutri)

| Método y ruta | Respuesta |
|---|---|
| `GET /reports/patient-follow-up` | Lista: `firstName`, `paternalLastName`, `maternalLastName`, `email`, `totalConsultations`, `lastConsultation`, `nextAppointment`, `daysSinceLastConsultation`, `needsFollowUp`, `currentWeightKg`, `weightGoalKg` |
| `GET /reports/weight-progress?days=90` | `{ days, patients: [{ firstName, paternalLastName, initialWeightKg, currentWeightKg, totalMeasurements, changeKg, changePct }] }` |
| `GET /reports/wellness-by-condition?days=30` | `{ days, conditions: [{ condition, patientsCount, totalSurveys, avgMood, avgSleepHours, avgWaterGlasses, avgActivityMinutes, avgPlanAdherence }] }` |
| `GET /reports/top-foods` | Lista de hasta 10: `food`, `groupKey`, `groupName`, `subgroup`, `timesUsed`, `plansCount` |

Un paciente sin consultas trae `lastConsultation` y `daysSinceLastConsultation` en `null`.

El peso de `patient-follow-up` (`currentWeightKg`) y de `weight-progress` sale de las mediciones **y** de las consultas, como en `/dashboard/progress`. En `weight-progress`, `totalMeasurements` cuenta todos esos registros.

---

## 6. Del mock a la API

### Paciente en el panel y expediente

| Mock | API |
|---|---|
| `id` | `_id` |
| `nombre` | `firstName` + `paternalLastName` + `maternalLastName` |
| `email`, `telefono` | `email`, `phone` |
| `edad` | Calculada con `clinicalHistory.identification.birthDate` |
| `sexo` | `clinicalHistory.identification.sex` |
| `objetivo` | `clinicalHistory.goals` (arreglo) |
| `estatura`, `imc` | `measurements.heightCm` y `bmi` de la última consulta |
| `pesoActual`, `grasaCorporal` | `currentWeightKg` del panel, o `goals` del dashboard |
| `pesoMeta` | `weightGoalKg` |
| `ultimaConsulta`, `consultasTotales` | `lastConsultation`, `totalConsultations` del panel |
| `antecedentes.alergias`, `medicamentos`, `padecimientos` | `pathologicalHistory.allergies`, `medications`, `diseases` (arreglos, no texto) |
| `antecedentes.intolerancias` | También en `pathologicalHistory.allergies`, por ejemplo `"Intolerancia a la lactosa"` |
| `antecedentes.actividadFisica` | `nonPathologicalHistory.physicalActivity` |
| `documentos[].nombre`, `fecha`, `tamano` | `originalName`, `createdAt`, `sizeBytes` (formatear) |

### Plan alimenticio

| Mock | API |
|---|---|
| `calorias: '1,800 kcal'` | `targetKcal` (número; formatear) |
| `agua: '2.2 L al día'` | `waterLiters` (número; formatear) |
| `desayuno`, `colacion1`, `comida`, `colacion2`, `cena` | `menu[día].meals[]` por `mealTime` |
| `recomendaciones` | `notes` |

`ExpedientePlanTab` y `PacientePlanAlimenticio` asumen **un solo día con texto libre**. Deben cambiar a días y comidas.

### Citas

| Mock | API |
|---|---|
| `id`, `pacienteId` | `_id`, `patient._id` |
| `fecha` + `hora` | `dateTime` |
| `duracion: '45 min'` | `durationMin` |
| `motivo` | `reason` |
| `estado: 'Completada'` | `status: 'completed'` |
| `modalidad: 'Presencial'` | `modality: 'in-person'`, o `'video-call'` para en línea |

### Mensajes

| Mock | API |
|---|---|
| `remitente` | `sender.role` |
| `texto` | `body` |
| `hora` | `createdAt` |
| `enLinea` | **No existe:** quitarlo |

---

## 7. Pantallas nuevas

| Ruta sugerida | Rol | Para qué | Endpoints |
|---|---|---|---|
| `/paciente/cambiar-password` | Paciente | Contraseña temporal, fuera del layout | `PUT /auth/change-password` |
| `/paciente/onboarding` | Paciente | Primer ingreso, fuera del layout | `/onboarding` |
| `/paciente/documentos` | Paciente | Subir y ver análisis, y ver los que subió el nutriólogo | `/lab-documents` |
| `/paciente/equivalencias` | Paciente | Catálogo por grupo | `/smae` |
| `/nutriologo/recetas` | Nutri | Biblioteca | `/recipes` |
| `/nutriologo/pacientes/:id/plan` | Nutri | Constructor del plan | `/meal-plans`, `/recipes`, `/smae` |
| `/nutriologo/reportes` | Nutri | Los 4 reportes | `/reports` |

### Constructor del plan

1. **Meta:** kcal de la última consulta (`energyCalculation.targetKcal`), editable, más el agua.
2. **Equivalentes:** tabla de grupos por comida, con las kcal calculadas al momento.
3. **Menú:** por día y comida, elegir receta o alimentos. Contador "Cereales 2 de 3".
4. **Copiar día** a otros días.
5. **Guardar:** al editar, pedir el motivo del cambio.
6. **Historial:** comparar `previous` y `current`.

### Vista del plan del paciente

Pestañas por día y tarjetas por comida, con foto, título, ingredientes con porciones y pasos numerados. Al tocar un ingrediente, mostrar sus equivalentes. Estado vacío si `/meal-plans/active` responde `404`.

---

## 8. Orden sugerido

Cada paso se puede probar por separado:

1. **Base:** `.env`, cliente, `AuthContext`, `ProtectedRoute`.
2. **Auth:** login, registro, recuperación, cambio de contraseña, onboarding, cerrar sesión.
3. **Pacientes:** panel, alta (botón *Nuevo paciente*) y expediente.
4. **Módulos del paciente:** mediciones, encuestas, progreso, documentos.
5. **Citas y mensajes.**
6. **Consultas.**
7. **Plan del paciente.**
8. **Recetas y constructor.**
9. **Reportes.**
10. **Limpieza:** borrar los `mock-data.js` y las referencias que queden.

---

## 9. Decisiones del equipo

Estas diferencias entre el front y el back ya se resolvieron:

| Pantalla | Decisión | Qué usa |
|---|---|---|
| Perfil del nutriólogo | Se edita; el paciente también puede editar sus datos básicos y foto | `PUT /auth/me`, `POST /auth/me/avatar` |
| Chat | Bandeja de mensajes, sin tiempo real. Lista de conversaciones para el nutriólogo | `/messages`, `GET /messages/conversations` |
| Cumplimiento | Se registra con la encuesta diaria (`planAdherence`) | `/wellness-surveys`, adherencia |
| Cuestionarios | Usan la misma encuesta diaria, enfocada en el estado general | `/wellness-surveys` |
| Progreso | Peso y grasa meta en la historia clínica | `goals` de `/dashboard/progress` |
| Panel de pacientes | Última consulta, total de consultas, peso actual y meta | `GET /patients` |
| Citas | Modalidad presencial o en línea | `modality` |
| Documentos | El nutriólogo también sube, con `patientId`. Cada quien borra solo lo que subió | `/lab-documents` |
| Intolerancias | Van junto con las alergias | `pathologicalHistory.allergies` |

Quedan fuera por ahora:

- **Plantillas de plan:** el back ya está preparado, pero no existen todavía.
- **`enLinea` del chat:** no aplica sin tiempo real; quitarlo.
- **`universidad`, `consultorio` y `biografia`** del mock: ahora son `university`, `officeAddress` y `bio`. `sexo` y `fechaNacimiento` del nutriólogo no existen: quitarlos del perfil.

---

## 10. Criterios de aceptación

- [ ] Ninguna pantalla importa `mock-data.js`.
- [ ] `apiFetch` es el único que agrega el token, y las páginas no lo llaman directamente.
- [ ] Un login incorrecto muestra el error sin recargar la página.
- [ ] Una sesión vencida lleva al login, en cualquier pantalla.
- [ ] Cada rol solo entra a sus rutas.
- [ ] Un paciente nuevo pasa por cambio de contraseña y onboarding antes de entrar.
- [ ] Ninguna petición manda `senderId`, `userId`, `nutritionistId` ni el `patientId` del paciente.
- [ ] Los documentos se descargan con su nombre original.
- [ ] Las fechas de encuestas y mediciones se muestran en el día correcto después de las 18:00.
- [ ] El plan muestra días, recetas, imágenes y equivalentes, con estado vacío si no hay plan.
- [ ] Toda pantalla tiene estados de carga, vacío y error.
- [ ] Las pantallas de la sección 9 usan lo que dice su tabla.
- [ ] `pnpm lint` y `pnpm build` pasan sin errores.

---

## 11. Verificación

Con el back levantado y el catálogo cargado, repetir en el navegador el flujo de la colección de Postman del back: registro, alta de paciente, primer ingreso, encuesta, consulta, plan, chat y reportes, con un nutriólogo y un paciente reales.

Probar también con un segundo nutriólogo que no vea a los pacientes del primero.
