import type { PortfolioData } from '../src/types/portfolio';
import { HttpError, isRecord } from './http';

type Validator = (value: unknown, path: string) => void;
function invalid(path: string, reason: string): never { throw new HttpError(400, `${path}: ${reason}`); }

const text = (max = 16_000, min = 0): Validator => (value, path) => {
  if (typeof value !== 'string' || value.length < min || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
    invalid(path, `must be text between ${min} and ${max} characters`);
  }
};

const integer = (min: number, max: number): Validator => (value, path) => {
  if (!Number.isSafeInteger(value) || typeof value !== 'number' || value < min || value > max) invalid(path, `must be a whole number between ${min} and ${max}`);
};

const boolean: Validator = (value, path) => { if (typeof value !== 'boolean') invalid(path, 'must be true or false'); };
const oneOf = (...values: string[]): Validator => (value, path) => { if (typeof value !== 'string' || !values.includes(value)) invalid(path, `must be one of ${values.join(', ')}`); };
const id: Validator = (value, path) => { if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,79}$/.test(value)) invalid(path, 'must be a unique identifier using letters, numbers, hyphens, or underscores'); };

export const safeUrl: Validator = (value, path) => {
  text(2048)(value, path);
  if (value === '') return;
  if (typeof value !== 'string' || /[\s\\]/.test(value)) invalid(path, 'must be a valid URL');
  if (value.startsWith('/') && !value.startsWith('//')) return;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) invalid(path, 'must use HTTPS or a local asset path');
  } catch {
    invalid(path, 'must use HTTPS or a local asset path');
  }
};

const assetUrl: Validator = (value, path) => {
  safeUrl(value, path);
  if (!value) invalid(path, 'an asset URL is required');
};

const optional = (validator: Validator): Validator => (value, path) => { if (value !== undefined) validator(value, path); };
const array = (validator: Validator, max = 100, uniqueIds = false): Validator => (value, path) => {
  if (!Array.isArray(value) || value.length > max) invalid(path, `must be a list with no more than ${max} items`);
  const ids = new Set<unknown>();
  value.forEach((entry, index) => {
    validator(entry, `${path}[${index}]`);
    if (uniqueIds && isRecord(entry)) {
      if (ids.has(entry.id)) invalid(`${path}[${index}].id`, 'must be unique within its list');
      ids.add(entry.id);
    }
  });
};

const object = (fields: Record<string, Validator>): Validator => (value, path) => {
  if (!isRecord(value)) invalid(path, 'must be an object');
  for (const key of Object.keys(value)) if (!Object.hasOwn(fields, key)) invalid(`${path}.${key}`, 'is not a supported field');
  for (const [key, validator] of Object.entries(fields)) validator(value[key], `${path}.${key}`);
};

const short = text(500);
const list = array(text(1000), 100);
const image = object({
  src: assetUrl,
  alt: text(1000),
  width: integer(1, 16_000),
  height: integer(1, 16_000),
  avif: optional(assetUrl),
  srcSet: optional((value, path) => {
    text(8000)(value, path);
    if (typeof value !== 'string') return;
    for (const part of value.split(',')) {
      const match = part.trim().match(/^(\S+)\s+(\d+(?:\.\d+)?[wx])$/);
      if (!match) invalid(path, 'must contain valid image URLs and width or density descriptors');
      assetUrl(match[1], path);
    }
  }),
});

const sectionCopy = object({ eyebrow: short, title: short, description: text() });
const hexColor: Validator = (value, path) => { if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) invalid(path, 'must be a six-digit hexadecimal color'); };
const editorial: Validator = (value, path) => {
  if (!isRecord(value) || Object.keys(value).length > 40) invalid(path, 'must contain no more than 40 text entries');
  for (const [key, entry] of Object.entries(value)) {
    if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(key) || ['constructor', 'prototype'].includes(key)) invalid(`${path}.${key}`, 'is not a valid text key');
    text(5000)(entry, `${path}.${key}`);
  }
  for (const key of ['makerTitle', 'dispatchTitle', 'dispatchLabel', 'statsLabel', 'journeyAction', 'aboutAction', 'archiveAction', 'puzzleEyebrow', 'puzzleTitle', 'puzzleDescription', 'puzzleAction']) text(5000)(value[key], `${path}.${key}`);
};
const sections = ['about', 'work', 'journey', 'skills', 'archive', 'credentials', 'puzzle', 'contact'];
const sectionOrder: Validator = (value, path) => {
  array(oneOf(...sections), sections.length)(value, path);
  if (!Array.isArray(value) || value.length !== sections.length || new Set(value).size !== sections.length) invalid(path, 'must include each supported section exactly once');
};
const timeline = object({
  id, title: short, organization: short, location: short,
  startDate: short, endDate: short, period: short,
  description: text(), highlights: list, tags: list,
  kind: oneOf('work', 'internship', 'education'), score: optional(short),
  demoUrl: optional(safeUrl), certificateUrl: optional(safeUrl),
});

const portfolio = object({
  schemaVersion: integer(1, 1),
  theme: object({ paper: hexColor, ink: hexColor, accent: hexColor, displayFont: oneOf('Barlow Condensed', 'Bodoni Moda'), bodyFont: oneOf('DM Sans', 'Bodoni Moda'), motion: boolean, showGallery: boolean, showCredentials: boolean, showPuzzle: boolean }),
  artwork: object({ hero: image, archive: image }),
  editorial,
  navigation: array(object({ id, label: short, url: oneOf('#about', '#work', '#journey', '#archive', '#contact') }), 20, true),
  sectionOrder,
  site: object({ title: short, description: text(), edition: short, masthead: short, tagline: short, copyright: short, logo: image, socialImage: image }),
  person: object({ name: short, firstName: short, lastName: short, role: short, location: short, hometown: short, email: short, phone: short, resumeUrl: safeUrl, portrait: image, aboutPortrait: image }),
  hero: object({ eyebrow: short, headline: text(2000), accent: short, description: text(), availability: short, primaryAction: short, secondaryAction: short }),
  about: object({ eyebrow: short, title: short, introduction: text(), paragraphs: array(text(), 20), philosophy: text() }),
  sectionCopy: object({ projects: sectionCopy, gallery: sectionCopy, experience: sectionCopy, education: sectionCopy, skills: sectionCopy, credentials: sectionCopy, contact: sectionCopy }),
  experience: array(timeline, 100, true),
  education: array(timeline, 100, true),
  skillGroups: array(object({ id, title: short, skills: list }), 100, true),
  projects: array(object({ id, title: short, shortTitle: short, category: short, status: short, description: text(), technologies: list, image, repository: safeUrl, liveUrl: safeUrl, liveAvailable: optional(boolean), featured: boolean, facts: list }), 100, true),
  gallery: array(object({ id, title: short, category: oneOf('design', 'branding', 'photography'), type: short, image, featured: boolean }), 300, true),
  certifications: array(object({ id, title: short, organization: short, year: short, duration: short, skills: list, url: safeUrl }), 100, true),
  achievements: array(object({ id, title: short, organization: short, period: short, description: text(), tags: list, url: safeUrl }), 100, true),
  interests: array(object({ id, title: short, description: text() }), 100, true),
  socials: array(object({ id, label: short, url: safeUrl }), 40, true),
  contact: object({ heading: short, description: text(), emailLabel: short, phoneLabel: short, locationLabel: short, messageLabel: short, submitLabel: short, successMessage: text() }),
} satisfies Record<keyof PortfolioData, Validator>);

export function validatePortfolio(value: unknown): PortfolioData {
  portfolio(value, 'content');
  return value as PortfolioData;
}

export function validateContentUpdate(value: unknown): { content: PortfolioData; version: number } {
  object({ content: portfolio, version: integer(0, Number.MAX_SAFE_INTEGER - 1) })(value, 'request');
  return value as { content: PortfolioData; version: number };
}

