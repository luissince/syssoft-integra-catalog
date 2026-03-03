"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

// Imagen de placeholder por defecto
const DEFAULT_PLACEHOLDER = "/placeholder.svg"

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined
  fallbackSrc?: string
}

export function SafeImage({ src, fallbackSrc = DEFAULT_PLACEHOLDER, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  // Si src es undefined, null, o cadena vacía, o si hubo un error, usar el fallback
  const safeSrc = !src || src.trim() === "" || error ? fallbackSrc : src

  return <Image src={safeSrc || "/placeholder.svg"} alt={alt || "Imagen"} {...props} onError={() => setError(true)} />
}
