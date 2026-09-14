import { useState } from 'react'
import { PlusCircle, Calendar, Scale, Activity, FileText } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'

/**
 * Modal para registrar una nueva sesión o consulta de seguimiento del paciente.
 * Permite capturar la fecha, el nuevo peso registrado, el % de grasa y las notas de evolución.
 */
export default function RegistrarSesionModal({
  open,
  onOpenChange,
  paciente,
  onGuardarSesion,
}) {
  const hoyStr = new Date().toISOString().split('T')[0]
  const [fecha, setFecha] = useState(hoyStr)
  const [peso, setPeso] = useState('')
  const [grasaCorporal, setGrasaCorporal] = useState('')
  const [nota, setNota] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const pesoNum = parseFloat(peso)
    if (isNaN(pesoNum) || pesoNum <= 0) return

    onGuardarSesion({
      fecha,
      peso: pesoNum,
      grasaCorporal: grasaCorporal.trim() ? grasaCorporal.trim() : null,
      nota: nota.trim() || 'Consulta de seguimiento rutinaria.',
    })

    // Limpiar formulario y cerrar
    setPeso('')
    setGrasaCorporal('')
    setNota('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-lg">
            <PlusCircle className="size-5 text-[#2F6B4E]" />
            Registrar Nueva Sesión de Seguimiento
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Actualiza el peso y progreso de <strong className="text-foreground">{paciente.nombre}</strong> para esta sesión.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fecha-sesion" className="text-xs font-medium flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground" />
                Fecha de la sesión
              </Label>
              <Input
                id="fecha-sesion"
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="peso-sesion" className="text-xs font-medium flex items-center gap-1.5">
                <Scale className="size-3.5 text-muted-foreground" />
                Nuevo Peso (kg) *
              </Label>
              <Input
                id="peso-sesion"
                type="number"
                step="0.1"
                min="20"
                max="300"
                required
                placeholder={paciente.pesoActual ? `ej. ${paciente.pesoActual}` : 'ej. 65.0'}
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="h-9 text-xs font-mono font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="grasa-sesion" className="text-xs font-medium flex items-center gap-1.5">
              <Activity className="size-3.5 text-muted-foreground" />
              % Grasa Corporal (opcional)
            </Label>
            <Input
              id="grasa-sesion"
              type="text"
              placeholder={paciente.grasaCorporal ? `ej. ${paciente.grasaCorporal}` : 'ej. 23.5%'}
              value={grasaCorporal}
              onChange={(e) => setGrasaCorporal(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nota-sesion" className="text-xs font-medium flex items-center gap-1.5">
              <FileText className="size-3.5 text-muted-foreground" />
              Notas de la consulta y evolución
            </Label>
            <Textarea
              id="nota-sesion"
              rows={3}
              placeholder="Anotar cumplimiento del plan, cambios físicos, estado de ánimo, observaciones antropométricas..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="text-xs leading-relaxed"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#2F6B4E] hover:bg-[#2F6B4E]/90 text-white"
            >
              Guardar Sesión
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
