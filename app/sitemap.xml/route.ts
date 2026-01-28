import { getProperties, getCommunities } from '@/lib/data-fetchers'

const BASE_URL = 'https://www.merravberko.com'

export async function GET() {
  const [properties, communities] = await Promise.all([
    getProperties(),
    getCommunities()
  ])

  const staticPages = [
    '',
    '/properties',
    '/communities',
    '/about',
    '/contact',
    '/buyers/search',
    '/sellers/valuation',
    '/relocation-to-austin/housing-real-estate',
  ]

  const propertyPages = properties.map(p => `/properties/${p.slug}`)
  const communityPages = communities.map(c => `/communities/${c.slug}`)

  const allPages = [...staticPages, ...propertyPages, ...communityPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(path => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${path === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '' ? '1.0' : path.startsWith('/properties/') ? '0.8' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
