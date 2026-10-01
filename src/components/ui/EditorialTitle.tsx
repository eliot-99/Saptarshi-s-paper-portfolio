type EditorialTitleProps = {
  title: string
  className?: string
  id?: string
  accentTailWords?: number
}

/** Keeps editable headlines intact while giving their closing thought red ink. */
export function EditorialTitle({ title, className = '', id, accentTailWords }: EditorialTitleProps) {
  let lines = title.split(/\r?\n/).map(line => line.trim()).filter(Boolean)

  if (lines.length === 1) {
    const sentences = lines[0].match(/[^.!?]+[.!?]?(?:\s+|$)/g)?.map(sentence => sentence.trim())
    if (sentences && sentences.length > 1) {
      lines = [sentences.slice(0, -1).join(' '), sentences[sentences.length - 1]]
    } else if (accentTailWords) {
      const words = lines[0].split(/\s+/)
      if (words.length > accentTailWords) {
        lines = [words.slice(0, -accentTailWords).join(' '), words.slice(-accentTailWords).join(' ')]
      }
    }
  }

  return <h2 id={id} className={`editorial-title ${className}`.trim()}>{lines.map((line, index) => <span className={index === 0 ? 'editorial-title-ink' : 'editorial-title-accent'} key={index}>{index > 0 && ' '}{line}</span>)}</h2>
}
