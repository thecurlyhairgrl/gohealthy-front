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

function EditarPerfilForm({ perfil, onGuardar, onClose }) {
  const [nombres, setNombres] = useState(perfil.nombres || '')
  const [apellidos, setApellidos] = useState(perfil.apellidos || '')
  const [email, setEmail] = useState(perfil.email || '')
  const [telefono, setTelefono] = useState(perfil.telefono || '')
  const [sexo, setSexo] = useState(perfil.sexo || 'Masculino')
  const [cedula, setCedula] = useState(perfil.cedula || '')
  const [consultorio, setConsultorio] = useState(perfil.consultorio || '')
  const [biografia, setBiografia] = useState(perfil.biografia || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onGuardar({
      ...perfil,
      nombres,
      apellidos,
      nombre: `${nombres} ${apellidos}`.trim(),
      email,
      telefono,
      sexo,
      cedula,
      consultorio,
      biografia,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="font-heading text-xl">
          Editar Información de Perfil
        </DialogTitle>
        <DialogDescription>
          Actualiza tus datos personales y de contacto profesional.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3.5 max-h-[60vh] overflow-y-auto px-1 py-2">
        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="perfil-nombres" className="text-xs font-medium">
              Nombre(s)
            </Label>
            <Input
              id="perfil-nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="perfil-apellidos" className="text-xs font-medium">
              Apellidos
            </Label>
            <Input
              id="perfil-apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Correo y Teléfono */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="perfil-email" className="text-xs font-medium">
              Correo Electrónico
            </Label>
            <Input
              id="perfil-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="perfil-telefono" className="text-xs font-medium">
              Teléfono / WhatsApp
            </Label>
            <Input
              id="perfil-telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Sexo y Cédula */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="perfil-sexo" className="text-xs font-medium">
              Sexo / Género
            </Label>
            <select
              id="perfil-sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="perfil-cedula" className="text-xs font-medium">
              Cédula Profesional
            </Label>
            <Input
              id="perfil-cedula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Consultorio */}
        <div className="space-y-1.5">
          <Label htmlFor="perfil-consultorio" className="text-xs font-medium">
            Ubicación del Consultorio
          </Label>
          <Input
            id="perfil-consultorio"
            value={consultorio}
            onChange={(e) => setConsultorio(e.target.value)}
            required
          />
        </div>

        {/* Biografía */}
        <div className="space-y-1.5">
          <Label htmlFor="perfil-biografia" className="text-xs font-medium">
            Biografía y Enfoque Clínico
          </Label>
          <textarea
            id="perfil-biografia"
            rows={3}
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            className="w-full rounded-md border border-input bg-background p-2.5 text-sm shadow-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Guardar Cambios</Button>
      </DialogFooter>
    </form>
  )
}

/**
 * Modal desplegable tipo Dialog para editar la información del nutriólogo.
 */
export function EditarPerfilModal({ isOpen, onClose, perfil, onGuardar }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {isOpen && (
          <EditarPerfilForm
            key={perfil.id || 'perfil-form'}
            perfil={perfil}
            onGuardar={onGuardar}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
