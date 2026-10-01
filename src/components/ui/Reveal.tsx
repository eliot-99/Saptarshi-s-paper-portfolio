import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export function Reveal({ children, className = '', enabled = true }: { children: ReactNode; className?: string; enabled?: boolean }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce || !enabled ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
