import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import {
  Nav, Footer, FloatingParticles, ScrollProgress, BackToTop, ScrollToTop,
} from './components/shared'

const ParticleSphere = lazy(() => import('./components/ParticleSphere'))
const Home = lazy(() => import('./pages/Home'))
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const PodcastPage = lazy(() => import('./pages/PodcastPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <ParticleSphere className="particle-sphere-backdrop" />
      </Suspense>
      <FloatingParticles />
      <ScrollProgress />
      <ScrollToTop />
      <Nav />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
      <Footer />
      <BackToTop />
    </BrowserRouter>
  )
}
