import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import logoGoHealthy from '@/assets/GoHealthyLogo.png'
import authImage1 from '@/assets/auth/auth1.png'
import authImage2 from '@/assets/auth/auth2.png'
import authImage3 from '@/assets/auth/auth3.png'

const authImages = [authImage1, authImage2, authImage3]

// Panel izquierdo: imagen real si ya existe (`image`), o una aleatoria de
// src/assets/auth/ elegida al entrar a la página, con degradado + ícono
// como respaldo si por algún motivo no hay imágenes disponibles.
function AuthVisualPanel({ image, gradient, icon: Icon, phrase }) {
  const randomImage = useMemo(
    () => authImages[Math.floor(Math.random() * authImages.length)],
    []
  )
  const resolvedImage = image ?? randomImage

  return (
    <div className="relative hidden overflow-hidden md:block">
      {resolvedImage ? (
        <img src={resolvedImage} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className={`flex size-full items-center justify-center bg-gradient-to-br ${gradient}`}>
          {Icon && <Icon className="size-24 text-primary-foreground/25" strokeWidth={1.25} />}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <p className="absolute bottom-8 left-8 max-w-xs text-xl font-semibold text-white">
        {phrase}
      </p>
    </div>
  )
}

export function AuthLayout({ image, gradient, icon, phrase, children }) {
  return (
    <div className="grid h-dvh overflow-hidden md:grid-cols-2">
      <AuthVisualPanel image={image} gradient={gradient} icon={icon} phrase={phrase} />

      <div className="flex items-center justify-center overflow-y-auto px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm space-y-8">
          <Link to="/" className="flex justify-center">
            <img src={logoGoHealthy} alt="GoHealthy" className="h-7 w-auto object-contain" />
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
