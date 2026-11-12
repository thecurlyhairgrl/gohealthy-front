import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import logoGoHealthy from '@/assets/GoHealthyLogo.png'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-accent to-accent/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <img src={logoGoHealthy} alt="GoHealthy" className="h-6 w-auto object-contain sm:h-7" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to="/auth/login" />}
          >
            Log In
          </Button>
          <Button size="sm" nativeButton={false} render={<Link to="/auth/signin" />}>
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  )
}
