import type { AssetImage } from '../../types/portfolio'

export function EditorialImage({ image, className = '', eager = false }: { image: AssetImage; className?: string; eager?: boolean }) {
  return <picture className={className}>
    {image.avif && <source type="image/avif" srcSet={image.avif} media="(min-width: 901px)" />}
    <img src={image.src} srcSet={image.srcSet || undefined} sizes="(max-width: 600px) 92vw, (max-width: 900px) 45vw, 32vw" alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'} />
  </picture>
}
