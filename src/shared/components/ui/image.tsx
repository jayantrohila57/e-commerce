'use client'

import * as React from 'react'
import Image from 'next/image'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils/lib/utils'

interface BlurImageProps extends ComponentProps<typeof Image> {
  fallbackSrc?: string
}

export function BlurImage({ className, alt, fallbackSrc = '/fallback.png', ...props }: BlurImageProps) {
  const [isLoading, setLoading] = React.useState(true)
  const [hasError, setError] = React.useState(false)
  const src = props.src ? props.src : fallbackSrc
  const errorSrc = hasError && fallbackSrc
  return (
    <Image
      {...props}
      alt={alt}
      src={errorSrc || src}
      className={cn(
        className,
        'motion-all',
        isLoading ? 'animate-shimmer blur-xs' : 'blur-0',
        errorSrc && 'bg-secondary',
      )}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onLoad={() => setLoading(false)}
      onError={() => {
        setError(true)
        setLoading(false)
      }}
    />
  )
}
