import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react/dist/csr/X'

export function Modal({ label, children, onClose }: { label: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous; dialog?.close() }
  }, [])
  return <dialog ref={ref} className="editorial-dialog" aria-label={label} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <button className="modal-close" onClick={onClose} aria-label="Close dialog"><X size={26} /></button>{children}
  </dialog>
}
