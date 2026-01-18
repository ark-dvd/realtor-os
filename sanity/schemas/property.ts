export default {
  name: 'property',
  title: 'Properties',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Property Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'For Sale', value: 'for-sale' },
          { title: 'Pending', value: 'pending' },
          { title: 'Sold', value: 'sold' },
          { title: 'Off Market', value: 'off-market' },
        ],
      },
      initialValue: 'for-sale',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule: any) => Rule.required().positive(),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        { name: 'street', title: 'Street', type: 'string' },
        { name: 'city', title: 'City', type: 'string', initialValue: 'Austin' },
        { name: 'state', title: 'State', type: 'string', initialValue: 'TX' },
        { name: 'zip', title: 'ZIP', type: 'string' },
      ],
    },
    {
      name: 'neighborhood',
      title: 'Neighborhood',
      type: 'reference',
      to: [{ type: 'neighborhood' }],
    },
    {
      name: 'details',
      title: 'Property Details',
      type: 'object',
      fields: [
        { name: 'beds', title: 'Bedrooms', type: 'number' },
        { name: 'baths', title: 'Bathrooms', type: 'number' },
        { name: 'sqft', title: 'Square Feet', type: 'number' },
        { name: 'lotSize', title: 'Lot Size (acres)', type: 'number' },
        { name: 'yearBuilt', title: 'Year Built', type: 'number' },
        { name: 'garage', title: 'Garage Spaces', type: 'number' },
      ],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'heroMedia',
      title: 'Hero Media',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          options: { list: ['image', 'video'] },
          initialValue: 'image',
        },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
        { name: 'videoUrl', title: 'Video URL', type: 'url' },
      ],
    },
    {
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
    {
      name: 'documents',
      title: 'Documents (Floorplans, etc.)',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [{ name: 'title', title: 'Title', type: 'string' }],
        },
      ],
    },
    {
      name: 'mlsNumber',
      title: 'MLS Number',
      type: 'string',
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    },
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      status: 'status',
      media: 'heroMedia.image',
    },
    prepare({ title, price, status, media }: any) {
      return {
        title,
        subtitle: `$${price?.toLocaleString()} - ${status}`,
        media,
      }
    },
  },
}
