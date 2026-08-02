'use client'

import Image from 'next/image'

const PRIMARY_LOGO_SRC = '/img/hawari-brand.jpeg'

export default function BrandLogo({
  alt = 'Hawari Tours',
  width = 960,
  height = 700,
  priority = false,
  className = '',
  imageClassName = '',
}) {
  return (
    <div className={className}>
      <Image
        src={PRIMARY_LOGO_SRC}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`block h-auto w-full object-contain ${imageClassName}`.trim()}
      />
    </div>
  )
}
