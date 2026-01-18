// ═══════════════════════════════════════════════════════════════════════════
// SANITY STUDIO CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'realtoros-studio',
  title: 'RealtorOS Studio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Agent Settings (Tenant Config)
            S.listItem()
              .title('Agent Settings')
              .child(
                S.documentTypeList('agentSettings')
                  .title('Agent Settings')
              ),
            
            S.divider(),
            
            // Properties
            S.listItem()
              .title('Properties')
              .child(
                S.documentTypeList('property')
                  .title('Properties')
                  .defaultOrdering([{ field: 'listDate', direction: 'desc' }])
              ),
            
            // Active Deals
            S.listItem()
              .title('Active Deals')
              .child(
                S.documentTypeList('activeDeal')
                  .title('Active Deals')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
