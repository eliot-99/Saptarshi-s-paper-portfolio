import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import type { PortfolioData } from '../types/portfolio'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'

export function Journey({ data }: { data: PortfolioData }) {
  return <section id="journey" className="section-space">
    <SectionHeading number="03" copy={data.sectionCopy.experience} />
    <div className="journey-layout">
      <div className="work-ledger">
        {data.experience.map((entry, index) => <Reveal enabled={data.theme.motion} className="ledger-entry" key={entry.id}>
          <div className="ledger-date">
            <span className="folio">{entry.period}</span>
            <span className="ledger-index">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <div>
            <span className="folio text-accent">{entry.organization} / {entry.kind}{entry.location ? ` / ${entry.location}` : ''}</span>
            <h3>{entry.title}</h3>
            <p>{entry.description}</p>
            {entry.highlights.map(highlight => <p className="ledger-highlight" key={highlight}>{highlight}</p>)}
            <div className="project-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            {(entry.demoUrl || entry.certificateUrl) && <div className="project-links ledger-links">
              {entry.demoUrl && <a className="text-link" href={entry.demoUrl} target="_blank" rel="noopener noreferrer">View internship demo <ArrowUpRight size={17} /></a>}
              {entry.certificateUrl && <a className="text-link" href={entry.certificateUrl} target="_blank" rel="noopener noreferrer">View certificate <ArrowUpRight size={17} /></a>}
            </div>}
          </div>
        </Reveal>)}
      </div>
      <aside className="academic-ledger">
        <p className="folio">{data.sectionCopy.education.eyebrow}</p>
        <h3 className="preserve-lines">{data.sectionCopy.education.title}</h3>
        <p className="academic-description">{data.sectionCopy.education.description}</p>
        {data.education.map(entry => <div className="education-entry" key={entry.id}>
          <div className="folio">{entry.period}</div>
          <h4>{entry.title}</h4>
          <p>{entry.organization}</p>
          {entry.score && <span className="education-score">{entry.score}</span>}
          <p>{entry.description}</p>
          {entry.highlights.map(item => <p key={item}>{item}</p>)}
          <div className="project-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>)}
      </aside>
    </div>
  </section>
}
