import { SiteSettings, Property, Neighborhood } from '@/lib/data-fetchers'

interface JsonLdProps {
  type: 'RealEstateAgent' | 'SingleFamilyResidence' | 'Place' | 'WebSite'
  settings?: SiteSettings
  property?: Property
  neighborhood?: Neighborhood
}

export function JsonLd({ type, settings, property, neighborhood }: JsonLdProps) {
  let structuredData: Record<string, unknown> = {}

  if (type === 'RealEstateAgent' && settings) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: settings.agentName || 'Merrav Berko',
      description: 'Luxury real estate services in Austin, Texas',
      url: 'https://www.merravberko.com',
      telephone: settings.phone || '(512) 599-9995',
      email: settings.email || 'merrav@merrav.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Austin',
        addressRegion: 'TX',
        addressCountry: 'US',
      },
      areaServed: {
        '@type': 'City',
        name: 'Austin',
        sameAs: 'https://en.wikipedia.org/wiki/Austin,_Texas',
      },
      image: settings.agentPhoto || 'https://www.merravberko.com/images/merav-berko.jpg',
      sameAs: [
        settings.instagram,
        settings.facebook,
        settings.linkedin,
        settings.youtube,
      ].filter(Boolean),
    }
  }

  if (type === 'SingleFamilyResidence' && property) {
    const address = property.address || {}
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SingleFamilyResidence',
      name: property.title,
      description: property.shortDescription || property.description?.slice(0, 200),
      url: `https://www.merravberko.com/properties/${property.slug}`,
      image: property.heroImage,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city || 'Austin',
        addressRegion: address.state || 'TX',
        postalCode: address.zip,
        addressCountry: 'US',
      },
      floorSize: property.sqft ? {
        '@type': 'QuantitativeValue',
        value: property.sqft,
        unitCode: 'FTK', // Square feet
      } : undefined,
      numberOfRooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      yearBuilt: property.yearBuilt,
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'USD',
        availability: property.status === 'for-sale' 
          ? 'https://schema.org/InStock' 
          : property.status === 'pending'
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/SoldOut',
      },
    }
  }

  if (type === 'Place' && neighborhood) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: neighborhood.name,
      description: neighborhood.tagline,
      address: {
        '@type': 'PostalAddress',
        addressLocality: neighborhood.name,
        addressRegion: 'TX',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        addressCountry: 'US',
      },
      image: neighborhood.image,
    }
  }

  if (type === 'WebSite') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: settings?.siteTitle || 'Merrav Berko Real Estate',
      url: 'https://www.merravberko.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.merravberko.com/properties?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
