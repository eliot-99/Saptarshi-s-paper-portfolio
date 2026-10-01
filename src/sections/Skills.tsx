import { BracketsCurly } from '@phosphor-icons/react/dist/csr/BracketsCurly'
import { Code } from '@phosphor-icons/react/dist/csr/Code'
import { Brain } from '@phosphor-icons/react/dist/csr/Brain'
import { PaintBrush } from '@phosphor-icons/react/dist/csr/PaintBrush'
import { Database } from '@phosphor-icons/react/dist/csr/Database'
import { FlowArrow } from '@phosphor-icons/react/dist/csr/FlowArrow'
import { GitBranch } from '@phosphor-icons/react/dist/csr/GitBranch'
import { Cpu } from '@phosphor-icons/react/dist/csr/Cpu'
import type { Icon } from '@phosphor-icons/react'
import type { PortfolioData } from '../types/portfolio'
import { SectionHeading } from '../components/ui/SectionHeading'

const toolboxIcons: Record<string, Icon> = {
  frontend: BracketsCurly,
  programming: Code,
  ai: Brain,
  design: PaintBrush,
  backend: Database,
  automation: FlowArrow,
  tools: GitBranch,
  hardware: Cpu,
}

export function Skills({ data }: { data: PortfolioData }) {
  return <section id="skills" className="section-space"><SectionHeading number="04" copy={data.sectionCopy.skills} /><div className="skills-grid">{data.skillGroups.map((group, index) => {
    const ToolboxIcon = toolboxIcons[group.id] ?? Code
    return <article className="skill-column" key={group.id}><div className="skill-heading"><span className="skill-icon" aria-hidden="true"><ToolboxIcon size={24} weight="duotone" /></span><span className="folio">TOOLBOX {String(index + 1).padStart(2, '0')}</span></div><h3>{group.title}</h3><div>{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>
  })}</div></section>
}
