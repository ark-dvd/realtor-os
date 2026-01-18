export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-neutral-charcoal text-white">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block w-12 h-px bg-accent-gold mb-6" />
          <h1 className="font-heading text-5xl md:text-6xl mb-6">Contact Us</h1>
          <p className="text-white/70 text-xl">We&apos;d love to hear from you</p>
        </div>
      </section>

      <section className="py-24 bg-neutral-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-2xl text-neutral-charcoal mb-6">Get in Touch</h2>
              <div className="space-y-4 text-neutral-slate">
                <p>📞 (512) 555-0123</p>
                <p>✉️ agent@realtoros.com</p>
                <p>📍 Austin, TX 78701</p>
              </div>
            </div>
            <div className="bg-white p-8 border border-neutral-pearl">
              <h3 className="font-heading text-xl text-neutral-charcoal mb-4">Send a Message</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-4 py-3 border border-neutral-pearl focus:border-accent-gold outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-3 border border-neutral-pearl focus:border-accent-gold outline-none"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-pearl focus:border-accent-gold outline-none resize-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-accent-gold text-neutral-charcoal py-3 font-medium hover:bg-accent-gold/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
