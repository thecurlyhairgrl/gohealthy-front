import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KeyRound, ShieldAlert, Lock } from 'lucide-react'

/**
 * Tarjeta de seguridad de la cuenta con opción para cambiar contraseña.
 */
export function PerfilSeguridadCard({ onAbrirCambiarPassword }) {
  return (
    <Card className="border-border/70 bg-card shadow-xs">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="font-heading text-base font-semibold flex items-center gap-2">
          <Lock className="size-4 text-primary" />
          <span>Seguridad y Credenciales</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <KeyRound className="size-4 text-primary/70" />
              Contraseña de Acceso
            </p>
            <p className="text-xs text-muted-foreground">
              Se recomienda utilizar una contraseña robusta con números y símbolos especiales.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onAbrirCambiarPassword}
            className="shrink-0 flex items-center gap-2 font-medium"
          >
            <ShieldAlert className="size-4 text-primary" />
            <span>Cambiar Contraseña</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
