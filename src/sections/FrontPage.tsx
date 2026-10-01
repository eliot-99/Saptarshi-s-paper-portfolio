import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { DownloadSimple } from '@phosphor-icons/react/dist/csr/DownloadSimple'
import type { PortfolioData } from '../types/portfolio'
import { EditorialImage } from '../components/ui/EditorialImage'
import { FitText } from '../components/ui/FitText'

export function FrontPage({ data }: { data: PortfolioData }) {
  const current = data.experience.find(entry => entry.kind === 'work' && entry.endDate === 'present') ?? data.experience[0]
  const score = data.education.find(item => item.score?.includes('CGPA'))?.score?.replace('CGPA:', '').replace('CGPA', '').trim()
  return <section className="front-page" aria-label="Front page">
    <div className="nameplate"><FitText>{data.person.firstName}</FitText><span className="nameplate-surname">{data.person.lastName}.</span><p className="folio nameplate-caption">A PERSONAL PORTFOLIO / DIGITAL EDITION</p></div>
    <div className="front-columns">
      <article className="lead-person"><div className="mini-head folio">MEET THE MAKER <span>01</span></div><EditorialImage image={data.person.portrait} className="front-portrait" eager /><h2 className="preserve-lines">{data.editorial.makerTitle}</h2><p>{data.hero.description}</p><a href={data.person.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-link">{data.hero.secondaryAction} <DownloadSimple size={18} /></a></article>
      <article className="lead-story"><div className="story-art"><EditorialImage image={data.artwork.hero} eager /><span className="art-label folio">FIG. 01 — A DIFFERENT<br />WAY OF SEEING.</span></div><p className="folio text-accent">{data.hero.eyebrow}</p><h2>{data.hero.headline}<br /><em>{data.hero.accent}</em></h2><a className="oval-link" href="#work">{data.hero.primaryAction} <ArrowUpRight size={29} /></a></article>
      <aside className="front-dispatch"><div className="mini-head folio">{data.editorial.dispatchLabel} <span>2026</span></div><div className="stamp">NEW<br />CHAPTER</div><h2 className="preserve-lines">{data.editorial.dispatchTitle}</h2><p className="dispatch-period folio">{current?.period}</p><h3>{current?.title}</h3><p className="text-accent company-name">{current?.organization}</p><p>{current?.description}</p><a className="text-link" href="#journey">{data.editorial.journeyAction} <ArrowUpRight size={18} /></a><div className="dispatch-bottom"><span className="folio">{data.editorial.statsLabel}</span><p><b>{String(data.projects.length).padStart(2, '0')}</b> Projects<br /><b>{String(data.gallery.length).padStart(2, '0')}</b> Creative works<br /><b>{score || '8.50'}</b> Graduation CGPA</p></div></aside>
    </div>
    <div className="news-wire"><span className="wire-label folio">ON THE RECORD</span><p>{data.hero.availability}</p><a href="#about" className="folio">SCROLL TO DISCOVER <ArrowDown size={17} /></a></div>
  </section>
}
