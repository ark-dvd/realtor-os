'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface NetlifyUser { id: string; email: string; user_metadata?: { full_name?: string }; app_metadata?: { roles?: string[] }; token?: { access_token: string; expires_at: number } }
interface NetlifyIdentityAPI { init: (options?: { APIUrl?: string }) => void; open: (tab?: 'login' | 'signup') => void; close: () => void; logout: () => Promise<void>; refresh: (force?: boolean) => Promise<string>; currentUser: () => NetlifyUser | null; on: (event: string, callback: (user?: NetlifyUser) => void) => void; off: (event: string) => void }
declare global { interface Window { netlifyIdentity?: NetlifyIdentityAPI } }
export interface AuthState { user: NetlifyUser | null; loading: boolean; error: string | null }

export function useNetlifyAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null })
  const identityRef = useRef<NetlifyIdentityAPI | null>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoadedRef.current) return
    scriptLoadedRef.current = true
    const script = document.createElement('script')
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js'
    script.async = true
    script.onload = () => {
      const identity = window.netlifyIdentity
      if (!identity) { setState(s => ({ ...s, loading: false, error: 'Identity widget failed' })); return }
      identityRef.current = identity
      identity.init()
      setState(s => ({ ...s, user: identity.currentUser(), loading: false }))
      identity.on('login', (user) => { setState(s => ({ ...s, user: user || null, error: null })); identity.close() })
      identity.on('logout', () => setState(s => ({ ...s, user: null })))
    }
    script.onerror = () => setState(s => ({ ...s, loading: false, error: 'Failed to load identity' }))
    document.head.appendChild(script)
    return () => { identityRef.current?.off('login'); identityRef.current?.off('logout') }
  }, [])

  const login = useCallback(() => identityRef.current?.open('login'), [])
  const logout = useCallback(async () => { try { await identityRef.current?.logout() } catch {} }, [])
  const getToken = useCallback(async (): Promise<string | null> => {
    try { return await identityRef.current?.refresh(true) || null } catch { return null }
  }, [])

  return { user: state.user, loading: state.loading, error: state.error, isAuthenticated: !!state.user, login, logout, getToken }
}
