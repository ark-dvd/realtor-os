export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'about', title: 'About Section' },
    { name: 'contact', title: 'Contact Info' },
    { name: 'branding', title: 'Branding' },
    { name: 'social', title: 'Social Media' },
  ],
  fields: [
    // This ensures only one document
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Merrav Berko Real Estate',
      description: 'The main title of your website',
    },

    // Hero Section
    {
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Find Your Home in Austin',
    },
    {
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      group: 'hero',
      initialValue: 'Luxury real estate with personalized service. Your journey to the perfect home starts here.',
    },
    {
      name: 'heroMediaType',
      title: 'Hero Media Type',
      type: 'string',
      group: 'hero',
      options: {
        list: [
          { title: 'Image Slider', value: 'images' },
          { title: 'Video Background', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'images',
    },
    {
      name: 'heroImages',
      title: 'Hero Images (for slider)',
      type: 'array',
      group: 'hero',
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
            {
              name: 'externalUrl',
              title: 'External URL (alternative to upload)',
              type: 'url',
              description: 'Use this for Unsplash or other external image URLs',
            },
          ],
        },
      ],
      description: 'Add 3-5 high-quality images for the hero slider',
    },
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      group: 'hero',
      options: {
        accept: 'video/*',
      },
      description: 'Upload an MP4 video for background (used if Video Background is selected)',
    },
    {
      name: 'heroVideoUrl',
      title: 'Hero Video URL (Alternative)',
      type: 'url',
      group: 'hero',
      description: 'Or paste a video URL instead of uploading',
    },

    // About Section
    {
      name: 'agentName',
      title: 'Agent Name',
      type: 'string',
      group: 'about',
      initialValue: 'Merrav Berko',
    },
    {
      name: 'agentTitle',
      title: 'Agent Title',
      type: 'string',
      group: 'about',
      initialValue: 'REALTOR® | Austin Luxury Specialist',
    },
    {
      name: 'agentPhoto',
      title: 'Agent Photo',
      type: 'image',
      group: 'about',
      options: { hotspot: true },
    },
    {
      name: 'aboutHeadline',
      title: 'About Headline',
      type: 'string',
      group: 'about',
      initialValue: 'Meet Merrav Berko',
    },
    {
      name: 'aboutText',
      title: 'About Text',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'about',
      description: 'Your bio and story',
    },
    {
      name: 'aboutStats',
      title: 'Stats to Display',
      type: 'array',
      group: 'about',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Value', type: 'string', description: 'e.g., "12+"' },
            { name: 'label', title: 'Label', type: 'string', description: 'e.g., "Years in Austin"' },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
    },

    // Contact Info
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      group: 'contact',
    },
    {
      name: 'address',
      title: 'Office Address',
      type: 'text',
      rows: 2,
      group: 'contact',
    },
    {
      name: 'officeHours',
      title: 'Office Hours',
      type: 'text',
      rows: 3,
      group: 'contact',
    },

    // Branding
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'branding',
    },
    {
      name: 'primaryColor',
      title: 'Primary Color (Navy)',
      type: 'string',
      group: 'branding',
      initialValue: '#1B2B4B',
    },
    {
      name: 'accentColor',
      title: 'Accent Color (Gold)',
      type: 'string',
      group: 'branding',
      initialValue: '#C9A961',
    },

    // Social Media
    {
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      group: 'social',
    },
    {
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
      group: 'social',
    },
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
    },
    {
      name: 'youtube',
      title: 'YouTube URL',
      type: 'url',
      group: 'social',
    },

    // Legal
    {
      name: 'trecLink',
      title: 'TREC Consumer Protection Link',
      type: 'url',
      initialValue: 'https://www.trec.texas.gov/forms/consumer-protection-notice',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Hero, About, Contact & Branding',
      }
    },
  },
}
