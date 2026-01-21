declare module 'netlify-identity-widget' {
  interface User {
    id: string
    email: string
    confirmed_at?: string
    confirmation_sent_at?: string
    created_at: string
    updated_at: string
    user_metadata: {
      full_name?: string
      avatar_url?: string
    }
    app_metadata: {
      provider?: string
      roles?: string[]
    }
    token?: {
      access_token: string
      token_type: string
      expires_in: number
      refresh_token: string
      expires_at: number
    }
  }

  interface InitOptions {
    container?: string
    APIUrl?: string
    logo?: boolean
    locale?: string
    namePlaceholder?: string
  }

  function init(options?: InitOptions): void
  function open(tab?: 'login' | 'signup'): void
  function close(): void
  function logout(): Promise<void>
  function refresh(force?: boolean): Promise<string>
  function currentUser(): User | null
  function on(event: 'init' | 'login' | 'logout' | 'error' | 'open' | 'close', callback: (user?: User) => void): void
  function off(event: string, callback?: Function): void

  const netlifyIdentity: {
    init: typeof init
    open: typeof open
    close: typeof close
    logout: typeof logout
    refresh: typeof refresh
    currentUser: typeof currentUser
    on: typeof on
    off: typeof off
  }

  export default netlifyIdentity
  export { User, InitOptions }
}
