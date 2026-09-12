---
name: open-pr
description: Guía para preparar y abrir un Pull Request de la rama actual contra develop, siguiendo la convención del equipo de GoHealthy. Usar cuando el usuario pida "abre un PR", "sube esto para revisión", "prepara el pull request", o esté por terminar el trabajo de una rama feature/fix/hotfix.
---

# Abrir un Pull Request

No asumir pasos de memoria.

## Antes de abrir el PR

1. Confirmar que la rama actual sigue la convención `feature/<nombre>/persona`, `fix/<nombre>/persona` o `hotfix/<nombre>/persona` (ver [CONTRIBUTING.md](../../../CONTRIBUTING.md#1-ramas)). Si no, avisar al usuario antes de continuar.
2. Correr y confirmar que pasan, sin arreglar nada por fuera de lo pedido en la tarea actual:
   ```bash
   pnpm lint
   pnpm build
   ```
3. Revisar `git status` y `git diff` para asegurarse de que no se suban archivos que no correspondan (`.env`, artefactos de build, etc.).
4. Confirmar con el usuario el mensaje de commit / título del PR si no fue explícito — debe seguir Conventional Commits (`feat:`, `fix:`, `docs:`, etc.).

## Al abrir el PR

1. Push de la rama: `git push -u origin <rama-actual>`.
2. Crear el PR **contra `develop`**, nunca contra `main`, usando `gh pr create` si está disponible:
   ```bash
   gh pr create --base develop --title "<tipo>: <descripción corta>" --body "..."
   ```
3. La descripción del PR debe usar el checklist de [CONTRIBUTING.md](../../../CONTRIBUTING.md#4-checklist-antes-de-abrir-un-pull-request):
   - Descripción breve del cambio.
   - Tipo de cambio (bug fix / feature / refactor / docs / etc.).
   - Checklist: lint pasa, build pasa, se probó la funcionalidad, sin `console.log` ni código comentado, documentación actualizada si aplica.
4. No auto-aprobar ni mergear el propio PR — el flujo requiere al menos 1 revisión de un compañero antes de merge (ver `CONTRIBUTING.md`).
5. Informar al usuario el link del PR creado; no asumir que debe mergearse automáticamente.
