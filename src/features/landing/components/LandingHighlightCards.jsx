import { Button } from '@/components/ui/button'
import { highlightCards } from '@/features/landing/data/landing-content'

export function LandingHighlightCards() {
  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {highlightCards.map((card, index) => (
          <div
            key={card.text}
            className={`flex flex-col items-center gap-6 rounded-3xl bg-muted p-8 text-center ${
              index === 1 ? 'md:mt-[-24px] md:mb-6' : ''
            }`}
          >
            <p className="text-muted-foreground">{card.text}</p>
            <Button variant="outline" size="sm" className="mt-auto">
              {card.ctaLabel}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
