import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

/**
 * Al editar un plan se pide el motivo del cambio; queda en el historial de versiones.
 */
export function MotivoCambioDialog({ open, saving, onConfirm, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="sm:max-w-md">{open && <MotivoForm saving={saving} onConfirm={onConfirm} onClose={onClose} />}</DialogContent>
    </Dialog>
  )
}

function MotivoForm({ saving, onConfirm, onClose }) {
  const [reason, setReason] = useState('')

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">¿Por qué cambias el plan?</DialogTitle>
        <DialogDescription>Se guarda en el historial, junto con la versión anterior.</DialogDescription>
      </DialogHeader>
      <Textarea autoFocus rows={3} placeholder="Ej. Ajuste de porciones por buen avance" value={reason} onChange={(event) => setReason(event.target.value)} aria-label="Motivo del cambio" />
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={!reason.trim() || saving} onClick={() => onConfirm(reason.trim())}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </DialogFooter>
    </div>
  )
}
