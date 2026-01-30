import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getSettings } from '@/lib/data-fetchers'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Merrav Berko Real Estate website.',
  alternates: {
    canonical: 'https://www.merravberko.com/privacy',
  },
}

export const revalidate = 60

export default async function PrivacyPage() {
  const settings = await getSettings()
  const businessName = settings.agentName ? `${settings.agentName} Real Estate` : 'Merrav Berko Real Estate'
  const email = settings.email || 'merrav@merrav.com'
  const privacyPolicy = settings.privacyPolicy

  // Replace placeholders in content
  const processedContent = privacyPolicy
    ?.replace(/\[Business Name\]/g, businessName)
    ?.replace(/\[Email\]/g, email)

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 bg-brand-navy text-white">
        <div className="container-wide">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-white/70">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide max-w-4xl">
          {processedContent ? (
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
              <div className="prose prose-lg max-w-none">
                {processedContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-neutral-600 leading-relaxed whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm text-center">
              <h2 className="font-display text-2xl text-brand-navy mb-4">Coming Soon</h2>
              <p className="text-neutral-600 mb-6">
                Our privacy policy is being prepared and will be available shortly.
              </p>
              <Link href="/contact" className="btn-gold">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
