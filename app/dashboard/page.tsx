// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE - "My Home Journey"
// Client portal with deal progress tracking
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { DashboardContent } from './DashboardContent'

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'My Home Journey',
  description: 'Track your home buying or selling progress',
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-neutral-charcoal text-white">
        <div className="container-cinematic">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-display-md mb-4">
            My Home Journey
          </h1>
          <p className="text-white/70 text-lg">
            Track your progress and access important documents
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <DashboardContent />
    </>
  )
}
