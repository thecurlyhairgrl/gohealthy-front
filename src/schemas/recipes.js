import { z } from 'zod'

export const recipeSchema = z.object({
  name: z.string().trim().min(1, 'Escribe el nombre'),
  mealTimes: z.array(z.string()).min(1, 'Elige al menos una comida'),
  prepMinutes: z.string().optional(),
  ingredients: z
    .array(
      z.object({
        food: z.string().optional(),
        name: z.string(),
        groupKey: z.string(),
        suggestedQuantity: z.number().optional(),
        equivalents: z.number().positive('Debe ser mayor a 0'),
        quantity: z.number().optional(),
        unit: z.string().optional(),
      }),
    )
    .min(1, 'Agrega al menos un ingrediente'),
  steps: z.array(z.object({ text: z.string().trim().min(1, 'Escribe el paso o quítalo') })).min(1, 'Agrega al menos un paso'),
})
