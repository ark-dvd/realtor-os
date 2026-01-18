'use client'

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD CONTENT
// Client component with authentication and deal tracking
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  Phone, 
  Mail, 
  Download, 
  ExternalLink,
  Lock,
  Loader2,
  AlertCircle,
  Home,
  DollarSign,
  Clock
} from 'lucide-react'
import { PizzaTracker, PizzaTrackerCompact } from '@/components/dashboard/PizzaTracker'
import { useTenant } from '@/components/layout/TenantProvider'
import { getImageUrl } from '@/lib/sanity/client'
import { formatPrice, formatDate, formatAddress, cn } from '@/lib/utils'
import type { ActiveDeal, TransactionStage } from '@/lib/types'

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STATE (Simplified - integrate with Netlify Identity / Auth0)
// ─────────────────────────────────────────────────────────────────────────────

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: { email: string; name?: string } | null
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate auth - replace with actual auth provider
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any email
      if (email && password) {
        onLogin(email)
      } else {
        setError('Please enter your email and password')
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="section-dramatic bg-neutral-cream">
      <div className="container-cinematic">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 lg:p-12 border border-neutral-pearl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-accent-gold" />
              </div>
              <h2 className="font-heading text-2xl text-neutral-charcoal mb-2">
                Client Login
              </h2>
              <p className="text-neutral-silver">
                Access your transaction dashboard
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-sm mb-6">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-slate mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-slate mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-neutral-pearl rounded-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/30 focus:border-accent-gold"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'btn-accent w-full flex items-center justify-center gap-2',
                  isLoading && 'opacity-70 cursor-not-allowed'
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-neutral-silver mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/contact" className="text-accent-gold hover:underline">
                Contact your agent
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DEAL DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

function DealDashboard({ deal, onLogout }: { deal: ActiveDeal; onLogout: () => void }) {
  const { tenant } = useTenant()
  
  const upcomingDates = deal.keyDates?.filter(d => !d.isCompleted) || []
  const completedDates = deal.keyDates?.filter(d => d.isCompleted) || []

  return (
    <section className="section-dramatic bg-neutral-cream">
      <div className="container-cinematic">
        {/* Welcome Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-neutral-silver">Welcome back,</p>
            <h2 className="font-heading text-2xl text-neutral-charcoal">
              {deal.clientName}
            </h2>
          </div>
          <button
            onClick={onLogout}
            className="text-sm text-neutral-silver hover:text-accent-gold transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-neutral-pearl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Property Image */}
                  <div className="relative w-32 h-24 flex-shrink-0 bg-neutral-pearl rounded overflow-hidden">
                    {deal.property.heroImage && (
                      <Image
                        src={getImageUrl(deal.property.heroImage as any, { width: 200 })}
                        alt={deal.property.title || 'Property'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-accent-gold uppercase tracking-wider mb-1">
                      {deal.transactionType === 'purchase' ? 'Purchasing' : 'Selling'}
                    </p>
                    <h3 className="font-heading text-xl text-neutral-charcoal mb-1 truncate">
                      {deal.property.title || 'Your Property'}
                    </h3>
                    {deal.property.address && (
                      <p className="text-sm text-neutral-silver">
                        {formatAddress(deal.property.address)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-pearl">
                  <div className="text-center">
                    <DollarSign size={20} className="text-accent-gold mx-auto mb-2" />
                    <p className="text-xs text-neutral-silver uppercase">Contract Price</p>
                    <p className="font-heading text-lg font-semibold">
                      {formatPrice(deal.contractPrice || deal.property.price || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <Home size={20} className="text-accent-gold mx-auto mb-2" />
                    <p className="text-xs text-neutral-silver uppercase">Earnest Money</p>
                    <p className="font-heading text-lg font-semibold">
                      {formatPrice(deal.earnestMoney || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <Clock size={20} className="text-accent-gold mx-auto mb-2" />
                    <p className="text-xs text-neutral-silver uppercase">Days in Contract</p>
                    <p className="font-heading text-lg font-semibold">
                      {Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pizza Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-neutral-pearl p-6"
            >
              <h3 className="font-heading text-xl text-neutral-charcoal mb-6">
                Transaction Progress
              </h3>
              <PizzaTracker 
                currentStage={deal.transactionStage} 
                keyDates={deal.keyDates}
              />
            </motion.div>

            {/* Documents */}
            {deal.dealDocumentsPrivate && deal.dealDocumentsPrivate.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-neutral-pearl p-6"
              >
                <h3 className="font-heading text-xl text-neutral-charcoal mb-6">
                  Documents
                </h3>
                <div className="space-y-3">
                  {deal.dealDocumentsPrivate.map(doc => (
                    <a
                      key={doc._key}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-neutral-cream hover:bg-neutral-pearl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-accent-gold" />
                        <div>
                          <p className="font-medium text-neutral-charcoal group-hover:text-accent-gold transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-xs text-neutral-silver">
                            {doc.category} • {formatDate(doc.uploadedAt, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <Download size={18} className="text-neutral-silver group-hover:text-accent-gold transition-colors" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compact Progress */}
            <PizzaTrackerCompact currentStage={deal.transactionStage} />

            {/* Key Dates */}
            {upcomingDates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-neutral-pearl p-6"
              >
                <h3 className="font-heading text-lg text-neutral-charcoal mb-4">
                  Upcoming Dates
                </h3>
                <div className="space-y-3">
                  {upcomingDates.slice(0, 3).map(date => (
                    <div key={date._key} className="flex items-start gap-3">
                      <Calendar size={16} className="text-accent-gold mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-neutral-charcoal">
                          {date.label}
                        </p>
                        <p className="text-xs text-neutral-silver">
                          {formatDate(date.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Agent Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-charcoal text-white p-6"
            >
              <h3 className="font-heading text-lg mb-4">Your Agent</h3>
              <p className="font-semibold mb-4">{tenant?.agentName}</p>
              
              <div className="space-y-3">
                {tenant?.contactInfo?.phone && (
                  <a
                    href={`tel:${tenant.contactInfo.phone}`}
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Phone size={16} />
                    <span>{tenant.contactInfo.phone}</span>
                  </a>
                )}
                {tenant?.contactInfo?.email && (
                  <a
                    href={`mailto:${tenant.contactInfo.email}`}
                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                  >
                    <Mail size={16} />
                    <span>{tenant.contactInfo.email}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NO DEAL STATE
// ─────────────────────────────────────────────────────────────────────────────

function NoDealState({ onLogout }: { onLogout: () => void }) {
  const { tenant } = useTenant()
  
  return (
    <section className="section-dramatic bg-neutral-cream">
      <div className="container-cinematic">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-6">
            <Home size={36} className="text-accent-gold" />
          </div>
          <h2 className="font-heading text-2xl text-neutral-charcoal mb-4">
            No Active Transaction
          </h2>
          <p className="text-neutral-silver mb-8">
            You don&apos;t have an active transaction at the moment. 
            Ready to start your home journey?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="btn-accent">
              Browse Properties
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact {tenant?.agentName || 'Agent'}
            </Link>
          </div>
          
          <button
            onClick={onLogout}
            className="mt-8 text-sm text-neutral-silver hover:text-accent-gold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function DashboardContent() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  })
  const [deal, setDeal] = useState<ActiveDeal | null>(null)
  const [isLoadingDeal, setIsLoadingDeal] = useState(false)

  // Check auth on mount
  useEffect(() => {
    // Check for stored auth (replace with actual auth check)
    const storedEmail = localStorage.getItem('dashboard_email')
    if (storedEmail) {
      setAuth({
        isAuthenticated: true,
        isLoading: false,
        user: { email: storedEmail },
      })
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Fetch deal when authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.email) {
      fetchDeal(auth.user.email)
    }
  }, [auth.isAuthenticated, auth.user?.email])

  const fetchDeal = async (email: string) => {
    setIsLoadingDeal(true)
    try {
      const response = await fetch(`/api/get-deal?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setDeal(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching deal:', error)
    } finally {
      setIsLoadingDeal(false)
    }
  }

  const handleLogin = (email: string) => {
    localStorage.setItem('dashboard_email', email)
    setAuth({
      isAuthenticated: true,
      isLoading: false,
      user: { email },
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('dashboard_email')
    setAuth({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })
    setDeal(null)
  }

  // Loading state
  if (auth.isLoading) {
    return (
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic flex justify-center">
          <Loader2 size={32} className="animate-spin text-accent-gold" />
        </div>
      </section>
    )
  }

  // Not authenticated
  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  // Loading deal
  if (isLoadingDeal) {
    return (
      <section className="section-dramatic bg-neutral-cream">
        <div className="container-cinematic flex justify-center">
          <Loader2 size={32} className="animate-spin text-accent-gold" />
        </div>
      </section>
    )
  }

  // No active deal
  if (!deal) {
    return <NoDealState onLogout={handleLogout} />
  }

  // Show dashboard
  return <DealDashboard deal={deal} onLogout={handleLogout} />
}

export default DashboardContent
