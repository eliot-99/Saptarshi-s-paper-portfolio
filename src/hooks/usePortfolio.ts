import { useEffect, useState } from 'react'
import { defaultPortfolio } from '../data/portfolio'
import type { PortfolioData } from '../types/portfolio'

export function usePortfolio() {
  const [content, setContent] = useState<PortfolioData>(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1') {
      try {
        const draft = JSON.parse(localStorage.getItem('paper-portfolio-preview') || 'null') as PortfolioData | null
        if (draft?.schemaVersion === 1 && draft.theme && draft.artwork) return draft
      } catch { /* A malformed draft must not break the public edition. */ }
    }
    return defaultPortfolio
  })
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('preview') === '1') return
    const controller = new AbortController()
    fetch('/api/content', { signal: controller.signal }).then(async response => {
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return
      const data = await response.json() as { content?: PortfolioData }
      if (data.content?.schemaVersion === 1) setContent(data.content)
    }).catch(() => { /* The complete bundled edition is available offline. */ })
    return () => controller.abort()
  }, [])
  return content
}
