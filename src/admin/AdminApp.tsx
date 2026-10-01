import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown';
import { ArrowSquareOut } from '@phosphor-icons/react/dist/csr/ArrowSquareOut';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { ClockCounterClockwise } from '@phosphor-icons/react/dist/csr/ClockCounterClockwise';
import { FloppyDisk } from '@phosphor-icons/react/dist/csr/FloppyDisk';
import { Image } from '@phosphor-icons/react/dist/csr/Image';
import { List } from '@phosphor-icons/react/dist/csr/List';
import { LockKey } from '@phosphor-icons/react/dist/csr/LockKey';
import { SignOut } from '@phosphor-icons/react/dist/csr/SignOut';
import { UploadSimple } from '@phosphor-icons/react/dist/csr/UploadSimple';
import { X } from '@phosphor-icons/react/dist/csr/X';
import type { PortfolioData } from '../types/portfolio';
import { defaultPortfolio } from '../data/portfolio';
import { validatePortfolio } from '../../server/validation';
import { api, ApiError, type ContentEnvelope } from './api';
import RecursiveEditor from './RecursiveEditor';
import MediaLibrary from './MediaLibrary';
import RevisionHistory from './RevisionHistory';
import { humanize, sectionNames } from './templates';
import { DRAFT_KEY, parseImportedContent, recoverStoredDraft, resolvePublication, type Draft } from './editorState';
import './admin.css';

function downloadContent(content: PortfolioData) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
  link.href = url;
  link.download = `portfolio-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function LoginScreen({ onLogin, reason }: { onLogin: () => void; reason: string }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const result = await api<{ authenticated: boolean }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
      if (!result.authenticated) throw new Error('Sign-in could not be completed. Please try again.');
      setPassword('');
      onLogin();
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to sign in.'); }
    finally { setBusy(false); }
  }
  return <div className="admin-login">
    <a className="admin-login-back" href="/">← Back to the portfolio</a>
    <div className="admin-login-art" aria-hidden="true"><span>THE<br />EDITOR’S<br /><em>ROOM.</em></span><p>A little space to make<br />your next edition.</p><div className="admin-login-seal">S<span>Est. 2026</span></div></div>
    <div className="admin-login-panel"><div className="admin-login-card"><span className="admin-kicker"><LockKey size={16} /> Private publication desk</span><h1>Make it<br /><em>your own.</em></h1><p>Sign in to edit the words, images, and stories behind your portfolio.</p>
      {reason && <div className="admin-alert" role="status">{reason}</div>}
      <form onSubmit={(event) => { void submit(event); }}><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} autoFocus />
        {error && <p className="admin-field-error" role="alert">{error}</p>}
        <button className="admin-button admin-button-primary" disabled={busy} type="submit">{busy ? 'Opening your desk…' : 'Enter the editor'}<ArrowSquareOut size={18} /></button>
      </form><small className="admin-login-note">Your password stays private. Drafts are saved on this device while you work.</small>
    </div></div>
  </div>;
}

function AdvancedEditor({ content, onApply }: { content: PortfolioData; onApply: (content: PortfolioData) => void }) {
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  return <details className="admin-advanced" onToggle={(event) => { if (event.currentTarget.open) { setJson(JSON.stringify(content, null, 2)); setError(''); } }}>
    <summary>Advanced: edit complete content JSON<span aria-hidden="true">⌄</span></summary><p>For bulk changes. Applying updates your draft; use Publish changes to update the website.</p>
    <label className="admin-sr-only" htmlFor="advanced-content">Complete portfolio content JSON</label><textarea id="advanced-content" value={json} rows={18} spellCheck={false} onChange={(event) => setJson(event.target.value)} />
    {error && <p className="admin-field-error" role="alert">{error}</p>}<button className="admin-button" onClick={() => {
      try { const data: unknown = JSON.parse(json); const imported = parseImportedContent(data, content); onApply(imported.content); setError(''); }
      catch (failure) { setError(failure instanceof Error ? failure.message : 'Invalid JSON.'); }
    }}>Apply to draft</button>
  </details>;
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [content, setContent] = useState<PortfolioData | null>(null);
  const [published, setPublished] = useState<ContentEnvelope | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState('site');
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loginReason, setLoginReason] = useState('');
  const [draftConflict, setDraftConflict] = useState<Draft | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const contentRef = useRef(content);
  const publishedRef = useRef(published);
  contentRef.current = content;
  publishedRef.current = published;
  const dirty = Boolean(content && published && JSON.stringify(content) !== JSON.stringify(published.content));

  const sessionExpired = useCallback(() => {
    setAuthenticated(false);
    setLoginReason('Your session ended. Sign in again to continue; your local draft is safe.');
  }, []);

  const loadContent = useCallback(async (force = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await api<ContentEnvelope>('/api/content');
      if (!response.content || !Number.isSafeInteger(response.version) || response.version < 0) throw new Error('The content service returned an invalid response. Your local draft is safe.');
      const result = { ...response, content: parseImportedContent(response.content, defaultPortfolio).content };
      let rawDraft: string | null = null;
      try { rawDraft = localStorage.getItem(DRAFT_KEY); } catch { /* The editor works when optional local storage is disabled. */ }
      const recovered = recoverStoredDraft(rawDraft, result.content);
      const draft = recovered.draft;
      if (recovered.warning && !force) setNotice(recovered.warning);
      if (!force && contentRef.current) {
        const previous = publishedRef.current;
        const changed = previous && JSON.stringify(contentRef.current) !== JSON.stringify(previous.content);
        if (previous && changed && previous.version !== result.version) {
          setPublished(previous);
          setContent(contentRef.current);
          setError('A newer edition was published while you were away. Your draft is retained. Export it, then load the latest edition before applying your changes again.');
        } else {
          setPublished(result);
          setContent(changed ? contentRef.current : result.content);
        }
      } else if (!force && draft && draft.version === result.version && JSON.stringify(draft.content) !== JSON.stringify(result.content)) {
        setPublished(result);
        setContent(draft.content);
        setNotice('Your unpublished draft was restored from this device.');
      } else {
        setPublished(result);
        setContent(result.content);
        if (!force && draft && draft.version !== result.version) setDraftConflict(draft);
      }
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) sessionExpired();
      setError(failure instanceof Error ? failure.message : 'The portfolio could not be loaded.');
    } finally { setLoading(false); }
  }, [sessionExpired]);

  useEffect(() => {
    let cancelled = false;
    void api<{ authenticated: boolean }>('/api/auth/session').then((session) => { if (!cancelled) setAuthenticated(Boolean(session.authenticated)); }).catch((failure: unknown) => {
      if (cancelled) return;
      setAuthenticated(false);
      if (!(failure instanceof ApiError && failure.status === 401)) setLoginReason(failure instanceof Error ? failure.message : 'The sign-in service is unavailable.');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { if (authenticated) void loadContent(); }, [authenticated, loadContent]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = setInterval(() => {
      void api<{ authenticated: boolean }>('/api/auth/session').then((session) => { if (!session.authenticated) sessionExpired(); }).catch((failure: unknown) => { if (failure instanceof ApiError && failure.status === 401) sessionExpired(); });
    }, 120000);
    return () => clearInterval(timer);
  }, [authenticated, sessionExpired]);

  useEffect(() => {
    if (!content || !published) return;
    const timer = setTimeout(() => {
      try {
        if (dirty) localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, version: published.version, savedAt: new Date().toISOString() }));
        else if (!draftConflict) localStorage.removeItem(DRAFT_KEY);
      } catch { setError('This browser could not save a local backup. Export your draft to keep a copy.'); }
    }, 500);
    return () => clearTimeout(timer);
  }, [content, published, dirty, draftConflict]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function save() {
    if (!content || !published) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const validContent = validatePortfolio(content);
      const result = await api<ContentEnvelope>('/api/content', { method: 'PUT', body: JSON.stringify({ content: validContent, version: published.version }) });
      if (!result.content || typeof result.version !== 'number') throw new Error('The server did not confirm publication. Your draft has been retained.');
      validatePortfolio(result.content);
      const publication = resolvePublication(content, contentRef.current, result.content);
      const newerEdits = publication.newerEdits;
      setPublished(result);
      if (!newerEdits) {
        setContent(publication.content);
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* Publication has already been confirmed by the server. */ }
      }
      setNotice(newerEdits ? 'Published the saved edition. Your newer edits remain in the draft.' : 'Published. Your portfolio now shows this edition.');
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) sessionExpired();
      setError(failure instanceof ApiError && failure.status === 409 ? 'Another editor published changes. Export your draft to keep a copy, then load the latest edition before applying your changes again.' : failure instanceof Error ? failure.message : 'Publication failed. Your draft has been retained.');
    } finally { setSaving(false); }
  }

  async function logout() {
    if (dirty && !window.confirm('Your unpublished draft is saved on this device. Sign out now?')) return;
    try { await api('/api/auth/logout', { method: 'POST' }); setAuthenticated(false); setLoginReason('You have signed out.'); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Sign-out failed. Please try again.'); }
  }

  async function previewDraft() {
    if (!content) return;
    setPreviewing(true);
    setError('');
    try {
      localStorage.setItem('paper-portfolio-preview', JSON.stringify(content));
      window.open('/?preview=1', '_blank', 'noopener,noreferrer');
    } catch { setError('Preview could not be opened. Allow popups for this website and try again.'); }
    finally { setPreviewing(false); }
  }

  if (authenticated === null) return <div className="admin-shell"><div className="admin-loading"><span className="admin-loading-mark">S.</span><p>Opening the editor’s room…</p></div></div>;
  if (!authenticated) return <div className="admin-shell"><LoginScreen reason={loginReason} onLogin={() => { setAuthenticated(true); setLoginReason(''); }} /></div>;

  const contentKeys = content ? Object.keys(content).filter((key) => key !== 'schemaVersion') : Object.keys(sectionNames).filter((key) => key !== 'appearance');
  const keys = [...Object.keys(sectionNames).filter((key) => contentKeys.includes(key)), ...contentKeys.filter((key) => !(key in sectionNames))];
  const selected = sectionNames[active] || { label: humanize(active), description: 'Edit the content in this section.', symbol: '—' };
  return <div className="admin-shell">
    {menuOpen && <button className="admin-mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}
    <aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`}>
      <div className="admin-brand"><a href="/" aria-label="View portfolio">S<span>.</span></a><div><strong>The editor’s room</strong><small>YOUR PORTFOLIO, IN PRINT</small></div><button className="admin-icon-button admin-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={22} /></button></div>
      <nav aria-label="Editor sections"><span className="admin-nav-label">TABLE OF CONTENTS</span>{keys.map((key) => <button key={key} className={active === key ? 'admin-nav-item admin-nav-active' : 'admin-nav-item'} onClick={() => { setActive(key); setMenuOpen(false); }}><span>{sectionNames[key]?.symbol || '—'}</span>{sectionNames[key]?.label || humanize(key)}<span className="admin-nav-dot" /></button>)}<button className={active === 'media' ? 'admin-nav-item admin-nav-active' : 'admin-nav-item'} onClick={() => { setActive('media'); setMenuOpen(false); }}><Image size={16} />Media library<span className="admin-nav-dot" /></button><button className={active === 'history' ? 'admin-nav-item admin-nav-active' : 'admin-nav-item'} onClick={() => { setActive('history'); setMenuOpen(false); }}><ClockCounterClockwise size={16} />Revision archive<span className="admin-nav-dot" /></button></nav>
      <div className="admin-sidebar-footer"><a href="/" target="_blank" rel="noreferrer">View live portfolio<ArrowSquareOut size={16} /></a><button onClick={() => { void logout(); }}>Sign out<SignOut size={17} /></button><small>Made to keep evolving.</small></div>
    </aside>
    <div className="admin-workspace"><header className="admin-topbar"><div className="admin-topbar-context"><button className="admin-icon-button admin-mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><List size={22} /></button><span>EDITOR / <strong>{active === 'media' ? 'Media library' : active === 'history' ? 'Revision archive' : selected.label}</strong></span></div><div className="admin-topbar-actions"><span className={`admin-save-state ${dirty ? 'admin-save-state-dirty' : ''}`}><span />{saving ? 'Publishing…' : dirty ? 'Unpublished draft' : 'Up to date'}</span><button className="admin-button admin-preview-button" disabled={!content || previewing} onClick={() => { void previewDraft(); }}>Preview<ArrowSquareOut size={16} /></button><button className="admin-button admin-button-primary" disabled={!dirty || saving || loading} onClick={() => { void save(); }}><FloppyDisk size={17} /><span>{saving ? 'Publishing…' : 'Publish changes'}</span></button></div></header>
      <main className="admin-main" id="admin-main">
        {error && <div className="admin-alert admin-alert-error" role="alert"><span>{error}</span><button className="admin-icon-button" aria-label="Dismiss error" onClick={() => setError('')}><X size={17} /></button></div>}
        {notice && <div className="admin-alert" role="status"><CheckCircle size={19} /><span>{notice}</span><button className="admin-icon-button" aria-label="Dismiss notice" onClick={() => setNotice('')}><X size={17} /></button></div>}
        {draftConflict && <div className="admin-alert admin-alert-warning"><span>A local draft from {new Date(draftConflict.savedAt).toLocaleDateString()} uses an older edition. You can export it or restore it over the current edition for review.</span><div className="admin-alert-actions"><button className="admin-button admin-button-small" onClick={() => downloadContent(draftConflict.content)}>Export older draft</button><button className="admin-button admin-button-small" onClick={() => { setContent(draftConflict.content); setDraftConflict(null); setNotice('Older draft restored. Review it before publishing.'); }}>Restore draft</button><button className="admin-icon-button" aria-label="Dismiss older draft" onClick={() => setDraftConflict(null)}><X size={17} /></button></div></div>}
        {loading && !content ? <div className="admin-empty admin-empty-large">Loading your latest edition…</div> : !content ? <div className="admin-empty admin-empty-large"><h1>Your desk is waiting.</h1><p>The content service could not be reached.</p><button className="admin-button" onClick={() => { void loadContent(); }}>Try again</button></div> : active === 'media' ? <MediaLibrary onSessionExpired={sessionExpired} /> : active === 'history' ? <RevisionHistory currentVersion={published?.version || 0} onSessionExpired={sessionExpired} onRestore={(next) => { setContent(next); setActive('site'); setNotice('Older edition restored to your draft. Review it before publishing.'); }} /> : <>
          <div className="admin-section-intro"><span className="admin-kicker">Chapter {selected.symbol} · The next edition</span><h1>{selected.label}<span>.</span></h1><p>{selected.description}</p></div>
          <div className="admin-editor-sheet"><RecursiveEditor key={active} fieldKey={active} path={active} value={(content as unknown as Record<string, unknown>)[active]} onSessionExpired={sessionExpired} onChange={(next) => { setContent((current) => current ? { ...current, [active]: next } : current); setNotice(''); }} /></div>
          <div className="admin-section-footer"><span>Changes remain in your draft until you publish.</span><button className="admin-text-link" disabled={!dirty} onClick={() => { if (window.confirm('Discard all unpublished changes and return to the latest published edition?')) { setContent(published?.content || content); setNotice('Returned to the published edition.'); setDraftConflict(null); } }}>Discard draft</button></div>
          <AdvancedEditor content={content} onApply={(next) => { setContent(next); setNotice('Complete JSON applied to draft. Review and publish when ready.'); }} />
        </>}
        {content && <footer className="admin-tools"><div><strong>Your content belongs to you.</strong><span>Keep a backup or import a complete edition.</span></div><div className="admin-tool-buttons"><button className="admin-button admin-button-small" onClick={() => downloadContent(content)}><ArrowDown size={16} />Export JSON</button><button className="admin-button admin-button-small" onClick={() => importInput.current?.click()}><UploadSimple size={16} />Import JSON</button><button className="admin-text-link" disabled={loading} onClick={() => {
          if (dirty && !window.confirm('Load the latest published edition? Your current unpublished changes will be discarded. Export them first if you want to keep a copy.')) return;
          try { localStorage.removeItem(DRAFT_KEY); } catch { /* The draft is optional. */ }
          setDraftConflict(null);
          void loadContent(true);
        }}>Load latest edition</button></div><input className="admin-hidden" ref={importInput} type="file" accept="application/json,.json" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            const imported = parseImportedContent(JSON.parse(await file.text()) as unknown, content);
            if (window.confirm('Replace your current draft with the imported content? The live website changes only when you publish.')) { setContent(imported.content); setActive('site'); setNotice(imported.migrated ? 'Older content imported and upgraded with current editorial and navigation settings. Review it before publishing.' : 'Content imported into your draft. Review it before publishing.'); }
          } catch (failure) { setError(failure instanceof Error ? failure.message : 'The content file could not be imported.'); }
          finally { if (importInput.current) importInput.current.value = ''; }
        }} /></footer>}
      </main>
    </div>
  </div>;
}
