export default {
  name: 'neighborhood',
  title: 'Neighborhoods',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'details', title: 'Details' },
    { name: 'schools', title: 'Schools' },
    { name: 'highlights', title: 'Highlights' },
    { name: 'media', title: 'Media' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // Basic Info
    {
      name: 'name',
      title: 'Neighborhood Name',
      type: 'string',
      group: 'basic',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      group: 'basic',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'basic',
      description: 'Short catchy description, e.g., "The heartbeat of the city"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'vibe',
      title: 'Vibe / Atmosphere',
      type: 'text',
      rows: 3,
      group: 'basic',
      description: 'Describe the feel of the neighborhood',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 5,
      group: 'basic',
      validation: (Rule: any) => Rule.required(),
    },

    // Details
    {
      name: 'population',
      title: 'Population',
      type: 'string',
      group: 'details',
      description: 'e.g., "~13,000 residents"',
    },
    {
      name: 'avgPrice',
      title: 'Average Home Price',
      type: 'string',
      group: 'details',
      description: 'e.g., "$850,000"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'commute',
      title: 'Commute Times',
      type: 'object',
      group: 'details',
      fields: [
        {
          name: 'toDowntown',
          title: 'To Downtown',
          type: 'string',
          description: 'e.g., "5-10 mins"',
        },
        {
          name: 'toDomain',
          title: 'To The Domain',
          type: 'string',
          description: 'e.g., "20-30 mins"',
        },
      ],
    },

    // Schools
    {
      name: 'schoolDistrict',
      title: 'School District',
      type: 'string',
      group: 'schools',
      description: 'e.g., "Austin ISD" or "Eanes ISD (Top 1% in Texas)"',
    },
    {
      name: 'schools',
      title: 'Schools List',
      type: 'array',
      group: 'schools',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'School Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'type',
              title: 'School Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Elementary', value: 'Elementary' },
                  { title: 'Middle', value: 'Middle' },
                  { title: 'High School', value: 'High School' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'rating',
              title: 'GreatSchools Rating (1-10)',
              type: 'number',
              validation: (Rule: any) => Rule.min(1).max(10),
            },
            {
              name: 'note',
              title: 'Additional Note',
              type: 'string',
              description: 'e.g., "College Readiness: 9/10"',
            },
          ],
          preview: {
            select: {
              title: 'name',
              type: 'type',
              rating: 'rating',
            },
            prepare({ title, type, rating }: any) {
              return {
                title,
                subtitle: `${type} - Rating: ${rating}/10`,
              }
            },
          },
        },
      ],
    },

    // Highlights
    {
      name: 'whyPeopleLove',
      title: 'Why People Love Living Here',
      type: 'array',
      group: 'highlights',
      of: [{ type: 'text', rows: 3 }],
      description: 'Add 3-5 reasons why people love this neighborhood',
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'highlights',
      title: 'Key Highlights / Landmarks',
      type: 'array',
      group: 'highlights',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Place/Feature Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'description' },
          },
        },
      ],
    },

    // Media
    {
      name: 'image',
      title: 'Main Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
    },

    // Settings
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers appear first (1, 2, 3...)',
      initialValue: 10,
    },
    {
      name: 'isActive',
      title: 'Show on Website',
      type: 'boolean',
      group: 'settings',
      description: 'Uncheck to hide this neighborhood from the website',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      avgPrice: 'avgPrice',
      media: 'image',
      isActive: 'isActive',
    },
    prepare({ title, avgPrice, media, isActive }: any) {
      return {
        title,
        subtitle: `${avgPrice || 'No price'} ${isActive ? '✓ Active' : '⨉ Hidden'}`,
        media,
      }
    },
  },
}
