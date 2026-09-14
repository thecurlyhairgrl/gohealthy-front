import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Award, GraduationCap, MapPin, FileText } from 'lucide-react'

/**
 * Tarjeta que visualiza los datos profesionales, consultorio y biografía clínica del nutriólogo.
 */
export function PerfilProfesionalCard({ perfil }) {
  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="font-heading text-base font-semibold flex items-center gap-2">
          <Award className="size-4 text-primary" />
          <span>Información Profesional y Consultorio</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cédula Profesional */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Award className="size-3.5 text-primary/70" />
              Cédula Profesional
            </p>
            <p className="text-sm font-medium font-mono text-foreground">
              {perfil.cedula}
            </p>
          </div>

          {/* Universidad */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-primary/70" />
              Institución de Egreso
            </p>
            <p className="text-sm font-medium text-foreground">
              {perfil.universidad}
            </p>
          </div>
        </div>

        {/* Consultorio */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary/70" />
            Ubicación del Consultorio
          </p>
          <p className="text-sm font-medium text-foreground">
            {perfil.consultorio}
          </p>
        </div>

        {/* Biografía / Enfoque */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <FileText className="size-3.5 text-primary/70" />
            Enfoque Clínico y Biografía
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/40">
            {perfil.biografia}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
