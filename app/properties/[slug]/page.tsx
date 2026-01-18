import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, Square, MapPin, Calendar, Phone, Mail, ArrowLeft, Share2, Heart } from 'lucide-react'
import { CTASection } from '@/components/CTASection'

// Demo property data - will be replaced with Sanity data
const demoProperties: { [key: string]: any } = {
  'modern-lakefront-estate': {
    title: 'Modern Lakefront Estate',
    price: 2850000,
    address: '1234 Lake Austin Blvd, Austin, TX 78703',
    neighborhood: 'Westlake',
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    lotSize: 0.75,
    yearBuilt: 2019,
    status: 'For Sale',
    description: `This stunning modern lakefront estate offers unparalleled luxury living with breathtaking views of Lake Austin. The open floor plan features floor-to-ceiling windows that flood the home with natural light and showcase the spectacular water views.

The gourmet kitchen is a chef's dream with top-of-the-line appliances, custom cabinetry, and a large island perfect for entertaining. The primary suite is a private retreat with a spa-like bathroom, walk-in closet, and private balcony overlooking the lake.

Additional features include a home theater, wine cellar, infinity pool, private boat dock, and a three-car garage. The outdoor living spaces are designed for year-round enjoyment with multiple covered patios and a summer kitchen.`,
    features: [
      'Lake views from every room',
      'Infinity pool with spa',
      'Private boat dock',
      'Home theater',
      'Wine cellar',
      'Smart home technology',
      'Three-car garage',
      'Outdoor kitchen',
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
  },
  'downtown-luxury-condo': {
    title: 'Downtown Luxury Condo',
    price: 975000,
    address: '200 Congress Ave #2001, Austin, TX 78701',
    neighborhood: 'Downtown Austin',
    beds: 2,
    baths: 2,
    sqft: 1650,
    lotSize: null,
    yearBuilt: 2020,
    status: 'For Sale',
    description: `Experience the best of downtown Austin living in this stunning high-rise condo with panoramic city views. Located in one of the most prestigious buildings in the city, this residence offers the perfect blend of luxury and convenience.

The open concept living space features designer finishes throughout, including hardwood floors, custom lighting, and floor-to-ceiling windows. The modern kitchen boasts premium appliances, quartz countertops, and a spacious island.

Building amenities include 24-hour concierge, rooftop pool and lounge, state-of-the-art fitness center, and private wine storage. Walk to the best restaurants, entertainment venues, and cultural attractions Austin has to offer.`,
    features: [
      'Panoramic city views',
      '24-hour concierge',
      'Rooftop pool',
      'Fitness center',
      'Private wine storage',
      'Secured parking',
      'Pet friendly',
      'Walk to everything',
    ],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    ],
  },
}

// Default property for any slug not in our demo data
const defaultProperty = {
  title: 'Beautiful Austin Property',
  price: 750000,
  address: 'Austin, TX',
  neighborhood: 'Austin',
  beds: 3,
  baths: 2,
  sqft: 2000,
  lotSize: 0.25,
  yearBuilt: 2015,
  status: 'For Sale',
  description: `This beautiful property is available for viewing. Contact Merrav Berko for more details about this listing and to schedule a private showing.`,
  features: [
    'Modern finishes',
    'Open floor plan',
    'Updated kitchen',
    'Private backyard',
  ],
  images: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
  ],
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = demoProperties[params.slug] || defaultProperty

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0">
          <div className="container-wide">
            <Link 
              href="/properties" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Properties
            </Link>
          </div>
        </div>

        {/* Property Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container-wide">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider mb-4 ${
                  property.status === 'Pending' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-brand-gold text-brand-navy'
                }`}>
                  {property.status}
                </span>
                <h1 className="font-display text-4xl md:text-5xl text-white mb-2">
                  {property.title}
                </h1>
                <p className="flex items-center gap-2 text-white/80 text-lg">
                  <MapPin size={18} />
                  {property.address}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-4xl md:text-5xl text-brand-gold">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pb-8 border-b border-neutral-200 mb-8">
                <div className="flex items-center gap-2">
                  <Bed className="text-brand-gold" size={24} />
                  <div>
                    <p className="font-display text-2xl text-brand-navy">{property.beds}</p>
                    <p className="text-sm text-neutral-500">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="text-brand-gold" size={24} />
                  <div>
                    <p className="font-display text-2xl text-brand-navy">{property.baths}</p>
                    <p className="text-sm text-neutral-500">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="text-brand-gold" size={24} />
                  <div>
                    <p className="font-display text-2xl text-brand-navy">{property.sqft.toLocaleString()}</p>
                    <p className="text-sm text-neutral-500">Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="text-brand-gold" size={24} />
                  <div>
                    <p className="font-display text-2xl text-brand-navy">{property.yearBuilt}</p>
                    <p className="text-sm text-neutral-500">Year Built</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="font-display text-2xl text-brand-navy mb-4">About This Property</h2>
                <div className="prose prose-lg max-w-none text-neutral-600">
                  {property.description.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-12">
                <h2 className="font-display text-2xl text-brand-navy mb-4">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-neutral-600">
                      <span className="w-2 h-2 bg-brand-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Gallery */}
              {property.images.length > 1 && (
                <div>
                  <h2 className="font-display text-2xl text-brand-navy mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {property.images.slice(1).map((image: string, index: number) => (
                      <div key={index} className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {/* Contact Card */}
                <div className="bg-brand-cream p-8 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src="/images/merrav-berko.jpg"
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

                  <div className="space-y-3 mb-6">
                    <a 
                      href="tel:+15125550123" 
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold transition-colors"
                    >
                      <Phone size={18} className="text-brand-gold" />
                      (512) 555-0123
                    </a>
                    <a 
                      href="mailto:merrav@merravberko.com" 
                      className="flex items-center gap-3 text-neutral-600 hover:text-brand-gold transition-colors"
                    >
                      <Mail size={18} className="text-brand-gold" />
                      merrav@merravberko.com
                    </a>
                  </div>

                  <Link href="/contact" className="btn-gold w-full justify-center mb-3">
                    Schedule a Showing
                  </Link>
                  <Link href="/contact" className="btn-secondary w-full justify-center">
                    Ask a Question
                  </Link>
                </div>

                {/* Share */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-neutral-200 text-neutral-600 hover:border-brand-gold hover:text-brand-gold transition-colors">
                    <Share2 size={18} />
                    Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-neutral-200 text-neutral-600 hover:border-brand-gold hover:text-brand-gold transition-colors">
                    <Heart size={18} />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
