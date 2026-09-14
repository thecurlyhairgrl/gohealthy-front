import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

function CambiarPasswordForm({ onClose }) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (nueva.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (nueva !== confirmar) {
      setError('La nueva contraseña y la confirmación no coinciden.')
      return
    }

    // Simulación de cambio exitoso
    setExito(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          Cambiar Contraseña
        </DialogTitle>
        <DialogDescription>
          Ingresa tu contraseña actual y la nueva contraseña para actualizar el acceso.
        </DialogDescription>
      </DialogHeader>

      {exito ? (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-700 border border-green-500/20">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>¡Contraseña actualizada correctamente!</span>
        </div>
      ) : (
        <div className="space-y-3 py-2">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="pass-actual" className="text-xs font-medium">
              Contraseña Actual
            </Label>
            <Input
              id="pass-actual"
              type="password"
              placeholder="••••••••"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pass-nueva" className="text-xs font-medium">
              Nueva Contraseña
            </Label>
            <Input
              id="pass-nueva"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pass-confirmar" className="text-xs font-medium">
              Confirmar Nueva Contraseña
            </Label>
            <Input
              id="pass-confirmar"
              type="password"
              placeholder="Repite la nueva contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <DialogFooter className="gap-2 sm:gap-0 pt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={exito}>
          Cancelar
        </Button>
        <Button type="submit" disabled={exito || !actual || !nueva || !confirmar}>
          Actualizar Contraseña
        </Button>
      </DialogFooter>
    </form>
  )
}

/**
 * Modal para gestionar el cambio seguro de contraseña.
 */
export function CambiarPasswordModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {isOpen && <CambiarPasswordForm key="cambiar-pass-form" onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
