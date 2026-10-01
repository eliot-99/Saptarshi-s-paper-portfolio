import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
import { Camera } from '@phosphor-icons/react/dist/csr/Camera'
import { Compass } from '@phosphor-icons/react/dist/csr/Compass'
import { FilmSlate } from '@phosphor-icons/react/dist/csr/FilmSlate'
import { FlagBanner } from '@phosphor-icons/react/dist/csr/FlagBanner'
import { SealCheck } from '@phosphor-icons/react/dist/csr/SealCheck'
import { Trophy } from '@phosphor-icons/react/dist/csr/Trophy'
import type { Icon } from '@phosphor-icons/react'
import type { PortfolioData } from '../types/portfolio'
import { SectionHeading } from '../components/ui/SectionHeading'

const interestIcons: Record<string, Icon> = {
  photography: Camera,
  travelling: Compass,
  filmmaking: FilmSlate,
}

export function Credentials({ data }: { data: PortfolioData }) {
  return (
    <section id="credentials" className="section-space credentials-editorial">
      <SectionHeading number="06" copy={data.sectionCopy.credentials} />

      <div className="credentials-columns">
        <div className="certification-register" aria-labelledby="certification-heading">
          <div className="credential-group-heading">
            <SealCheck size={26} weight="duotone" aria-hidden="true" />
            <h3 id="certification-heading" className="folio">Professional certifications</h3>
            <span className="folio credential-count">{String(data.certifications.length).padStart(2, '0')}</span>
          </div>

          <div className="certificate-documents">
            {data.certifications.map(item => (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="certificate-document"
                key={item.id}
                aria-label={`View ${item.title} certificate from ${item.organization}`}
              >
                <div className="certificate-copy">
                  <p className="folio certificate-issuer">{item.organization} / {item.year}</p>
                  <h4>{item.title}</h4>
                  <p className="certificate-skills">{item.skills.join(' · ')}</p>
                </div>
                <div className="certificate-stub">
                  <span className="folio">{item.duration}</span>
                  <span className="certificate-open" aria-hidden="true"><ArrowUpRight size={22} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="recognition-register" aria-labelledby="recognition-heading">
          <div className="credential-group-heading">
            <Trophy size={26} weight="duotone" aria-hidden="true" />
            <h3 id="recognition-heading" className="folio">Recognition &amp; leadership</h3>
            <span className="folio credential-count">{String(data.achievements.length).padStart(2, '0')}</span>
          </div>

          <div className="recognition-entries">
            {data.achievements.map((item, index) => (
              <article className="recognition-entry" key={item.id}>
                <span className="recognition-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <p className="folio recognition-issuer">{item.organization} / {item.period}</p>
                  <h4>{item.title}</h4>
                  <p className="recognition-description">{item.description}</p>
                  {item.url && (
                    <a className="recognition-link" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`View recognition: ${item.title}`}>
                      View recognition <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="offclock-feature" aria-labelledby="offclock-heading">
        <div className="offclock-heading">
          <FlagBanner size={22} weight="duotone" aria-hidden="true" />
          <h3 id="offclock-heading" className="folio">Off the clock</h3>
        </div>
        <div className="offclock-interests">
          {data.interests.map(item => {
            const InterestIcon = interestIcons[item.id] ?? interestIcons[item.title.toLowerCase()] ?? Compass
            return (
              <article className="offclock-interest" key={item.id}>
                <span className="offclock-icon" aria-hidden="true"><InterestIcon size={38} weight="duotone" /></span>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
