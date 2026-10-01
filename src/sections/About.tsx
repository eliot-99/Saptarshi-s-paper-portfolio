import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import type { PortfolioData } from '../types/portfolio'
import { EditorialImage } from '../components/ui/EditorialImage'
import { EditorialTitle } from '../components/ui/EditorialTitle'
import { Reveal } from '../components/ui/Reveal'

export function About({ data }: { data: PortfolioData }) {
  return <section id="about" className="about-section section-space"><Reveal enabled={data.theme.motion} className="about-layout"><div className="about-title"><p className="folio">01 / {data.about.eyebrow}</p><EditorialTitle title={data.about.title} /><p className="serif-quote">{data.about.philosophy}</p></div><div className="about-copy"><p className="dropcap">{data.about.introduction}</p>{data.about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<a className="text-link" href="#contact">{data.editorial.aboutAction} <ArrowUpRight size={20} /></a></div><figure className="about-photo"><EditorialImage image={data.person.aboutPortrait} /><figcaption className="folio">{data.person.name} / {data.person.role} / {data.person.location}</figcaption></figure></Reveal></section>
}
