export default {
  name: 'property',
  title: 'Properties',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'details', title: 'Property Details' },
    { name: 'factsFeatures', title: 'Facts & Features' },
    { name: 'description', title: 'Description' },
    { name: 'media', title: 'Photos & Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Basic Info
    {
      name: 'title',
      title: 'Property Title',
      type: 'string',
      group: 'basic',
      validation: (Rule: any) => Rule.required(),
      description: 'e.g., "Modern Lakefront Estate"',
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'basic',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'For Sale', value: 'for-sale' },
          { title: 'Pending', value: 'pending' },
          { title: 'Sold', value: 'sold' },
          { title: 'Off Market', value: 'off-market' },
        ],
        layout: 'radio',
      },
      initialValue: 'for-sale',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      group: 'basic',
      validation: (Rule: any) => Rule.positive(),
      description: 'Leave empty for "Call For Price"',
    },
    {
      name: 'priceLabel',
      title: 'Price Display Override',
      type: 'string',
      group: 'basic',
      description: 'Optional override text shown instead of price (e.g., "Call For Price", "Price Upon Request")',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'basic',
      fields: [
        { name: 'street', title: 'Street Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string', initialValue: 'Austin' },
        { name: 'state', title: 'State', type: 'string', initialValue: 'TX' },
        { name: 'zip', title: 'ZIP Code', type: 'string' },
      ],
    },
    {
      name: 'neighborhood',
      title: 'Neighborhood',
      type: 'reference',
      to: [{ type: 'neighborhood' }],
      group: 'basic',
    },
    {
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'My Listing', value: 'own' },
          { title: 'Co-Listed / Other Agent', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'own',
      description: 'Select "Other Agent" for co-listings or MLS-sourced properties',
    },
    {
      name: 'listingAgent',
      title: 'Listing Agent Attribution',
      type: 'string',
      group: 'basic',
      description: 'e.g., "Privately Listed by Noa Levy, The Boutique Real Estate, eXp Realty LLC"',
      hidden: ({ parent }: any) => parent?.listingType !== 'other',
    },

    // Property Details
    {
      name: 'beds',
      title: 'Bedrooms',
      type: 'number',
      group: 'details',
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'baths',
      title: 'Bathrooms',
      type: 'number',
      group: 'details',
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'sqft',
      title: 'Square Feet',
      type: 'number',
      group: 'details',
      validation: (Rule: any) => Rule.positive(),
    },
    {
      name: 'lotSize',
      title: 'Lot Size (acres)',
      type: 'number',
      group: 'details',
    },
    {
      name: 'yearBuilt',
      title: 'Year Built',
      type: 'number',
      group: 'details',
    },
    {
      name: 'garage',
      title: 'Garage Spaces',
      type: 'number',
      group: 'details',
    },
    {
      name: 'mlsNumber',
      title: 'MLS Number',
      type: 'string',
      group: 'details',
    },

    // Description
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'description',
      description: 'Brief summary for property cards',
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 10,
      group: 'description',
      description: 'Detailed property description. Use double line breaks for paragraphs.',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'description',
      description: 'List of property features',
    },

    // Media
    {
      name: 'heroImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroVideo',
      title: 'Hero Video URL',
      type: 'url',
      group: 'media',
      description: 'YouTube or Vimeo URL (optional)',
    },
    {
      name: 'gallery',
      title: 'Photo Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
      group: 'media',
    },
    {
      name: 'floorPlan',
      title: 'Floor Plan',
      type: 'image',
      group: 'media',
    },
    {
      name: 'documents',
      title: 'Documents (Brochures, Disclosures)',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'object',
          name: 'propertyDocument',
          title: 'Document',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'file', title: 'File', type: 'file' },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    },

    // SEO
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Custom title for search engines (optional)',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Meta description for search results (optional)',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FACTS & FEATURES - Interior
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'fullBathrooms',
      title: 'Full Bathrooms',
      type: 'number',
      group: 'factsFeatures',
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'halfBathrooms',
      title: 'Half Bathrooms',
      type: 'number',
      group: 'factsFeatures',
      validation: (Rule: any) => Rule.min(0),
    },
    {
      name: 'stories',
      title: 'Stories',
      type: 'number',
      group: 'factsFeatures',
      validation: (Rule: any) => Rule.min(1),
    },
    {
      name: 'flooring',
      title: 'Flooring',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Stone, Tile, Wood" or "Hardwood"',
    },
    {
      name: 'fireplace',
      title: 'Fireplace',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Family Room, Living Room, Outside" — leave empty if none',
    },
    {
      name: 'appliances',
      title: 'Appliances',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Dishwasher, Disposal, Gas Cooktop, Double Oven, Refrigerator, Stainless Steel"',
    },
    {
      name: 'interiorFeatures',
      title: 'Other Interior Features',
      type: 'text',
      rows: 3,
      group: 'factsFeatures',
      description: 'e.g., "Beamed Ceilings, High Ceilings, Granite Counters, Walk-In Closet(s), Wet Bar, Wired for Sound"',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FACTS & FEATURES - Exterior
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'propertyType',
      title: 'Property Type',
      type: 'string',
      group: 'factsFeatures',
      options: {
        list: [
          { title: 'Residential / Single Family', value: 'residential' },
          { title: 'Condo / Townhome', value: 'condo' },
          { title: 'Multi-Family', value: 'multi-family' },
          { title: 'Land / Lot', value: 'land' },
          { title: 'Commercial', value: 'commercial' },
        ],
      },
    },
    {
      name: 'roofType',
      title: 'Roof',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Metal", "Composition", "Tile"',
    },
    {
      name: 'foundation',
      title: 'Foundation',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Slab", "Pier & Beam"',
    },
    {
      name: 'exteriorFeatures',
      title: 'Exterior Features',
      type: 'text',
      rows: 3,
      group: 'factsFeatures',
      description: 'e.g., "Barbecue, Gutters Full, Private Yard, Tennis Court(s), RV Hookup"',
    },
    {
      name: 'pool',
      title: 'Pool',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "In Ground, Outdoor Pool, Pool/Spa Combo" — leave empty if none',
    },
    {
      name: 'parkingFeatures',
      title: 'Parking',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Attached, Driveway, Garage Faces Side" (garage count is already in Details tab)',
    },
    {
      name: 'heatingType',
      title: 'Heating',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Central", "Forced Air, Gas"',
    },
    {
      name: 'coolingType',
      title: 'Cooling / AC',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Central Air", "Ceiling Fan(s), Central Air"',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FACTS & FEATURES - Lot & Area
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'lotFeatures',
      title: 'Lot Features',
      type: 'text',
      rows: 2,
      group: 'factsFeatures',
      description: 'e.g., "Back to Park/Greenbelt, Level, Sprinklers, Many Trees"',
    },
    {
      name: 'viewDescription',
      title: 'View',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Hill Country, Park/Greenbelt, Trees/Woods"',
    },
    {
      name: 'waterSource',
      title: 'Water Source',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Municipal Utility District (MUD)", "City"',
    },
    {
      name: 'sewer',
      title: 'Sewer',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Municipal Utility District (MUD)", "City Sewer"',
    },
    {
      name: 'utilities',
      title: 'Utilities',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Electricity Available, Natural Gas Available, Phone Connected"',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FACTS & FEATURES - Schools
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'elementarySchool',
      title: 'Elementary School',
      type: 'string',
      group: 'factsFeatures',
    },
    {
      name: 'middleSchool',
      title: 'Middle School',
      type: 'string',
      group: 'factsFeatures',
    },
    {
      name: 'highSchool',
      title: 'High School',
      type: 'string',
      group: 'factsFeatures',
    },
    {
      name: 'schoolDistrict',
      title: 'School District',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "Austin ISD", "Eanes ISD"',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FACTS & FEATURES - Financial
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'hoaFee',
      title: 'HOA Fee',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "$175/month", "$525/quarter", "None"',
    },
    {
      name: 'taxRate',
      title: 'Tax Rate / Annual Taxes',
      type: 'string',
      group: 'factsFeatures',
      description: 'e.g., "$49,468/year" or "2.1%"',
    },
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      priceLabel: 'priceLabel',
      status: 'status',
      media: 'heroImage',
    },
    prepare({ title, price, priceLabel, status, media }: any) {
      const statusLabels: any = {
        'for-sale': '🟢 For Sale',
        pending: '🟡 Pending',
        sold: '⚪ Sold',
        'off-market': '⚫ Off Market',
      }
      const priceDisplay = priceLabel || (price ? `$${price.toLocaleString()}` : 'Call For Price')
      return {
        title,
        subtitle: `${priceDisplay} - ${statusLabels[status] || status}`,
        media,
      }
    },
  },
}
