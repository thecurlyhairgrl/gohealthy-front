import { useRef, useState } from 'react'
import { Camera, Pencil, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import { useAuth } from '@/context/AuthContext'
import { uploadAvatarRequest } from '@/api/auth'
import { fullName, initials } from '@/lib/labels'
import { getImageUrl } from '@/lib/image-url'

/**
 * Cabecera del perfil: foto (se puede cambiar), nombre, especialidad y cédula.
 */
export function PerfilHeroCard({ onEditarPerfil }) {
  const { user, saveUser } = useAuth()
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const updatedUser = await uploadAvatarRequest(file)
      saveUser(updatedUser)
      toast.add({ title: 'Foto actualizada', type: 'success' })
    } catch (error) {
      toast.add({ title: 'No se pudo subir la foto', description: error.message, type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="overflow-hidden border-border/70 shadow-xs">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <Avatar className="size-24 border-2 border-primary/30 text-2xl font-bold sm:size-28">
                <AvatarImage src={getImageUrl(user.avatarUrl)} alt="" />
                <AvatarFallback className="bg-primary/20 text-primary">{initials(user)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Cambiar foto de perfil"
                aria-label="Cambiar foto de perfil"
                className="absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
              >
                {uploading ? <Spinner className="size-4" /> : <Camera className="size-4" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="space-y-1.5">
              <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">{fullName(user)}</h1>
              <p className="text-sm font-medium text-muted-foreground">{user.specialty || 'Nutriólogo(a)'}</p>
              {user.professionalLicense && (
                <p className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Céd. Prof. {user.professionalLicense}
                </p>
              )}
              <p className="text-xs text-muted-foreground">La foto se recorta en cuadrado (JPG, PNG o WebP).</p>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <Button onClick={onEditarPerfil}>
              <Pencil data-icon="inline-start" />
              Editar perfil
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
