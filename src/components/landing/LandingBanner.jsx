import { bannerText as defaultBannerText } from '@/data/landing-content'

export function LandingBanner({ text = defaultBannerText }) {
  return (
    <section className="w-full bg-primary px-4 py-14 sm:py-20 justify-items-center">
      <p className="mx-auto block w-full max-w-4xl text-center font-heading text-3xl font-bold uppercase leading-tight text-primary-foreground md:text-5xl">
        {text}
      </p>
    </section>
  )
}
