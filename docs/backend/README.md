# Contexto del backend de GoHealthy

Este documento explica la API que consume el front. Va dirigido a quien programe el front, persona o agente de código. **El back es la fuente de verdad:** si una pantalla no coincide con lo que dice aquí, se cambia la pantalla, no la API.

- **Repositorio del back:** `gohealthy-back` (Node.js + Express + MongoDB con Mongoose).
- **Contrato detallado de cada endpoint:** [`docs/frontend/specs/conexion-api-back.spec.md`](../frontend/specs/conexion-api-back.spec.md).
- **Plan de trabajo del front:** [`docs/frontend/GUIA-FRONT.md`](../frontend/GUIA-FRONT.md).

---

## 1. Conexión

| Dato | Valor |
|---|---|
| URL base | `http://localhost:3000/api`, en `VITE_API_URL` |
| Imágenes | Fuera de `/api`: la API regresa rutas como `/images/recipes/tacos.webp`, que se sirven en `http://localhost:3000/images/...` |
| Formato | JSON, salvo subidas de archivos (`multipart/form-data`) y descargas de documentos (archivo binario) |
| CORS | El back solo acepta peticiones desde su `CLIENT_URL`, que debe ser `http://localhost:5173` |

Para levantarlo: en `gohealthy-back`, `pnpm install` y luego `pnpm dev`, con su `.env` lleno y MongoDB corriendo. El catálogo SMAE y las recetas ya están cargados en la base de la computadora de Dante. En un clon nuevo, `/api/smae` y `/api/recipes` responden listas vacías.

---

## 2. Sesión y roles

- **Login:** `POST /auth/login` responde `{ token, user }`. El token dura 8 horas.
- **Token:** se manda en cada petición como `Authorization: Bearer <token>`. Todas las rutas lo piden, salvo `register`, `login`, `forgot-password`, `verify-otp` y `reset-password`.
- **Roles:** `nutritionist` y `patient`. El usuario y su rol salen del token: **el front nunca manda `senderId`, `userId`, `nutritionistId` ni el `patientId` del paciente que inició sesión**.
- **Un nutriólogo solo ve a sus pacientes.** Si pide datos de uno ajeno, la API responde `404`, como si no existiera.
- **Registro:** solo los nutriólogos se registran solos. A los pacientes los da de alta su nutriólogo.

### Primer ingreso del paciente

1. El nutriólogo crea al paciente. La API genera una contraseña temporal y se la manda por correo. Si el correo falla, la imprime en la terminal del back.
2. El paciente inicia sesión con `user.mustChangePassword: true` y debe cambiarla (`PUT /auth/change-password`).
3. Después completa el onboarding (`PUT /onboarding`); `user.onboardingCompleted` es `false` hasta que lo haga.
4. El back no deja completar el onboarding sin haber cambiado la contraseña (`403`). El resto del orden lo controla el front.

---

## 3. Errores

Todos los errores traen `message` en español. Los de validación agregan `details`, con los textos de Mongoose en inglés.

```json
{ "message": "Hay datos inválidos", "details": ["Path `weightKg` is required."] }
```

| Código | Significa | Qué hace el front |
|---|---|---|
| `400` | Datos inválidos o id con formato incorrecto | Mostrar `message` en el formulario |
| `401` | Sin sesión, token vencido, o login incorrecto | Ir al login, salvo en el formulario de login |
| `403` | Ese rol no puede hacer eso | Ocultar la acción |
| `404` | No existe o no es de este usuario | Estado "no encontrado" o vacío |
| `409` | Duplicado: correo ya registrado o encuesta del día ya contestada | Mostrar `message` |
| `502` | Falló el correo en *Reenviar acceso* | Mostrar `message` |
| `500` | Error del servidor | Mensaje genérico |

---

## 4. Modelos

Campos que regresa la API (además de `_id`, `createdAt` y `updatedAt`). Los marcados con `*` son obligatorios al crear.

| Modelo | Campos |
|---|---|
| **User** | `firstName*`, `paternalLastName*`, `maternalLastName`, `email*`, `role*` (`nutritionist`, `patient`), `phone`, `avatarUrl`, `active`, `mustChangePassword`, `onboardingCompleted`, `nutritionist` (id, solo pacientes). Del nutriólogo: `professionalLicense`, `specialty`, `university`, `officeAddress`, `bio` |
| **ClinicalHistory** | `identification` (`birthDate`, `sex`: `female`/`male`, `maritalStatus`, `occupation`, `education`, `address` {`street`, `neighborhood`, `city`, `state`, `zipCode`}), `reasonForVisit`, `goals` (arreglo), `weightGoalKg`, `bodyFatGoalPct`, `familyHistory` [{`condition*`, `relationship`}], `pathologicalHistory` (`diseases`, `surgeries`, `allergies`, `medications`: arreglos de texto), `nonPathologicalHistory` (`smoking`, `alcoholConsumption`: `never`/`occasional`/`frequent`, `physicalActivity`, `sleepHours`), `eatingHabits` (`mealsPerDay`, `eatsOut`, `preferredFoods`, `dislikedFoods`), `gynecoObstetricHistory` (`pregnancies`, `lastMenstrualPeriod`, `contraceptiveMethod`) |
| **Consultation** | `patient*`, `date`, `appointment`, `measurements` (`weightKg`, `heightCm`, `bmi`, `waistCm`, `hipCm`, `bodyFatPct`, `systolicPressure`, `diastolicPressure`), `energyCalculation` (`formula`: `harris-benedict`/`mifflin-st-jeor`, `activityFactor`, `basalEnergyExpenditure`, `totalEnergyExpenditure`, `targetKcal`), `diagnosis`, `prognosis`, `instructions`, `notes`. El back calcula `bmi` |
| **Appointment** | `patient*`, `nutritionist`, `dateTime*`, `durationMin` (mínimo 15, 60 por defecto), `status` (`scheduled`, `rescheduled`, `cancelled`, `completed`), `modality` (`in-person` por defecto, `video-call`), `reason`, `notes`, `consultation` |
| **Measurement** | `date`, `weightKg*`, `waistCm`, `hipCm`, `armCm`, `bodyFatPct` (0 a 100), `notes` (máx. 500) |
| **WellnessSurvey** | `date*` (`AAAA-MM-DD`), `mood*` (1 a 5), `sleepHours*` (0 a 24), `waterGlasses*` (0 a 30), `activityMinutes*` (0 a 1440), `planAdherence*` (0 a 100), `comment` (máx. 500). **Una por paciente por día** |
| **LabDocument** | `patient`, `uploadedBy`, `originalName`, `mimeType` (PDF, JPG o PNG), `sizeBytes` (máx. 10 MB), `description`, `studyDate` |
| **Message** | `patient`, `sender`, `recipient`, `subject` (máx. 150), `body*` (máx. 5000), `read`, `readAt` |
| **SmaeGroup** | `key`, `category`, `name`, `subgroup`, `energyKcal`, `proteinG`, `lipidsG`, `carbohydratesG`, `imageUrl`. Son 19 |
| **SmaeFood** | `name`, `groupKey`, `suggestedQuantity`, `unit`, `grossWeightG`, `netWeightG`, `energyKcal`, `proteinG`, `lipidsG`, `carbohydratesG`, `fiberG`, `sodiumMg`, `imageUrl` (si no tiene foto, la API regresa la de su grupo) |
| **Recipe** | `nutritionist` (`null` = compartida), `name*`, `imageUrl`, `mealTimes`, `prepMinutes`, `ingredients*` [{`food`, `name`, `groupKey`, `equivalents`, `quantity`, `unit`}], `steps*` (arreglo de texto) |
| **MealPlan** | `patient*`, `name`, `active`, `version`, `startDate`, `targetKcal`, `waterLiters`, `notes`, `distribution` [{`mealTime`, `equivalents` [{`groupKey`, `quantity`}]}], `menu` [{`day`, `meals` [{`mealTime`, `title`, `recipe`, `imageUrl`, `foods`, `steps`, `preparation`}]}] |

Valores fijos:

- **`mealTime`:** `breakfast`, `morning-snack`, `lunch`, `afternoon-snack`, `dinner`.
- **`day`:** `monday` … `sunday`.
- **`adherence.status`:** `green`, `yellow`, `red`, `no-data`.

La API usa los valores en inglés; el front los traduce solo al mostrarlos.

---

## 5. Endpoints

| Recurso | Ruta base | Quién | Para qué |
|---|---|---|---|
| Autenticación | `/auth` | Público y ambos | Registro, login, perfil (`/me`), foto (`/me/avatar`), datos del nutriólogo para el paciente (`/me/nutritionist`), contraseña, recuperación |
| Pacientes | `/patients` | Nutriólogo | Panel, alta, expediente, historia clínica, adherencia, reenviar acceso |
| Onboarding | `/onboarding` | Paciente | Primer ingreso |
| Consultas | `/consultations` | Nutriólogo | Notas de evolución |
| Mediciones | `/measurements` | Ambos | El paciente registra; el nutriólogo consulta |
| Encuestas | `/wellness-surveys` | Ambos | El paciente contesta una al día; el nutriólogo consulta |
| Dashboard | `/dashboard/progress` | Ambos | Series para gráficas y metas de peso. `weights` junta el peso de las mediciones y de las consultas, con su origen |
| Documentos | `/lab-documents` | Ambos | Subir, listar, descargar y borrar |
| Citas | `/appointments` | Ambos | El nutriólogo agenda y edita; el paciente consulta |
| Mensajes | `/messages` | Ambos | Bandeja de mensajes y lista de conversaciones |
| SMAE | `/smae` | Ambos | Grupos y alimentos |
| Recetas | `/recipes` | Nutriólogo | Biblioteca de recetas |
| Planes | `/meal-plans` | Ambos | El nutriólogo arma y edita; el paciente ve su plan activo |
| Reportes | `/reports` | Nutriólogo | Cuatro reportes |

El detalle de cada endpoint (método, cuerpo, respuesta y quién puede usarlo) está en la sección 5 del spec. **No uses un endpoint ni un campo que no aparezca ahí.** Si falta algo, señálalo en lugar de suponer su forma.

---

## 6. Reglas que el front debe respetar

1. **Ids:** el usuario de login, registro y `/auth/me` trae `id`. Todo lo demás trae `_id`. Los ids son texto, no números.
2. **Fechas sin hora** (encuestas y mediciones): el back las guarda a las 00:00 UTC. Mostrarlas en UTC, o en México aparecen un día antes. Al mandarlas, usar la fecha **local** en `AAAA-MM-DD`, nunca `new Date().toISOString()`.
3. **Fechas con hora** (citas y mensajes): mandarlas en ISO y mostrarlas en la hora local.
4. **Reemplazos completos:** `PUT /measurements/:id` necesita todos los campos, incluida la fecha. Los objetos anidados de la historia clínica y del onboarding (`identification`, `pathologicalHistory`…) se reemplazan completos, al igual que `menu` y `distribution` del plan. Lo que no se mande se borra.
5. **Ediciones parciales:** `PUT /auth/me`, `PUT /patients/:id`, `PUT /appointments/:id` y `PUT /recipes/:id` solo cambian los campos que se mandan.
6. **Una encuesta por día:** la segunda del mismo día responde `409`.
7. **Paciente sin plan:** `GET /meal-plans/active` responde `404` si el paciente no tiene plan. Es un estado vacío, no un error.
8. **Recetas en el plan:** al asignar una receta, el front copia al plan su `name` (como `title`), su `_id` (como `recipe`), `imageUrl`, sus `ingredients` (como `foods`) y sus `steps`. El paciente no puede consultar `/recipes`: todo lo que ve está en su plan.
9. **Descarga de documentos:** con `downloadFile` de `src/api/client.js`, nunca con un `<a href>`, porque el enlace no manda el token. El nombre del archivo sale de `originalName`.
10. **Imágenes:** formato JPG, PNG o WebP, de al menos 600x450 (fotos de perfil: 200x200). El back las recorta a 800x600 (perfil: 400x400) y las convierte a WebP.
11. **Calorías:** el front las calcula como la suma de los equivalentes por el `energyKcal` del grupo, que viene en `GET /smae/groups`.
12. **Mensajes:** no hay tiempo real. Se recargan al abrir la conversación y después de enviar.

---

## 7. Lo que el back no tiene

No lo inventes ni lo simules con datos de prueba:

- Mensajes en tiempo real ni un estado "en línea".
- Cuestionarios psicológico y alimenticio: solo existe la encuesta diaria de cinco preguntas.
- Registro de comidas marcadas una por una: el cumplimiento sale de `planAdherence` en la encuesta.
- Horario de cada comida: los horarios son fijos en el front.
- Sexo ni fecha de nacimiento del nutriólogo.
- Plantillas de plan alimenticio.
