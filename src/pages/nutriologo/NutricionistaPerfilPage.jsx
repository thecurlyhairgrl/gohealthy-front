import { useState } from 'react'
import { PerfilHeroCard } from '@/components/perfil/PerfilHeroCard'
import { PerfilDatosPersonalesCard } from '@/components/perfil/PerfilDatosPersonalesCard'
import { PerfilProfesionalCard } from '@/components/nutriologo/PerfilProfesionalCard'
import { PerfilSeguridadCard } from '@/components/perfil/PerfilSeguridadCard'
import { EditarPerfilModal } from '@/components/perfil/EditarPerfilModal'
import { CambiarPasswordModal } from '@/components/perfil/CambiarPasswordModal'
import { useAuth } from '@/context/AuthContext'

/**
 * Perfil del nutriólogo: sus datos salen de la sesión (AuthContext).
 */
function NutricionistaPerfilPage() {
  const { user } = useAuth()
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PerfilHeroCard onEditarPerfil={() => setIsEditarModalOpen(true)} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PerfilDatosPersonalesCard perfil={user} />
        <PerfilProfesionalCard perfil={user} />
      </div>

      <PerfilSeguridadCard onAbrirCambiarPassword={() => setIsPasswordModalOpen(true)} />

      <EditarPerfilModal isOpen={isEditarModalOpen} onClose={() => setIsEditarModalOpen(false)} />
      <CambiarPasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  )
}

export default NutricionistaPerfilPage
