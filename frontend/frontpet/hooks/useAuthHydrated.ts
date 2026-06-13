'use client'

import { useEffect, useState } from 'react'
import { useAuthenticationStore } from '@/app/utils/uistate/fetures/authentication'

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false) // ← always false on server, safe

  useEffect(() => {
    // Only runs client-side, after mount
    if (useAuthenticationStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useAuthenticationStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
    return unsub
  }, [])

  return hydrated
}