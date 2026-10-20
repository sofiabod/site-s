import type { ImgHTMLAttributes } from 'react'
import manifest from './image-manifest.json'

type ImageAsset = { width: number; height: number; src: string; webp: string; avif?: string }
const images: Record<string, ImageAsset> = manifest

export default function ResponsiveImage({ src = '', sizes, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const asset = images[src]
  if (!asset) return <img src={src} {...props} />
  const image = <img decoding="async" width={asset.width} height={asset.height} {...props} data-original-src={src} src={asset.src} srcSet={asset.webp} sizes={sizes} />
  return asset.avif ? <picture style={{ display: 'contents' }}><source type="image/avif" srcSet={asset.avif} sizes={sizes} />{image}</picture> : image
}
