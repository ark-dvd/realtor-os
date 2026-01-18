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
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'property',
      title: 'Property (if in system)',
      type: 'reference',
      to: [{ type: 'property' }],
    },
    {
      name: 'propertyAddress',
      title: 'Property Address',
      type: 'string',
      description: 'Use this if property is not in the system',
    },
    {
      name: 'price',
      title: 'Transaction Price',
      type: 'number',
    },
    {
      name: 'transactionStage',
      title: 'Transaction Stage',
      type: 'number',
      description: 'Stage 1-8',
      options: {
        list: [
          { title: '1 - Contract Signed', value: 1 },
          { title: '2 - Option Period', value: 2 },
          { title: '3 - Inspection', value: 3 },
          { title: '4 - Appraisal', value: 4 },
          { title: '5 - Financing', value: 5 },
          { title: '6 - Title Work', value: 6 },
          { title: '7 - Final Walk', value: 7 },
          { title: '8 - Closing', value: 8 },
        ],
      },
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
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 4,
    },
    {
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [
        {
          type: 'file',
          fields: [
            { name: 'title', title: 'Document Title', type: 'string' },
            {
              name: 'isPrivate',
              title: 'Private (Agent Only)',
              type: 'boolean',
              initialValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      title: 'Active Deal',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck when deal is closed',
    },
  ],
  preview: {
    select: {
      title: 'clientName',
      propertyAddress: 'propertyAddress',
      stage: 'transactionStage',
      dealType: 'dealType',
      isActive: 'isActive',
    },
    prepare({ title, propertyAddress, stage, dealType, isActive }: any) {
      const stages = ['', 'Contract', 'Option', 'Inspection', 'Appraisal', 'Financing', 'Title', 'Final Walk', 'Closing']
      return {
        title: `${title} ${isActive ? '' : '(Closed)'}`,
        subtitle: `${dealType === 'buying' ? '🏠 Buying' : '🏷️ Selling'} - Stage ${stage}: ${stages[stage]}`,
      }
    },
  },
}
