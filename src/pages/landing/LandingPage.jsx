import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingBanner } from '@/components/landing/LandingBanner'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingVideoSection } from '@/components/landing/LandingVideoSection'
import { LandingHighlightCards } from '@/components/landing/LandingHighlightCards'
import { LandingFooter } from '@/components/landing/LandingFooter'

function LandingPage() {
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

export default LandingPage
