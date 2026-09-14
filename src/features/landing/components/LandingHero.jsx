import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { heroContent } from '@/features/landing/data/landing-content'

export function LandingHero() {
  return (
    <section className="bg-gradient-to-b from-accent to-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="font-heading text-4xl leading-tight font-semibold text-foreground sm:text-5xl md:text-6xl">
            {heroContent.titleLine1}{' '}
            <span className="text-border">{heroContent.titleLine2}</span>
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground md:mx-0">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <Button size="lg" nativeButton={false} render={<Link to="/auth/signin" />}>
              Comenzar ahora
            </Button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col gap-3 md:max-w-none">
          <img
            src={heroContent.images.lifestyle}
            alt="Personas activas disfrutando un estilo de vida saludable"
            className="h-56 w-full rounded-3xl object-cover [clip-path:polygon(0_0,100%_0,100%_100%,0_75%)] sm:h-64"
          />
          <img
            src={heroContent.images.food}
            alt="Platillo saludable con vegetales frescos"
            className="h-56 w-full rounded-3xl object-cover [clip-path:polygon(0_0,100%_25%,100%_100%,0_100%)] sm:h-64"
          />
        </div>
      </div>
    </section>
  )
}
