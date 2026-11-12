import { useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import BuscadorPacientes from '@/components/nutriologo/BuscadorPacientes'
import { RecetaCard } from '@/components/nutriologo/RecetaCard'
import { RecetaDetalleSheet } from '@/components/nutriologo/RecetaDetalleSheet'
import RecetaFormModal from '@/components/nutriologo/RecetaFormModal'
import { useRecipes } from '@/hooks/useRecipes'
import { useSmaeGroups } from '@/hooks/useSmaeGroups'
import { deleteRecipeRequest } from '@/api/recipes'
import { MEAL_TIME } from '@/lib/labels'
import { getKcal } from '@/lib/smae'

/**
 * Biblioteca de recetas: las compartidas y las propias del nutriólogo.
 */
function NutricionistaRecetasPage() {
  const { recipes, loading, error, reload } = useRecipes()
  const { groups } = useSmaeGroups()
  const [search, setSearch] = useState('')
  const [mealTime, setMealTime] = useState('all')
  const [selected, setSelected] = useState(null)
  // Formulario: { receta } para editar, {} para una nueva, null si está cerrado
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const term = search.trim().toLowerCase()
  const visible = recipes.filter(
    (recipe) => recipe.name.toLowerCase().includes(term) && (mealTime === 'all' || recipe.mealTimes.includes(mealTime)),
  )

  async function handleDelete() {
    try {
      await deleteRecipeRequest(toDelete._id)
      toast.add({ title: 'Receta eliminada', description: 'Los planes que ya la usan no cambian', type: 'success' })
      setSelected(null)
      reload()
    } catch (err) {
      toast.add({ title: 'No se pudo eliminar', description: err.message, type: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">Recetas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Para armar los planes de tus pacientes</p>
        </div>
        <Button onClick={() => setEditing({})}>
          <Plus data-icon="inline-start" />
          Nueva receta
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="lg:w-80">
          <BuscadorPacientes valor={search} onChange={setSearch} placeholder="Buscar receta..." />
        </div>
        <ToggleGroup variant="outline" className="flex-wrap" value={[mealTime]} onValueChange={(values) => values.length > 0 && setMealTime(values[0])}>
          <ToggleGroupItem value="all">Todas</ToggleGroupItem>
          {Object.entries(MEAL_TIME).map(([key, label]) => (
            <ToggleGroupItem key={key} value={key}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>Sin recetas</EmptyTitle>
            <EmptyDescription>Ninguna receta coincide con la búsqueda.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((recipe) => (
            <RecetaCard key={recipe._id} receta={recipe} kcal={getKcal(recipe.ingredients, groups)} onClick={() => setSelected(recipe)} />
          ))}
        </div>
      )}

      <RecetaDetalleSheet
        receta={selected}
        kcal={selected ? getKcal(selected.ingredients, groups) : 0}
        onClose={() => setSelected(null)}
        onEditar={(recipe) => {
          setSelected(null)
          setEditing({ receta: recipe })
        }}
        onEliminar={setToDelete}
      />
      <RecetaFormModal
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        receta={editing?.receta}
        groups={groups}
        onSaved={reload}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="¿Eliminar la receta?"
        description={`${toDelete?.name}. Los planes que ya la usan no cambian.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default NutricionistaRecetasPage
