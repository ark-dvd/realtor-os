import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Allowed admin emails - ONLY these users can access /admin
// Stored in lowercase for normalized comparison
const ALLOWED_ADMIN_EMAILS = [
  'merrav@merrav.com',
  'arik@daflash.com',
]

function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase()
}

function isAllowedAdmin(email: string | null | undefined): boolean {
  const normalized = normalizeEmail(email)
  if (!normalized) return false
  return ALLOWED_ADMIN_EMAILS.includes(normalized)
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // FAIL CLOSED: Only allow specific admin emails
      if (!isAllowedAdmin(user.email)) {
        console.warn(`Admin login denied: ${user.email}`)
        return false
      }
      console.log(`Admin login granted: ${user.email}`)
      return true
    },

    async session({ session }) {
      return session
    },

    async jwt({ token }) {
      return token
    },
  },

  pages: {
    signIn: '/admin',
    error: '/admin',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}

// Re-export for use in API routes
export { isAllowedAdmin, ALLOWED_ADMIN_EMAILS }
