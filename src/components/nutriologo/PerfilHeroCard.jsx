import { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, CheckCircle2, Pencil, ShieldCheck } from 'lucide-react'

/**
 * Tarjeta principal de cabecera para el perfil del nutriólogo.
 * Incluye avatar con soporte para carga y vista previa de foto local,
 * datos principales, credenciales y botón para editar perfil.
 */
export function PerfilHeroCard({ perfil, onEditarPerfil, onSubirAvatar }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onSubirAvatar(url)
    }
  }

  const iniciales = `${perfil.nombres?.[0] || 'C'}${perfil.apellidos?.[0] || 'M'}`

  return (
    <Card className="border-border/70 bg-card shadow-xs overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Contenedor del Avatar con botón de cámara interactivo */}
            <div className="relative group">
              <div className="flex size-24 sm:size-28 items-center justify-center rounded-full bg-primary/20 text-primary font-heading font-bold text-2xl sm:text-3xl shadow-xs overflow-hidden border-2 border-primary/30">
                {perfil.avatarUrl ? (
                  <img
                    src={perfil.avatarUrl}
                    alt={perfil.nombre}
                    className="size-full object-cover"
                  />
                ) : (
                  <span>{iniciales}</span>
                )}
              </div>

              {/* Botón flotante para cambiar foto */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Cambiar foto de perfil"
                aria-label="Subir foto de perfil"
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
              >
                <Camera className="size-4" />
              </button>

              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Información principal */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Dr. {perfil.nombres} {perfil.apellidos}
                </h1>
                <Badge
                  variant="outline"
                  className="border-green-600/40 bg-green-500/10 text-green-700 text-xs flex items-center gap-1 font-medium"
                >
                  <CheckCircle2 className="size-3 text-green-600" />
                  Verificado
                </Badge>
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                {perfil.especialidad}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-mono">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Céd. Prof. {perfil.cedula}
                </span>
                <span>•</span>
                <span>Miembro desde {perfil.fechaRegistro}</span>
              </div>
            </div>
          </div>

          {/* Botón de acción Editar */}
          <div className="flex justify-center sm:justify-end">
            <Button
              onClick={onEditarPerfil}
              className="flex items-center gap-2 font-medium"
            >
              <Pencil className="size-4" />
              <span>Editar Perfil</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
