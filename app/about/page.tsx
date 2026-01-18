import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Award, Users, Home, Star } from 'lucide-react'
import { CTASection } from '@/components/CTASection'

export const metadata = {
  title: 'About',
  description: 'Learn more about Merrav Berko, your trusted Austin real estate expert.',
}

const stats = [
  { icon: Home, value: '12+', label: 'Years in Austin' },
  { icon: Award, value: 'B.A.', label: 'Management' },
  { icon: Star, value: '5★', label: 'Service' },
  { icon: Users, value: '100%', label: 'Dedication' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-3.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-hero mb-6">About Merrav</h1>
            <p className="text-xl text-white/70">
              Dedicated to helping you navigate Austin&apos;s real estate market with 
              expertise, integrity, and personalized attention.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Image */}
            <div className="relative lg:sticky lg:top-32">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/merav-berko.jpg"
                  alt="Merrav Berko"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-brand-gold -z-10 hidden lg:block" />
            </div>

            {/* Content */}
            <div>
              <h2 className="font-display text-title text-brand-navy mb-2">
                Merrav Berko
              </h2>
              <p className="text-brand-gold font-medium mb-8">
                REALTOR® | Austin Luxury Specialist
              </p>

              <div className="prose prose-lg max-w-none text-neutral-600">
                <p className="drop-cap">
                  Merrav Berko holds a Bachelor of Arts in Management from Israel&apos;s Open University 
                  and brings over 12 years of experience living in Austin to her work in real estate. 
                  Her deep understanding of the city—its neighborhoods, culture, and evolving market—allows 
                  her to guide clients with clarity and confidence.
                </p>
                
                <p>
                  With a refined eye for design, a strong foundation in investment strategy, and 
                  meticulous attention to detail, Merrav is committed to exceeding her clients&apos; 
                  expectations at every step. She prides herself on delivering the highest level 
                  of service, ensuring each client feels supported, informed, and fully understood 
                  throughout their real estate journey.
                </p>

                <p>
                  Whether you&apos;re buying, selling, or investing, Merrav Berko is ready to help 
                  you navigate the Austin market with expertise and care.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 mt-8 border-y border-neutral-200">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <stat.icon className="w-8 h-8 text-brand-gold mx-auto mb-2" />
                    <p className="font-display text-3xl text-brand-navy">{stat.value}</p>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="bg-white p-8 mt-8 border border-neutral-200">
                <h3 className="font-display text-2xl text-brand-navy mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  <a 
                    href="tel:+15125999995" 
                    className="flex items-center gap-4 text-neutral-600 hover:text-brand-gold transition-colors"
                  >
                    <Phone size={20} className="text-brand-gold" />
                    (512) 599-9995
                  </a>
                  <a 
                    href="mailto:merrav@merravberko.com" 
                    className="flex items-center gap-4 text-neutral-600 hover:text-brand-gold transition-colors"
                  >
                    <Mail size={20} className="text-brand-gold" />
                    merrav@merravberko.com
                  </a>
                </div>
                <Link href="/contact" className="btn-gold w-full justify-center mt-6">
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
