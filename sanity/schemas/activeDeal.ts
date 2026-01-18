export default {
  name: 'activeDeal',
  title: 'Active Deals',
  type: 'document',
  fields: [
    {
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'clientEmail',
      title: 'Client Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'clientPhone',
      title: 'Client Phone',
      type: 'string',
    },
    {
      name: 'dealType',
      title: 'Deal Type',
      type: 'string',
      options: {
        list: [
          { title: 'Buying', value: 'buying' },
          { title: 'Selling', value: 'selling' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'property',
      title: 'Property',
      type: 'reference',
      to: [{ type: 'property' }],
    },
    {
      name: 'propertyAddress',
      title: 'Property Address (if not in system)',
      type: 'string',
    },
    {
      name: 'transactionStage',
      title: 'Transaction Stage',
      type: 'number',
      description: '1-8 stages of the transaction',
      validation: (Rule: any) => Rule.min(1).max(8),
      initialValue: 1,
    },
    {
      name: 'keyDates',
      title: 'Key Dates',
      type: 'object',
      fields: [
        { name: 'contractDate', title: 'Contract Date', type: 'date' },
        { name: 'optionPeriodEnds', title: 'Option Period Ends', type: 'date' },
        { name: 'inspectionDate', title: 'Inspection Date', type: 'date' },
        { name: 'appraisalDate', title: 'Appraisal Date', type: 'date' },
        { name: 'financingDeadline', title: 'Financing Deadline', type: 'date' },
        { name: 'closingDate', title: 'Closing Date', type: 'date' },
      ],
    },
    {
      name: 'price',
      title: 'Transaction Price',
      type: 'number',
    },
    {
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
    },
    {
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { 
              name: 'isPrivate', 
              title: 'Private (agent only)', 
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'clientName',
      subtitle: 'propertyAddress',
      stage: 'transactionStage',
    },
    prepare({ title, subtitle, stage }: any) {
      const stages = ['', 'Contract', 'Option Period', 'Inspection', 'Appraisal', 'Financing', 'Title', 'Final Walk', 'Closing']
      return {
        title,
        subtitle: `${subtitle || 'Property'} - Stage ${stage}: ${stages[stage] || 'Unknown'}`,
      }
    },
  },
}
