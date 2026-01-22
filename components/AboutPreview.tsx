import Image from 'next/image'
import Link from 'next/link'
import { SiteSettings } from '@/lib/data-fetchers'

interface AboutPreviewProps {
  settings: SiteSettings
}

export function AboutPreview({ settings }: AboutPreviewProps) {
  const stats = settings.aboutStats || [
    { value: '12+', label: 'Years in Austin' },
    { value: 'B.A.', label: 'Management' },
    { value: '5★', label: 'Service' },
  ]

  // Split about text into paragraphs
  const paragraphs = (settings.aboutText || '').split('\n\n').filter(p => p.trim())

  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={settings.agentPhoto || '/images/merav-berko.jpg'}
                alt={settings.agentName || 'Merrav Berko'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-brand-gold -z-10 hidden lg:block" />
          </div>

          {/* Content */}
          <div>
            <div className="gold-line mb-8" />
            <h2 className="font-display text-display text-brand-navy mb-6">
              {settings.aboutHeadline || `Meet ${settings.agentName || 'Merrav Berko'}`}
            </h2>
            
            {paragraphs.length > 0 ? (
              paragraphs.slice(0, 2).map((paragraph, index) => (
                <p key={index} className="text-neutral-600 text-lg leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                  {settings.agentName || 'Merrav Berko'} holds a Bachelor of Arts in Management from Israel&apos;s Open University 
                  and brings over 12 years of experience living in Austin to her work in real estate. 
                  Her deep understanding of the city—its neighborhoods, culture, and evolving market—allows 
                  her to guide clients with clarity and confidence.
                </p>
                <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                  With a refined eye for design, a strong foundation in investment strategy, and 
                  meticulous attention to detail, {settings.agentName || 'Merrav'} is committed to exceeding her clients&apos; 
                  expectations at every step.
                </p>
              </>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-neutral-200 mb-8">
              {stats.map((stat, index) => (
                <div key={stat._key || index} className="text-center">
                  <p className="font-display text-4xl text-brand-gold">{stat.value}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="btn-primary">
                Learn More
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
