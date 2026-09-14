import { features } from '@/features/landing/data/landing-content'

export function LandingFeatures() {
  return (
    <section className="bg-accent/25 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-heading text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
          Todo lo que necesitas
          <br />
          para comer mejor.
        </h2>

        <div className="mt-12 grid gap-10 text-center md:grid-cols-3 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-2">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
