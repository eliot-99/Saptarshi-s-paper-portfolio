import { useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { GithubLogo } from '@phosphor-icons/react/dist/csr/GithubLogo'
import { HardHat } from '@phosphor-icons/react/dist/csr/HardHat'
import { Camera } from '@phosphor-icons/react/dist/csr/Camera'
import { Plant } from '@phosphor-icons/react/dist/csr/Plant'
import { Browsers } from '@phosphor-icons/react/dist/csr/Browsers'
import { ChartLineUp } from '@phosphor-icons/react/dist/csr/ChartLineUp'
import { Brain } from '@phosphor-icons/react/dist/csr/Brain'
import { ShieldCheck } from '@phosphor-icons/react/dist/csr/ShieldCheck'
import { GlobeHemisphereWest } from '@phosphor-icons/react/dist/csr/GlobeHemisphereWest'
import { UserCircle } from '@phosphor-icons/react/dist/csr/UserCircle'
import { Crosshair } from '@phosphor-icons/react/dist/csr/Crosshair'
import { Atom } from '@phosphor-icons/react/dist/csr/Atom'
import type { Icon } from '@phosphor-icons/react'
import type { PortfolioData, Project } from '../types/portfolio'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { Modal } from '../components/ui/Modal'

const projectIcons: Record<string, Icon> = {
  ppe: HardHat,
  plant: Plant,
  'photographic-journal': Camera,
  datascope: ChartLineUp,
  'ai-quiz-hub': Brain,
  sentinel: ShieldCheck,
  nokiverse: GlobeHemisphereWest,
  anon: UserCircle,
  'redline-reckoning': Crosshair,
  'molecular-design': Atom,
}

function ProjectIcon({ project }: { project: Project }) {
  const IconComponent = projectIcons[project.id] ?? Browsers
  return <span className="project-icon" aria-hidden="true"><IconComponent size={30} weight="duotone" /></span>
}

export function SelectedWork({ data }: { data: PortfolioData }) {
  const [selected, setSelected] = useState<Project | null>(null)

  return <section id="work" className="section-space project-section">
    <SectionHeading number="02" copy={data.sectionCopy.projects} />
    <div className="project-grid">
      {data.projects.map((project, index) => <Reveal enabled={data.theme.motion} key={project.id} className="project-story">
        <button className="project-record" onClick={() => setSelected(project)} aria-label={`Read about ${project.title}`}>
          <span className="project-record-top"><span className="project-number folio">CASE {String(index + 1).padStart(2, '0')}</span><span className="project-status folio">{project.status}</span></span>
          <span className="project-record-icon"><ProjectIcon project={project} /></span>
          <span className="project-meta folio">{project.category}{project.featured ? ' / SELECTED' : ''}</span>
          <span className="project-title"><strong>{project.shortTitle}</strong><ArrowUpRight size={23} /></span>
          <span className="project-summary">{project.description}</span>
          <span className="project-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</span>
        </button>
        <div className="project-links">
          {project.repository && <a className="text-link" href={project.repository} target="_blank" rel="noopener noreferrer"><GithubLogo size={17} /> Source code</a>}
          {project.liveUrl && project.liveAvailable !== false && <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit project <ArrowUpRight size={17} /></a>}
        </div>
      </Reveal>)}
    </div>
    {selected && <Modal label={selected.title} onClose={() => setSelected(null)}><div className="project-modal project-modal-iconic">
      <div className="project-modal-mark"><ProjectIcon project={selected} /><span className="folio">CASE {String(data.projects.findIndex(item => item.id === selected.id) + 1).padStart(2, '0')}</span></div>
      <p className="folio">{selected.category} / {selected.status}</p>
      <h2>{selected.title}</h2>
      <p>{selected.description}</p>
      <div className="project-tags">{selected.technologies.map(tech => <span key={tech}>{tech}</span>)}</div>
      <ul className="project-facts">{selected.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
      <div className="project-links">
        {selected.repository && <a className="ink-button" href={selected.repository} target="_blank" rel="noopener noreferrer">Explore the repository <ArrowUpRight size={19} /></a>}
        {selected.liveUrl && selected.liveAvailable !== false && <a className="text-link" href={selected.liveUrl} target="_blank" rel="noopener noreferrer">Open live project <ArrowUpRight size={18} /></a>}
      </div>
    </div></Modal>}
  </section>
}
