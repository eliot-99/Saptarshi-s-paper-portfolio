import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown';
import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp';

const sectionLabels: Record<string, { title: string; description: string }> = {
  about: { title: 'About the person', description: 'Your introduction and philosophy' },
  work: { title: 'Selected work', description: 'Your featured development projects' },
  journey: { title: 'The journey', description: 'Experience and education' },
  skills: { title: 'Skills & tools', description: 'The technologies behind the work' },
  archive: { title: 'Creative archive', description: 'Design, branding, and photography' },
  credentials: { title: 'Credentials', description: 'Certificates, achievements, and interests' },
  puzzle: { title: 'Back-page puzzle', description: 'The interactive memory game' },
  contact: { title: 'Contact', description: 'Your contact details and enquiry form' },
};

export function reorderSections(sections: string[], index: number, direction: -1 | 1): string[] {
  const nextIndex = index + direction;
  if (index < 0 || index >= sections.length || nextIndex < 0 || nextIndex >= sections.length) return sections;
  const next = [...sections];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

export default function SectionOrderEditor({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return <div className="admin-section-order">
    <p className="admin-order-note">The front page stays first. Arrange the chapters that follow it using the arrow buttons. Visibility is controlled in Art direction.</p>
    <ol>{value.map((section, index) => {
      const details = sectionLabels[section] || { title: section, description: '' };
      return <li key={section} className="admin-order-row"><span className="admin-order-number">{String(index + 1).padStart(2, '0')}</span><div><strong>{details.title}</strong><small>{details.description}</small></div><div className="admin-item-actions"><button type="button" className="admin-icon-button" aria-label={`Move ${details.title} up`} disabled={index === 0} onClick={() => onChange(reorderSections(value, index, -1))}><ArrowUp size={18} /></button><button type="button" className="admin-icon-button" aria-label={`Move ${details.title} down`} disabled={index === value.length - 1} onClick={() => onChange(reorderSections(value, index, 1))}><ArrowDown size={18} /></button></div></li>;
    })}</ol>
  </div>;
}
