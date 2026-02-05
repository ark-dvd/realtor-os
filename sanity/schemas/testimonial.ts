export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'details', title: 'Details' },
    { name: 'display', title: 'Display Settings' },
  ],
  fields: [
    // ═══════════════════════════════════════════════════════════════════════════
    // CONTENT
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      group: 'content',
      validation: (Rule: any) => Rule.required().max(100),
      description: 'The client\'s full name',
    },
    {
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule: any) => Rule.required().max(500),
      description: 'The testimonial text (max 500 characters)',
    },
    {
      name: 'clientPhoto',
      title: 'Client Photo',
      type: 'image',
      options: { hotspot: true },
      group: 'content',
      description: 'Optional photo of the client - adds credibility',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DETAILS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'transactionType',
      title: 'Transaction Type',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Bought a Home', value: 'buyer' },
          { title: 'Sold a Home', value: 'seller' },
          { title: 'Both (Bought & Sold)', value: 'both' },
        ],
        layout: 'radio',
      },
      description: 'What type of transaction did this client complete?',
    },
    {
      name: 'neighborhood',
      title: 'Neighborhood',
      type: 'string',
      group: 'details',
      description: 'Area name, e.g., "Westlake", "Downtown Austin"',
    },
    {
      name: 'rating',
      title: 'Star Rating',
      type: 'number',
      group: 'details',
      options: {
        list: [
          { title: '5 Stars', value: 5 },
          { title: '4 Stars', value: 4 },
          { title: '3 Stars', value: 3 },
          { title: '2 Stars', value: 2 },
          { title: '1 Star', value: 1 },
        ],
      },
      initialValue: 5,
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'source',
      title: 'Review Source',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'Zillow', value: 'zillow' },
          { title: 'Realtor.com', value: 'realtor' },
          { title: 'Direct / Personal', value: 'direct' },
        ],
      },
      description: 'Where did this review come from?',
    },
    {
      name: 'sourceUrl',
      title: 'Original Review URL',
      type: 'url',
      group: 'details',
      description: 'Link to the original review for verification (optional)',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DISPLAY SETTINGS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      group: 'display',
      initialValue: false,
      description: 'Show prominently on homepage carousel',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'display',
      initialValue: 0,
      description: 'Lower numbers appear first (0, 1, 2...)',
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      group: 'display',
      initialValue: true,
      description: 'Uncheck to hide this testimonial from the site',
    },
  ],
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      clientName: 'clientName',
      neighborhood: 'neighborhood',
      isFeatured: 'isFeatured',
      isActive: 'isActive',
      rating: 'rating',
      media: 'clientPhoto',
    },
    prepare({ clientName, neighborhood, isFeatured, isActive, rating, media }: any) {
      const stars = '★'.repeat(rating || 5) + '☆'.repeat(5 - (rating || 5))
      const statusIcon = !isActive ? '🚫 ' : isFeatured ? '⭐ ' : ''
      const subtitle = [
        neighborhood,
        stars,
      ].filter(Boolean).join(' • ')

      return {
        title: `${statusIcon}${clientName}`,
        subtitle,
        media,
      }
    },
  },
}
