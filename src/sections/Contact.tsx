import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { EnvelopeSimple } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { Copy } from '@phosphor-icons/react/dist/csr/Copy'
import { Check } from '@phosphor-icons/react/dist/csr/Check'
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin'
import { Phone } from '@phosphor-icons/react/dist/csr/Phone'
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/csr/PaperPlaneTilt'
import type { PortfolioData } from '../types/portfolio'
import type { FormEvent } from 'react'
import { EditorialTitle } from '../components/ui/EditorialTitle'
import '../styles/contact.css'

export function Contact({ data }: { data: PortfolioData }) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('')
  const copyTimeout = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const field = (name: string) => String(fields.get(name) ?? '').trim()
    const body = `${field('message')}\n\nFrom: ${field('name')}\nReply to: ${field('email')}`
    window.location.href = `mailto:${data.person.email}?subject=${encodeURIComponent(field('subject'))}&body=${encodeURIComponent(body)}`
    setStatus(data.contact.successMessage)
  }
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.person.email)
      setCopied(true)
      window.clearTimeout(copyTimeout.current)
      copyTimeout.current = window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setStatus(`Email: ${data.person.email}`)
    }
  }
  return (
    <section id="contact" className="section-space correspondence-section" aria-labelledby="correspondence-heading">
      <div className="correspondence-folio">
        <p className="folio">07 / {data.sectionCopy.contact.eyebrow}</p>
        <EnvelopeSimple size={22} weight="light" aria-hidden="true" />
      </div>
      <div className="correspondence-intro">
        <EditorialTitle id="correspondence-heading" title={data.contact.heading} accentTailWords={2} />
        <p>{data.contact.description}</p>
      </div>
      <div className="correspondence-desk">
        <div className="correspondence-address">
          <div className="correspondence-email-block">
            <p className="folio">{data.contact.emailLabel}</p>
            <a className="correspondence-email" href={`mailto:${data.person.email}`}>
              <span>{data.person.email}</span><ArrowUpRight size={27} aria-hidden="true" />
            </a>
            <button className="correspondence-copy" type="button" onClick={copyEmail}>
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? 'Email copied' : 'Copy email address'}
            </button>
          </div>
          <dl className="correspondence-details">
            <div>
              <dt><Phone size={19} weight="light" aria-hidden="true" /><span className="folio">{data.contact.phoneLabel}</span></dt>
              <dd><a href={`tel:${data.person.phone.replace(/\s/g, '')}`}>{data.person.phone}<ArrowUpRight size={17} aria-hidden="true" /></a></dd>
            </div>
            <div>
              <dt><MapPin size={19} weight="light" aria-hidden="true" /><span className="folio">{data.contact.locationLabel}</span></dt>
              <dd>{data.person.hometown}</dd>
            </div>
          </dl>
          <div className="correspondence-socials" aria-label="Social profiles">
            {data.socials.map(social => <a href={social.url} key={social.id} target="_blank" rel="noopener noreferrer"><span>{social.label}</span><ArrowUpRight size={18} aria-hidden="true" /></a>)}
          </div>
        </div>
        <form onSubmit={submit} className="correspondence-letter">
          <div className="correspondence-letter-heading">
            <div><p className="folio">A personal note</p><h3>{data.contact.messageLabel}</h3></div>
            <div className="correspondence-stamp" aria-hidden="true"><EnvelopeSimple size={34} weight="light" /><span>{data.person.firstName}</span></div>
          </div>
          <div className="correspondence-fields-two">
            <label className="correspondence-field"><span className="correspondence-field-label"><span aria-hidden="true">01</span>Your name</span><input name="name" autoComplete="name" placeholder="Alex Smith" required maxLength={100} /></label>
            <label className="correspondence-field"><span className="correspondence-field-label"><span aria-hidden="true">02</span>Your email</span><input name="email" type="email" autoComplete="email" placeholder="alex@example.com" required maxLength={200} /></label>
          </div>
          <label className="correspondence-field"><span className="correspondence-field-label"><span aria-hidden="true">03</span>Subject</span><input name="subject" placeholder="A project, an idea, a hello…" required maxLength={200} /></label>
          <label className="correspondence-field correspondence-field-message"><span className="correspondence-field-label"><span aria-hidden="true">04</span>Your message</span><textarea name="message" rows={4} placeholder="Tell me what you have in mind." required maxLength={5000} /></label>
          <div className="correspondence-send">
            <button type="submit"><span>{data.contact.submitLabel}</span><PaperPlaneTilt size={23} weight="light" aria-hidden="true" /></button>
            <p className="folio">Opens your email app</p>
          </div>
        </form>
      </div>
      <p role="status" aria-live="polite" className="correspondence-status">{status}</p>
    </section>
  )
}
