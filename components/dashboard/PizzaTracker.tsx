'use client'

// ═══════════════════════════════════════════════════════════════════════════
// PIZZA TRACKER COMPONENT
// Visual timeline showing deal progress stages
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, FileText, Search, Building, CreditCard, Key, Home } from 'lucide-react'
import type { TransactionStage, KeyDate } from '@/lib/types'
import { TRANSACTION_STAGES } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// STAGE ICONS
// ─────────────────────────────────────────────────────────────────────────────

const STAGE_ICONS: Record<TransactionStage, React.ElementType> = {
  1: FileText,    // Offer Submitted
  2: Check,       // Under Contract
  3: Clock,       // Option Period
  4: Search,      // Inspections Complete
  5: Building,    // Appraisal
  6: CreditCard,  // Loan Processing
  7: Key,         // Clear to Close
  8: Home,        // Closed!
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface PizzaTrackerProps {
  currentStage: TransactionStage
  keyDates?: KeyDate[]
  className?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.8,
      ease: [0.65, 0, 0.35, 1],
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function PizzaTracker({ currentStage, keyDates = [], className }: PizzaTrackerProps) {
  const stages = Object.entries(TRANSACTION_STAGES) as [string, { title: string; description: string }][]

  // Find key date for a stage (simplified mapping)
  const getKeyDateForStage = (stageNum: number): KeyDate | undefined => {
    // Map stages to common key date labels
    const stageKeyDateMap: Record<number, string[]> = {
      2: ['contract date', 'effective date'],
      3: ['option period', 'due diligence'],
      4: ['inspection', 'inspection deadline'],
      5: ['appraisal', 'appraisal deadline'],
      6: ['loan approval', 'financing deadline'],
      7: ['clear to close', 'final walkthrough'],
      8: ['closing date', 'closing'],
    }

    const searchTerms = stageKeyDateMap[stageNum] || []
    return keyDates.find(kd => 
      searchTerms.some(term => kd.label.toLowerCase().includes(term))
    )
  }

  return (
    <div className={cn('tracker-container', className)}>
      {/* Progress Line */}
      <motion.div
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="tracker-line origin-top"
      >
        {/* Filled portion */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${((currentStage - 1) / 7) * 100}%` }}
          transition={{ duration: 1, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
          className="absolute top-0 left-0 right-0 bg-accent-gold"
        />
      </motion.div>

      {/* Steps */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-0"
      >
        {stages.map(([stageNum, stage], index) => {
          const num = parseInt(stageNum) as TransactionStage
          const isCompleted = num < currentStage
          const isActive = num === currentStage
          const isPending = num > currentStage
          const Icon = STAGE_ICONS[num]
          const keyDate = getKeyDateForStage(num)

          return (
            <motion.div
              key={stageNum}
              variants={stepVariants}
              className={cn(
                'tracker-step',
                isCompleted && 'completed',
                isActive && 'active'
              )}
            >
              {/* Marker */}
              <div
                className={cn(
                  'tracker-marker',
                  isCompleted && 'bg-neutral-charcoal text-white',
                  isActive && 'bg-accent-gold text-neutral-charcoal ring-4 ring-accent-gold/20',
                  isPending && 'bg-neutral-pearl text-neutral-silver'
                )}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              {/* Content */}
              <div className="tracker-content">
                <h4
                  className={cn(
                    'font-heading text-lg font-semibold mb-1',
                    isActive ? 'text-neutral-charcoal' : 'text-neutral-slate',
                    isPending && 'text-neutral-silver'
                  )}
                >
                  {stage.title}
                </h4>
                <p
                  className={cn(
                    'text-sm',
                    isPending ? 'text-neutral-silver/60' : 'text-neutral-silver'
                  )}
                >
                  {stage.description}
                </p>

                {/* Key Date */}
                {keyDate && (
                  <div
                    className={cn(
                      'mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs',
                      keyDate.isCompleted
                        ? 'bg-green-50 text-green-700'
                        : isActive
                        ? 'bg-accent-gold/10 text-accent-gold'
                        : 'bg-neutral-pearl text-neutral-slate'
                    )}
                  >
                    <Clock size={12} />
                    <span>{formatDate(keyDate.date, { month: 'short', day: 'numeric' })}</span>
                    {keyDate.isCompleted && <Check size={12} />}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPACT VERSION (for sidebar/mobile)
// ─────────────────────────────────────────────────────────────────────────────

export function PizzaTrackerCompact({ currentStage }: { currentStage: TransactionStage }) {
  const stages = Object.entries(TRANSACTION_STAGES) as [string, { title: string; description: string }][]
  const currentStageInfo = TRANSACTION_STAGES[currentStage]

  return (
    <div className="bg-white rounded-lg p-6 shadow-elegant">
      {/* Current Stage */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-accent-gold text-neutral-charcoal flex items-center justify-center mx-auto mb-3">
          {React.createElement(STAGE_ICONS[currentStage], { size: 28 })}
        </div>
        <h3 className="font-heading text-xl font-semibold text-neutral-charcoal">
          {currentStageInfo.title}
        </h3>
        <p className="text-sm text-neutral-silver mt-1">
          {currentStageInfo.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-neutral-silver">Progress</span>
          <span className="text-xs font-semibold text-accent-gold">
            {currentStage} of 8
          </span>
        </div>
        <div className="h-2 bg-neutral-pearl rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStage / 8) * 100}%` }}
            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
            className="h-full bg-accent-gold rounded-full"
          />
        </div>
      </div>

      {/* Mini Steps */}
      <div className="flex justify-between mt-4">
        {stages.map(([stageNum]) => {
          const num = parseInt(stageNum) as TransactionStage
          const isCompleted = num < currentStage
          const isActive = num === currentStage

          return (
            <div
              key={stageNum}
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                isCompleted && 'bg-neutral-charcoal text-white',
                isActive && 'bg-accent-gold text-neutral-charcoal ring-2 ring-accent-gold/30',
                !isCompleted && !isActive && 'bg-neutral-pearl text-neutral-silver'
              )}
            >
              {isCompleted ? <Check size={12} /> : num}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PizzaTracker
