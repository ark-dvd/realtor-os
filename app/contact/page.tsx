import { getSettings } from '@/lib/data-fetchers'
import ContactPageClient from './ContactPageClient'

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Merrav Berko for all your Austin real estate needs.',
}

export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSettings()
  return <ContactPageClient settings={settings} />
}
