---
name: scaffold-feature
description: Crea la estructura de carpetas y archivos base para una nueva feature de dominio (ej. pacientes, nutriologos, auth) siguiendo la convención de organización por features de GoHealthy. Usar cuando el usuario pida "crear una nueva feature", "agregar el módulo de X", o cuando haga falta empezar una pantalla/dominio nuevo que todavía no tiene carpeta en src/features/.
---

# Scaffold de una feature nueva

Esta skill crea el esqueleto de una feature dentro de `src/features/<nombre>/`, siguiendo la convención documentada en [docs/frontend/README.md](../../../docs/frontend/README.md#estructura-de-carpetas) y en [AGENTS.md](../../../AGENTS.md).

## Cuándo usarla

Cuando se necesite empezar a trabajar un dominio de negocio nuevo (ej. "pacientes", "nutriologos", "citas", "seguimiento") que todavía no existe en `src/features/`.

No usar esta skill para agregar una pantalla que reutiliza una feature ya existente — en ese caso solo hace falta una página nueva en `src/pages/` y una ruta en `src/app/router.jsx`.

## Pasos

1. Preguntar (si no es obvio por el contexto) el nombre de la feature en **kebab-case** y en español o inglés consistente con el resto del proyecto (ej. `pacientes`, no `patients` si el resto usa español).

2. Crear la siguiente estructura bajo `src/features/<nombre>/`:

   ```
   src/features/<nombre>/
     api/
       use-<nombre>.js       # hooks de TanStack Query (useQuery/useMutation)
     components/
       .gitkeep              # componentes usados solo por esta feature
     schemas/
       <nombre>.schema.js    # esquemas de Zod para sus formularios
   ```

   Solo crear `store/` (Zustand) si la feature realmente necesita estado propio compartido entre varios componentes — no crearlo "por si acaso".

3. En `api/use-<nombre>.js`, dejar un hook de ejemplo mínimo que use el cliente central, **no** axios directo:

   ```js
   import { useQuery } from '@tanstack/react-query'
   import { apiClient } from '@/lib/api-client'

   export function use<Nombre>() {
     return useQuery({
       queryKey: ['<nombre>'],
       queryFn: async () => {
         const { data } = await apiClient.get('/<nombre>')
         return data
       },
     })
   }
   ```

   Si el endpoint real todavía no existe en el Back-End, dejarlo así de todos modos (es el contrato esperado) y avisar al usuario que falta confirmarlo con el equipo de Back-End — no inventar la forma de la respuesta.

4. En `schemas/<nombre>.schema.js`, solo crear un esquema de Zod si el usuario ya especificó qué campos necesita el formulario de esa feature. Si no los especificó, no inventar campos — dejar la carpeta con `.gitkeep` y preguntar.

5. Recordar que `pages/` se mantiene delgado: si hace falta una pantalla para esta feature, crearla en `src/pages/` (o `src/pages/<area>/`) importando componentes desde `src/features/<nombre>/components/`, y agregar la ruta correspondiente en `src/app/router.jsx`.

6. Correr `pnpm lint` y `pnpm build` al terminar para confirmar que no se rompió nada.

## Anatomía de esta skill (para el equipo, no para el agente)

Esta skill sirve de plantilla para que el equipo cree las suyas:

- **Carpeta = nombre de la skill.** `name:` en el frontmatter debe ser idéntico al nombre de la carpeta (`scaffold-feature`).
- **`description` es lo único que decide si la skill se activa sola.** Debe decir claramente *qué hace* y *cuándo usarla*, con las palabras que el equipo realmente escribiría al pedirlo.
- **El cuerpo son instrucciones para el agente, en imperativo**, no documentación para humanos (esa ya vive en `docs/` y `CONTRIBUTING.md`). Puede incluir pasos numerados, plantillas de código, y reglas de "qué no inventar".
- Una skill puede traer archivos de apoyo en la misma carpeta (ej. `references/`, `scripts/`) si hace falta algo más elaborado que texto — no fue necesario acá.
