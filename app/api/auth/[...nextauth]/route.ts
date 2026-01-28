import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// FAIL CLOSED: Verify required env vars at startup
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('AUTH_CONFIG_ERROR: GOOGLE_CLIENT_ID is required')
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('AUTH_CONFIG_ERROR: GOOGLE_CLIENT_SECRET is required')
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('AUTH_CONFIG_ERROR: NEXTAUTH_SECRET is required')
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
