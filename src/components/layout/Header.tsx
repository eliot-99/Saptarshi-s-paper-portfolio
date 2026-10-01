import { useState } from 'react'
import { List } from '@phosphor-icons/react/dist/csr/List'
import { X } from '@phosphor-icons/react/dist/csr/X'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import type { PortfolioData } from '../../types/portfolio'
import '../../styles/navigation.css'

export function Header({ data }: { data: PortfolioData }) {
  const [open, setOpen] = useState(false)
  const links = data.navigation.filter(link => link.url !== '#archive' || data.theme.showGallery)
  return <header className="publication-header" id="top">
    <div className="publication-top"><span className="folio">{data.person.location.split(',').slice(0, 1).join('')} <span className="tiny-star">✳</span> INDIA</span><a href="#top" className="publication-brand">{data.site.masthead}</a><a className="header-contact folio" href={`mailto:${data.person.email}`}>LET’S TALK <ArrowUpRight size={17} /></a><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X size={26} /> : <List size={26} />}</button></div>
    <nav className={open ? 'publication-nav is-open' : 'publication-nav'} aria-label="Main navigation"><span className="folio edition">{data.site.edition}</span><div>{links.map(link => <a href={link.url} key={link.id} onClick={() => setOpen(false)}>{link.label}</a>)}</div><span className="folio nav-note">CODE. CRAFT. CURIOSITY.</span></nav>
  </header>
}
