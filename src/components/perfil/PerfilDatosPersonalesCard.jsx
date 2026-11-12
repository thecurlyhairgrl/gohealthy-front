import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, User } from 'lucide-react'
import { fullName } from '@/lib/labels'

// Un dato con su ícono y etiqueta
export function PerfilDato({ icon: Icon, label, value, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5 text-primary/70" />
        {label}
      </p>
      <p className="text-sm font-medium">{value || 'Sin registrar'}</p>
    </div>
  )
}

/**
 * Datos personales y de contacto del nutriólogo.
 */
export function PerfilDatosPersonalesCard({ perfil }) {
  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
          <User className="size-4 text-primary" />
          Información personal y de contacto
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
        <PerfilDato icon={User} label="Nombre completo" value={fullName(perfil)} className="sm:col-span-2" />
        <PerfilDato icon={Mail} label="Correo electrónico" value={perfil.email} />
        <PerfilDato icon={Phone} label="Teléfono" value={perfil.phone} />
      </CardContent>
    </Card>
  )
}
