# AGENTS.md

## Qué es este proyecto

GoHealthy conecta nutriólogos con sus pacientes: seguimiento de alimentación, ejercicio y evolución física en un solo lugar, reemplazando papel/Excel/WhatsApp. Este repo es la SPA de React que usan ambos tipos de usuario (nutriólogo y paciente).

## Stack

- **React 19 + react-router-dom** — ruteo declarado en código (`src/app/router.jsx`),
- **Vite** — bundler y dev server.
- **Tailwind CSS v4** — config vía CSS en `src/index.css` (`@theme`); `tailwind.config.js` solo define qué archivos escanear.
- **shadcn/ui + base-ui** — componentes en `src/components/ui/`, generados con `npx shadcn add <componente>`.
- **TanStack Query** — estado de servidor (cliente en `src/lib/query-client.js`).
- **Zustand** — estado de cliente.
- **React Hook Form + Zod** — formularios y validación.
- **Recharts** — gráficos.
- **axios** — HTTP (cliente central en `src/lib/api-client.js`, usa `VITE_API_URL`).
- **pnpm** — gestor de paquetes. Usar siempre `pnpm`
- **Podman + Podman Compose** — entorno de desarrollo en contenedor, opcional para el día a día (ver `CONTRIBUTING.md`).

## Estructura del proyecto (organización por features)

Detalle completo y siempre actualizado en [docs/frontend/README.md](docs/frontend/README.md#estructura-de-carpetas). Resumen:

- `src/app/` — router, providers, layouts globales. Sin lógica de negocio.
- `src/pages/` — componentes de ruta: delgados, solo componen features.
- `src/features/<dominio>/` — lógica de negocio por dominio (`api/`, `components/`, `schemas/`, `store/`). La mayoría del código nuevo va aquí.
- `src/components/ui/` — shadcn. **No editar a mano** salvo necesidad justificada (documentarlo en el PR).
- `src/hooks/`, `src/lib/`, `src/stores/` — compartido entre features.

**Regla:** si algo lo usa una sola feature, vive en `features/<esa-feature>/`. Si lo usan dos o más (o es parte del layout general), sube a `components/`, `hooks/` o `lib/`.

## Comandos

- `pnpm install` — instalar dependencias.
- `pnpm dev` — servidor de desarrollo (`http://localhost:5173`).
- `pnpm build` — build de producción. **Correr antes de dar una tarea por terminada.**
- `pnpm lint` — ESLint. **Correr antes de dar una tarea por terminada; el proyecto debe lintear sin errores.**
- `pnpm podman:up` / `pnpm podman:down` — levantar/bajar el entorno con Podman.

## Convenciones

- Alias `@/` apunta a `src/` — usarlo en vez de rutas relativas largas (`../../../`).
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- Ramas: `main` (producción) + `develop` (integración) + `feature/`, `fix/`, `hotfix/`. Nunca commitear directo a `main` ni `develop`.
- Todo cambio va en una rama propia y se sube vía Pull Request contra `develop`, con al menos 1 aprobación antes de mergear.
- Flujo completo de ramas/commits/PRs: [CONTRIBUTING.md](CONTRIBUTING.md).

## Qué NO debe hacer un agente sin confirmarlo con el equipo

- No agregar dependencias nuevas a `package.json` sin que se pida explícitamente.
- No inventar endpoints ni contratos de API: el Back-End todavía está en definición (`docs/backend/`). Si hace falta un endpoint que no existe, señalarlo en vez de asumir su forma.
- No commitear `.env` ni credenciales (`.env` ya está en `.gitignore`; usar `.env.example` como referencia).
- No hacer force-push ni tocar `main`/`develop` directamente.
- No reactivar `minimum-release-age` en `.npmrc` sin discutirlo con el equipo — se desactivó a propósito (ver el comentario en ese archivo).

## Particularidades del entorno (para no "arreglar" algo que ya está arreglado a propósito)

- `vite.config.js` fuerza `server.watch.usePolling`: el watcher nativo de archivos crashea (`EIO`) sobre los bind mounts de Podman en Windows/WSL2.
- `.npmrc` desactiva `minimum-release-age` de pnpm: sin eso, un `pnpm install` limpio puede fallar si alguna dependencia fue publicada hace menos de 24h.
- Si con Podman el contenedor arranca bien (logs dicen "VITE ready") pero `localhost:5173` no responde desde el navegador: es un bug de red de WSL2, no del proyecto. Ver troubleshooting en [CONTRIBUTING.md](CONTRIBUTING.md#problemas-conocidos-ya-resueltos-por-si-vuelven-a-aparecer).

## Documentación adicional

- [CONTRIBUTING.md](CONTRIBUTING.md) — flujo de ramas, commits, cómo abrir/revisar un PR, cómo correr el proyecto.
- [docs/frontend/README.md](docs/frontend/README.md) — stack y estructura de carpetas en detalle.
- [docs/README.md](docs/README.md) — índice general (incluye Back-End y arquitectura, en construcción).
- `.claude/skills/` — skills específicas de este proyecto para agentes de Claude Code.
