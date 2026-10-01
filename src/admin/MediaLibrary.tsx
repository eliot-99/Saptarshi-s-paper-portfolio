import { useEffect, useRef, useState } from 'react';
import { ArrowClockwise } from '@phosphor-icons/react/dist/csr/ArrowClockwise';
import { Copy } from '@phosphor-icons/react/dist/csr/Copy';
import { FilePdf } from '@phosphor-icons/react/dist/csr/FilePdf';
import { Trash } from '@phosphor-icons/react/dist/csr/Trash';
import { UploadSimple } from '@phosphor-icons/react/dist/csr/UploadSimple';
import { api, uploadMedia, type MediaAsset } from './api';

export default function MediaLibrary({ onSessionExpired }: { onSessionExpired: () => void }) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  async function refresh(nextCursor?: string) {
    setLoading(true);
    setError('');
    try {
      const result = await api<{ items: MediaAsset[]; cursor?: string }>(`/api/media${nextCursor ? `?cursor=${encodeURIComponent(nextCursor)}` : ''}`);
      if (!Array.isArray(result.items) || result.items.some((item) => !item || typeof item.key !== 'string' || typeof item.url !== 'string' || typeof item.size !== 'number')) throw new Error('The media service returned an invalid response. Please try again.');
      setItems((old) => nextCursor ? [...old, ...result.items] : result.items);
      setCursor(result.cursor);
    } catch (failure) {
      if (failure && typeof failure === 'object' && 'status' in failure && failure.status === 401) onSessionExpired();
      setError(failure instanceof Error ? failure.message : 'The media library could not be loaded.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { void refresh(); }, []);
  return <div className="admin-media-library">
    <div className="admin-section-intro"><span className="admin-kicker">Your asset archive</span><h1>Media library<span>.</span></h1><p>Compressed images and documents stored in Cloudflare R2. Upload an asset, copy its URL, and place it in any image or link field.</p></div>
    <div className="admin-media-toolbar">
      <input className="admin-hidden" ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/avif,application/pdf" multiple onChange={async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;
        setUploading(true);
        setError('');
        let completed = 0;
        let uploadError = '';
        try {
          for (const file of files) { await uploadMedia(file); completed += 1; }
          setMessage(`${completed} ${completed === 1 ? 'asset' : 'assets'} uploaded.`);
        } catch (failure) {
          if (failure && typeof failure === 'object' && 'status' in failure && failure.status === 401) onSessionExpired();
          uploadError = failure instanceof Error ? failure.message : 'Upload failed.';
          if (completed) setMessage(`${completed} ${completed === 1 ? 'asset' : 'assets'} uploaded before the upload stopped.`);
        } finally {
          setUploading(false);
          if (input.current) input.current.value = '';
          await refresh();
          if (uploadError) setError(uploadError);
        }
      }} />
      <button className="admin-button admin-button-primary" onClick={() => input.current?.click()} disabled={uploading}><UploadSimple size={18} />{uploading ? 'Compressing & uploading…' : 'Upload assets'}</button>
      <button className="admin-button" disabled={loading} onClick={() => { void refresh(); }}><ArrowClockwise size={17} />Refresh</button>
    </div>
    {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
    {message && <div className="admin-alert" role="status">{message}</div>}
    {loading && !items.length && <p className="admin-empty">Loading your archive…</p>}
    {!loading && !items.length && !error && <div className="admin-empty admin-empty-large"><UploadSimple size={32} /><h3>Your archive starts here.</h3><p>Upload an image or PDF. Images are compressed in your browser before reaching R2.</p></div>}
    <div className="admin-media-grid">{items.map((asset) => <article key={asset.key} className="admin-media-card">
      <div className="admin-media-preview">{asset.type?.startsWith('image/') || /\.(webp|png|jpe?g|avif)$/i.test(asset.key) ? <img src={asset.url || `/media/${asset.key}`} alt={asset.name || asset.key} loading="lazy" /> : <FilePdf size={50} weight="light" />}</div>
      <div className="admin-media-details"><strong title={asset.name || asset.key}>{asset.name || asset.key.split('/').pop()}</strong><small>{asset.type || 'Asset'} · {Math.round(asset.size / 1024)} KB</small>
        <div className="admin-media-actions"><button type="button" className="admin-button admin-button-small" onClick={async () => {
          try { await navigator.clipboard.writeText(asset.url || `/media/${asset.key}`); setMessage('Asset URL copied.'); }
          catch { setError('The browser could not access the clipboard. Open the asset and copy its address.'); }
        }}><Copy size={15} />Copy URL</button>
          <a className="admin-text-link" href={asset.url || `/media/${asset.key}`} target="_blank" rel="noreferrer">Open ↗</a>
          <button className="admin-icon-button admin-icon-danger" aria-label={`Delete ${asset.name || asset.key}`} onClick={async () => {
            if (!window.confirm(`Permanently delete “${asset.name || asset.key}”? Any portfolio image or link using this asset will stop working. Make sure you replace it first.`)) return;
            try { await api(`/api/media?key=${encodeURIComponent(asset.key)}`, { method: 'DELETE' }); setItems((old) => old.filter((item) => item.key !== asset.key)); setMessage('Asset deleted from R2.'); }
            catch (failure) {
              if (failure && typeof failure === 'object' && 'status' in failure && failure.status === 401) onSessionExpired();
              setError(failure instanceof Error ? failure.message : 'Deletion failed.');
            }
          }}><Trash size={16} /></button></div>
      </div>
    </article>)}</div>
    {cursor && <button className="admin-button" disabled={loading} onClick={() => { void refresh(cursor); }}>{loading ? 'Loading…' : 'Load more assets'}</button>}
  </div>;
}
