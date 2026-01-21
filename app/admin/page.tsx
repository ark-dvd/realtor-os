'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Lock, Home, Users, FileText, Settings, LogOut, Plus, 
  Search, Edit, Trash2, MapPin, TrendingUp, 
  Save, X, Upload, Star, GraduationCap,
  Building2, Image as ImageIcon, Phone, Globe, Loader2, RefreshCw
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface School {
  _key?: string
  name: string
  type: string
  rating: number
  note?: string
}

interface Highlight {
  _key?: string
  name: string
  description: string
}

interface Neighborhood {
  _id?: string
  name: string
  slug: string
  tagline: string
  vibe: string
  description: string
  population: string
  commute: { toDowntown: string; toDomain: string }
  schoolDistrict: string
  schools: School[]
  whyPeopleLove: string[]
  highlights: Highlight[]
  avgPrice: string
  image?: string
  imageAssetId?: string
  order: number
  isActive: boolean
}

interface Property {
  _id?: string
  title: string
  slug: string
  address: any
  price: number
  status: string
  beds: number
  baths: number
  sqft: number
  image?: string
  imageAssetId?: string
}

interface Deal {
  _id?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  propertyAddress?: string
  price: number
  transactionStage: number
  dealType: 'buying' | 'selling'
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
  _id?: string
  heroHeadline: string
  heroSubheadline: string
  heroMediaType: 'images' | 'video'
  heroImages?: { url: string; alt?: string }[]
  agentName: string
  agentTitle: string
  agentPhoto?: string
  aboutText?: string
  phone: string
  email: string
  address: string
  instagram?: string
  facebook?: string
  linkedin?: string
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
// IMAGE UPLOAD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ImageUpload({ 
  currentImage, 
  onUpload,
  label = 'Image'
}: { 
  currentImage?: string
  onUpload: (assetId: string, url: string) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to Sanity
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      onUpload(data.assetId, data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      setPreview(currentImage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-brand-navy mb-2">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-neutral-300 rounded-lg p-4 hover:border-brand-gold transition-colors cursor-pointer"
      >
        {preview ? (
          <div className="relative h-48 rounded overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={32} />
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-neutral-400">
            <Upload size={32} className="mb-2" />
            <p className="text-sm">Click to upload image</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}

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
              <label className="block text-sm font-medium text-brand-navy mb-2">Password</label>
              <input
                type="password"
                required
                className="input-field"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
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
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING SPINNER
// ═══════════════════════════════════════════════════════════════════════════

function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="animate-spin text-brand-gold mb-4" size={40} />
      <p className="text-neutral-500">{message}</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════════

function DashboardTab({ 
  properties, 
  deals, 
  neighborhoods,
  onSeedData,
  seeding
}: { 
  properties: Property[]
  deals: Deal[]
  neighborhoods: Neighborhood[]
  onSeedData: (type: string) => void
  seeding: boolean
}) {
  const activeDeals = deals.filter(d => d.isActive)
  const stats = [
    { label: 'Active Listings', value: properties.filter(p => p.status === 'for-sale').length.toString(), icon: Home, color: 'bg-blue-500' },
    { label: 'Neighborhoods', value: neighborhoods.length.toString(), icon: MapPin, color: 'bg-green-500' },
    { label: 'Active Deals', value: activeDeals.length.toString(), icon: FileText, color: 'bg-amber-500' },
    { label: 'Total Properties', value: properties.length.toString(), icon: Building2, color: 'bg-purple-500' },
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

      {/* Seed Data Section - Only show if no data */}
      {neighborhoods.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
          <h3 className="font-display text-lg text-amber-800 mb-2">Initialize Database</h3>
          <p className="text-amber-700 mb-4">
            Your Sanity database is empty. Click below to populate it with the initial Austin neighborhoods data.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onSeedData('neighborhoods')}
              disabled={seeding}
              className="btn-gold"
            >
              {seeding ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
              Load Neighborhoods
            </button>
            <button 
              onClick={() => onSeedData('settings')}
              disabled={seeding}
              className="btn-secondary"
            >
              {seeding ? <Loader2 className="animate-spin" size={18} /> : <Settings size={18} />}
              Initialize Settings
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Neighborhoods */}
        <div className="bg-white p-6 border border-neutral-200">
          <h3 className="font-display text-lg text-brand-navy mb-4">Neighborhoods ({neighborhoods.length})</h3>
          <div className="space-y-3">
            {neighborhoods.slice(0, 5).map((n) => (
              <div key={n._id || n.slug} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="font-medium text-brand-navy">{n.name}</p>
                  <p className="text-sm text-neutral-500">{n.avgPrice}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${n.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {n.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
            ))}
            {neighborhoods.length === 0 && (
              <p className="text-neutral-500 text-center py-4">No neighborhoods yet</p>
            )}
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-white p-6 border border-neutral-200">
          <h3 className="font-display text-lg text-brand-navy mb-4">Active Deals ({activeDeals.length})</h3>
          <div className="space-y-3">
            {activeDeals.slice(0, 5).map((deal) => (
              <div key={deal._id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div>
                  <p className="font-medium text-brand-navy">{deal.clientName}</p>
                  <p className="text-sm text-neutral-500">{deal.propertyAddress}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${deal.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {deal.dealType === 'buying' ? 'Buying' : 'Selling'}
                  </span>
                  <p className="text-xs text-neutral-400 mt-1">Stage {deal.transactionStage}/8</p>
                </div>
              </div>
            ))}
            {activeDeals.length === 0 && (
              <p className="text-neutral-500 text-center py-4">No active deals</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NEIGHBORHOODS TAB
// ═══════════════════════════════════════════════════════════════════════════

function NeighborhoodsTab({ 
  neighborhoods, 
  loading,
  onSave,
  onDelete,
  saving
}: { 
  neighborhoods: Neighborhood[]
  loading: boolean
  onSave: (n: Neighborhood) => Promise<void>
  onDelete: (id: string) => Promise<void>
  saving: boolean
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this neighborhood?')) {
      await onDelete(id)
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading neighborhoods..." />
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
          <div key={neighborhood._id || neighborhood.slug} className="bg-white border border-neutral-200 overflow-hidden">
            <div className="relative h-40 bg-neutral-200">
              {neighborhood.image ? (
                <Image src={neighborhood.image} alt={neighborhood.name} fill className="object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-400">
                  <ImageIcon size={40} />
                </div>
              )}
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
                  onClick={() => neighborhood._id && handleDelete(neighborhood._id)}
                  className="p-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNeighborhoods.length === 0 && !loading && (
        <div className="text-center py-12 text-neutral-500 bg-white border border-neutral-200">
          {searchTerm ? 'No neighborhoods match your search' : 'No neighborhoods yet. Click "Add Neighborhood" to create one.'}
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
          saving={saving}
          onSave={async (neighborhood) => {
            await onSave(neighborhood)
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
  saving,
  onSave, 
  onCancel 
}: { 
  neighborhood: Neighborhood | null
  saving: boolean
  onSave: (neighborhood: Neighborhood) => Promise<void>
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
    order: 10,
    isActive: true,
  })

  const [activeSection, setActiveSection] = useState('basic')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
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
                        placeholder="e.g., Natural spring-fed pool"
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
          <ImageUpload
            currentImage={formData.image}
            label="Neighborhood Image *"
            onUpload={(assetId, url) => setFormData({ ...formData, imageAssetId: assetId, image: url })}
          />
          <p className="text-sm text-neutral-500">
            Upload a high-quality image (at least 1200x800 pixels) that represents this neighborhood.
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-4 justify-end pt-6 mt-6 border-t border-neutral-200">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-gold" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Neighborhood'}
        </button>
      </div>
    </form>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES TAB (Simplified)
// ═══════════════════════════════════════════════════════════════════════════

function PropertiesTab({ properties, loading }: { properties: Property[], loading: boolean }) {
  if (loading) return <LoadingSpinner message="Loading properties..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">Properties ({properties.length})</h2>
        <button className="btn-gold">
          <Plus size={18} />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 bg-white border border-neutral-200">
          No properties yet.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Property</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Price</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {properties.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand-navy">{p.title}</p>
                    <p className="text-sm text-neutral-500">{p.beds} bed • {p.baths} bath • {p.sqft?.toLocaleString()} sqft</p>
                  </td>
                  <td className="px-6 py-4 font-display text-lg">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      p.status === 'for-sale' ? 'bg-green-100 text-green-700' :
                      p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DEALS TAB (Simplified)
// ═══════════════════════════════════════════════════════════════════════════

function DealsTab({ deals, loading }: { deals: Deal[], loading: boolean }) {
  if (loading) return <LoadingSpinner message="Loading deals..." />

  const activeDeals = deals.filter(d => d.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">Active Deals ({activeDeals.length})</h2>
        <button className="btn-gold">
          <Plus size={18} />
          New Deal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDeals.map((deal) => (
          <div key={deal._id} className="bg-white p-6 border border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-display text-lg text-brand-navy">{deal.clientName}</p>
                <p className="text-sm text-neutral-500">{deal.propertyAddress}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                deal.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {deal.dealType}
              </span>
            </div>
            
            <p className="font-display text-2xl text-brand-gold mb-4">{formatPrice(deal.price)}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-500 mb-2">
                <span>{stageNames[deal.transactionStage]}</span>
                <span>Stage {deal.transactionStage}/8</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-gold rounded-full"
                  style={{ width: `${(deal.transactionStage / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeDeals.length === 0 && (
        <div className="text-center py-12 text-neutral-500 bg-white border border-neutral-200">
          No active deals.
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SITE SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════════════

function SiteSettingsTab({ 
  settings, 
  loading, 
  onSave, 
  saving 
}: { 
  settings: SiteSettings | null
  loading: boolean
  onSave: (s: SiteSettings) => Promise<void>
  saving: boolean
}) {
  const [formData, setFormData] = useState<SiteSettings>(settings || {
    heroHeadline: '',
    heroSubheadline: '',
    heroMediaType: 'images',
    agentName: '',
    agentTitle: '',
    phone: '',
    email: '',
    address: '',
  })
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    if (settings) setFormData(settings)
  }, [settings])

  if (loading) return <LoadingSpinner message="Loading settings..." />

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: ImageIcon },
    { id: 'about', label: 'About', icon: Users },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
  ]

  return (
    <div className="max-w-4xl space-y-6">
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

      {activeSection === 'hero' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">Hero Section</h3>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Headline</label>
            <input
              type="text"
              className="input-field"
              value={formData.heroHeadline}
              onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Subheadline</label>
            <textarea
              rows={2}
              className="input-field resize-none"
              value={formData.heroSubheadline}
              onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeSection === 'about' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">About Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Agent Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.agentName}
                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Title</label>
              <input
                type="text"
                className="input-field"
                value={formData.agentTitle}
                onChange={(e) => setFormData({ ...formData, agentTitle: e.target.value })}
              />
            </div>
          </div>
          <ImageUpload
            currentImage={formData.agentPhoto}
            label="Agent Photo"
            onUpload={(assetId, url) => setFormData({ ...formData, agentPhoto: url })}
          />
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Phone</label>
              <input
                type="tel"
                className="input-field"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Email</label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Address</label>
            <input
              type="text"
              className="input-field"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>
      )}

      {activeSection === 'social' && (
        <div className="bg-white p-6 border border-neutral-200 space-y-4">
          <h3 className="font-display text-lg text-brand-navy mb-4">Social Media Links</h3>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Instagram</label>
            <input
              type="url"
              className="input-field"
              value={formData.instagram || ''}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Facebook</label>
            <input
              type="url"
              className="input-field"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">LinkedIn</label>
            <input
              type="url"
              className="input-field"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => onSave(formData)} className="btn-gold" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Data states
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  
  // Loading states
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true)
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [loadingDeals, setLoadingDeals] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    fetchNeighborhoods()
    fetchProperties()
    fetchDeals()
    fetchSettings()
  }, [])

  const fetchNeighborhoods = async () => {
    try {
      const res = await fetch('/api/neighborhoods')
      if (res.ok) {
        const data = await res.json()
        setNeighborhoods(data)
      }
    } catch (error) {
      console.error('Error fetching neighborhoods:', error)
    } finally {
      setLoadingNeighborhoods(false)
    }
  }

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties')
      if (res.ok) {
        const data = await res.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoadingProperties(false)
    }
  }

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals')
      if (res.ok) {
        const data = await res.json()
        setDeals(data)
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setLoadingDeals(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoadingSettings(false)
    }
  }

  const saveNeighborhood = async (neighborhood: Neighborhood) => {
    setSaving(true)
    try {
      const method = neighborhood._id ? 'PUT' : 'POST'
      const res = await fetch('/api/neighborhoods', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(neighborhood),
      })
      if (res.ok) {
        await fetchNeighborhoods()
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      console.error('Error saving neighborhood:', error)
      alert('Failed to save neighborhood')
    } finally {
      setSaving(false)
    }
  }

  const deleteNeighborhood = async (id: string) => {
    try {
      const res = await fetch(`/api/neighborhoods?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchNeighborhoods()
      }
    } catch (error) {
      console.error('Error deleting neighborhood:', error)
      alert('Failed to delete neighborhood')
    }
  }

  const saveSettings = async (newSettings: SiteSettings) => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
      if (res.ok) {
        await fetchSettings()
        alert('Settings saved!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const seedData = async (type: string) => {
    setSeeding(true)
    try {
      const res = await fetch(`/api/seed?type=${type}`, { method: 'POST' })
      const data = await res.json()
      alert(data.message)
      if (type === 'neighborhoods') await fetchNeighborhoods()
      if (type === 'settings') await fetchSettings()
    } catch (error) {
      console.error('Error seeding data:', error)
      alert('Failed to seed data')
    } finally {
      setSeeding(false)
    }
  }

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
            <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Logout">
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
          <DashboardTab 
            properties={properties} 
            deals={deals} 
            neighborhoods={neighborhoods}
            onSeedData={seedData}
            seeding={seeding}
          />
        )}
        {activeTab === 'properties' && (
          <PropertiesTab properties={properties} loading={loadingProperties} />
        )}
        {activeTab === 'neighborhoods' && (
          <NeighborhoodsTab 
            neighborhoods={neighborhoods} 
            loading={loadingNeighborhoods}
            onSave={saveNeighborhood}
            onDelete={deleteNeighborhood}
            saving={saving}
          />
        )}
        {activeTab === 'deals' && (
          <DealsTab deals={deals} loading={loadingDeals} />
        )}
        {activeTab === 'settings' && (
          <SiteSettingsTab 
            settings={settings} 
            loading={loadingSettings}
            onSave={saveSettings}
            saving={saving}
          />
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
    const loggedIn = localStorage.getItem('admin_logged_in')
    if (loggedIn === 'true') setIsLoggedIn(true)
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
