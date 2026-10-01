import type { SectionCopy } from '../../types/portfolio'

export function SectionHeading({ number, copy }: { number: string; copy: SectionCopy }) {
  return <div className="section-heading"><div><p className="folio">{number} / {copy.eyebrow}</p><h2>{copy.title}</h2></div><p className="section-description">{copy.description}</p></div>
}
