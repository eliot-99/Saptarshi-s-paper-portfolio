import { StrictMode, Suspense, lazy } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import PortfolioApp from './app/PortfolioApp'
import './styles/index.css'
import './styles/responsive.css'
import './styles/equal-layouts.css'
import './styles/editorial-titles.css'
import './styles/paper-textures.css'
import './styles/centered-nameplate.css'
import './styles/credentials-editorial.css'
import './styles/toolbox-editorial.css'

const AdminApp = lazy(() => import('./admin/AdminApp'))
const isAdmin = window.location.pathname.replace(/\/$/, '') === '/admin'
const application = (
  <StrictMode>
    {isAdmin ? <Suspense fallback={<div className="admin-loading">Opening the editor…</div>}><AdminApp /></Suspense> : <PortfolioApp />}
  </StrictMode>
)
const root = document.getElementById('root')!
if (!isAdmin && root.hasChildNodes() && !window.location.search.includes('preview=1')) hydrateRoot(root, application)
else createRoot(root).render(application)
