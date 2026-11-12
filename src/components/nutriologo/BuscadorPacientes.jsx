import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

/**
 * Input de búsqueda (pacientes o recetas). El filtrado ocurre en la página.
 * El filtrado ocurre en tiempo real conforme el usuario escribe.
 */
function BuscadorPacientes({ valor, onChange, placeholder = 'Buscar paciente...' }) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="buscador-pacientes"
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}

export default BuscadorPacientes
