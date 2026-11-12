import { useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { toast } from '@/components/ui/toast'
import { FormField } from '@/components/FormField'
import { BuscadorAlimentos } from '@/components/nutriologo/BuscadorAlimentos'
import { createRecipeRequest, updateRecipeRequest, uploadRecipeImageRequest } from '@/api/recipes'
import { MEAL_TIME } from '@/lib/labels'
import { getImageUrl } from '@/lib/image-url'
import { getKcal, quantityFor } from '@/lib/smae'
import { recipeSchema } from '@/schemas/recipes'

/**
 * Diálogo para crear o editar una receta propia.
 * Los ingredientes salen del SMAE; la cantidad se calcula con los equivalentes.
 */
function RecetaFormModal({ open, onOpenChange, receta, groups, onSaved }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        {open && <RecetaForm receta={receta} groups={groups} onSaved={onSaved} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}

function RecetaForm({ receta, groups, onSaved, onClose }) {
  const [apiError, setApiError] = useState(null)
  const [image, setImage] = useState(null)
  const isEdit = Boolean(receta)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: receta?.name || '',
      mealTimes: receta?.mealTimes || [],
      prepMinutes: receta?.prepMinutes ? String(receta.prepMinutes) : '',
      // Guardamos la cantidad de 1 equivalente para recalcular al cambiar los equivalentes
      ingredients: (receta?.ingredients || []).map((ingredient) => ({
        food: ingredient.food || undefined,
        name: ingredient.name,
        groupKey: ingredient.groupKey,
        suggestedQuantity: ingredient.quantity && ingredient.equivalents ? ingredient.quantity / ingredient.equivalents : undefined,
        equivalents: ingredient.equivalents,
        unit: ingredient.unit || '',
      })),
      steps: (receta?.steps || ['']).map((text) => ({ text })),
    },
  })

  const ingredients = useFieldArray({ control, name: 'ingredients' })
  const steps = useFieldArray({ control, name: 'steps' })
  const watchedIngredients = useWatch({ control, name: 'ingredients' })

  function handleAddFood(food) {
    ingredients.append({
      food: food._id,
      name: food.name,
      groupKey: food.groupKey,
      suggestedQuantity: food.suggestedQuantity,
      equivalents: 1,
      unit: food.unit,
    })
  }

  async function onSubmit(formData) {
    setApiError(null)
    const recipeData = {
      name: formData.name,
      mealTimes: formData.mealTimes,
      prepMinutes: formData.prepMinutes ? Number(formData.prepMinutes) : undefined,
      ingredients: formData.ingredients.map((ingredient) => ({
        food: ingredient.food,
        name: ingredient.name,
        groupKey: ingredient.groupKey,
        equivalents: ingredient.equivalents,
        quantity: ingredient.suggestedQuantity ? quantityFor(ingredient.suggestedQuantity, ingredient.equivalents) : undefined,
        unit: ingredient.unit,
      })),
      steps: formData.steps.map((step) => step.text),
    }

    try {
      const saved = isEdit ? await updateRecipeRequest(receta._id, recipeData) : await createRecipeRequest(recipeData)
      // La foto se sube después de guardar la receta
      if (image) {
        try {
          await uploadRecipeImageRequest(saved._id, image)
        } catch (error) {
          toast.add({ title: 'La receta se guardó, pero no la foto', description: error.message, type: 'warning' })
        }
      }
      toast.add({ title: isEdit ? 'Receta actualizada' : 'Receta creada', type: 'success' })
      onSaved()
      onClose()
    } catch (error) {
      setApiError(error.message)
    }
  }

  const kcal = getKcal(watchedIngredients || [], groups)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">{isEdit ? 'Editar receta' : 'Nueva receta'}</DialogTitle>
        <DialogDescription>Los ingredientes salen del SMAE; las kcal se calculan con sus equivalentes.</DialogDescription>
      </DialogHeader>

      {apiError && <p className="text-sm text-destructive">{apiError}</p>}

      <FieldGroup className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        <FormField label="Nombre" htmlFor="name" error={errors.name}>
          <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
        </FormField>
        <FormField label="Minutos" htmlFor="prepMinutes" error={errors.prepMinutes}>
          <Input id="prepMinutes" type="number" min="0" {...register('prepMinutes')} />
        </FormField>
      </FieldGroup>

      <FormField label="¿En qué comidas va?" htmlFor="mealTimes" error={errors.mealTimes}>
        <Controller
          control={control}
          name="mealTimes"
          render={({ field }) => (
            <ToggleGroup id="mealTimes" multiple variant="outline" className="flex-wrap" value={field.value} onValueChange={field.onChange}>
              {Object.entries(MEAL_TIME).map(([key, label]) => (
                <ToggleGroupItem key={key} value={key}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </FormField>

      <FieldSet>
        <FieldLegend>Ingredientes · {kcal} kcal</FieldLegend>
        {ingredients.fields.length > 0 && (
          <ul className="divide-y divide-border/50 rounded-xl border">
            {ingredients.fields.map((field, index) => {
              const current = watchedIngredients?.[index] || field
              return (
                <li key={field.id} className="flex items-center gap-3 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{field.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {current.suggestedQuantity ? `${quantityFor(current.suggestedQuantity, current.equivalents || 0)} ${current.unit}` : current.unit}
                    </p>
                  </div>
                  <Input
                    type="number"
                    step="0.25"
                    min="0.25"
                    aria-label={`Equivalentes de ${field.name}`}
                    className="w-20"
                    {...register(`ingredients.${index}.equivalents`, { valueAsNumber: true })}
                  />
                  <span className="text-xs text-muted-foreground">eq.</span>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Quitar ${field.name}`} onClick={() => ingredients.remove(index)}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
        <BuscadorAlimentos onSelect={handleAddFood} placeholder="Agregar ingrediente: busca un alimento..." />
        {errors.ingredients && <FieldError errors={[errors.ingredients.root || errors.ingredients]} />}
      </FieldSet>

      <FieldSet>
        <FieldLegend>Pasos</FieldLegend>
        <ol className="space-y-2">
          {steps.fields.map((field, index) => (
            <li key={field.id} className="flex items-start gap-2">
              <span className="mt-2 w-5 text-sm text-muted-foreground">{index + 1}.</span>
              <div className="flex-1">
                <Textarea rows={2} aria-label={`Paso ${index + 1}`} aria-invalid={Boolean(errors.steps?.[index]?.text)} {...register(`steps.${index}.text`)} />
                {errors.steps?.[index]?.text && <p className="mt-1 text-xs text-destructive">{errors.steps[index].text.message}</p>}
              </div>
              <Button type="button" variant="ghost" size="icon-sm" aria-label={`Quitar paso ${index + 1}`} onClick={() => steps.remove(index)}>
                <Trash2 className="text-destructive" />
              </Button>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => steps.append({ text: '' })}>
          <Plus data-icon="inline-start" />
          Agregar paso
        </Button>
        {errors.steps?.root && <FieldError errors={[errors.steps.root]} />}
        {errors.steps?.message && <FieldError errors={[errors.steps]} />}
      </FieldSet>

      <div className="space-y-2">
        <FieldLabel htmlFor="image">Foto (opcional)</FieldLabel>
        {receta?.imageUrl && !image && <img src={getImageUrl(receta.imageUrl)} alt="" className="aspect-4/3 w-40 rounded-lg object-cover" />}
        <Input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files[0] || null)} />
        <p className="text-xs text-muted-foreground">JPG, PNG o WebP de al menos 600×450. Se recorta en proporción 4:3.</p>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar receta'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default RecetaFormModal
