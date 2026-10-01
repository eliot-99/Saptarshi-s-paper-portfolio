import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { MotionConfig } from 'framer-motion'
import { usePortfolio } from '../hooks/usePortfolio'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { FrontPage } from '../sections/FrontPage'
import { About } from '../sections/About'
import { SelectedWork } from '../sections/SelectedWork'
import { Journey } from '../sections/Journey'
import { Skills } from '../sections/Skills'
import { CreativeArchive } from '../sections/CreativeArchive'
import { Credentials } from '../sections/Credentials'
import { Contact } from '../sections/Contact'

export default function PortfolioApp() {
  const data = usePortfolio()
  useEffect(() => {
    document.title = data.site.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.site.description)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', data.theme.paper)
    for (const [property, value] of Object.entries({ 'og:title': data.site.title, 'og:description': data.site.description, 'og:image': new URL(data.site.socialImage.src, window.location.origin).href })) {
      document.querySelector(`meta[property="${property}"]`)?.setAttribute('content', value)
    }
  }, [data.site.title, data.site.description, data.theme.paper])
  const themeStyle = { '--paper': data.theme.paper, '--ink': data.theme.ink, '--accent': data.theme.accent, '--display': `"${data.theme.displayFont}"`, '--body': `"${data.theme.bodyFont}"` } as CSSProperties
  const sections = { about: <About data={data} />, work: <SelectedWork data={data} />, journey: <Journey data={data} />, skills: <Skills data={data} />, archive: data.theme.showGallery && <CreativeArchive data={data} />, credentials: data.theme.showCredentials && <Credentials data={data} />, puzzle: null, contact: <Contact data={data} /> }
  return <MotionConfig reducedMotion={data.theme.motion ? 'user' : 'always'}><div className="paper-site" style={themeStyle}><a className="skip-link" href="#main">Skip to content</a><div className="paper-grain" aria-hidden="true" /><div className="paper-container"><Header data={data} /><main id="main"><FrontPage data={data} />{data.sectionOrder.map(id => <div key={id}>{sections[id as keyof typeof sections]}</div>)}</main><Footer data={data} /></div></div></MotionConfig>
}
