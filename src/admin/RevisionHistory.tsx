import { useEffect, useState } from 'react';
import { ArrowClockwise } from '@phosphor-icons/react/dist/csr/ArrowClockwise';
import { ClockCounterClockwise } from '@phosphor-icons/react/dist/csr/ClockCounterClockwise';
import type { PortfolioData } from '../types/portfolio';
import { api, ApiError } from './api';

interface Revision { version: number; savedAt: string }

export default function RevisionHistory({ currentVersion, onRestore, onSessionExpired }: {
  currentVersion: number;
  onRestore: (content: PortfolioData) => void;
  onSessionExpired: () => void;
}) {
  const [items, setItems] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);
  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const result = await api<{ items: Revision[] }>('/api/history');
      if (!Array.isArray(result.items) || result.items.some((item) => !item || !Number.isSafeInteger(item.version) || typeof item.savedAt !== 'string')) throw new Error('The revision service returned an invalid response. Please try again.');
      setItems(result.items);
    }
    catch (failure) {
      if (failure instanceof ApiError && failure.status === 401) onSessionExpired();
      setError(failure instanceof Error ? failure.message : 'Revisions could not be loaded.');
    } finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  return <section>
    <div className="admin-section-intro"><span className="admin-kicker">A record of every edition</span><h1>Revision archive<span>.</span></h1><p>Your last 30 published editions. Restore an older edition into your draft, review it, and publish when ready.</p></div>
    <button className="admin-button admin-button-small" disabled={loading} onClick={() => { void refresh(); }}><ArrowClockwise size={15} />Refresh archive</button>
    {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
    {loading && !items.length ? <p className="admin-empty admin-revision-list">Loading the archive…</p> : !items.length && !error ? <p className="admin-empty admin-revision-list">Your first published change will create a saved edition.</p> : <div className="admin-revision-list">{items.map((item) => <article key={item.version} className="admin-revision-item"><ClockCounterClockwise size={24} weight="light" /><div><strong>Edition {item.version}{item.version === currentVersion && <span>Current</span>}</strong><small>{new Date(item.savedAt).toLocaleString()}</small></div><button className="admin-button admin-button-small" disabled={busy !== null || item.version === currentVersion} onClick={async () => {
      if (!window.confirm(`Restore edition ${item.version} into your draft? This replaces your current draft. The live website changes only after you publish.`)) return;
      setBusy(item.version);
      setError('');
      try {
        const revision = await api<{ content: PortfolioData; version: number; savedAt: string }>(`/api/history?version=${item.version}`);
        if (!revision.content) throw new Error('This edition could not be opened.');
        onRestore(revision.content);
      } catch (failure) {
        if (failure instanceof ApiError && failure.status === 401) onSessionExpired();
        setError(failure instanceof Error ? failure.message : 'Restore failed.');
      } finally { setBusy(null); }
    }}>{busy === item.version ? 'Restoring…' : 'Restore to draft'}</button></article>)}</div>}
  </section>;
}
