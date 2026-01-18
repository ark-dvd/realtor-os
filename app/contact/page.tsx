'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'buying',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-4.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="container-wide relative z-10">
          <div className="max-w-3xl">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-hero mb-6">Let&apos;s Connect</h1>
            <p className="text-xl text-white/70">
              Ready to find your dream home or have questions about the market? 
              I&apos;m here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-brand-cream">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <div className="bg-white p-8 lg:p-12 border border-neutral-200 order-2 lg:order-1">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                  <h3 className="font-display text-2xl text-brand-navy mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-neutral-600">
                    Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-brand-navy mb-2">
                    Send a Message
                  </h2>
                  <p className="text-neutral-500 mb-8">
                    Fill out the form below and I&apos;ll get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-brand-navy mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        className="input-field"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        className="input-field"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-brand-navy mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="input-field"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="interest" className="block text-sm font-medium text-brand-navy mb-2">
                        I&apos;m Interested In
                      </label>
                      <select
                        id="interest"
                        className="input-field"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      >
                        <option value="buying">Buying a Home</option>
                        <option value="selling">Selling a Home</option>
                        <option value="valuation">Home Valuation</option>
                        <option value="investing">Real Estate Investment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-brand-navy mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        required
                        className="input-field resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold w-full justify-center"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="order-1 lg:order-2">
              {/* Agent Card */}
              <div className="flex items-center gap-6 mb-10">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src="/images/merrav-berko.jpg"
                    alt="Merrav Berko"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-brand-navy">Merrav Berko</h3>
                  <p className="text-neutral-500">REALTOR® | Austin Specialist</p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6 mb-10">
                <a href="tel:+15125550123" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold transition-colors">
                    <Phone size={20} className="text-brand-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg text-brand-navy group-hover:text-brand-gold transition-colors">
                      (512) 555-0123
                    </p>
                  </div>
                </a>

                <a href="mailto:merrav@merravberko.com" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold transition-colors">
                    <Mail size={20} className="text-brand-gold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-lg text-brand-navy group-hover:text-brand-gold transition-colors">
                      merrav@merravberko.com
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Office</p>
                    <p className="text-lg text-brand-navy">
                      Austin, Texas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Hours</p>
                    <p className="text-brand-navy">
                      Monday - Friday: 9am - 6pm<br />
                      Saturday: 10am - 4pm<br />
                      Sunday: By appointment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
