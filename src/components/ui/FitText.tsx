import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/** Fits editable masthead text once fonts/layout settle, without scroll work. */
export function FitText({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const heading = ref.current
    if (!heading) return
    let alive = true
    const fit = () => {
      if (!alive || !heading.parentElement) return
      heading.style.fontSize = ''
      const natural = heading.scrollWidth
      const available = heading.parentElement.clientWidth
      if (natural > available) heading.style.fontSize = `${parseFloat(getComputedStyle(heading).fontSize) * (available / natural) * 0.98}px`
    }
    const observer = new ResizeObserver(fit)
    observer.observe(heading.parentElement!)
    document.fonts.ready.then(fit)
    fit()
    return () => { alive = false; observer.disconnect() }
  }, [children])
  return <h1 ref={ref}>{children}</h1>
}
