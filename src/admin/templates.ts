export const sectionNames: Record<string, { label: string; description: string; symbol: string }> = {
  site: { label: 'Publication', description: 'Page title, search appearance, masthead, and the details that make this edition yours.', symbol: '01' },
  person: { label: 'Your profile', description: 'Your name, portraits, contact details, and downloadable résumé.', symbol: '02' },
  hero: { label: 'Front page', description: 'The opening headline, introduction, availability, and calls to action.', symbol: '03' },
  about: { label: 'About you', description: 'Your story, point of view, and the words behind the work.', symbol: '04' },
  sectionCopy: { label: 'Section headings', description: 'Headlines, captions, and introductions throughout the portfolio.', symbol: '05' },
  projects: { label: 'Selected work', description: 'Project details, images, technologies, and links. Reorder the stories as you like.', symbol: '06' },
  gallery: { label: 'Visual gallery', description: 'Design, branding, and photography. Add images and choose the featured pieces.', symbol: '07' },
  experience: { label: 'Experience', description: 'Your professional timeline, roles, highlights, and technologies.', symbol: '08' },
  education: { label: 'Education', description: 'Your qualifications, graduation, and academic results.', symbol: '09' },
  skillGroups: { label: 'Skills', description: 'Organize your tools and strengths into readable groups.', symbol: '10' },
  certifications: { label: 'Certificates', description: 'Training, qualifications, issuing organizations, and certificate links.', symbol: '11' },
  achievements: { label: 'Achievements', description: 'Milestones, awards, and things you are proud of.', symbol: '12' },
  interests: { label: 'Interests', description: 'The creative interests beyond your professional work.', symbol: '13' },
  socials: { label: 'Social links', description: 'The places where people can find you and your work.', symbol: '14' },
  contact: { label: 'Contact', description: 'Contact section labels, form text, and confirmation messages.', symbol: '15' },
  theme: { label: 'Art direction', description: 'Colors, typefaces, and the sections displayed in your portfolio.', symbol: '16' },
  appearance: { label: 'Art direction', description: 'Colors, typefaces, and the sections displayed in your portfolio.', symbol: '16' },
  artwork: { label: 'Original artwork', description: 'The generated illustrations that give your paper portfolio its own visual world.', symbol: '17' },
  editorial: { label: 'Editorial details', description: 'The small headlines, captions, and calls to action that give every page its voice.', symbol: '18' },
  navigation: { label: 'Navigation', description: 'Rename, arrange, and add menu links to the portfolio’s supported destinations.', symbol: '19' },
  sectionOrder: { label: 'Page sequence', description: 'Move sections up or down to arrange the reading order. Every section appears exactly once.', symbol: '20' },
};

export function humanize(key: string): string {
  const names: Record<string, string> = {
    src: 'Image URL', avif: 'AVIF image URL', srcSet: 'Responsive image sources', alt: 'Accessible image description',
    cgpa: 'CGPA', resumeUrl: 'Résumé URL', liveUrl: 'Live website', repository: 'Repository URL', demoUrl: 'Demo URL', certificateUrl: 'Certificate URL',
    primaryAction: 'Primary button label', secondaryAction: 'Secondary button label', id: 'Unique ID',
    score: 'Grade / CGPA', kind: 'Entry type', featured: 'Feature this item', url: 'Link URL',
    endDate: 'End date (or Present)', startDate: 'Start date', skills: 'Skills / tools',
    schemaVersion: 'Content schema version', bodyFont: 'Body typeface', displayFont: 'Display typeface',
    makerTitle: 'Front-page maker headline', dispatchTitle: 'Latest dispatch headline', dispatchLabel: 'Latest dispatch label',
    statsLabel: 'Portfolio statistics heading', journeyAction: 'Journey link label', aboutAction: 'About-section contact link',
    archiveAction: 'Archive link label', puzzleEyebrow: 'Puzzle section caption', puzzleTitle: 'Puzzle headline',
    puzzleDescription: 'Puzzle introduction', puzzleAction: 'Puzzle button label',
  };
  return names[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
}

const emptyImage = { src: '', alt: '', width: 1200, height: 900 };
const timeline = { id: '', title: '', organization: '', location: '', startDate: '', endDate: '', period: '', description: '', highlights: [], tags: [], kind: 'work', score: '', demoUrl: '', certificateUrl: '' };
const arrayTemplates: Record<string, unknown> = {
  projects: { id: '', title: 'New project', shortTitle: '', category: '', status: '', description: '', technologies: [], image: emptyImage, repository: '', liveUrl: '', featured: false, facts: [] },
  gallery: { id: '', title: 'New gallery item', category: 'design', type: '', image: emptyImage, featured: false },
  experience: timeline,
  education: { ...timeline, kind: 'education' },
  skillGroups: { id: '', title: 'New skill group', skills: [] },
  certifications: { id: '', title: 'New certificate', organization: '', year: '', duration: '', skills: [], url: '' },
  achievements: { id: '', title: 'New achievement', organization: '', period: '', description: '', tags: [], url: '' },
  interests: { id: '', title: 'New interest', description: '' },
  socials: { id: '', label: 'New link', url: '' },
  navigation: { id: '', label: 'New menu link', url: '#about' },
};

function clearValue(value: unknown, key = ''): unknown {
  if (typeof value === 'boolean') return false;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (key === 'kind') return value;
    if (key === 'category' && ['design', 'branding', 'photography'].includes(value)) return value;
    return '';
  }
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([name, field]) => [name, clearValue(field, name)]));
  return '';
}

export function newArrayItem(key: string, existing?: unknown): unknown {
  const template = arrayTemplates[key];
  const item = template ? structuredClone(template) : clearValue(existing ?? '');
  if (item && typeof item === 'object' && !Array.isArray(item) && 'id' in item) {
    (item as Record<string, unknown>).id = `${key}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return item;
}
