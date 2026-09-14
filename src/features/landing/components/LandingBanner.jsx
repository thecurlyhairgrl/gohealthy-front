import { bannerText as defaultBannerText } from '@/features/landing/data/landing-content'

export function LandingBanner({ text = defaultBannerText }) {
  return (
    <section className="bg-primary px-4 py-14 sm:py-20">
      <p className="mx-auto max-w-4xl text-center font-heading text-3xl leading-tight font-bold uppercase text-primary-foreground md:text-5xl">
        {text}
      </p>
    </section>
  )
}
