import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

/**
 * Input de búsqueda para filtrar pacientes por nombre.
 * El filtrado ocurre en tiempo real conforme el usuario escribe.
 */
function BuscadorPacientes({ valor, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="buscador-pacientes"
        type="text"
        aria-label="Buscar pacientes"
        placeholder="Buscar paciente..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}

export default BuscadorPacientes
