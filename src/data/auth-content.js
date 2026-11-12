import { HeartPulse, KeyRound, Mail, ShieldCheck, Sparkles } from 'lucide-react'

// Contenido visual de cada página de auth: imagen, frase e ícono decorativo.
// `image` queda en null hasta que se suban las fotos reales a src/assets/auth/
// (ver spec-auth.md §2); mientras tanto, AuthLayout usa `gradient` + `icon`
// como respaldo visual para no bloquear la implementación del flujo.
export const authContent = {
  login: {
    image: null,
    gradient: 'from-primary via-accent to-secondary',
    icon: HeartPulse,
    phrase: 'Tu bienestar comienza con un solo paso.',
  },
  signup: {
    image: null,
    gradient: 'from-secondary via-primary to-accent',
    icon: Sparkles,
    phrase: 'Empieza hoy tu cambio de hábitos.',
  },
  recoveryEmail: {
    image: null,
    gradient: 'from-accent via-secondary to-primary',
    icon: Mail,
    phrase: 'Estamos aquí para ayudarte a volver.',
  },
  recoveryOtp: {
    image: null,
    gradient: 'from-primary via-secondary to-accent',
    icon: ShieldCheck,
    phrase: 'Un código, un paso más cerca.',
  },
  recoveryNewPassword: {
    image: null,
    gradient: 'from-secondary via-accent to-primary',
    icon: KeyRound,
    phrase: 'Una contraseña nueva, un nuevo comienzo.',
  },
}
