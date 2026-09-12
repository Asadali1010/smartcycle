import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

/**
 * Every route is code-split. This matters most for `/`: it's the only page
 * that pulls in three.js/@react-three/fiber/postprocessing (via Hero +
 * ScrollStory), so without per-route splitting every other page would pay
 * that ~1.2MB cost too, just to render a Contact form or Terms page.
 */
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const PlatformPage = lazy(() => import('@/pages/PlatformPage').then((m) => ({ default: m.PlatformPage })))
const UseCasesPage = lazy(() => import('@/pages/UseCasesPage').then((m) => ({ default: m.UseCasesPage })))
const WhySmartCycleAIPage = lazy(() =>
  import('@/pages/WhySmartCycleAIPage').then((m) => ({ default: m.WhySmartCycleAIPage })),
)
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ForCiosCtosPage = lazy(() => import('@/pages/ForCiosCtosPage').then((m) => ({ default: m.ForCiosCtosPage })))
const ForCfosPage = lazy(() => import('@/pages/ForCfosPage').then((m) => ({ default: m.ForCfosPage })))
const ForClinicalLeadersPage = lazy(() =>
  import('@/pages/ForClinicalLeadersPage').then((m) => ({ default: m.ForClinicalLeadersPage })),
)
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const RequestDemoPage = lazy(() => import('@/pages/RequestDemoPage').then((m) => ({ default: m.RequestDemoPage })))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('@/pages/TermsPage').then((m) => ({ default: m.TermsPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const StyleGuidePage = lazy(() =>
  import('@/design-system/dev/StyleGuidePage').then((m) => ({ default: m.StyleGuidePage })),
)

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // TEMPORARY (design-system, phase 1): dev-only route rendering every
      // design-system primitive against both surfaces for contrast/focus QA.
      // forms-and-pages MUST remove this route (and src/design-system/dev/)
      // before the site ships.
      { path: '/dev/style-guide', element: <StyleGuidePage /> },
      { path: '/', element: <HomePage /> },
      { path: '/platform', element: <PlatformPage /> },
      { path: '/use-cases', element: <UseCasesPage /> },
      { path: '/why-smartcycleai', element: <WhySmartCycleAIPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/for-cios-ctos', element: <ForCiosCtosPage /> },
      { path: '/for-cfos', element: <ForCfosPage /> },
      { path: '/for-clinical-leaders', element: <ForClinicalLeadersPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/request-demo', element: <RequestDemoPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
