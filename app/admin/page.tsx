'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Lock, Home, Users, FileText, Settings, LogOut, Plus, 
  Search, Edit, Trash2, Eye, MapPin, TrendingUp, Calendar, 
  Bell, Save, X, ChevronDown, Upload, Star, GraduationCap,
  Building2, Image as ImageIcon, Video, Phone, Mail, Globe
} from 'lucide-react'

// Import static data as fallback
import { neighborhoods as staticNeighborhoods, Neighborhood } from '@/lib/neighborhoods-data'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Property {
  id: string
  title: string
  slug: string
  address: string
  price: number
  status: string
  beds: number
  baths: number
  sqft: number
  image: string
  views?: number
  inquiries?: number
  lastUpdated: string
}

interface Deal {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  property: string
  propertyAddress?: string
  price: number
  stage: number
  type: 'buying' | 'selling'
  keyDates: {
    contractDate?: string
    optionPeriodEnds?: string
    inspectionDate?: string
    appraisalDate?: string
    closingDate?: string
  }
  isActive: boolean
}

interface SiteSettings {
  heroHeadline: string
  heroSubheadline: string
  heroMediaType: 'images' | 'video'
  heroImages: { url: string; alt: string }[]
  agentName: string
  agentTitle: string
  agentPhoto: string
  aboutText: string
  phone: string
  email: string
  address: string
  instagram: string
  facebook: string
  linkedin: string
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO DATA (Used when Sanity is not configured)
// ═══════════════════════════════════════════════════════════════════════════

const demoProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Lakefront Estate',
    slug: 'modern-lakefront-estate',
    address: '1234 Lake Austin Blvd',
    price: 2850000,
    status: 'For Sale',
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    views: 342,
    inquiries: 12,
    lastUpdated: '2024-01-15',
  },
  {
    id: '2',
    title: 'Downtown Luxury Condo',
    slug: 'downtown-luxury-condo',
    address: '200 Congress Ave #2001',
    price: 975000,
    status: 'For Sale',
    beds: 2,
    baths: 2,
    sqft: 1650,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    views: 256,
    inquiries: 8,
    lastUpdated: '2024-01-14',
  },
  {
    id: '3',
    title: 'Tarrytown Family Home',
    slug: 'tarrytown-family-home',
    address: '3456 Windsor Rd',
    price: 1650000,
    status: 'Pending',
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    views: 189,
    inquiries: 15,
    lastUpdated: '2024-01-13',
  },
]

const demoDeals: Deal[] = [
  { 
    id: '1', 
    clientName: 'John Smith', 
    clientEmail: 'john@email.com',
    clientPhone: '512-555-1234',
    property: 'Modern Lakefront Estate', 
    price: 2850000,
    stage: 4, 
    type: 'buying',
    keyDates: {
      contractDate: '2024-01-15',
      optionPeriodEnds: '2024-01-25',
      inspectionDate: '2024-01-22',
      appraisalDate: '2024-02-01',
      closingDate: '2024-02-28',
    },
    isActive: true,
  },
  { 
    id: '2', 
    clientName: 'Sarah Johnson', 
    clientEmail: 'sarah@email.com',
    property: '456 Oak Lane', 
    propertyAddress: '456 Oak Lane, Austin TX',
    price: 725000,
    stage: 6, 
    type: 'selling',
    keyDates: {
      contractDate: '2024-01-10',
      closingDate: '2024-02-15',
    },
    isActive: true,
  },
]

const demoSiteSettings: SiteSettings = {
  heroHeadline: 'Find Your Home in Austin',
  heroSubheadline: 'Luxury real estate with personalized service. Your journey to the perfect home starts here.',
  heroMediaType: 'images',
  heroImages: [
    { url: '/images/hero-1.jpg', alt: 'Austin skyline' },
    { url: '/images/hero-2.jpg', alt: 'Luxury home' },
    { url: '/images/hero-3.jpg', alt: 'Austin neighborhood' },
    { url: '/images/hero-4.jpg', alt: 'Pennybacker Bridge' },
  ],
  agentName: 'Merrav Berko',
  agentTitle: 'REALTOR® | Austin Luxury Specialist',
  agentPhoto: '/images/merrav-berko.jpg',
  aboutText: `Merrav Berko holds a Bachelor of Arts in Management from Israel's Open University and brings over 12 years of experience living in Austin to her work in real estate. Her deep understanding of the city—its neighborhoods, culture, and evolving market—allows her to guide clients with clarity and confidence.

With a refined eye for design, a strong foundation in investment strategy, and meticulous attention to detail, Merrav is committed to exceeding her clients' expectations at every step.`,
  phone: '(512) 599-9995',
  email: 'merrav@merravberko.com',
  address: 'Austin, Texas',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  linkedin: 'https://linkedin.com',
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

const stageNames = ['', 'Contract Signed', 'Option Period', 'Inspection', 'Appraisal', 'Financing', 'Title Work', 'Final Walk', 'Closing']

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'merav2024') {
      localStorage.setItem('admin_logged_in', 'true')
      onLogin()
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border border-neutral-200 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-brand-navy mx-auto flex items-center justify-center mb-4">
              <Lock className="text-brand-gold" size={28} />
            </div>
            <h1 className="font-display text-2xl text-brand-navy mb-2">Back Office</h1>
            <p className="text-neutral-500">Enter your password to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter admin password"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button type="submit" className="btn-gold w-full justify-center">
              Access Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <Link href="/" className="text-brand-gold hover:underline text-sm">
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md'
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className={`bg-white w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white p-6 border-b border-neutral-200 flex items-center justify-between z-10">
          <h2 className="font-display text-xl text-brand-navy">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════════

function DashboardTab({ 
  properties, 
  deals, 
  neighborhoods 
}: { 
  properties: Property[]
  deals: Deal[]
  neighborhoods: Neighborhood[]
}) {
  const activeDeals = deals.filter(d => d.isActive)
  const stats = [
    { label: 'Active Listings', value: properties.filter(p => p.status === 'For Sale').length.toString(), icon: Home, color: 'bg-blue-500' },
    { label: 'Neighborhoods', value: neighborhoods.length.toString(), icon: MapPin, color: 'bg-green-500' },
    { label: 'Active Deals', value: activeDeals.length.toString(), icon: FileText, color: 'bg-amber-500' },
    { label: 'Total Inquiries', value: properties.reduce((acc, p) => acc + (p.inquiries || 0), 0).toString(), icon: Users, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
            <p className="font-display text-3xl text-brand-navy mb-1">{stat.value}</p>
            <p className="text-neutral-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white p-6 border border-neutral-200">
          <h3 className="font-display text-lg text-brand-navy mb-4">Recent Properties</h3>
          <div className="space-y-4">
            {properties.slice(0, 4).map((property) => (
              <div key={property.id} className="flex items-center gap-4 py-3 border-b border-neutral-100 last:border-0">
                <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                  <Image src={property.image} alt={property.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy truncate">{property.title}</p>
                  <p className="text-sm text-neutral-500">{formatPrice(property.price)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  property.status === 'For Sale' ? 'bg-green-100 text-green-700' :
                  property.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-neutral-100 text-neutral-700'
                }`}>
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-white p-6 border border-neutral-200">
          <h3 className="font-display text-lg text-brand-navy mb-4">Active Deals</h3>
          <div className="space-y-4">
            {activeDeals.slice(0, 4).map((deal) => (
              <div key={deal.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="font-medium text-brand-navy">{deal.clientName}</p>
                  <p className="text-sm text-neutral-500">{deal.property}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    deal.type === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {deal.type === 'buying' ? 'Buying' : 'Selling'}
                  </span>
                  <p className="text-xs text-neutral-400 mt-1">Stage {deal.stage}/8</p>
                </div>
              </div>
            ))}
            {activeDeals.length === 0 && (
              <p className="text-neutral-500 text-center py-4">No active deals</p>
            )}
          </div>
        </div>
      </div>

      {/* Sanity Status */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> This Back Office is currently in demo mode. To enable full functionality 
          (saving changes, uploading images), connect your Sanity CMS by setting up environment variables.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES TAB
// ═══════════════════════════════════════════════════════════════════════════

function PropertiesTab({ 
  properties, 
  setProperties 
}: { 
  properties: Property[]
  setProperties: (p: Property[]) => void 
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search properties..."
            className="input-field pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingProperty(null); setShowForm(true) }}
          className="btn-gold whitespace-nowrap"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider hidden md:table-cell">Details</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0 hidden sm:block">
                        <Image src={property.image} alt={property.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-navy">{property.title}</p>
                        <p className="text-sm text-neutral-500">{property.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-display text-lg text-brand-navy">{formatPrice(property.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      property.status === 'For Sale' ? 'bg-green-100 text-green-700' :
                      property.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      property.status === 'Sold' ? 'bg-neutral-100 text-neutral-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-sm text-neutral-600">
                      {property.beds} bed • {property.baths} bath • {property.sqft.toLocaleString()} sqft
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProperty(property); setShowForm(true) }}
                        className="p-2 hover:bg-neutral-100 rounded transition-colors" 
                        title="Edit"
                      >
                        <Edit size={16} className="text-neutral-500" />
                      </button>
                      <button 
                        onClick={() => handleDelete(property.id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProperties.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No properties found
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
        size="lg"
      >
        <PropertyForm 
          property={editingProperty}
          onSave={(property) => {
            if (editingProperty) {
              setProperties(properties.map(p => p.id === property.id ? property : p))
            } else {
              setProperties([...properties, { ...property, id: Date.now().toString() }])
            }
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function PropertyForm({ 
  property, 
  onSave, 
  onCancel 
}: { 
  property: Property | null
  onSave: (property: Property) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Property>>(property || {
    title: '',
    slug: '',
    address: '',
    price: 0,
    status: 'For Sale',
    beds: 0,
    baths: 0,
    sqft: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    lastUpdated: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Property)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-brand-navy mb-2">Property Title *</label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            placeholder="e.g., Modern Lakefront Estate"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Price *</label>
          <input
            type="number"
            required
            className="input-field"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            placeholder="850000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Status</label>
          <select
            className="input-field"
            value={formData.status || 'For Sale'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option>For Sale</option>
            <option>Pending</option>
            <option>Sold</option>
            <option>Off Market</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-brand-navy mb-2">Address *</label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Main St, Austin, TX 78701"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Bedrooms</label>
          <input
            type="number"
            className="input-field"
            value={formData.beds || ''}
            onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Bathrooms</label>
          <input
            type="number"
            step="0.5"
            className="input-field"
            value={formData.baths || ''}
            onChange={(e) => setFormData({ ...formData, baths: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Square Feet</label>
          <input
            type="number"
            className="input-field"
            value={formData.sqft || ''}
            onChange={(e) => setFormData({ ...formData, sqft: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Image URL</label>
          <input
            type="url"
            className="input-field"
            value={formData.image || ''}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-gold">
          <Save size={18} />
          Save Property
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NEIGHBORHOODS TAB
// ═══════════════════════════════════════════════════════════════════════════

function NeighborhoodsTab({ 
  neighborhoods, 
  setNeighborhoods 
}: { 
  neighborhoods: Neighborhood[]
  setNeighborhoods: (n: Neighborhood[]) => void 
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this neighborhood?')) {
      setNeighborhoods(neighborhoods.filter(n => n.slug !== slug))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search neighborhoods..."
            className="input-field pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { setEditingNeighborhood(null); setShowForm(true) }}
          className="btn-gold whitespace-nowrap"
        >
          <Plus size={18} />
          Add Neighborhood
        </button>
      </div>

      {/* Neighborhoods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNeighborhoods.map((neighborhood) => (
          <div key={neighborhood.slug} className="bg-white border border-neutral-200 overflow-hidden">
            <div className="relative h-40">
              <Image 
                src={neighborhood.image} 
                alt={neighborhood.name} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display text-xl text-white">{neighborhood.name}</h3>
                <p className="text-white/80 text-sm">{neighborhood.avgPrice}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-neutral-600 line-clamp-2 mb-4">{neighborhood.tagline}</p>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} />
                  {neighborhood.schools?.length || 0} schools
                </span>
                <span className="flex items-center gap-1">
                  <Star size={14} />
                  {neighborhood.highlights?.length || 0} highlights
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingNeighborhood(neighborhood); setShowForm(true) }}
                  className="btn-secondary flex-1 py-2 text-sm"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(neighborhood.slug)}
                  className="p-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNeighborhoods.length === 0 && (
        <div className="text-center py-12 text-neutral-500 bg-white border border-neutral-200">
          No neighborhoods found
        </div>
      )}

      {/* Neighborhood Form Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={editingNeighborhood ? `Edit: ${editingNeighborhood.name}` : 'Add New Neighborhood'}
        size="xl"
      >
        <NeighborhoodForm 
          neighborhood={editingNeighborhood}
          onSave={(neighborhood) => {
            if (editingNeighborhood) {
              setNeighborhoods(neighborhoods.map(n => n.slug === neighborhood.slug ? neighborhood : n))
            } else {
              setNeighborhoods([...neighborhoods, neighborhood])
            }
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function NeighborhoodForm({ 
  neighborhood, 
  onSave, 
  onCancel 
}: { 
  neighborhood: Neighborhood | null
  onSave: (neighborhood: Neighborhood) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Neighborhood>(neighborhood || {
    name: '',
    slug: '',
    tagline: '',
    vibe: '',
    description: '',
    population: '',
    commute: { toDowntown: '', toDomain: '' },
    schoolDistrict: '',
    schools: [],
    whyPeopleLove: [],
    highlights: [],
    avgPrice: '',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  })

  const [activeSection, setActiveSection] = useState('basic')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addSchool = () => {
    setFormData({
      ...formData,
      schools: [...formData.schools, { name: '', type: 'Elementary', rating: 5 }]
    })
  }

  const removeSchool = (index: number) => {
    setFormData({
      ...formData,
      schools: formData.schools.filter((_, i) => i !== index)
    })
  }

  const updateSchool = (index: number, field: string, value: any) => {
    const newSchools = [...formData.schools]
    newSchools[index] = { ...newSchools[index], [field]: value }
    setFormData({ ...formData, schools: newSchools })
  }

  const addHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, { name: '', description: '' }]
    })
  }

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    })
  }

  const addWhyLove = () => {
    setFormData({
      ...formData,
      whyPeopleLove: [...formData.whyPeopleLove, '']
    })
  }

  const removeWhyLove = (index: number) => {
    setFormData({
      ...formData,
      whyPeopleLove: formData.whyPeopleLove.filter((_, i) => i !== index)
    })
  }

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: MapPin },
    { id: 'details', label: 'Details', icon: Building2 },
    { id: 'schools', label: 'Schools', icon: GraduationCap },
    { id: 'highlights', label: 'Highlights', icon: Star },
    { id: 'media', label: 'Media', icon: ImageIcon },
  ]

  return (
    <form onSubmit={handleSubmit}>
      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-t transition-colors ${
              activeSection === section.id
                ? 'bg-brand-gold text-brand-navy'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <section.icon size={16} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                })}
                placeholder="e.g., Downtown Austin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Average Price *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.avgPrice}
                onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                placeholder="e.g., $850,000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Tagline *</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g., The heartbeat of the city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Vibe / Atmosphere *</label>
            <textarea
              required
              rows={3}
              className="input-field resize-none"
              value={formData.vibe}
              onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
              placeholder="Describe the feel of the neighborhood..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Full Description *</label>
            <textarea
              required
              rows={4}
              className="input-field resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed neighborhood description..."
            />
          </div>
        </div>
      )}

      {/* Details Section */}
      {activeSection === 'details' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Population</label>
              <input
                type="text"
                className="input-field"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                placeholder="e.g., ~13,000 residents"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Commute to Downtown</label>
              <input
                type="text"
                className="input-field"
                value={formData.commute.toDowntown}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  commute: { ...formData.commute, toDowntown: e.target.value }
                })}
                placeholder="e.g., 5-10 mins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Commute to Domain</label>
              <input
                type="text"
                className="input-field"
                value={formData.commute.toDomain}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  commute: { ...formData.commute, toDomain: e.target.value }
                })}
                placeholder="e.g., 20-30 mins"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">School District</label>
            <input
              type="text"
              className="input-field"
              value={formData.schoolDistrict}
              onChange={(e) => setFormData({ ...formData, schoolDistrict: e.target.value })}
              placeholder="e.g., Austin ISD or Eanes ISD"
            />
          </div>

          {/* Why People Love */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-brand-navy">Why People Love Living Here</label>
              <button type="button" onClick={addWhyLove} className="text-brand-gold text-sm hover:underline">
                + Add Reason
              </button>
            </div>
            <div className="space-y-2">
              {formData.whyPeopleLove.map((reason, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    rows={2}
                    className="input-field flex-1 resize-none"
                    value={reason}
                    onChange={(e) => {
                      const newReasons = [...formData.whyPeopleLove]
                      newReasons[index] = e.target.value
                      setFormData({ ...formData, whyPeopleLove: newReasons })
                    }}
                    placeholder="Enter a reason..."
                  />
                  <button
                    type="button"
                    onClick={() => removeWhyLove(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schools Section */}
      {activeSection === 'schools' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-brand-navy">Schools in this Neighborhood</h3>
            <button type="button" onClick={addSchool} className="btn-secondary text-sm py-2">
              <Plus size={16} />
              Add School
            </button>
          </div>

          {formData.schools.length === 0 ? (
            <p className="text-neutral-500 text-center py-8 bg-neutral-50 rounded">
              No schools added yet. Click "Add School" to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.schools.map((school, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-neutral-500">School #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSchool(index)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-neutral-500 mb-1">School Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={school.name}
                        onChange={(e) => updateSchool(index, 'name', e.target.value)}
                        placeholder="e.g., Mathews Elementary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Type</label>
                      <select
                        className="input-field"
                        value={school.type}
                        onChange={(e) => updateSchool(index, 'type', e.target.value)}
                      >
                        <option>Elementary</option>
                        <option>Middle</option>
                        <option>High School</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Rating (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="input-field"
                        value={school.rating}
                        onChange={(e) => updateSchool(index, 'rating', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1">Note (optional)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={school.note || ''}
                      onChange={(e) => updateSchool(index, 'note', e.target.value)}
                      placeholder="e.g., College Readiness: 9/10"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Highlights Section */}
      {activeSection === 'highlights' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-brand-navy">Key Highlights & Landmarks</h3>
            <button type="button" onClick={addHighlight} className="btn-secondary text-sm py-2">
              <Plus size={16} />
              Add Highlight
            </button>
          </div>

          {formData.highlights.length === 0 ? (
            <p className="text-neutral-500 text-center py-8 bg-neutral-50 rounded">
              No highlights added yet. Click "Add Highlight" to add one.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-500">Highlight #{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-500 hover:bg-red-100 p-1 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Name</label>
                      <input
                        type="text"
                        className="input-field"
                        value={highlight.name}
                        onChange={(e) => {
                          const newHighlights = [...formData.highlights]
                          newHighlights[index] = { ...highlight, name: e.target.value }
                          setFormData({ ...formData, highlights: newHighlights })
                        }}
                        placeholder="e.g., Barton Springs Pool"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-1">Description</label>
                      <input
                        type="text"
                        className="input-field"
                        value={highlight.description}
                        onChange={(e) => {
                          const newHighlights = [...formData.highlights]
                          newHighlights[index] = { ...highlight, description: e.target.value }
                          setFormData({ ...formData, highlights: newHighlights })
                        }}
                        placeholder="e.g., Natural spring-fed pool that stays 68°F year-round"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media Section */}
      {activeSection === 'media' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Main Image URL *</label>
            <input
              type="url"
              required
              className="input-field"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
            {formData.image && (
              <div className="mt-2 relative h-48 rounded overflow-hidden">
                <Image src={formData.image} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-500">
            💡 Tip: For best results, use high-quality images with dimensions of at least 1200x800 pixels.
            You can use images from Unsplash by pasting their URL.
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4 justify-end pt-6 mt-6 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-gold">
          <Save size={18} />
          Save Neighborhood
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DEALS TAB
// ═══════════════════════════════════════════════════════════════════════════

function DealsTab({ deals, setDeals }: { deals: Deal[], setDeals: (d: Deal[]) => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)

  const activeDeals = deals.filter(d => d.isActive)
  const closedDeals = deals.filter(d => !d.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">Active Transactions ({activeDeals.length})</h2>
        <button onClick={() => { setEditingDeal(null); setShowForm(true) }} className="btn-gold">
          <Plus size={18} />
          New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDeals.map((deal) => (
          <div key={deal.id} className="bg-white p-6 border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-display text-lg text-brand-navy">{deal.clientName}</p>
                <p className="text-sm text-neutral-500">{deal.property}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                deal.type === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {deal.type === 'buying' ? 'Buying' : 'Selling'}
              </span>
            </div>
            
            <p className="font-display text-2xl text-brand-gold mb-4">{formatPrice(deal.price)}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-500 mb-2">
                <span>{stageNames[deal.stage]}</span>
                <span>Stage {deal.stage}/8</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-gold rounded-full transition-all"
                  style={{ width: `${(deal.stage / 8) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { setEditingDeal(deal); setShowForm(true) }}
                className="btn-secondary flex-1 py-2 text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => {
                  const newStage = Math.min(deal.stage + 1, 8)
                  setDeals(deals.map(d => d.id === deal.id ? { ...d, stage: newStage } : d))
                }}
                className="btn-gold flex-1 py-2 text-sm"
                disabled={deal.stage >= 8}
              >
                Next Stage
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeDeals.length === 0 && (
        <div className="text-center py-12 text-neutral-500 bg-white border border-neutral-200">
          No active deals. Click "New Deal" to add one.
        </div>
      )}

      {/* Deal Form Modal */}
      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={editingDeal ? 'Edit Deal' : 'New Deal'}
        size="md"
      >
        <DealForm 
          deal={editingDeal}
          onSave={(deal) => {
            if (editingDeal) {
              setDeals(deals.map(d => d.id === deal.id ? deal : d))
            } else {
              setDeals([...deals, { ...deal, id: Date.now().toString() }])
            }
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function DealForm({ deal, onSave, onCancel }: { deal: Deal | null, onSave: (d: Deal) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Deal>(deal || {
    id: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    property: '',
    propertyAddress: '',
    price: 0,
    stage: 1,
    type: 'buying',
    keyDates: {},
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-brand-navy mb-2">Client Name *</label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Email *</label>
          <input
            type="email"
            required
            className="input-field"
            value={formData.clientEmail}
            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Phone</label>
          <input
            type="tel"
            className="input-field"
            value={formData.clientPhone || ''}
            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Deal Type</label>
          <select
            className="input-field"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'buying' | 'selling' })}
          >
            <option value="buying">Buying</option>
            <option value="selling">Selling</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Stage</label>
          <select
            className="input-field"
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: Number(e.target.value) })}
          >
            {stageNames.slice(1).map((name, index) => (
              <option key={index + 1} value={index + 1}>{index + 1}. {name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-brand-navy mb-2">Property Address</label>
          <input
            type="text"
            className="input-field"
            value={formData.propertyAddress || formData.property}
            onChange={(e) => setFormData({ ...formData, property: e.target.value, propertyAddress: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Price</label>
          <input
            type="number"
            className="input-field"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-navy mb-2">Closing Date</label>
          <input
            type="date"
            className="input-field"
            value={formData.keyDates.closingDate || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              keyDates: { ...formData.keyDates, closingDate: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold">
          <Save size={18} />
          Save Deal
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SITE SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════════════

function SiteSettingsTab({ settings, setSettings }: { settings: SiteSettings, setSettings: (s: SiteSettings) => void }) {
  const [activeSection, setActiveSection] = useState('hero')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'about', label: 'About', icon: Users },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto pb-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-t transition-colors ${
              activeSection === section.id
                ? 'bg-brand-gold text-brand-navy'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <section.icon size={16} />
            {section.label}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      {activeSection === 'hero' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">Hero Section</h3>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Headline</label>
            <input
              type="text"
              className="input-field"
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Subheadline</label>
            <textarea
              rows={2}
              className="input-field resize-none"
              value={settings.heroSubheadline}
              onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Media Type</label>
            <select
              className="input-field"
              value={settings.heroMediaType}
              onChange={(e) => setSettings({ ...settings, heroMediaType: e.target.value as 'images' | 'video' })}
            >
              <option value="images">Image Slider</option>
              <option value="video">Video Background</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Hero Images</label>
            <p className="text-sm text-neutral-500 mb-2">Currently: {settings.heroImages.length} images</p>
            <div className="grid grid-cols-4 gap-2">
              {settings.heroImages.map((img, index) => (
                <div key={index} className="relative aspect-video rounded overflow-hidden">
                  <Image src={img.url} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">About Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Agent Name</label>
              <input
                type="text"
                className="input-field"
                value={settings.agentName}
                onChange={(e) => setSettings({ ...settings, agentName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Title</label>
              <input
                type="text"
                className="input-field"
                value={settings.agentTitle}
                onChange={(e) => setSettings({ ...settings, agentTitle: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Photo URL</label>
            <input
              type="url"
              className="input-field"
              value={settings.agentPhoto}
              onChange={(e) => setSettings({ ...settings, agentPhoto: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">About Text</label>
            <textarea
              rows={6}
              className="input-field resize-none"
              value={settings.aboutText}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Phone</label>
              <input
                type="tel"
                className="input-field"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Address</label>
            <input
              type="text"
              className="input-field"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Social Section */}
      {activeSection === 'social' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">Social Media Links</h3>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Instagram</label>
            <input
              type="url"
              className="input-field"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Facebook</label>
            <input
              type="url"
              className="input-field"
              value={settings.facebook}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">LinkedIn</label>
            <input
              type="url"
              className="input-field"
              value={settings.linkedin}
              onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-gold">
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <p className="text-amber-800 text-sm">
          <strong>Note:</strong> Changes are saved locally in this demo. To make them permanent and sync across devices, 
          connect your Sanity CMS.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [properties, setProperties] = useState<Property[]>(demoProperties)
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(staticNeighborhoods)
  const [deals, setDeals] = useState<Deal[]>(demoDeals)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(demoSiteSettings)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'neighborhoods', label: 'Neighborhoods', icon: MapPin },
    { id: 'deals', label: 'Active Deals', icon: FileText },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top Bar */}
      <header className="bg-brand-navy text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl hover:text-brand-gold transition-colors">
              Merrav Berko
            </Link>
            <span className="text-white/40">|</span>
            <span className="text-white/70 text-sm">Back Office</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/70 hover:text-white text-sm hidden sm:block">
              View Website →
            </Link>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <DashboardTab properties={properties} deals={deals} neighborhoods={neighborhoods} />
        )}
        {activeTab === 'properties' && (
          <PropertiesTab properties={properties} setProperties={setProperties} />
        )}
        {activeTab === 'neighborhoods' && (
          <NeighborhoodsTab neighborhoods={neighborhoods} setNeighborhoods={setNeighborhoods} />
        )}
        {activeTab === 'deals' && (
          <DealsTab deals={deals} setDeals={setDeals} />
        )}
        {activeTab === 'settings' && (
          <SiteSettingsTab settings={siteSettings} setSettings={setSiteSettings} />
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if already logged in
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
