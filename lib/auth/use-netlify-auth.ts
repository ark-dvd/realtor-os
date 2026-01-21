'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from 'netlify-identity-widget'

// Dynamic import for client-side only
let netlifyIdentity: typeof import('netlify-identity-widget').default | null = null

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useNetlifyAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    // Dynamically import netlify-identity-widget
    import('netlify-identity-widget').then((module) => {
      netlifyIdentity = module.default
      
      // Initialize
      netlifyIdentity.init()

      // Set initial user
      const currentUser = netlifyIdentity.currentUser()
      setState(prev => ({ ...prev, user: currentUser, loading: false }))

      // Listen for auth events
      netlifyIdentity.on('login', (user) => {
        setState(prev => ({ ...prev, user, loading: false, error: null }))
        netlifyIdentity?.close()
      })

      netlifyIdentity.on('logout', () => {
        setState(prev => ({ ...prev, user: null, loading: false }))
      })

      netlifyIdentity.on('error', (err) => {
        console.error('Netlify Identity error:', err)
        setState(prev => ({ ...prev, error: String(err), loading: false }))
      })
    }).catch((err) => {
      console.error('Failed to load netlify-identity-widget:', err)
      setState(prev => ({ ...prev, loading: false, error: 'Failed to load authentication' }))
    })

    return () => {
      netlifyIdentity?.off('login')
      netlifyIdentity?.off('logout')
      netlifyIdentity?.off('error')
    }
  }, [])

  const login = useCallback(() => {
    netlifyIdentity?.open('login')
  }, [])

  const signup = useCallback(() => {
    netlifyIdentity?.open('signup')
  }, [])

  const logout = useCallback(async () => {
    try {
      await netlifyIdentity?.logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }, [])

  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      if (!netlifyIdentity) return null
      const token = await netlifyIdentity.refresh()
      return token
    } catch (err) {
      console.error('Token refresh error:', err)
      return null
    }
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    login,
    signup,
    logout,
    getToken,
  }
}

// Helper to make authenticated API calls
export async function authFetch(
  url: string,
  options: RequestInit = {},
  getToken: () => Promise<string | null>
): Promise<Response> {
  const token = await getToken()
  
  if (!token) {
    throw new Error('Not authenticated')
  }

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')

  return fetch(url, {
    ...options,
    headers,
  })
}
