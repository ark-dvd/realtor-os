// ═══════════════════════════════════════════════════════════════════════════
// LOADING COMPONENT
// Shown during page transitions
// ═══════════════════════════════════════════════════════════════════════════

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-cream">
      <div className="text-center">
        {/* Animated Logo/Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-neutral-pearl rounded-full" />
          <div className="absolute inset-0 border-4 border-accent-gold rounded-full border-t-transparent animate-spin" />
        </div>
        
        <p className="text-neutral-silver text-sm tracking-widest uppercase">
          Loading...
        </p>
      </div>
    </div>
  )
}
