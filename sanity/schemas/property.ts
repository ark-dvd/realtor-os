// ═══════════════════════════════════════════════════════════════════════════
// PROPERTY SCHEMA
// Main property listing document
// ═══════════════════════════════════════════════════════════════════════════

export default {
  name: 'property',
  title: 'Property',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'location', title: 'Location' },
    { name: 'specs', title: 'Specifications' },
    { name: 'media', title: 'Media' },
    { name: 'content', title: 'Content' },
    { name: 'documents', title: 'Documents' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─────────────────────────────────────────────────────────────────────
    // TENANT REFERENCE - CRITICAL FOR ISOLATION
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'belongsToAgent',
      title: 'Belongs to Agent',
      type: 'reference',
      to: [{ type: 'agentSettings' }],
      validation: (Rule: any) => Rule.required(),
      description: 'CRITICAL: Links this property to a specific tenant',
    },

    // ─────────────────────────────────────────────────────────────────────
    // BASIC INFO
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Pending', value: 'pending' },
          { title: 'Sold', value: 'sold' },
          { title: 'Coming Soon', value: 'coming_soon' },
          { title: 'Off Market', value: 'off_market' },
        ],
      },
      initialValue: 'active',
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
      group: 'basic',
    },
    {
      name: 'pricePerSqFt',
      title: 'Price Per Sq Ft',
      type: 'number',
      group: 'basic',
    },

    // ─────────────────────────────────────────────────────────────────────
    // LOCATION
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'location',
      fields: [
        { name: 'street', title: 'Street', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'unit', title: 'Unit/Apt', type: 'string' },
        { name: 'city', title: 'City', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'state', title: 'State', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'zip', title: 'ZIP Code', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'neighborhood', title: 'Neighborhood', type: 'string' },
        { name: 'county', title: 'County', type: 'string' },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // SPECIFICATIONS
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'specs',
      title: 'Specifications',
      type: 'object',
      group: 'specs',
      fields: [
        { name: 'bedrooms', title: 'Bedrooms', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
        { name: 'bathrooms', title: 'Bathrooms', type: 'number', validation: (Rule: any) => Rule.required().min(0) },
        { name: 'squareFeet', title: 'Square Feet', type: 'number', validation: (Rule: any) => Rule.required().positive() },
        { name: 'lotSize', title: 'Lot Size', type: 'number' },
        {
          name: 'lotSizeUnit',
          title: 'Lot Size Unit',
          type: 'string',
          options: { list: ['sqft', 'acres'] },
          initialValue: 'sqft',
        },
        { name: 'yearBuilt', title: 'Year Built', type: 'number' },
        { name: 'parking', title: 'Parking Spaces', type: 'number' },
        { name: 'stories', title: 'Stories', type: 'number' },
        {
          name: 'propertyType',
          title: 'Property Type',
          type: 'string',
          options: {
            list: [
              'Single Family',
              'Condo',
              'Townhouse',
              'Multi-Family',
              'Land',
              'Commercial',
            ],
          },
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'financials',
      title: 'Financial Details',
      type: 'object',
      group: 'specs',
      fields: [
        { name: 'hoaFees', title: 'HOA Fees', type: 'number' },
        {
          name: 'hoaFrequency',
          title: 'HOA Frequency',
          type: 'string',
          options: { list: ['monthly', 'quarterly', 'annually'] },
        },
        { name: 'taxAmount', title: 'Annual Tax Amount', type: 'number' },
        { name: 'taxYear', title: 'Tax Year', type: 'number' },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // MEDIA
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'heroType',
      title: 'Hero Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
      },
      initialValue: 'image',
      group: 'media',
    },
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'object',
      hidden: ({ parent }: any) => parent?.heroType !== 'video',
      group: 'media',
      fields: [
        { name: 'url', title: 'Video URL', type: 'url' },
        { name: 'posterImage', title: 'Poster Image', type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'string' },
      ],
      group: 'media',
    },
    {
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
      group: 'media',
    },
    {
      name: 'floorPlanImage',
      title: 'Floor Plan',
      type: 'image',
      group: 'media',
    },
    {
      name: 'virtualTourUrl',
      title: 'Virtual Tour URL',
      type: 'url',
      description: 'Matterport or similar virtual tour link',
      group: 'media',
    },

    // ─────────────────────────────────────────────────────────────────────
    // CONTENT
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Marketing headline for the property',
      group: 'content',
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description for cards and previews',
      group: 'content',
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed property description',
      group: 'content',
    },
    {
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key selling points',
      group: 'content',
    },
    {
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
    },

    // ─────────────────────────────────────────────────────────────────────
    // DOCUMENTS
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'documentsPublic',
      title: 'Public Documents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'file', title: 'File', type: 'file' },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
      description: 'Documents available to all visitors (brochures, etc.)',
      group: 'documents',
    },

    // ─────────────────────────────────────────────────────────────────────
    // DATES
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'listDate',
      title: 'List Date',
      type: 'date',
      group: 'basic',
    },
    {
      name: 'soldDate',
      title: 'Sold Date',
      type: 'date',
      hidden: ({ parent }: any) => parent?.status !== 'sold',
      group: 'basic',
    },

    // ─────────────────────────────────────────────────────────────────────
    // SEO
    // ─────────────────────────────────────────────────────────────────────
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
      rows: 3,
      group: 'seo',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'address.city',
      media: 'heroImage',
      status: 'status',
    },
    prepare({ title, subtitle, media, status }: any) {
      return {
        title,
        subtitle: `${subtitle} • ${status}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Price, High to Low',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Price, Low to High',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'List Date, Newest',
      name: 'listDateDesc',
      by: [{ field: 'listDate', direction: 'desc' }],
    },
  ],
}
