import { LandingHeader } from '@/features/landing/components/LandingHeader'
import { LandingHero } from '@/features/landing/components/LandingHero'
import { LandingBanner } from '@/features/landing/components/LandingBanner'
import { LandingFeatures } from '@/features/landing/components/LandingFeatures'
import { LandingVideoSection } from '@/features/landing/components/LandingVideoSection'
import { LandingHighlightCards } from '@/features/landing/components/LandingHighlightCards'
import { LandingFooter } from '@/features/landing/components/LandingFooter'

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <LandingHero />
      <LandingBanner />
      <LandingFeatures />
      <LandingVideoSection />
      <LandingHighlightCards />
      <LandingFooter />
    </>
  )
}
