'use client'

import { debugError } from '@/shared/utils/lib/logger.utils'
import { useState, useEffect } from 'react'

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const STORAGE_KEY = 'cookie-consent-preferences'
const CONSENT_GIVEN_KEY = 'cookie-consent-given'

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  })
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consentGiven = localStorage.getItem(CONSENT_GIVEN_KEY)
    const savedPreferences = localStorage.getItem(STORAGE_KEY)

    let parsedPrefs: CookiePreferences | null = null
    if (savedPreferences) {
      try {
        parsedPrefs = JSON.parse(savedPreferences)
      } catch (error) {
        debugError('Failed to parse saved cookie preferences:', error)
      }
    }

    // Update once, asynchronously — no warning, no re-render storm
    queueMicrotask(() => {
      if (consentGiven) setHasConsent(true)
      if (parsedPrefs) setPreferences(parsedPrefs)
    })
  }, [])

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences)
    setHasConsent(true)
  }

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CONSENT_GIVEN_KEY)
    setHasConsent(false)
    setPreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    })
  }

  const canUseAnalytics = () => preferences.analytics && hasConsent
  const canUseMarketing = () => preferences.marketing && hasConsent
  const canUseFunctional = () => preferences.functional && hasConsent

  return {
    preferences,
    hasConsent,
    updatePreferences,
    resetConsent,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
  }
}
