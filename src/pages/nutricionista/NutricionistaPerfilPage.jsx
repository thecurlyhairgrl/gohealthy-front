import { useState } from 'react'
import { nutriologoMock } from '@/features/nutricionista/data/mock-data'
import { PerfilHeroCard } from '@/features/nutricionista/components/PerfilHeroCard'
import { PerfilDatosPersonalesCard } from '@/features/nutricionista/components/PerfilDatosPersonalesCard'
import { PerfilProfesionalCard } from '@/features/nutricionista/components/PerfilProfesionalCard'
import { PerfilSeguridadCard } from '@/features/nutricionista/components/PerfilSeguridadCard'
import { EditarPerfilModal } from '@/features/nutricionista/components/EditarPerfilModal'
import { CambiarPasswordModal } from '@/features/nutricionista/components/CambiarPasswordModal'

/**
 * Página principal de Mi Perfil para el rol de Nutriólogo.
 * Visualiza y permite editar datos personales, de contacto y profesionales,
 * así como subir avatar y gestionar la contraseña.
 */
export function NutricionistaPerfilPage() {
  const [perfil, setPerfil] = useState(nutriologoMock)
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handleSubirAvatar = (avatarUrl) => {
    setPerfil((prev) => ({
      ...prev,
      avatarUrl,
    }))
  }

  const handleGuardarPerfil = (datosActualizados) => {
    setPerfil(datosActualizados)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabecera / Tarjeta Hero */}
      <PerfilHeroCard
        perfil={perfil}
        onEditarPerfil={() => setIsEditarModalOpen(true)}
        onSubirAvatar={handleSubirAvatar}
      />

      {/* Grid de bloques de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerfilDatosPersonalesCard perfil={perfil} />
        <PerfilProfesionalCard perfil={perfil} />
      </div>

      {/* Sección de seguridad */}
      <PerfilSeguridadCard
        onAbrirCambiarPassword={() => setIsPasswordModalOpen(true)}
      />

      {/* Modal de edición */}
      <EditarPerfilModal
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        perfil={perfil}
        onGuardar={handleGuardarPerfil}
      />

      {/* Modal de cambio de contraseña */}
      <CambiarPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}

export default NutricionistaPerfilPage
