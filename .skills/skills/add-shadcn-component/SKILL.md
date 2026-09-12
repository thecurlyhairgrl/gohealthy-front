---
name: add-shadcn-component
description: Instala o actualiza un componente de shadcn/ui en el proyecto de forma correcta. Usar cuando el usuario pida agregar un componente de UI que podría existir en la librería de shadcn (ej. "agrega un dialog", "necesito un select", "pon un date picker") antes de construirlo a mano.
---

# Agregar un componente de shadcn/ui

## Cuándo usarla

Antes de escribir un componente de UI genérico a mano (modal, dropdown, tabla, calendario, tooltip, etc.), verificar si ya existe en el catálogo de shadcn — el proyecto ya tiene 60+ componentes instalados en `src/components/ui/`.

## Pasos

1. Revisar primero si el componente ya existe en `src/components/ui/` (ej. `ls src/components/ui/`). Si ya está, usarlo directamente vía `@/components/ui/<nombre>` — no reinstalarlo ni recrearlo.

2. Si no existe, instalarlo con la CLI (usa la config de [components.json](../../../components.json)):

   ```bash
   npx shadcn add <componente>
   ```

3. **No editar a mano** el archivo generado salvo necesidad real (ej. adaptar una variante al diseño de GoHealthy). Si se edita, dejar claro en el commit/PR qué se cambió y por qué, porque un futuro `npx shadcn add <componente> --overwrite` pisaría esos cambios.

4. Si el componente exporta más de un símbolo desde el mismo archivo (ej. `Button` + `buttonVariants`), es el patrón normal de shadcn — no hace falta separar archivos ni suprimir el lint manualmente, ya existe una excepción para `src/components/ui/**` en `eslint.config.js`.

5. Después de instalar, correr `pnpm lint` y `pnpm build` para confirmar que no rompió nada (ocasionalmente un componente nuevo trae un import sin usar; ver la excepción de lint ya configurada antes de "arreglarlo" a mano).

6. Usarlo en la feature o página correspondiente vía el alias `@/components/ui/<nombre>`.
