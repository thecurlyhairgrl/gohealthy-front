import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, FileText, GraduationCap, MapPin, Stethoscope } from 'lucide-react'
import { PerfilDato } from '@/components/nutriologo/PerfilDatosPersonalesCard'

/**
 * Datos profesionales, consultorio y biografía del nutriólogo.
 */
export function PerfilProfesionalCard({ perfil }) {
  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
          <Award className="size-4 text-primary" />
          Información profesional y consultorio
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
        <PerfilDato icon={Award} label="Cédula profesional" value={perfil.professionalLicense} />
        <PerfilDato icon={Stethoscope} label="Especialidad" value={perfil.specialty} />
        <PerfilDato icon={GraduationCap} label="Universidad" value={perfil.university} />
        <PerfilDato icon={MapPin} label="Consultorio" value={perfil.officeAddress} />
        <div className="space-y-1 sm:col-span-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <FileText className="size-3.5 text-primary/70" />
            Biografía
          </p>
          <p className="rounded-lg border border-border/40 bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {perfil.bio || 'Cuéntales a tus pacientes sobre tu enfoque.'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
