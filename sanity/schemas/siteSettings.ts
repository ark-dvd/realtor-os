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
      type: 'text',
      rows: 10,
      group: 'about',
      description: 'Your bio and story. Use double line breaks for paragraphs.',
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
      description: 'Upload your logo. If not set, the agent name will be displayed.',
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
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      description: 'Links displayed in the footer (Privacy Policy, Terms of Service, TREC, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (Rule: { required: () => unknown }) => Rule.required() },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: {
            select: { title: 'title', subtitle: 'url' },
          },
        },
      ],
    },
    {
      name: 'iabsDocument',
      title: 'IABS Document (Information About Brokerage Services)',
      type: 'file',
      options: {
        accept: '.pdf',
      },
      description: 'Upload the IABS PDF document for Texas real estate disclosure',
    },

    // Legal Documents
    {
      name: 'privacyPolicy',
      title: 'Privacy Policy',
      type: 'text',
      rows: 20,
      description: 'Full privacy policy text. Will be displayed on /privacy page.',
    },
    {
      name: 'termsOfService',
      title: 'Terms of Service',
      type: 'text',
      rows: 20,
      description: 'Full terms of service text. Will be displayed on /terms page.',
    },

    // License & Compliance
    {
      name: 'agentLicenseNumber',
      title: 'Agent License Number',
      type: 'string',
      description: 'Your Texas real estate license number',
    },
    {
      name: 'brokerName',
      title: 'Broker Name',
      type: 'string',
      description: 'Name of your sponsoring broker',
    },
    {
      name: 'brokerLicenseNumber',
      title: 'Broker License Number',
      type: 'string',
      description: 'Your broker\'s license number',
    },
    {
      name: 'showFairHousing',
      title: 'Show Fair Housing Statement',
      type: 'boolean',
      description: 'Display Fair Housing logo and statement in footer',
      initialValue: true,
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
