import type { SectionCopy } from '../../types/portfolio'
import { EditorialTitle } from './EditorialTitle'

export function SectionHeading({ number, copy }: { number: string; copy: SectionCopy }) {
  return <div className="section-heading"><div><p className="folio">{number} / {copy.eyebrow}</p><EditorialTitle title={copy.title} /></div><p className="section-description">{copy.description}</p></div>
}
