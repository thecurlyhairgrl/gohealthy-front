# Guía de Contribución

Este documento define cómo trabajamos como equipo en **GoHealthy** (Front-End y Back-End). El objetivo es mantenerlo simple.

---

## 1. Ramas

| Rama | Propósito |
| :--- | :--- |
| `main` | Producción. Siempre estable y desplegable. Solo recibe merges desde `develop`. |
| `develop` | Integración. Rama por defecto para trabajar; todas las features nacen de aquí y regresan aquí. |
| `feature/<nombre-corto>/persona` | Una funcionalidad nueva (ej. `feature/login-paciente/john`). |
| `fix/<nombre-corto>/persona` | Corrección de un bug (ej. `fix/hero-image-mobile/john`). |
| `hotfix/<nombre-corto>/persona` | Arreglo urgente directo sobre `main`, para producción. Excepcional. |

Regla simple: **nunca se trabaja directo sobre `main` ni `develop`.** Siempre en una rama propia.

---

## 2. Flujo de trabajo paso a paso

> ¡Puede trabajarse desde un cliente visual!

1. Actualizar `develop` local:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crea la rama de trabajo desde `develop`:
   ```bash
   git checkout -b feature/mi-funcionalidad
   ```
3. Trabajar en commits pequeños y frecuentes se puede consultar nuestra [convencion](#5-convención-de-commits).
4. Antes de subir una rama, correr localmente:
   ```bash
   pnpm lint
   pnpm build
   ```
5. Sube tu rama:
   ```bash
   git push -u origin feature/mi-funcionalidad
   ```
6. Abrir un Pull Request **contra `develop`** (nunca contra `main`). [🔗](#guía-de-contribución).
7. Espera al menos **1 aprobación** antes de hacer merge.
8. Resuelve los comentarios de la revisión.
9. Al aprobar, usar **"Squash and merge"** para mantener el historial de `develop` limpio.
10. Borrar la rama después de mergear (No obligación pero es mejor).

Cuando `develop` acumule funcionalidad lista para publicarse, se abre un PR de `develop` → `main`.

---

## 3. Cómo abrir y revisar un Pull Request 

**Para abrir uno:**
1. Subir la rama (`git push -u origin tu-rama`, ver arriba).
2. En GitHub, entrar al repositorio: buscar el boton **"Compare & pull request"**. Si no aparece, buscar en la pestaña **Pull Requests → New pull request**.
3. Verifica `base: develop` ← `compare: tu-rama`.
4. Título corto y descriptivo
5. En la descripción, usar el [checklist](#4-checklist-antes-de-abrir-un-pull-request).
6. Asignar como reviewer a al menos un contribuidor.
7. Publicar el PR.

**Para revisar uno:**
1. Entrar al PR, pestaña **Files changed**, para ver el diff.
2. Dejar comentarios directamente sobre las líneas si algo no queda claro o ves un problema.
3. Si todo está bien: botón **Review changes → Approve**.
4. Si hay cambios pendientes: **Review changes → Request changes**, explicando qué falta.
5. Quien abrió el PR resuelve los comentarios (push de nuevos commits) y responde en el hilo.
6. Una vez aprobado, quien abrió el PR (o el reviewer, según acuerden) hace el merge.

---

## 4. Checklist antes de abrir un Pull Request

```markdown
## Descripción
<!-- Descripcion breve de los cambios intrdoudcidos en el PR y que se reseuelve o añade-->

## Enlaces relacionados
- **Documentación: [Texto](Link) [Si aplicá]

## Tipo de cambio
- [ ] 🐛 Corrección de errores (Bug fix)
- [ ] ✨ Nueva característica (Feature)
- [ ] ⚡ Optimización o mejora de rendimiento
- [ ] 🎨 Refactorización (Sin cambios funcionales)
- [ ] 📚 Documentación

## Checklist
- [ ] `pnpm lint` pasa sin errores.
- [ ] `pnpm build` pasa sin errores.
- [ ] Probé la funcionalidad corriendo la app (local o con Podman).
- [ ] No dejé `console.log`, código comentado ni TODOs sin explicar.
- [ ] Actualicé documentación relevante en `docs/` si el cambio lo amerita.

```
---

## 5. Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) simplificado:

O bien utilizar la extension de VSCode para facilitar el nombramiento de los commits [🔗](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)

```
tipo: descripción corta en presente

feat:     nueva funcionalidad
fix:      corrección de un bug
docs:     solo documentación
style:    formato, sin cambios de lógica (espacios, punto y coma, etc.)
refactor: cambio de código que no agrega funcionalidad ni corrige bugs
test:     agregar o corregir tests
chore:    tareas de mantenimiento (dependencias, configuración, etc.)
```

Ejemplos: `feat: agregar login de nutriólogo`, `fix: corregir overflow en tabla de pacientes`, `chore: actualizar dependencias`.

---

## 6. Cómo correr el proyecto

### Opción A — Local con pnpm (recomendado para el día a día, más rápido)

1. Usando Node (ver [.nvmrc](./.nvmrc); con `nvm` alcanza con `nvm use`).
2. Instalar pnpm en la versión fijada en `package.json` (`packageManager`): `corepack enable` (ya viene con Node 20) resuelve esto automáticamente.
3. Instala dependencias:
   ```bash
   pnpm install
   ```
4. Levanta el entorno de desarrollo:
   ```bash
   pnpm dev
   ```
   Abre `http://localhost:5173`.

### Opción B — Con Podman

Útil para verificar que tu cambio funciona igual para todos, sin depender de la versión de Node instalada en tu máquina.

```bash
pnpm podman:up    # equivalente a: podman compose up --build
```

Abre `http://localhost:5173`. Los cambios en el código se reflejan en caliente (hot reload) igual que en local, gracias al bind mount configurado en `compose.yaml`.

Para apagarlo:
```bash
pnpm podman:down
```

### Problemas conocidos (ya resueltos, por si vuelven a aparecer)

- **`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` al instalar dependencias:** pnpm 10 bloquea por defecto paquetes publicados hace menos de 24h (protección contra ataques de supply-chain). Ya está desactivado a nivel de proyecto en [.npmrc](./.npmrc). Si ves este error, corre `pnpm install` de nuevo — no debería volver a pasar salvo que se borre ese archivo.
- **El contenedor de Podman no mostraba `Network:` / no era accesible desde el navegador:** faltaba `host: true` en `vite.config.js`. Ya está corregido.
- **El contenedor se caía con un error `EIO: i/o error, stat '/app'` o dejaba de refrescar cambios:** es un problema conocido de los bind mounts de Podman sobre Windows/WSL2 con el watcher nativo de archivos. Se mitigó forzando polling en `vite.config.js` (`server.watch.usePolling`). Si vuelve a pasar, `podman compose restart` (ya configuramos `restart: unless-stopped` para que se recupere solo).
- **`podman compose up` corre bien, `podman logs` muestra "VITE ready" y aun así `http://localhost:5173` da "conexión rechazada":** es un bug de red de WSL2 en Windows (el relay de puertos hacia `localhost` se queda atascado), no algo del proyecto. Se puede confirmar entrando al contenedor: `podman exec <container> wget -qO- http://localhost:5173/` — si eso responde HTML, el problema es 100% del host, no de la app. Orden de intentos para arreglarlo:
  1. `podman machine stop` y luego `podman machine start`.
  2. Si sigue sin funcionar: `wsl --shutdown` (apaga **todas** tus distros WSL, guarda tu trabajo en otras antes) y luego `podman machine start` de nuevo.
  3. Si ninguno de los dos funciona: reiniciar Windows. Esto lo resuelve siempre.

---

## 7. Variables de entorno

El proyecto contiene un archivo `.env.example` en el cual viven las variables globales que utiliza el proyecto sin el valor real seteado, pero listas para ser copiadas a un .env real.
