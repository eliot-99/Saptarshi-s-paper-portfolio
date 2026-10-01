import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp'
import type { PortfolioData } from '../../types/portfolio'

export function Footer({ data }: { data: PortfolioData }) {
  return <footer className="publication-footer"><a className="publication-brand" href="#top">{data.site.masthead}</a><span className="folio">{data.site.copyright}</span><a href="#top" className="folio">BACK TO THE FRONT PAGE <ArrowUp size={17} /></a></footer>
}
