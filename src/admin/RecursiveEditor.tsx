import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown';
import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { Trash } from '@phosphor-icons/react/dist/csr/Trash';
import { UploadSimple } from '@phosphor-icons/react/dist/csr/UploadSimple';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { humanize, newArrayItem } from './templates';
import { uploadMedia } from './api';
import SectionOrderEditor from './SectionOrderEditor';
import { replaceUploadedImage, updateImageField } from './editorState';

type EditorValue = unknown;
interface EditorProps {
  value: EditorValue;
  onChange: (value: EditorValue) => void;
  fieldKey: string;
  path?: string;
  onSessionExpired: () => void;
}

const longFields = ['description', 'introduction', 'philosophy', 'successMessage', 'copyright', 'headline', 'heading', 'tagline'];
const linkFields = ['src', 'avif', 'url', 'liveUrl', 'repository', 'resumeUrl', 'demoUrl', 'certificateUrl'];

function UploadButton({ accept, onUploaded, onSessionExpired }: {
  accept: string;
  onUploaded: (result: Awaited<ReturnType<typeof uploadMedia>>) => void;
  onSessionExpired: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const uploadedCallback = useRef(onUploaded);
  const mounted = useRef(true);
  uploadedCallback.current = onUploaded;
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <div className="admin-upload-control">
    <input ref={input} className="admin-hidden" type="file" accept={accept} onChange={async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setBusy(true);
      setError('');
      try {
        const result = await uploadMedia(file);
        if (mounted.current) uploadedCallback.current(result);
      } catch (failure) {
        if (failure && typeof failure === 'object' && 'status' in failure && failure.status === 401) onSessionExpired();
        setError(failure instanceof Error ? failure.message : 'Upload failed. Please try again.');
      } finally {
        setBusy(false);
        if (input.current) input.current.value = '';
      }
    }} />
    <button type="button" className="admin-button admin-button-small" disabled={busy} onClick={() => input.current?.click()}>
      <UploadSimple size={16} /> {busy ? 'Compressing & uploading…' : accept.includes('pdf') ? 'Upload résumé' : 'Upload image'}
    </button>
    {error && <p className="admin-field-error" role="alert">{error}</p>}
  </div>;
}

function PrimitiveEditor({ value, onChange, fieldKey, path = fieldKey, onSessionExpired }: EditorProps) {
  const id = `field-${path.replace(/[^a-z0-9-]/gi, '-')}`;
  const options = fieldKey === 'kind' ? ['work', 'internship', 'education'] : fieldKey === 'category' && path.startsWith('gallery') ? ['design', 'branding', 'photography'] : fieldKey === 'displayFont' ? ['Barlow Condensed', 'Bodoni Moda'] : fieldKey === 'bodyFont' ? ['DM Sans', 'Bodoni Moda'] : fieldKey === 'url' && path.startsWith('navigation.') ? ['#about', '#work', '#journey', '#archive', '#contact'] : undefined;
  const multiline = longFields.includes(fieldKey) || /\.paragraphs\.|\.highlights\./.test(path) || path.startsWith('editorial.') && /Title$|Description$/.test(fieldKey) || typeof value === 'string' && value.includes('\n');
  if (typeof value === 'boolean') return <label className="admin-toggle" htmlFor={id}>
    <span><strong>{humanize(fieldKey)}</strong><small>{fieldKey.startsWith('show') ? value ? 'Visible on the portfolio' : 'Hidden on the portfolio' : fieldKey === 'featured' ? value ? 'Featured placement' : 'Standard placement' : value ? 'Enabled' : 'Disabled'}</small></span>
    <input id={id} type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
    <span className="admin-toggle-track" aria-hidden="true" />
  </label>;
  return <div className={`admin-field ${longFields.includes(fieldKey) ? 'admin-field-wide' : ''}`}>
    <label htmlFor={id}>{humanize(fieldKey)}</label>
    {options ? <select id={id} value={String(value)} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option} value={option}>{option.startsWith('#') ? `${humanize(option.slice(1))} section (${option})` : humanize(option)}</option>)}
    </select> : typeof value === 'number' ? <input id={id} type="number" value={value} min={fieldKey === 'width' || fieldKey === 'height' ? 1 : undefined} onChange={(event) => onChange(Number(event.target.value))} />
      : multiline ? <textarea id={id} rows={fieldKey === 'description' || fieldKey === 'introduction' || fieldKey === 'puzzleDescription' ? 4 : 2} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} />
        : <input id={id} type={fieldKey === 'email' ? 'email' : 'text'} value={String(value ?? '')} onChange={(event) => onChange(event.target.value)} autoComplete="off" spellCheck={!linkFields.includes(fieldKey) && fieldKey !== 'id'} />}
    {fieldKey === 'id' && <small className="admin-field-hint">Keep this unique. It identifies this item in the portfolio.</small>}
    {fieldKey === 'resumeUrl' && <UploadButton accept="application/pdf" onUploaded={(asset) => onChange(asset.url)} onSessionExpired={onSessionExpired} />}
    {['paper', 'ink', 'accent', 'muted', 'background', 'paperColor', 'inkColor', 'accentColor'].includes(fieldKey) && /^#[0-9a-f]{3,8}$/i.test(String(value)) && <label className="admin-color-choice">Color picker <input aria-label={`Choose ${humanize(fieldKey)}`} type="color" value={String(value).slice(0, 7)} onChange={(event) => onChange(event.target.value)} /></label>}
  </div>;
}

function ImageEditor({ value, onChange, fieldKey, path = fieldKey, onSessionExpired }: EditorProps & { value: Record<string, unknown> }) {
  const source = String(value.src ?? '');
  return <fieldset className="admin-image-editor">
    <legend>{humanize(fieldKey)}</legend>
    <div className="admin-image-preview">
      {source ? <img src={source} alt={String(value.alt || humanize(fieldKey))} loading="lazy" onError={(event) => { event.currentTarget.style.opacity = '0.15'; }} onLoad={(event) => { event.currentTarget.style.opacity = '1'; }} /> : <span>No image selected</span>}
      <UploadButton accept="image/png,image/jpeg,image/webp,image/avif" onSessionExpired={onSessionExpired} onUploaded={(asset) => onChange(replaceUploadedImage(value, asset))} />
    </div>
    <div className="admin-fields-grid">
      {Object.entries(value).map(([key, item]) => <PrimitiveEditor key={key} fieldKey={key} path={`${path}.${key}`} value={item} onChange={(next) => onChange(updateImageField(value, key, next))} onSessionExpired={onSessionExpired} />)}
    </div>
    <p className="admin-field-hint">Images are resized to a maximum of 1920 px and compressed to WebP before uploading. Transparent backgrounds are preserved.</p>
  </fieldset>;
}

function ArrayEditor({ value, onChange, fieldKey, path = fieldKey, onSessionExpired }: EditorProps & { value: unknown[] }) {
  const primitive = value.length > 0 ? value.every((item) => typeof item !== 'object') : typeof newArrayItem(fieldKey) !== 'object';
  const move = (index: number, direction: number) => {
    const next = [...value];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  return <div className={`admin-array ${primitive ? 'admin-array-compact' : ''}`}>
    <div className="admin-array-heading"><h3>{humanize(fieldKey)} <span>{value.length}</span></h3>
      <button type="button" className="admin-button admin-button-small" onClick={() => onChange([...value, newArrayItem(fieldKey, value[0])])}><Plus size={15} /> Add {primitive ? 'text' : 'item'}</button>
    </div>
    {value.length === 0 && <p className="admin-empty">No items yet. Add your first {humanize(fieldKey).toLowerCase()} item.</p>}
    {value.map((item, index) => {
      const record = item && typeof item === 'object' ? item as Record<string, unknown> : null;
      const title = record ? String(record.title || record.label || record.name || `Untitled item ${index + 1}`) : `Item ${index + 1}`;
      const controls = <div className="admin-item-actions">
        <button type="button" className="admin-icon-button" aria-label={`Move ${title} up`} disabled={index === 0} onClick={(event) => { event.preventDefault(); move(index, -1); }}><ArrowUp size={16} /></button>
        <button type="button" className="admin-icon-button" aria-label={`Move ${title} down`} disabled={index === value.length - 1} onClick={(event) => { event.preventDefault(); move(index, 1); }}><ArrowDown size={16} /></button>
        <button type="button" className="admin-icon-button admin-icon-danger" aria-label={`Remove ${title}`} onClick={(event) => { event.preventDefault(); if (primitive || window.confirm(`Remove “${title}” from this draft? It will be removed from the website when you publish.`)) onChange(value.filter((_, at) => at !== index)); }}>{primitive ? <X size={16} /> : <Trash size={16} />}</button>
      </div>;
      const editor = <RecursiveEditor value={item} fieldKey={primitive ? `${humanize(fieldKey).replace(/s$/, '')} ${index + 1}` : fieldKey} path={`${path}.${index}`} onSessionExpired={onSessionExpired} onChange={(next) => onChange(value.map((original, at) => at === index ? next : original))} />;
      return primitive ? <div className="admin-text-item" key={index}>{editor}{controls}</div> : <details className="admin-item-card" key={record?.id ? String(record.id) : index} open={value.length === 1}>
        <summary><span className="admin-item-index">{String(index + 1).padStart(2, '0')}</span><span className="admin-item-title">{title}<small>{String(record?.organization || record?.category || '')}</small></span>{controls}<span className="admin-detail-chevron" aria-hidden="true">⌄</span></summary>
        <div className="admin-item-body">{editor}</div>
      </details>;
    })}
  </div>;
}

export default function RecursiveEditor({ value, onChange, fieldKey, path = fieldKey, onSessionExpired }: EditorProps) {
  if (fieldKey === 'sectionOrder' && Array.isArray(value)) return <SectionOrderEditor value={value as string[]} onChange={onChange} />;
  if (Array.isArray(value)) return <ArrayEditor value={value} onChange={onChange} fieldKey={fieldKey} path={path} onSessionExpired={onSessionExpired} />;
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    if ('src' in object && 'alt' in object) return <ImageEditor value={object} onChange={onChange} fieldKey={fieldKey} path={path} onSessionExpired={onSessionExpired} />;
    return <div className="admin-fields-grid">{Object.entries(object).map(([key, item]) => {
      const nested = Boolean(item && typeof item === 'object');
      return <div key={key} className={nested ? 'admin-nested-field admin-field-wide' : undefined}>
        {nested && !Array.isArray(item) && !(item && typeof item === 'object' && 'src' in item) && <h3 className="admin-object-heading">{humanize(key)}</h3>}
        <RecursiveEditor fieldKey={key} path={`${path}.${key}`} value={item} onChange={(next) => onChange({ ...object, [key]: next })} onSessionExpired={onSessionExpired} />
      </div>;
    })}</div>;
  }
  return <PrimitiveEditor value={value} onChange={onChange} fieldKey={fieldKey} path={path} onSessionExpired={onSessionExpired} />;
}
