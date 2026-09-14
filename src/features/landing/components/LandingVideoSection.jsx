import { Play } from 'lucide-react'
import { videoSection } from '@/features/landing/data/landing-content'

export function LandingVideoSection() {
  return (
    <section className="bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center md:gap-14">
        <button
          type="button"
          onClick={() => {
            // TODO: integrar reproducción de video
          }}
          aria-label="Reproducir video"
          className="group flex aspect-video w-full cursor-pointer items-center justify-center rounded-3xl bg-border"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-transform group-hover:scale-105 sm:size-20">
            <Play className="size-6 fill-current sm:size-7" />
          </span>
        </button>

        <p className="text-center text-lg text-foreground md:text-left md:text-xl">
          {videoSection.caption}
        </p>
      </div>
    </section>
  )
}
