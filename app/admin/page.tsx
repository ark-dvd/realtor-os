'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Lock, Home, Users, FileText, Settings, LogOut, Plus, 
  Search, Edit, Trash2, MapPin, TrendingUp, Check,
  Save, X, Upload, Star, GraduationCap, ChevronRight, ChevronDown,
  Building2, Image as ImageIcon, Phone, Globe, Loader2, 
  RefreshCw, DollarSign, Calendar, Mail, Clock,
  AlertCircle, CheckCircle, Eye, EyeOff
} from 'lucide-react'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

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
  status: string
  price: number
  address: { street?: string; city?: string; state?: string; zip?: string }
  beds: number
  baths: number
  sqft: number
  lotSize?: number
  yearBuilt?: number
  garage?: number
  mlsNumber?: string
  shortDescription?: string
  features?: string[]
  heroImage?: string
  heroImageAssetId?: string
}

interface Deal {
  _id?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  dealType: 'buying' | 'selling'
  propertyAddress: string
  price: number
  transactionStage: number
  keyDates: {
    contractDate?: string
    optionPeriodEnds?: string
    inspectionDate?: string
    appraisalDate?: string
    closingDate?: string
  }
  notes?: string
  isActive: boolean
}

interface SiteSettings {
  _id?: string
  heroHeadline: string
  heroSubheadline: string
  heroMediaType: 'images' | 'video'
  heroImages?: { _key?: string; url?: string; assetId?: string; alt?: string }[]
  agentName: string
  agentTitle: string
  agentPhoto?: string
  agentPhotoAssetId?: string
  aboutText?: string
  phone: string
  email: string
  address: string
  instagram?: string
  facebook?: string
  linkedin?: string
}

// ════════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price || 0)
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'
const STAGES = ['', 'Contract Signed', 'Option Period', 'Inspection', 'Appraisal', 'Financing', 'Title Work', 'Final Walk', 'Closing']
const STATUS_STYLES: Record<string, string> = {
  'for-sale': 'bg-green-100 text-green-700',
  'pending': 'bg-amber-100 text-amber-700',
  'sold': 'bg-blue-100 text-blue-700',
  'off-market': 'bg-neutral-100 text-neutral-600',
}

// ════════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={16} /></button>
    </div>
  )
}

function Modal({ isOpen, onClose, title, children, size = 'lg' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!isOpen) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white w-full ${sizes[size]} my-8 rounded-lg shadow-xl`}>
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between rounded-t-lg z-10">
          <h2 className="font-display text-xl text-brand-navy">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ImageUpload({ currentImage, onUpload, label = 'Image' }: { currentImage?: string; onUpload: (assetId: string, url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setPreview(currentImage) }, [currentImage])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onUpload(data.assetId, data.url)
    } catch (err) {
      alert('Failed to upload image')
      setPreview(currentImage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-brand-navy mb-2">{label}</label>
      <div onClick={() => !uploading && inputRef.current?.click()} className={`relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-colors ${uploading ? 'border-brand-gold' : 'border-neutral-300 hover:border-brand-gold'}`}>
        {preview ? (
          <div className="relative h-48">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={32} /></div>}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center text-neutral-400">
            <Upload size={32} className="mb-2" />
            <p className="text-sm">Click to upload</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// LOGIN
// ════════════════════════════════════════════════════════════════════════════════

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'merav2024') { localStorage.setItem('admin_logged_in', 'true'); onLogin() }
    else setError('Invalid password')
  }
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-navy mx-auto flex items-center justify-center mb-4"><Lock className="text-brand-gold" size={28} /></div>
          <h1 className="font-display text-2xl text-brand-navy">Back Office</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">Password</label>
            <input type="password" required className="input-field" value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} placeholder="Enter password" />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button type="submit" className="btn-gold w-full justify-center">Access Dashboard</button>
        </form>
        <div className="mt-6 text-center"><Link href="/" className="text-brand-gold hover:underline text-sm">← Back to Website</Link></div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ════════════════════════════════════════════════════════════════════════════════

function DashboardTab({ properties, deals, neighborhoods, onSeed, seeding }: { properties: Property[]; deals: Deal[]; neighborhoods: Neighborhood[]; onSeed: () => void; seeding: boolean }) {
  const needsSeed = neighborhoods.length === 0 && properties.length === 0
  const stats = [
    { label: 'Active Listings', value: properties.filter(p => p.status === 'for-sale').length, icon: Home, color: 'bg-blue-500' },
    { label: 'Neighborhoods', value: neighborhoods.length, icon: MapPin, color: 'bg-green-500' },
    { label: 'Active Deals', value: deals.filter(d => d.isActive).length, icon: FileText, color: 'bg-amber-500' },
    { label: 'Total Properties', value: properties.length, icon: Building2, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-8">
      {needsSeed && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
          <h3 className="font-display text-lg text-amber-800 mb-2">Initialize Database</h3>
          <p className="text-amber-700 mb-4">Your database is empty. Load all existing data including 12 neighborhoods, sample properties, deals, and site settings.</p>
          <button onClick={onSeed} disabled={seeding} className="btn-gold">
            {seeding ? <><Loader2 className="animate-spin" size={18} /> Loading...</> : <><RefreshCw size={18} /> Load All Data</>}
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl border">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}><s.icon className="text-white" size={24} /></div>
            <p className="font-display text-3xl text-brand-navy">{s.value}</p>
            <p className="text-neutral-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-display text-lg text-brand-navy mb-4">Recent Properties</h3>
          {properties.slice(0, 5).map(p => (
            <div key={p._id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div><p className="font-medium text-brand-navy">{p.title}</p><p className="text-sm text-neutral-500">{formatPrice(p.price)}</p></div>
              <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[p.status] || ''}`}>{p.status}</span>
            </div>
          ))}
          {properties.length === 0 && <p className="text-neutral-500 text-center py-4">No properties yet</p>}
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-display text-lg text-brand-navy mb-4">Active Deals</h3>
          {deals.filter(d => d.isActive).slice(0, 5).map(d => (
            <div key={d._id} className="py-3 border-b last:border-0">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-brand-navy">{d.clientName}</p>
                <span className={`text-xs px-2 py-1 rounded ${d.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{d.dealType}</span>
              </div>
              <p className="text-sm text-neutral-500">{d.propertyAddress}</p>
              <div className="flex items-center gap-2 mt-2"><div className="flex-1 h-1.5 bg-neutral-200 rounded-full"><div className="h-full bg-brand-gold rounded-full" style={{ width: `${(d.transactionStage / 8) * 100}%` }} /></div><span className="text-xs text-neutral-400">{d.transactionStage}/8</span></div>
            </div>
          ))}
          {deals.filter(d => d.isActive).length === 0 && <p className="text-neutral-500 text-center py-4">No active deals</p>}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// PROPERTIES TAB
// ════════════════════════════════════════════════════════════════════════════════

function PropertiesTab({ properties, loading, onSave, onDelete, saving }: { properties: Property[]; loading: boolean; onSave: (p: Property) => Promise<void>; onDelete: (id: string) => Promise<void>; saving: boolean }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [search, setSearch] = useState('')
  const filtered = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input type="text" placeholder="Search properties..." className="input-field pl-10 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-gold"><Plus size={18} /> Add Property</button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl">
          <Home className="mx-auto text-neutral-300 mb-4" size={48} />
          <p className="text-neutral-500">{search ? 'No properties match your search' : 'No properties yet'}</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Property</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Price</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Details</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Status</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-neutral-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(p => (
                <tr key={p._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-neutral-100 rounded overflow-hidden relative flex-shrink-0">
                        {p.heroImage ? <Image src={p.heroImage} alt={p.title} fill className="object-cover" /> : <Home className="absolute inset-0 m-auto text-neutral-300" size={20} />}
                      </div>
                      <div><p className="font-medium text-brand-navy">{p.title}</p><p className="text-sm text-neutral-500">{p.address?.street || 'No address'}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-display text-lg">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{p.beds} bed • {p.baths} bath • {p.sqft?.toLocaleString()} sqft</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[p.status] || ''}`}>{p.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditing(p); setShowForm(true) }} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button>
                    <button onClick={() => p._id && confirm('Delete this property?') && onDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? `Edit: ${editing.title}` : 'Add Property'} size="lg">
        <PropertyForm property={editing} saving={saving} onSave={async (p) => { await onSave(p); setShowForm(false) }} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}

function PropertyForm({ property, saving, onSave, onCancel }: { property: Property | null; saving: boolean; onSave: (p: Property) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<Property>(property || {
    title: '', slug: '', status: 'for-sale', price: 0, address: {}, beds: 0, baths: 0, sqft: 0, features: []
  })
  const [featuresText, setFeaturesText] = useState(property?.features?.join(', ') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...form, features: featuresText.split(',').map(f => f.trim()).filter(Boolean) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Title *</label><input type="text" required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Price *</label><input type="number" required className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Beds</label><input type="number" className="input-field" value={form.beds || ''} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Baths</label><input type="number" step="0.5" className="input-field" value={form.baths || ''} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Sqft</label><input type="number" className="input-field" value={form.sqft || ''} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Status</label><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="for-sale">For Sale</option><option value="pending">Pending</option><option value="sold">Sold</option><option value="off-market">Off Market</option></select></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Street Address</label><input type="text" className="input-field" value={form.address?.street || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} /></div>
        <div className="grid grid-cols-3 gap-2">
          <div><label className="block text-sm font-medium text-brand-navy mb-2">City</label><input type="text" className="input-field" value={form.address?.city || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">State</label><input type="text" className="input-field" value={form.address?.state || 'TX'} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">ZIP</label><input type="text" className="input-field" value={form.address?.zip || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, zip: e.target.value } })} /></div>
        </div>
      </div>
      <div><label className="block text-sm font-medium text-brand-navy mb-2">Description</label><textarea rows={3} className="input-field resize-none" value={form.shortDescription || ''} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div>
      <div><label className="block text-sm font-medium text-brand-navy mb-2">Features (comma separated)</label><input type="text" className="input-field" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Pool, Smart Home, Wine Cellar" /></div>
      <ImageUpload currentImage={form.heroImage} label="Hero Image" onUpload={(assetId, url) => setForm({ ...form, heroImageAssetId: assetId, heroImage: url })} />
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {saving ? 'Saving...' : 'Save Property'}</button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// NEIGHBORHOODS TAB
// ════════════════════════════════════════════════════════════════════════════════

function NeighborhoodsTab({ neighborhoods, loading, onSave, onDelete, saving }: { neighborhoods: Neighborhood[]; loading: boolean; onSave: (n: Neighborhood) => Promise<void>; onDelete: (id: string) => Promise<void>; saving: boolean }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Neighborhood | null>(null)
  const [search, setSearch] = useState('')
  const filtered = neighborhoods.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input type="text" placeholder="Search neighborhoods..." className="input-field pl-10 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-gold"><Plus size={18} /> Add Neighborhood</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(n => (
          <div key={n._id} className="bg-white border rounded-xl overflow-hidden">
            <div className="relative h-40 bg-neutral-200">
              {n.image ? <Image src={n.image} alt={n.name} fill className="object-cover" /> : <MapPin className="absolute inset-0 m-auto text-neutral-300" size={40} />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4"><h3 className="font-display text-xl text-white">{n.name}</h3><p className="text-white/80 text-sm">{n.avgPrice}</p></div>
            </div>
            <div className="p-4">
              <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{n.tagline}</p>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                <span className="flex items-center gap-1"><GraduationCap size={14} /> {n.schools?.length || 0} schools</span>
                <span className="flex items-center gap-1"><Star size={14} /> {n.highlights?.length || 0} highlights</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(n); setShowForm(true) }} className="btn-secondary flex-1 py-2 text-sm"><Edit size={14} /> Edit</button>
                <button onClick={() => n._id && confirm('Delete this neighborhood?') && onDelete(n._id)} className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-16 bg-white border rounded-xl"><MapPin className="mx-auto text-neutral-300 mb-4" size={48} /><p className="text-neutral-500">{search ? 'No match' : 'No neighborhoods yet'}</p></div>}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? `Edit: ${editing.name}` : 'Add Neighborhood'} size="xl">
        <NeighborhoodForm neighborhood={editing} saving={saving} onSave={async (n) => { await onSave(n); setShowForm(false) }} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}

function NeighborhoodForm({ neighborhood, saving, onSave, onCancel }: { neighborhood: Neighborhood | null; saving: boolean; onSave: (n: Neighborhood) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<Neighborhood>(neighborhood || {
    name: '', slug: '', tagline: '', vibe: '', description: '', population: '', commute: { toDowntown: '', toDomain: '' },
    schoolDistrict: '', schools: [], whyPeopleLove: [], highlights: [], avgPrice: '', order: 10, isActive: true
  })
  const [tab, setTab] = useState('basic')

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form) }
  const addSchool = () => setForm({ ...form, schools: [...form.schools, { name: '', type: 'Elementary', rating: 5 }] })
  const removeSchool = (i: number) => setForm({ ...form, schools: form.schools.filter((_, idx) => idx !== i) })
  const addHighlight = () => setForm({ ...form, highlights: [...form.highlights, { name: '', description: '' }] })
  const removeHighlight = (i: number) => setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) })
  const addWhyLove = () => setForm({ ...form, whyPeopleLove: [...form.whyPeopleLove, ''] })
  const removeWhyLove = (i: number) => setForm({ ...form, whyPeopleLove: form.whyPeopleLove.filter((_, idx) => idx !== i) })

  const tabs = [{ id: 'basic', label: 'Basic Info', icon: MapPin }, { id: 'details', label: 'Details', icon: Building2 }, { id: 'schools', label: 'Schools', icon: GraduationCap }, { id: 'highlights', label: 'Highlights', icon: Star }, { id: 'media', label: 'Media', icon: ImageIcon }]

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-t transition-colors ${tab === t.id ? 'bg-brand-gold text-brand-navy' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}><t.icon size={16} />{t.label}</button>
        ))}
      </div>

      {tab === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Name *</label><input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Avg Price *</label><input type="text" required className="input-field" value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} placeholder="$850,000" /></div>
          </div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Tagline *</label><input type="text" required className="input-field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Vibe *</label><textarea rows={2} required className="input-field resize-none" value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Description *</label><textarea rows={4} required className="input-field resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
      )}

      {tab === 'details' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Population</label><input type="text" className="input-field" value={form.population} onChange={(e) => setForm({ ...form, population: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-brand-navy mb-2">To Downtown</label><input type="text" className="input-field" value={form.commute.toDowntown} onChange={(e) => setForm({ ...form, commute: { ...form.commute, toDowntown: e.target.value } })} /></div>
            <div><label className="block text-sm font-medium text-brand-navy mb-2">To Domain</label><input type="text" className="input-field" value={form.commute.toDomain} onChange={(e) => setForm({ ...form, commute: { ...form.commute, toDomain: e.target.value } })} /></div>
          </div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">School District</label><input type="text" className="input-field" value={form.schoolDistrict} onChange={(e) => setForm({ ...form, schoolDistrict: e.target.value })} /></div>
          <div>
            <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-brand-navy">Why People Love Living Here</label><button type="button" onClick={addWhyLove} className="text-brand-gold text-sm">+ Add</button></div>
            {form.whyPeopleLove.map((r, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea rows={2} className="input-field flex-1 resize-none" value={r} onChange={(e) => { const arr = [...form.whyPeopleLove]; arr[i] = e.target.value; setForm({ ...form, whyPeopleLove: arr }) }} />
                <button type="button" onClick={() => removeWhyLove(i)} className="p-2 text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'schools' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-medium text-brand-navy">Schools</h3><button type="button" onClick={addSchool} className="btn-secondary text-sm py-2"><Plus size={16} /> Add School</button></div>
          {form.schools.length === 0 && <p className="text-neutral-500 text-center py-8 bg-neutral-50 rounded">No schools yet</p>}
          {form.schools.map((s, i) => (
            <div key={i} className="p-4 bg-neutral-50 rounded-lg space-y-3">
              <div className="flex justify-between items-center"><span className="text-sm text-neutral-500">School #{i + 1}</span><button type="button" onClick={() => removeSchool(i)} className="text-red-500"><Trash2 size={16} /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2"><input type="text" className="input-field" placeholder="Name" value={s.name} onChange={(e) => { const arr = [...form.schools]; arr[i] = { ...s, name: e.target.value }; setForm({ ...form, schools: arr }) }} /></div>
                <select className="input-field" value={s.type} onChange={(e) => { const arr = [...form.schools]; arr[i] = { ...s, type: e.target.value }; setForm({ ...form, schools: arr }) }}><option>Elementary</option><option>Middle</option><option>High School</option></select>
                <input type="number" min="1" max="10" className="input-field" placeholder="Rating" value={s.rating} onChange={(e) => { const arr = [...form.schools]; arr[i] = { ...s, rating: Number(e.target.value) }; setForm({ ...form, schools: arr }) }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'highlights' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-medium text-brand-navy">Highlights & Landmarks</h3><button type="button" onClick={addHighlight} className="btn-secondary text-sm py-2"><Plus size={16} /> Add</button></div>
          {form.highlights.length === 0 && <p className="text-neutral-500 text-center py-8 bg-neutral-50 rounded">No highlights yet</p>}
          {form.highlights.map((h, i) => (
            <div key={i} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex justify-between items-center mb-3"><span className="text-sm text-neutral-500">#{i + 1}</span><button type="button" onClick={() => removeHighlight(i)} className="text-red-500"><Trash2 size={16} /></button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" className="input-field" placeholder="Name" value={h.name} onChange={(e) => { const arr = [...form.highlights]; arr[i] = { ...h, name: e.target.value }; setForm({ ...form, highlights: arr }) }} />
                <input type="text" className="input-field" placeholder="Description" value={h.description} onChange={(e) => { const arr = [...form.highlights]; arr[i] = { ...h, description: e.target.value }; setForm({ ...form, highlights: arr }) }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'media' && (
        <div className="space-y-4">
          <ImageUpload currentImage={form.image} label="Neighborhood Image" onUpload={(assetId, url) => setForm({ ...form, imageAssetId: assetId, image: url })} />
        </div>
      )}

      <div className="flex gap-4 justify-end pt-6 mt-6 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// DEALS TAB
// ════════════════════════════════════════════════════════════════════════════════

function DealsTab({ deals, loading, onSave, onDelete, saving }: { deals: Deal[]; loading: boolean; onSave: (d: Deal) => Promise<void>; onDelete: (id: string) => Promise<void>; saving: boolean }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Deal | null>(null)

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  const active = deals.filter(d => d.isActive)
  const closed = deals.filter(d => !d.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">Active Deals ({active.length})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-gold"><Plus size={18} /> New Deal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {active.map(d => (
          <div key={d._id} className="bg-white p-6 border rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div><p className="font-display text-lg text-brand-navy">{d.clientName}</p><p className="text-sm text-neutral-500">{d.propertyAddress}</p></div>
              <span className={`text-xs px-2 py-1 rounded ${d.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{d.dealType}</span>
            </div>
            <p className="font-display text-2xl text-brand-gold mb-4">{formatPrice(d.price)}</p>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-500 mb-2"><span>{STAGES[d.transactionStage]}</span><span>{d.transactionStage}/8</span></div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden"><div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${(d.transactionStage / 8) * 100}%` }} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 mb-4">
              <div><span className="block text-neutral-400">Contract</span>{formatDate(d.keyDates?.contractDate)}</div>
              <div><span className="block text-neutral-400">Closing</span>{formatDate(d.keyDates?.closingDate)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(d); setShowForm(true) }} className="btn-secondary flex-1 py-2 text-sm"><Edit size={14} /> Edit</button>
              {d.transactionStage < 8 && (
                <button onClick={() => onSave({ ...d, transactionStage: d.transactionStage + 1 })} className="btn-gold flex-1 py-2 text-sm"><ChevronRight size={14} /> Next Stage</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {active.length === 0 && <div className="text-center py-16 bg-white border rounded-xl"><FileText className="mx-auto text-neutral-300 mb-4" size={48} /><p className="text-neutral-500">No active deals</p></div>}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Deal' : 'New Deal'} size="lg">
        <DealForm deal={editing} saving={saving} onSave={async (d) => { await onSave(d); setShowForm(false) }} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}

function DealForm({ deal, saving, onSave, onCancel }: { deal: Deal | null; saving: boolean; onSave: (d: Deal) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<Deal>(deal || {
    clientName: '', clientEmail: '', clientPhone: '', dealType: 'buying', propertyAddress: '', price: 0, transactionStage: 1, keyDates: {}, isActive: true
  })

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form) }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Client Name *</label><input type="text" required className="input-field" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Email *</label><input type="email" required className="input-field" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Phone</label><input type="tel" className="input-field" value={form.clientPhone || ''} onChange={(e) => setForm({ ...form, clientPhone: e.target.value })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Type</label><select className="input-field" value={form.dealType} onChange={(e) => setForm({ ...form, dealType: e.target.value as 'buying' | 'selling' })}><option value="buying">Buying</option><option value="selling">Selling</option></select></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Price</label><input type="number" className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
      </div>
      <div><label className="block text-sm font-medium text-brand-navy mb-2">Property Address</label><input type="text" className="input-field" value={form.propertyAddress} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} /></div>
      <div><label className="block text-sm font-medium text-brand-navy mb-2">Stage</label><select className="input-field" value={form.transactionStage} onChange={(e) => setForm({ ...form, transactionStage: Number(e.target.value) })}>{STAGES.slice(1).map((s, i) => <option key={i + 1} value={i + 1}>{i + 1}. {s}</option>)}</select></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Contract Date</label><input type="date" className="input-field" value={form.keyDates?.contractDate || ''} onChange={(e) => setForm({ ...form, keyDates: { ...form.keyDates, contractDate: e.target.value } })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Inspection Date</label><input type="date" className="input-field" value={form.keyDates?.inspectionDate || ''} onChange={(e) => setForm({ ...form, keyDates: { ...form.keyDates, inspectionDate: e.target.value } })} /></div>
        <div><label className="block text-sm font-medium text-brand-navy mb-2">Closing Date</label><input type="date" className="input-field" value={form.keyDates?.closingDate || ''} onChange={(e) => setForm({ ...form, keyDates: { ...form.keyDates, closingDate: e.target.value } })} /></div>
      </div>
      <div><label className="block text-sm font-medium text-brand-navy mb-2">Notes</label><textarea rows={3} className="input-field resize-none" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
      <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /><label htmlFor="active" className="text-sm">Active Deal</label></div>
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {saving ? 'Saving...' : 'Save Deal'}</button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// SITE SETTINGS TAB
// ════════════════════════════════════════════════════════════════════════════════

function SiteSettingsTab({ settings, loading, onSave, saving }: { settings: SiteSettings | null; loading: boolean; onSave: (s: SiteSettings) => Promise<void>; saving: boolean }) {
  const [form, setForm] = useState<SiteSettings>(settings || {
    heroHeadline: '', heroSubheadline: '', heroMediaType: 'images', agentName: '', agentTitle: '', phone: '', email: '', address: ''
  })
  const [tab, setTab] = useState('hero')

  useEffect(() => { if (settings) setForm(settings) }, [settings])

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  const tabs = [{ id: 'hero', label: 'Hero Section', icon: ImageIcon }, { id: 'about', label: 'About', icon: Users }, { id: 'contact', label: 'Contact', icon: Phone }, { id: 'social', label: 'Social', icon: Globe }]

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-t transition-colors ${tab === t.id ? 'bg-brand-gold text-brand-navy' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}><t.icon size={16} />{t.label}</button>
        ))}
      </div>

      {tab === 'hero' && (
        <div className="bg-white p-6 border rounded-xl space-y-4">
          <h3 className="font-display text-lg text-brand-navy">Hero Section</h3>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Headline</label><input type="text" className="input-field" value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Subheadline</label><textarea rows={2} className="input-field resize-none" value={form.heroSubheadline} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} /></div>
          <p className="text-sm text-neutral-500">Hero images are managed through the public/images folder. Upload new hero images there.</p>
        </div>
      )}

      {tab === 'about' && (
        <div className="bg-white p-6 border rounded-xl space-y-4">
          <h3 className="font-display text-lg text-brand-navy">About Section</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Agent Name</label><input type="text" className="input-field" value={form.agentName} onChange={(e) => setForm({ ...form, agentName: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Title</label><input type="text" className="input-field" value={form.agentTitle} onChange={(e) => setForm({ ...form, agentTitle: e.target.value })} /></div>
          </div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">About Text</label><textarea rows={6} className="input-field resize-none" value={form.aboutText || ''} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} /></div>
          <ImageUpload currentImage={form.agentPhoto} label="Agent Photo" onUpload={(assetId, url) => setForm({ ...form, agentPhotoAssetId: assetId, agentPhoto: url })} />
        </div>
      )}

      {tab === 'contact' && (
        <div className="bg-white p-6 border rounded-xl space-y-4">
          <h3 className="font-display text-lg text-brand-navy">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Phone</label><input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-brand-navy mb-2">Email</label><input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Address</label><input type="text" className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        </div>
      )}

      {tab === 'social' && (
        <div className="bg-white p-6 border rounded-xl space-y-4">
          <h3 className="font-display text-lg text-brand-navy">Social Media</h3>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Instagram</label><input type="url" className="input-field" value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">Facebook</label><input type="url" className="input-field" value={form.facebook || ''} onChange={(e) => setForm({ ...form, facebook: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-brand-navy mb-2">LinkedIn</label><input type="url" className="input-field" value={form.linkedin || ''} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => onSave(form)} className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState({ n: true, p: true, d: true, s: true })
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    fetch('/api/neighborhoods').then(r => r.json()).then(d => { setNeighborhoods(d || []); setLoading(l => ({ ...l, n: false })) }).catch(() => setLoading(l => ({ ...l, n: false })))
    fetch('/api/properties').then(r => r.json()).then(d => { setProperties(d || []); setLoading(l => ({ ...l, p: false })) }).catch(() => setLoading(l => ({ ...l, p: false })))
    fetch('/api/deals').then(r => r.json()).then(d => { setDeals(d || []); setLoading(l => ({ ...l, d: false })) }).catch(() => setLoading(l => ({ ...l, d: false })))
    fetch('/api/settings').then(r => r.json()).then(d => { setSettings(d || null); setLoading(l => ({ ...l, s: false })) }).catch(() => setLoading(l => ({ ...l, s: false })))
  }

  const seed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/seed?type=all', { method: 'POST' })
      const data = await res.json()
      setToast({ message: 'Data loaded successfully!', type: 'success' })
      fetchAll()
    } catch (e) {
      setToast({ message: 'Failed to load data', type: 'error' })
    } finally {
      setSeeding(false)
    }
  }

  const saveNeighborhood = async (n: Neighborhood) => {
    setSaving(true)
    try {
      const res = await fetch('/api/neighborhoods', { method: n._id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(n) })
      if (!res.ok) throw new Error()
      setToast({ message: 'Neighborhood saved!', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to save', type: 'error' }) }
    finally { setSaving(false) }
  }

  const deleteNeighborhood = async (id: string) => {
    try {
      await fetch(`/api/neighborhoods?id=${id}`, { method: 'DELETE' })
      setToast({ message: 'Deleted', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to delete', type: 'error' }) }
  }

  const saveProperty = async (p: Property) => {
    setSaving(true)
    try {
      await fetch('/api/properties', { method: p._id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
      setToast({ message: 'Property saved!', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to save', type: 'error' }) }
    finally { setSaving(false) }
  }

  const deleteProperty = async (id: string) => {
    try {
      await fetch(`/api/properties?id=${id}`, { method: 'DELETE' })
      setToast({ message: 'Deleted', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to delete', type: 'error' }) }
  }

  const saveDeal = async (d: Deal) => {
    setSaving(true)
    try {
      await fetch('/api/deals', { method: d._id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      setToast({ message: 'Deal saved!', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to save', type: 'error' }) }
    finally { setSaving(false) }
  }

  const deleteDeal = async (id: string) => {
    try {
      await fetch(`/api/deals?id=${id}`, { method: 'DELETE' })
      setToast({ message: 'Deleted', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to delete', type: 'error' }) }
  }

  const saveSettings = async (s: SiteSettings) => {
    setSaving(true)
    try {
      await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
      setToast({ message: 'Settings saved!', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed to save', type: 'error' }) }
    finally { setSaving(false) }
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
      <header className="bg-brand-navy text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl hover:text-brand-gold">Merrav Berko</Link>
            <span className="text-white/40">|</span>
            <span className="text-white/70 text-sm">Back Office</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/70 hover:text-white text-sm hidden sm:block">View Website →</Link>
            <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full" title="Logout"><LogOut size={20} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-brand-navy text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50 border'}`}><t.icon size={18} />{t.label}</button>
          ))}
        </div>

        {activeTab === 'dashboard' && <DashboardTab properties={properties} deals={deals} neighborhoods={neighborhoods} onSeed={seed} seeding={seeding} />}
        {activeTab === 'properties' && <PropertiesTab properties={properties} loading={loading.p} onSave={saveProperty} onDelete={deleteProperty} saving={saving} />}
        {activeTab === 'neighborhoods' && <NeighborhoodsTab neighborhoods={neighborhoods} loading={loading.n} onSave={saveNeighborhood} onDelete={deleteNeighborhood} saving={saving} />}
        {activeTab === 'deals' && <DealsTab deals={deals} loading={loading.d} onSave={saveDeal} onDelete={deleteDeal} saving={saving} />}
        {activeTab === 'settings' && <SiteSettingsTab settings={settings} loading={loading.s} onSave={saveSettings} saving={saving} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => { if (localStorage.getItem('admin_logged_in') === 'true') setIsLoggedIn(true) }, [])
  const handleLogout = () => { localStorage.removeItem('admin_logged_in'); setIsLoggedIn(false) }
  if (!isLoggedIn) return <LoginForm onLogin={() => setIsLoggedIn(true)} />
  return <AdminDashboard onLogout={handleLogout} />
}
