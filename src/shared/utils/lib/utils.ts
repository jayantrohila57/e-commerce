import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(string: string | undefined | null) {
  return String(String(string)?.charAt(0)?.toUpperCase() + string?.slice(1))
}

export function truncateString(string: string | undefined | null, length: number) {
  return String(String(string)?.length > length ? string?.slice(0, length) + '...' : string)
}
