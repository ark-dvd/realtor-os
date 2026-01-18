// ═══════════════════════════════════════════════════════════════════════════
// ACTIVE DEAL SCHEMA
// Private client transaction data
// ═══════════════════════════════════════════════════════════════════════════

export default {
  name: 'activeDeal',
  title: 'Active Deal',
  type: 'document',
  groups: [
    { name: 'client', title: 'Client Info' },
    { name: 'property', title: 'Property' },
    { name: 'transaction', title: 'Transaction' },
    { name: 'dates', title: 'Key Dates' },
    { name: 'documents', title: 'Documents' },
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
      description: 'CRITICAL: Links this deal to a specific tenant',
    },

    // ─────────────────────────────────────────────────────────────────────
    // CLIENT INFO
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'client',
    },
    {
      name: 'clientEmail',
      title: 'Client Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
      description: 'Used for dashboard login',
      group: 'client',
    },
    {
      name: 'clientPhone',
      title: 'Client Phone',
      type: 'string',
      group: 'client',
    },

    // ─────────────────────────────────────────────────────────────────────
    // PROPERTY
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'property',
      title: 'Property',
      type: 'reference',
      to: [{ type: 'property' }],
      group: 'property',
    },

    // ─────────────────────────────────────────────────────────────────────
    // TRANSACTION DETAILS
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'transactionType',
      title: 'Transaction Type',
      type: 'string',
      options: {
        list: [
          { title: 'Purchase', value: 'purchase' },
          { title: 'Sale', value: 'sale' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
      group: 'transaction',
    },
    {
      name: 'transactionStage',
      title: 'Transaction Stage',
      type: 'number',
      options: {
        list: [
          { title: '1 - Offer Submitted', value: 1 },
          { title: '2 - Under Contract', value: 2 },
          { title: '3 - Option Period', value: 3 },
          { title: '4 - Inspections Complete', value: 4 },
          { title: '5 - Appraisal', value: 5 },
          { title: '6 - Loan Processing', value: 6 },
          { title: '7 - Clear to Close', value: 7 },
          { title: '8 - Closed', value: 8 },
        ],
      },
      validation: (Rule: any) => Rule.required().min(1).max(8),
      initialValue: 1,
      group: 'transaction',
    },
    {
      name: 'offerPrice',
      title: 'Offer Price',
      type: 'number',
      group: 'transaction',
    },
    {
      name: 'contractPrice',
      title: 'Contract Price',
      type: 'number',
      group: 'transaction',
    },
    {
      name: 'earnestMoney',
      title: 'Earnest Money',
      type: 'number',
      group: 'transaction',
    },

    // ─────────────────────────────────────────────────────────────────────
    // KEY DATES
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'keyDates',
      title: 'Key Dates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'date', title: 'Date', type: 'datetime', validation: (Rule: any) => Rule.required() },
            { name: 'isCompleted', title: 'Completed', type: 'boolean', initialValue: false },
            { name: 'notes', title: 'Notes', type: 'text', rows: 2 },
          ],
          preview: {
            select: { title: 'label', subtitle: 'date', isCompleted: 'isCompleted' },
            prepare({ title, subtitle, isCompleted }: any) {
              return {
                title: `${isCompleted ? '✓ ' : ''}${title}`,
                subtitle: new Date(subtitle).toLocaleDateString(),
              }
            },
          },
        },
      ],
      group: 'dates',
    },

    // ─────────────────────────────────────────────────────────────────────
    // DOCUMENTS (PRIVATE)
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'dealDocumentsPrivate',
      title: 'Deal Documents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'file', title: 'File', type: 'file' },
            { name: 'uploadedAt', title: 'Uploaded At', type: 'datetime', initialValue: () => new Date().toISOString() },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              options: {
                list: [
                  { title: 'Contract', value: 'contract' },
                  { title: 'Inspection', value: 'inspection' },
                  { title: 'Appraisal', value: 'appraisal' },
                  { title: 'Loan', value: 'loan' },
                  { title: 'Closing', value: 'closing' },
                  { title: 'Other', value: 'other' },
                ],
              },
            },
          ],
          preview: {
            select: { title: 'title', category: 'category' },
            prepare({ title, category }: any) {
              return {
                title,
                subtitle: category,
              }
            },
          },
        },
      ],
      description: 'Private documents only visible to authenticated client',
      group: 'documents',
    },

    // ─────────────────────────────────────────────────────────────────────
    // NOTES
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Private notes (not shown to client)',
    },

    // ─────────────────────────────────────────────────────────────────────
    // TIMESTAMPS
    // ─────────────────────────────────────────────────────────────────────
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'transactionStage',
      property: 'property.title',
    },
    prepare({ title, subtitle, property }: any) {
      const stageNames: Record<number, string> = {
        1: 'Offer Submitted',
        2: 'Under Contract',
        3: 'Option Period',
        4: 'Inspections',
        5: 'Appraisal',
        6: 'Loan Processing',
        7: 'Clear to Close',
        8: 'Closed',
      }
      return {
        title,
        subtitle: `${property || 'No property'} • Stage ${subtitle}: ${stageNames[subtitle] || 'Unknown'}`,
      }
    },
  },
}
