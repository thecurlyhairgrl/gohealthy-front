import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User, Mail, Phone, Calendar, HeartHandshake } from 'lucide-react'

/**
 * Tarjeta que visualiza los datos personales y de contacto del nutriólogo.
 */
export function PerfilDatosPersonalesCard({ perfil }) {
  // Formatear fecha de nacimiento
  const fechaNacFormateada = perfil.fechaNacimiento
    ? new Date(`${perfil.fechaNacimiento}T00:00:00`).toLocaleDateString(
        'es-MX',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      )
    : 'No especificada'

  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="font-heading text-base font-semibold flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span>Información Personal y de Contacto</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nombre completo */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-primary/70" />
              Nombre Completo
            </p>
            <p className="text-sm font-medium text-foreground">
              {perfil.nombres} {perfil.apellidos}
            </p>
          </div>

          {/* Correo */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary/70" />
              Correo Electrónico
            </p>
            <p className="text-sm font-medium text-foreground">
              {perfil.email}
            </p>
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Phone className="size-3.5 text-primary/70" />
              Teléfono / WhatsApp
            </p>
            <p className="text-sm font-medium font-mono text-foreground">
              {perfil.telefono}
            </p>
          </div>

          {/* Sexo */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <HeartHandshake className="size-3.5 text-primary/70" />
              Sexo / Género
            </p>
            <p className="text-sm font-medium text-foreground">
              {perfil.sexo}
            </p>
          </div>

          {/* Fecha de nacimiento */}
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary/70" />
              Fecha de Nacimiento
            </p>
            <p className="text-sm font-medium text-foreground">
              {fechaNacFormateada}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
