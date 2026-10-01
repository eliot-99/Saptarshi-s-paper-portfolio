import { BracketsCurly } from '@phosphor-icons/react/dist/csr/BracketsCurly'
import { Code } from '@phosphor-icons/react/dist/csr/Code'
import { Brain } from '@phosphor-icons/react/dist/csr/Brain'
import { PaintBrush } from '@phosphor-icons/react/dist/csr/PaintBrush'
import { Database } from '@phosphor-icons/react/dist/csr/Database'
import { FlowArrow } from '@phosphor-icons/react/dist/csr/FlowArrow'
import { GitBranch } from '@phosphor-icons/react/dist/csr/GitBranch'
import { Cpu } from '@phosphor-icons/react/dist/csr/Cpu'
import { Atom } from '@phosphor-icons/react/dist/csr/Atom'
import { FileTs } from '@phosphor-icons/react/dist/csr/FileTs'
import { FileJs } from '@phosphor-icons/react/dist/csr/FileJs'
import { FileHtml } from '@phosphor-icons/react/dist/csr/FileHtml'
import { FileCss } from '@phosphor-icons/react/dist/csr/FileCss'
import { FilePy } from '@phosphor-icons/react/dist/csr/FilePy'
import { Wind } from '@phosphor-icons/react/dist/csr/Wind'
import { Flask } from '@phosphor-icons/react/dist/csr/Flask'
import { PlugsConnected } from '@phosphor-icons/react/dist/csr/PlugsConnected'
import { DeviceMobile } from '@phosphor-icons/react/dist/csr/DeviceMobile'
import { Coffee } from '@phosphor-icons/react/dist/csr/Coffee'
import { Graph } from '@phosphor-icons/react/dist/csr/Graph'
import { Eye } from '@phosphor-icons/react/dist/csr/Eye'
import { Table } from '@phosphor-icons/react/dist/csr/Table'
import { MathOperations } from '@phosphor-icons/react/dist/csr/MathOperations'
import { Robot } from '@phosphor-icons/react/dist/csr/Robot'
import { Image } from '@phosphor-icons/react/dist/csr/Image'
import { PenNib } from '@phosphor-icons/react/dist/csr/PenNib'
import { FigmaLogo } from '@phosphor-icons/react/dist/csr/FigmaLogo'
import { FilmSlate } from '@phosphor-icons/react/dist/csr/FilmSlate'
import { ShippingContainer } from '@phosphor-icons/react/dist/csr/ShippingContainer'
import { ArrowsClockwise } from '@phosphor-icons/react/dist/csr/ArrowsClockwise'
import { GithubLogo } from '@phosphor-icons/react/dist/csr/GithubLogo'
import { TerminalWindow } from '@phosphor-icons/react/dist/csr/TerminalWindow'
import { Circuitry } from '@phosphor-icons/react/dist/csr/Circuitry'
import { Network } from '@phosphor-icons/react/dist/csr/Network'
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

const technologyIcons: Record<string, Icon> = {
  'React.js': Atom,
  TypeScript: FileTs,
  JavaScript: FileJs,
  HTML: FileHtml,
  CSS: FileCss,
  'Tailwind CSS': Wind,
  Flask,
  WebSockets: PlugsConnected,
  'Progressive Web Apps': DeviceMobile,
  Python: FilePy,
  Java: Coffee,
  C: Code,
  SQL: Database,
  TensorFlow: Brain,
  Keras: Brain,
  'Scikit-learn': Graph,
  OpenCV: Eye,
  Pandas: Table,
  NumPy: MathOperations,
  'AI Tools': Robot,
  'Adobe Photoshop': Image,
  'Adobe Illustrator': PenNib,
  Figma: FigmaLogo,
  'Premiere Pro': FilmSlate,
  'Node.js': BracketsCurly,
  MongoDB: Database,
  MySQL: Database,
  Docker: ShippingContainer,
  'n8n Workflows': FlowArrow,
  'Process Automation': ArrowsClockwise,
  Git: GitBranch,
  GitHub: GithubLogo,
  Linux: TerminalWindow,
  n8n: FlowArrow,
  Arduino: Circuitry,
  'Raspberry Pi': Cpu,
  WebRTC: Network,
}

export function Skills({ data }: { data: PortfolioData }) {
  return (
    <section id="skills" className="section-space toolbox-editorial">
      <SectionHeading number="04" copy={data.sectionCopy.skills} />
      <div className="toolbox-editorial-inventory">
        {data.skillGroups.map((group, index) => {
          const ToolboxIcon = toolboxIcons[group.id] ?? Code
          const headingId = `toolbox-title-${group.id}`

          return (
            <article className={`toolbox-editorial-group${index === 0 ? ' toolbox-editorial-group-featured' : ''}`} key={group.id} aria-labelledby={headingId}>
              <header className="toolbox-editorial-header">
                <div className="toolbox-editorial-heading">
                  <p className="folio toolbox-editorial-label">Toolbox {String(index + 1).padStart(2, '0')}</p>
                  <h3 id={headingId}>{group.title}</h3>
                </div>
                <ToolboxIcon className="toolbox-editorial-category-icon" size={64} weight="duotone" aria-hidden="true" />
              </header>
              <ul className="toolbox-editorial-tools">
                {group.skills.map(skill => {
                  const TechnologyIcon = technologyIcons[skill] ?? ToolboxIcon

                  return (
                    <li key={skill} className={skill.length > 18 ? 'toolbox-editorial-tool-long' : undefined}>
                      <TechnologyIcon size={19} weight="regular" aria-hidden="true" />
                      <span>{skill}</span>
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
