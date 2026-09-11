import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { PlatformPage } from '@/pages/PlatformPage'
import { UseCasesPage } from '@/pages/UseCasesPage'
import { WhySmartCycleAIPage } from '@/pages/WhySmartCycleAIPage'
import { AboutPage } from '@/pages/AboutPage'
import { ForCiosCtosPage } from '@/pages/ForCiosCtosPage'
import { ForCfosPage } from '@/pages/ForCfosPage'
import { ForClinicalLeadersPage } from '@/pages/ForClinicalLeadersPage'
import { ContactPage } from '@/pages/ContactPage'
import { RequestDemoPage } from '@/pages/RequestDemoPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
