import { Metadata } from 'next'
import { getSettings } from '@/lib/data-fetchers'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact Merrav Berko | Austin Real Estate Agent',
  description: 'Ready to buy or sell in Austin? Contact Merrav Berko at (512) 599-9995 or schedule a consultation online.',
  openGraph: {
    title: 'Contact Merrav Berko | Austin Real Estate Agent',
    description: 'Ready to buy or sell in Austin? Contact Merrav Berko at (512) 599-9995 or schedule a consultation online.',
    url: 'https://www.merravberko.com/contact',
  },
  alternates: {
    canonical: 'https://www.merravberko.com/contact',
  },
}

export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactPageClient settings={settings} />
}
