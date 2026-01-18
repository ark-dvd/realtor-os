export default {
  name: 'property',
  title: 'Properties',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'details', title: 'Property Details' },
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
      validation: (Rule: any) => Rule.required().positive(),
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
      type: 'array',
      of: [{ type: 'block' }],
      group: 'description',
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
      of: [{ type: 'image', options: { hotspot: true } }],
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
          type: 'file',
          fields: [{ name: 'title', title: 'Title', type: 'string' }],
        },
      ],
    },

    // SEO
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      status: 'status',
      media: 'heroImage',
    },
    prepare({ title, price, status, media }: any) {
      const statusLabels: any = {
        'for-sale': '🟢 For Sale',
        pending: '🟡 Pending',
        sold: '⚪ Sold',
        'off-market': '⚫ Off Market',
      }
      return {
        title,
        subtitle: `$${price?.toLocaleString() || 0} - ${statusLabels[status] || status}`,
        media,
      }
    },
  },
}
