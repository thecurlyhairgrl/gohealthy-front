import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DAYS } from '@/lib/meal-plan'
import { WEEK_DAY } from '@/lib/labels'

/**
 * Copiar las comidas de un día a otros días. Las comidas de esos días se reemplazan.
 */
export function CopiarDiaDialog({ day, onCopy, onClose }) {
  return (
    <Dialog open={Boolean(day)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">{day && <CopiarDiaForm day={day} onCopy={onCopy} onClose={onClose} />}</DialogContent>
    </Dialog>
  )
}

function CopiarDiaForm({ day, onCopy, onClose }) {
  const [targets, setTargets] = useState([])

  function toggle(target, checked) {
    setTargets((current) => (checked ? [...current, target] : current.filter((item) => item !== target)))
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">Copiar el {WEEK_DAY[day].toLowerCase()}</DialogTitle>
        <DialogDescription>Las comidas de los días que elijas se reemplazan.</DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        {DAYS.filter((item) => item !== day).map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Checkbox id={`copy-${item}`} checked={targets.includes(item)} onCheckedChange={(checked) => toggle(item, checked)} />
            <Label htmlFor={`copy-${item}`}>{WEEK_DAY[item]}</Label>
          </div>
        ))}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={targets.length === 0} onClick={() => onCopy(targets)}>
          Copiar a {targets.length} {targets.length === 1 ? 'día' : 'días'}
        </Button>
      </DialogFooter>
    </div>
  )
}
