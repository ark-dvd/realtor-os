// ═══════════════════════════════════════════════════════════════════════════
// AGENT SETTINGS SCHEMA
// The tenant configuration document
// ═══════════════════════════════════════════════════════════════════════════

export default {
  name: 'agentSettings',
  title: 'Agent Settings',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'branding', title: 'Branding' },
    { name: 'contact', title: 'Contact' },
    { name: 'hero', title: 'Homepage Hero' },
    { name: 'legal', title: 'Legal & Compliance' },
    { name: 'ai', title: 'AI Settings' },
  ],
  fields: [
    // ─────────────────────────────────────────────────────────────────────
    // BASIC INFO
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'domain',
      title: 'Domain',
      type: 'string',
      description: 'The domain this configuration applies to (e.g., austin-homes.com)',
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'agentName',
      title: 'Agent Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'agentTitle',
      title: 'Agent Title',
      type: 'string',
      description: 'e.g., "Luxury Real Estate Specialist"',
      group: 'basic',
    },
    {
      name: 'agentBio',
      title: 'Agent Bio',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'basic',
    },
    {
      name: 'agentImage',
      title: 'Agent Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
      group: 'basic',
    },
    {
      name: 'brokerageName',
      title: 'Brokerage Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'basic',
    },
    {
      name: 'brokerageLogo',
      title: 'Brokerage Logo',
      type: 'image',
      group: 'basic',
    },

    // ─────────────────────────────────────────────────────────────────────
    // BRANDING
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'branding',
      title: 'Branding',
      type: 'object',
      group: 'branding',
      fields: [
        {
          name: 'primaryColor',
          title: 'Primary Color',
          type: 'string',
          description: 'Hex color (e.g., #1A1A1A)',
          validation: (Rule: any) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }),
        },
        {
          name: 'secondaryColor',
          title: 'Secondary Color',
          type: 'string',
          validation: (Rule: any) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }),
        },
        {
          name: 'accentColor',
          title: 'Accent Color',
          type: 'string',
          description: 'Used for CTAs and highlights (e.g., gold: #C9A962)',
          validation: (Rule: any) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }),
        },
        {
          name: 'fontHeading',
          title: 'Heading Font',
          type: 'string',
          description: 'Google Font name (e.g., Cormorant Garamond)',
        },
        {
          name: 'fontBody',
          title: 'Body Font',
          type: 'string',
          description: 'Google Font name (e.g., Plus Jakarta Sans)',
        },
        {
          name: 'logoUrl',
          title: 'Logo URL',
          type: 'url',
        },
        {
          name: 'faviconUrl',
          title: 'Favicon URL',
          type: 'url',
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // CONTACT
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'email', title: 'Email', type: 'string', validation: (Rule: any) => Rule.required().email() },
        { name: 'phone', title: 'Phone', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'address', title: 'Street Address', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'zip', title: 'ZIP Code', type: 'string' },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      group: 'contact',
      fields: [
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'facebook', title: 'Facebook URL', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn URL', type: 'url' },
        { name: 'twitter', title: 'Twitter URL', type: 'url' },
        { name: 'youtube', title: 'YouTube URL', type: 'url' },
        { name: 'tiktok', title: 'TikTok URL', type: 'url' },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // HOMEPAGE HERO
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'object',
      group: 'hero',
      fields: [
        { name: 'url', title: 'Video URL', type: 'url', description: 'URL to MP4 video file' },
        { name: 'posterImage', title: 'Poster Image', type: 'image', options: { hotspot: true } },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero Image (fallback)',
      type: 'image',
      description: 'Used if no video is provided',
      options: { hotspot: true },
      group: 'hero',
    },
    {
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Main headline on homepage',
      group: 'hero',
    },
    {
      name: 'heroSubtagline',
      title: 'Hero Subtagline',
      type: 'string',
      group: 'hero',
    },
    {
      name: 'featuredPropertyIds',
      title: 'Featured Property IDs',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Sanity document IDs of properties to feature',
      group: 'hero',
    },

    // ─────────────────────────────────────────────────────────────────────
    // LEGAL & COMPLIANCE
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'legalFooter',
      title: 'Legal Footer',
      type: 'array',
      of: [{ 
        type: 'block',
        marks: {
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [
                { name: 'href', type: 'url', title: 'URL' },
              ],
            },
          ],
        },
      }],
      description: 'Legal disclaimers, TREC info, etc.',
      group: 'legal',
    },

    // ─────────────────────────────────────────────────────────────────────
    // AI SETTINGS
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'aiSettings',
      title: 'AI Agent Settings',
      type: 'object',
      group: 'ai',
      fields: [
        {
          name: 'maxDailyBudget',
          title: 'Max Daily Budget (tokens)',
          type: 'number',
          description: 'Maximum tokens per day for this tenant',
          initialValue: 100000,
        },
        {
          name: 'customSystemPromptAdditions',
          title: 'Custom System Prompt',
          type: 'text',
          description: 'Additional instructions for the AI agent',
        },
        {
          name: 'enabledFeatures',
          title: 'Enabled Features',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              { title: 'Document QA', value: 'document_qa' },
              { title: 'Property Search', value: 'property_search' },
              { title: 'Scheduling', value: 'scheduling' },
            ],
          },
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────────────
    // SEO
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title for search engines',
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Description for search engines',
    },
  ],
  preview: {
    select: {
      title: 'agentName',
      subtitle: 'domain',
      media: 'agentImage',
    },
  },
}
