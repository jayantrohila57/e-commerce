'use client'

import * as React from 'react'
import Image from 'next/image'
import type { ComponentProps } from 'react'
import { cn } from '@/shared/utils/lib/utils'

interface BlurImageProps extends ComponentProps<typeof Image> {
  fallbackSrc?: string
}

export function BlurImage({ className, alt, fallbackSrc, ...props }: BlurImageProps) {
  const [isLoading, setLoading] = React.useState(true)
  const [hasError, setError] = React.useState(false)

  return (
    <Image
      {...props}
      alt={alt}
      src={hasError && fallbackSrc ? fallbackSrc : props.src}
      className={cn(
        className,
        'motion-all',
        isLoading ? 'animate-shimmer blur-lg' : 'blur-0',
        hasError && 'bg-secondary',
      )}
      onLoad={() => setLoading(false)}
      onError={() => {
        setError(true)
        setLoading(false)
      }}
    />
  )
}
