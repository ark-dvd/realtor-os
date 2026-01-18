import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'merrav-berko-studio',
  title: 'Merrav Berko Real Estate',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Properties
            S.listItem()
              .title('Properties')
              .child(
                S.documentList()
                  .title('All Properties')
                  .filter('_type == "property"')
              ),
            
            // Neighborhoods
            S.listItem()
              .title('Neighborhoods')
              .child(
                S.documentList()
                  .title('All Neighborhoods')
                  .filter('_type == "neighborhood"')
              ),
            
            // Active Deals
            S.listItem()
              .title('Active Deals')
              .child(
                S.documentList()
                  .title('All Deals')
                  .filter('_type == "activeDeal"')
              ),
            
            S.divider(),
            
            // Site Settings (Singleton)
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
