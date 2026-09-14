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
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Video,
  FileText,
} from 'lucide-react'

function AgendarCitaForm({ fechaInicial, pacientes, onGuardarCita, onClose }) {
  const [pacienteId, setPacienteId] = useState('')
  const [fecha, setFecha] = useState(
    fechaInicial || new Date().toISOString().split('T')[0]
  )
  const [hora, setHora] = useState('10:00')
  const [modalidad, setModalidad] = useState('Presencial')
  const [motivo, setMotivo] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!pacienteId || !fecha || !hora) return

    const pacienteSeleccionado = pacientes.find(
      (p) => String(p.id) === String(pacienteId)
    )

    const nuevaCita = {
      id: Date.now(),
      pacienteId: Number(pacienteId),
      pacienteNombre: pacienteSeleccionado
        ? pacienteSeleccionado.nombre
        : 'Paciente',
      fecha,
      hora,
      duracion: '45 min',
      modalidad,
      motivo: motivo || 'Consulta general',
      estado: 'Confirmada',
    }

    onGuardarCita(nuevaCita)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          Agendar Nueva Cita
        </DialogTitle>
        <DialogDescription>
          Completa los datos para programar una consulta con el paciente.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3.5 py-2">
        {/* Seleccionar Paciente */}
        <div className="space-y-1.5">
          <Label
            htmlFor="paciente-select"
            className="text-xs font-medium flex items-center gap-1.5"
          >
            <User className="size-3.5 text-primary" />
            Paciente
          </Label>
          <select
            id="paciente-select"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>
              Selecciona un paciente...
            </option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre} ({paciente.objetivo})
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora en Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="fecha-cita"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              <CalendarIcon className="size-3.5 text-primary" />
              Fecha
            </Label>
            <Input
              id="fecha-cita"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="hora-cita"
              className="text-xs font-medium flex items-center gap-1.5"
            >
              <Clock className="size-3.5 text-primary" />
              Hora
            </Label>
            <Input
              id="hora-cita"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Modalidad (Presencial / Online) */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Modalidad</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModalidad('Presencial')}
              className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                modalidad === 'Presencial'
                  ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <MapPin className="size-4 text-primary" />
              Presencial
            </button>
            <button
              type="button"
              onClick={() => setModalidad('Online')}
              className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                modalidad === 'Online'
                  ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <Video className="size-4 text-blue-500" />
              Online / Virtual
            </button>
          </div>
        </div>

        {/* Motivo o Notas */}
        <div className="space-y-1.5">
          <Label
            htmlFor="motivo-cita"
            className="text-xs font-medium flex items-center gap-1.5"
          >
            <FileText className="size-3.5 text-primary" />
            Motivo de la consulta
          </Label>
          <Input
            id="motivo-cita"
            placeholder="Ej. Revisión mensual, evaluación de analítica..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!pacienteId || !fecha || !hora}>
          Guardar Cita
        </Button>
      </DialogFooter>
    </form>
  )
}

/**
 * Modal para agendar una nueva cita médica.
 * Permite seleccionar el paciente, fecha, hora, modalidad y motivo.
 */
export function AgendarCitaModal({
  isOpen,
  onClose,
  fechaInicial,
  pacientes = [],
  onGuardarCita,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {isOpen && (
          <AgendarCitaForm
            key={fechaInicial || 'default'}
            fechaInicial={fechaInicial}
            pacientes={pacientes}
            onGuardarCita={onGuardarCita}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
