import { Award, Mail, MapPin, Phone, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { PerfilDato } from '@/components/perfil/PerfilDatosPersonalesCard'
import { useMyNutritionist } from '@/hooks/useMyNutritionist'
import { fullName, initials } from '@/lib/labels'
import { getImageUrl } from '@/lib/image-url'

/**
 * Datos públicos del nutriólogo del paciente.
 */
export function MiNutriologoCard() {
  const { nutritionist, loading, error } = useMyNutritionist()

  if (loading) return <Skeleton className="h-48 w-full" />
  if (error) return <p className="text-sm text-destructive">{error}</p>

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="border-b border-border/50 pb-3">
        <CardTitle className="flex items-center gap-2 font-heading text-base font-semibold">
          <Stethoscope className="size-4 text-primary" />
          Mi nutriólogo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 text-lg font-bold">
            <AvatarImage src={getImageUrl(nutritionist.avatarUrl)} alt="" />
            <AvatarFallback className="bg-primary/20 text-primary">{initials(nutritionist)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-heading text-lg font-semibold">{fullName(nutritionist)}</p>
            <p className="text-sm text-muted-foreground">{nutritionist.specialty || 'Nutriólogo(a)'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PerfilDato icon={Mail} label="Correo" value={nutritionist.email} />
          <PerfilDato icon={Phone} label="Teléfono" value={nutritionist.phone} />
          <PerfilDato icon={Award} label="Cédula profesional" value={nutritionist.professionalLicense} />
          <PerfilDato icon={MapPin} label="Consultorio" value={nutritionist.officeAddress} />
        </div>
        {nutritionist.bio && (
          <p className="rounded-lg border border-border/40 bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {nutritionist.bio}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
