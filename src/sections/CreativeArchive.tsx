import { useState } from 'react'
import { ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { Plus } from '@phosphor-icons/react/dist/csr/Plus'
import type { PortfolioData } from '../types/portfolio'
import { EditorialImage } from '../components/ui/EditorialImage'
import { EditorialTitle } from '../components/ui/EditorialTitle'
import { Modal } from '../components/ui/Modal'

export function CreativeArchive({ data }: { data: PortfolioData }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(8)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const items = data.gallery.filter(item => (filter === 'all' || item.category === filter) && item.title.toLowerCase().includes(search.toLowerCase()))
  const selectedIndex = items.findIndex(item => item.id === selectedId)
  const selected = items[selectedIndex]
  const changeImage = (direction: number) => setSelectedId(items[(selectedIndex + direction + items.length) % items.length].id)
  return <section id="archive" className="section-space archive-section"><div className="archive-heading"><div><p className="folio">05 / {data.sectionCopy.gallery.eyebrow}</p><EditorialTitle title={data.sectionCopy.gallery.title} /><p>{data.sectionCopy.gallery.description}</p></div><EditorialImage image={data.artwork.archive} className="archive-art" /></div><div className="archive-controls"><div className="filter-tabs" role="group" aria-label="Filter creative archive">{['all', 'design', 'photography', 'branding'].map(category => <button key={category} className={filter === category ? 'active' : ''} aria-pressed={filter === category} onClick={() => { setFilter(category); setLimit(8) }}>{category === 'all' ? 'All work' : category}</button>)}</div><label className="archive-search"><MagnifyingGlass size={18} /><input type="search" placeholder="Search the archive" aria-label="Search creative archive" value={search} onChange={event => { setSearch(event.target.value); setLimit(8) }} /></label><span className="folio">{String(items.length).padStart(2, '0')} WORKS</span></div><div className="archive-grid">{items.slice(0, limit).map((item, index) => <button className="archive-item" key={item.id} onClick={() => setSelectedId(item.id)}><div><EditorialImage image={item.image} /><span className="archive-enlarge"><Plus size={23} /></span></div><span className="folio">FIG. {String(index + 1).padStart(2, '0')} / {item.type}{item.featured ? " / SELECTED" : ""}</span><h3>{item.title}</h3></button>)}</div>{!items.length && <p className="empty-state">No works match this search. Try another title or category.</p>}{limit < items.length && <button className="oval-link archive-more" onClick={() => setLimit(limit + 8)}>{data.editorial.archiveAction} <Plus size={22} /> <span className="folio">{items.length - limit} MORE</span></button>}{selected && <Modal label={selected.title} onClose={() => setSelectedId(null)}><div className="gallery-modal"><EditorialImage image={selected.image} eager /><div><button onClick={() => changeImage(-1)} aria-label="Previous artwork"><ArrowLeft size={22} /></button><div><h3>{selected.title}</h3><p className="folio">{selected.type} / {selectedIndex + 1} OF {items.length}</p></div><button onClick={() => changeImage(1)} aria-label="Next artwork"><ArrowRight size={22} /></button></div></div></Modal>}</section>
}
