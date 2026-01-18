'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  Home, FileText, Calendar, CheckCircle, Clock, 
  ArrowRight, Lock, Mail, Phone 
} from 'lucide-react'

// Transaction stages for the "Pizza Tracker"
const stages = [
  { id: 1, name: 'Contract Signed', icon: FileText },
  { id: 2, name: 'Option Period', icon: Clock },
  { id: 3, name: 'Inspection', icon: Home },
  { id: 4, name: 'Appraisal', icon: FileText },
  { id: 5, name: 'Financing', icon: FileText },
  { id: 6, name: 'Title Work', icon: FileText },
  { id: 7, name: 'Final Walk', icon: Home },
  { id: 8, name: 'Closing', icon: CheckCircle },
]

// Demo deal data
const demoDeal = {
  clientName: 'Demo Client',
  dealType: 'buying',
  propertyAddress: '1234 Austin Blvd, Austin TX',
  currentStage: 4,
  price: 850000,
  keyDates: {
    contractDate: '2024-01-15',
    optionPeriodEnds: '2024-01-25',
    inspectionDate: '2024-01-22',
    appraisalDate: '2024-02-01',
    closingDate: '2024-02-28',
  },
}

function PizzaTracker({ currentStage }: { currentStage: number }) {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-8 left-0 right-0 h-1 bg-neutral-200">
        <div 
          className="h-full bg-brand-gold transition-all duration-500"
          style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
        />
      </div>

      {/* Stages */}
      <div className="relative flex justify-between">
        {stages.map((stage) => {
          const StageIcon = stage.icon
          const isCompleted = stage.id < currentStage
          const isCurrent = stage.id === currentStage

          return (
            <div key={stage.id} className="flex flex-col items-center">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-brand-gold text-white' 
                    : isCurrent 
                      ? 'bg-brand-navy text-white ring-4 ring-brand-gold/30' 
                      : 'bg-neutral-200 text-neutral-400'
                }`}
              >
                <StageIcon size={24} />
              </div>
              <p className={`mt-3 text-xs text-center max-w-[80px] ${
                isCurrent ? 'text-brand-navy font-medium' : 'text-neutral-500'
              }`}>
                {stage.name}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 border border-neutral-200">
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-brand-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl text-brand-navy mb-2">
            Client Portal
          </h2>
          <p className="text-neutral-500">
            Enter your email to access your home journey dashboard
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            onLogin()
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <button type="submit" className="btn-gold w-full justify-center">
            Access Dashboard
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Not a client yet?{' '}
          <a href="/contact" className="text-brand-gold hover:underline">
            Contact Merrav
          </a>
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const deal = demoDeal

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-brand-navy text-white">
        <div className="container-wide">
          <div className="gold-line mb-6" />
          <h1 className="font-display text-display mb-4">My Home Journey</h1>
          <p className="text-white/70 text-lg">
            Track your progress and access important documents
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          {!isLoggedIn ? (
            <LoginForm onLogin={() => setIsLoggedIn(true)} />
          ) : (
            <div className="space-y-8">
              {/* Welcome */}
              <div className="bg-white p-8 border border-neutral-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-brand-navy mb-1">
                      Welcome back, {deal.clientName}!
                    </h2>
                    <p className="text-neutral-500">
                      {deal.dealType === 'buying' ? 'Buying' : 'Selling'}: {deal.propertyAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-500 uppercase tracking-wider">Transaction Price</p>
                    <p className="font-display text-3xl text-brand-gold">
                      ${deal.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pizza Tracker */}
              <div className="bg-white p-8 border border-neutral-200">
                <h3 className="font-display text-xl text-brand-navy mb-8">
                  Transaction Progress
                </h3>
                <PizzaTracker currentStage={deal.currentStage} />
              </div>

              {/* Key Dates & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Key Dates */}
                <div className="bg-white p-8 border border-neutral-200">
                  <h3 className="font-display text-xl text-brand-navy mb-6 flex items-center gap-2">
                    <Calendar className="text-brand-gold" size={24} />
                    Key Dates
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(deal.keyDates).map(([key, date]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-neutral-100">
                        <span className="text-neutral-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium text-brand-navy">
                          {new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Agent */}
                <div className="bg-white p-8 border border-neutral-200">
                  <h3 className="font-display text-xl text-brand-navy mb-6">
                    Your Agent
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src="/images/merav-berko.jpg"
                        alt="Merrav Berko"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-display text-lg text-brand-navy">Merrav Berko</p>
                      <p className="text-neutral-500 text-sm">REALTOR®</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="tel:+15125999995" 
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold transition-colors"
                    >
                      <Phone size={18} className="text-brand-gold" />
                      (512) 599-9995
                    </a>
                    <a 
                      href="mailto:merrav@merravberko.com" 
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold transition-colors"
                    >
                      <Mail size={18} className="text-brand-gold" />
                      merrav@merravberko.com
                    </a>
                  </div>
                  <a href="/contact" className="btn-primary w-full justify-center mt-6">
                    Send Message
                  </a>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white p-8 border border-neutral-200">
                <h3 className="font-display text-xl text-brand-navy mb-6 flex items-center gap-2">
                  <FileText className="text-brand-gold" size={24} />
                  Documents
                </h3>
                <div className="text-center py-8 text-neutral-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Documents will appear here once uploaded by your agent.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
