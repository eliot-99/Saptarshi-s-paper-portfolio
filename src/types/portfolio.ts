export interface AssetImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  avif?: string;
  srcSet?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  period: string;
  description: string;
  highlights: string[];
  tags: string[];
  kind: 'work' | 'internship' | 'education';
  score?: string;
  demoUrl?: string;
  certificateUrl?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  status: string;
  description: string;
  technologies: string[];
  image: AssetImage;
  repository: string;
  liveUrl: string;
  liveAvailable?: boolean;
  featured: boolean;
  facts: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'design' | 'branding' | 'photography';
  type: string;
  image: AssetImage;
  featured: boolean;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  year: string;
  duration: string;
  skills: string[];
  url: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  tags: string[];
  url: string;
}

export interface Interest {
  id: string;
  title: string;
  description: string;
}

export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface PortfolioData {
  schemaVersion: number;
  theme: {
    paper: string;
    ink: string;
    accent: string;
    displayFont: 'Barlow Condensed' | 'Bodoni Moda';
    bodyFont: 'DM Sans' | 'Bodoni Moda';
    motion: boolean;
    showGallery: boolean;
    showCredentials: boolean;
    showPuzzle: boolean;
  };
  artwork: { hero: AssetImage; archive: AssetImage };
  editorial: Record<string, string>;
  navigation: SocialLink[];
  sectionOrder: string[];
  site: {
    title: string;
    description: string;
    edition: string;
    masthead: string;
    tagline: string;
    copyright: string;
    logo: AssetImage;
    socialImage: AssetImage;
  };
  person: {
    name: string;
    firstName: string;
    lastName: string;
    role: string;
    location: string;
    hometown: string;
    email: string;
    phone: string;
    resumeUrl: string;
    portrait: AssetImage;
    aboutPortrait: AssetImage;
  };
  hero: {
    eyebrow: string;
    headline: string;
    accent: string;
    description: string;
    availability: string;
    primaryAction: string;
    secondaryAction: string;
  };
  about: {
    eyebrow: string;
    title: string;
    introduction: string;
    paragraphs: string[];
    philosophy: string;
  };
  sectionCopy: {
    projects: SectionCopy;
    gallery: SectionCopy;
    experience: SectionCopy;
    education: SectionCopy;
    skills: SectionCopy;
    credentials: SectionCopy;
    contact: SectionCopy;
  };
  experience: TimelineEntry[];
  education: TimelineEntry[];
  skillGroups: SkillGroup[];
  projects: Project[];
  gallery: GalleryItem[];
  certifications: Certification[];
  achievements: Achievement[];
  interests: Interest[];
  socials: SocialLink[];
  contact: {
    heading: string;
    description: string;
    emailLabel: string;
    phoneLabel: string;
    locationLabel: string;
    messageLabel: string;
    submitLabel: string;
    successMessage: string;
  };
}
