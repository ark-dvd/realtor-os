'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Lock, Home, FileText, Settings, LogOut, Plus, Search, Edit, Trash2, 
  MapPin, TrendingUp, Save, X, Upload, Star, GraduationCap, ChevronRight,
  Building2, Image as ImageIcon, Phone, Loader2, RefreshCw, Calendar,
  AlertCircle, CheckCircle
} from 'lucide-react'
import { useNetlifyAuth, authFetch } from '@/lib/auth/use-netlify-auth'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

interface Neighborhood {
  _id?: string; name: string; slug: string; tagline: string; vibe: string
  description: string; population?: string; commute?: { toDowntown?: string; toDomain?: string }
  schoolDistrict?: string; schools?: { _key?: string; name: string; type: string; rating: number }[]
  whyPeopleLove?: string[]; highlights?: { _key?: string; name: string; description: string }[]
  avgPrice: string; image?: string; imageAssetId?: string; order?: number; isActive?: boolean
}

interface Property {
  _id?: string; title: string; slug: string; status: string; price: number
  address?: { street?: string; city?: string; state?: string; zip?: string }
  beds?: number; baths?: number; sqft?: number; heroImage?: string; heroImageAssetId?: string
  shortDescription?: string; features?: string[]
}

interface Deal {
  _id?: string; clientName: string; clientEmail: string; clientPhone?: string
  dealType: 'buying' | 'selling'; propertyAddress?: string; price?: number
  transactionStage: number; keyDates?: { contractDate?: string; closingDate?: string }
  notes?: string; isActive: boolean
}

interface SiteSettings {
  _id?: string; heroHeadline?: string; heroSubheadline?: string
  agentName?: string; agentTitle?: string; agentPhoto?: string; agentPhotoAssetId?: string
  aboutText?: string; phone?: string; email?: string; address?: string
  instagram?: string; facebook?: string; linkedin?: string
}

// ════════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════════════════════════

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p || 0)
const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'
const STAGES = ['', 'Contract Signed', 'Option Period', 'Inspection', 'Appraisal', 'Financing', 'Title Work', 'Final Walk', 'Closing']
const STATUS_STYLES: Record<string, string> = { 'for-sale': 'bg-green-100 text-green-700', 'pending': 'bg-amber-100 text-amber-700', 'sold': 'bg-blue-100 text-blue-700' }

// ════════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
    </div>
  )
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl my-8 rounded-lg shadow-xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between rounded-t-lg z-10">
          <h2 className="font-display text-xl text-brand-navy">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ImageUpload({ currentImage, onUpload, label, getToken }: { currentImage?: string; onUpload: (assetId: string, url: string) => void; label?: string; getToken: () => Promise<string | null> }) {
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
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData })
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
      {label && <label className="block text-sm font-medium text-brand-navy mb-2">{label}</label>}
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
// LOGIN SCREEN
// ════════════════════════════════════════════════════════════════════════════════

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 rounded-full bg-brand-navy mx-auto flex items-center justify-center mb-4">
          <Lock className="text-brand-gold" size={28} />
        </div>
        <h1 className="font-display text-2xl text-brand-navy mb-2">Back Office</h1>
        <p className="text-neutral-500 mb-6">Merrav Berko Real Estate</p>
        <button onClick={onLogin} className="btn-gold w-full justify-center">
          Sign In with Netlify Identity
        </button>
        <p className="text-xs text-neutral-400 mt-4">
          Secure authentication powered by Netlify Identity
        </p>
        <div className="mt-6 pt-6 border-t">
          <Link href="/" className="text-brand-gold hover:underline text-sm">← Back to Website</Link>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ════════════════════════════════════════════════════════════════════════════════

function DashboardTab({ properties, deals, neighborhoods, onSeed, seeding, getToken }: { properties: Property[]; deals: Deal[]; neighborhoods: Neighborhood[]; onSeed: () => void; seeding: boolean; getToken: () => Promise<string | null> }) {
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
          <p className="text-amber-700 mb-4">Your database is empty. Load sample data to get started.</p>
          <button onClick={onSeed} disabled={seeding} className="btn-gold">
            {seeding ? <><Loader2 className="animate-spin" size={18} /> Loading...</> : <><RefreshCw size={18} /> Load Sample Data</>}
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
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// PROPERTIES TAB
// ════════════════════════════════════════════════════════════════════════════════

function PropertiesTab({ properties, loading, onSave, onDelete, saving, getToken }: { properties: Property[]; loading: boolean; onSave: (p: Property) => Promise<void>; onDelete: (id: string) => Promise<void>; saving: boolean; getToken: () => Promise<string | null> }) {
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

      <div className="bg-white border rounded-xl overflow-hidden">
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
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-neutral-50">
                <td className="px-6 py-4"><p className="font-medium text-brand-navy">{p.title}</p></td>
                <td className="px-6 py-4 font-display">{formatPrice(p.price)}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[p.status] || ''}`}>{p.status}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setEditing(p); setShowForm(true) }} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button>
                  <button onClick={() => p._id && confirm('Delete?') && onDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-neutral-500 text-center py-8">No properties</p>}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Property' : 'Add Property'}>
        <PropertyForm property={editing} saving={saving} onSave={async (p) => { await onSave(p); setShowForm(false) }} onCancel={() => setShowForm(false)} getToken={getToken} />
      </Modal>
    </div>
  )
}

function PropertyForm({ property, saving, onSave, onCancel, getToken }: { property: Property | null; saving: boolean; onSave: (p: Property) => Promise<void>; onCancel: () => void; getToken: () => Promise<string | null> }) {
  const [form, setForm] = useState<Property>(property || { title: '', slug: '', status: 'for-sale', price: 0 })
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...form, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-') }) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Title *</label><input type="text" required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Price *</label><input type="number" required className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Beds</label><input type="number" className="input-field" value={form.beds || ''} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium mb-2">Baths</label><input type="number" step="0.5" className="input-field" value={form.baths || ''} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium mb-2">Sqft</label><input type="number" className="input-field" value={form.sqft || ''} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium mb-2">Status</label><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="for-sale">For Sale</option><option value="pending">Pending</option><option value="sold">Sold</option></select></div>
      </div>
      <ImageUpload currentImage={form.heroImage} label="Hero Image" onUpload={(assetId, url) => setForm({ ...form, heroImageAssetId: assetId, heroImage: url })} getToken={getToken} />
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// NEIGHBORHOODS TAB (Simplified for brevity)
// ════════════════════════════════════════════════════════════════════════════════

function NeighborhoodsTab({ neighborhoods, loading, onSave, onDelete, saving, getToken }: { neighborhoods: Neighborhood[]; loading: boolean; onSave: (n: Neighborhood) => Promise<void>; onDelete: (id: string) => Promise<void>; saving: boolean; getToken: () => Promise<string | null> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Neighborhood | null>(null)

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Neighborhoods ({neighborhoods.length})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-gold"><Plus size={18} /> Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighborhoods.map(n => (
          <div key={n._id} className="bg-white border rounded-xl overflow-hidden">
            <div className="relative h-32 bg-neutral-200">
              {n.image && <Image src={n.image} alt={n.name} fill className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3"><h3 className="font-display text-lg text-white">{n.name}</h3></div>
            </div>
            <div className="p-4">
              <p className="text-sm text-neutral-500 mb-3">{n.avgPrice}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(n); setShowForm(true) }} className="btn-secondary flex-1 py-2 text-sm"><Edit size={14} /> Edit</button>
                <button onClick={() => n._id && confirm('Delete?') && onDelete(n._id)} className="p-2 border border-red-200 text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Neighborhood' : 'Add Neighborhood'}>
        <NeighborhoodForm neighborhood={editing} saving={saving} onSave={async (n) => { await onSave(n); setShowForm(false) }} onCancel={() => setShowForm(false)} getToken={getToken} />
      </Modal>
    </div>
  )
}

function NeighborhoodForm({ neighborhood, saving, onSave, onCancel, getToken }: { neighborhood: Neighborhood | null; saving: boolean; onSave: (n: Neighborhood) => Promise<void>; onCancel: () => void; getToken: () => Promise<string | null> }) {
  const [form, setForm] = useState<Neighborhood>(neighborhood || { name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '' })
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-') }) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Name *</label><input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Avg Price *</label><input type="text" required className="input-field" value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} /></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Tagline *</label><input type="text" required className="input-field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Vibe *</label><textarea rows={2} required className="input-field" value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Description *</label><textarea rows={3} required className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <ImageUpload currentImage={form.image} label="Image" onUpload={(assetId, url) => setForm({ ...form, imageAssetId: assetId, image: url })} getToken={getToken} />
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// DEALS TAB
// ════════════════════════════════════════════════════════════════════════════════

function DealsTab({ deals, loading, onSave, saving, getToken }: { deals: Deal[]; loading: boolean; onSave: (d: Deal) => Promise<void>; saving: boolean; getToken: () => Promise<string | null> }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Deal | null>(null)

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl">Active Deals ({deals.filter(d => d.isActive).length})</h2>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="btn-gold"><Plus size={18} /> New Deal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.filter(d => d.isActive).map(d => (
          <div key={d._id} className="bg-white p-6 border rounded-xl">
            <div className="flex justify-between mb-2">
              <p className="font-display text-lg text-brand-navy">{d.clientName}</p>
              <span className={`text-xs px-2 py-1 rounded ${d.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{d.dealType}</span>
            </div>
            <p className="text-sm text-neutral-500 mb-2">{d.propertyAddress}</p>
            <p className="font-display text-xl text-brand-gold mb-4">{formatPrice(d.price || 0)}</p>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-neutral-500 mb-1"><span>{STAGES[d.transactionStage]}</span><span>{d.transactionStage}/8</span></div>
              <div className="h-2 bg-neutral-200 rounded-full"><div className="h-full bg-brand-gold rounded-full" style={{ width: `${(d.transactionStage / 8) * 100}%` }} /></div>
            </div>
            <button onClick={() => { setEditing(d); setShowForm(true) }} className="btn-secondary w-full py-2 text-sm"><Edit size={14} /> Edit</button>
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Deal' : 'New Deal'}>
        <DealForm deal={editing} saving={saving} onSave={async (d) => { await onSave(d); setShowForm(false) }} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}

function DealForm({ deal, saving, onSave, onCancel }: { deal: Deal | null; saving: boolean; onSave: (d: Deal) => Promise<void>; onCancel: () => void }) {
  const [form, setForm] = useState<Deal>(deal || { clientName: '', clientEmail: '', dealType: 'buying', transactionStage: 1, isActive: true })
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Client Name *</label><input type="text" required className="input-field" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" required className="input-field" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Type</label><select className="input-field" value={form.dealType} onChange={(e) => setForm({ ...form, dealType: e.target.value as 'buying' | 'selling' })}><option value="buying">Buying</option><option value="selling">Selling</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Price</label><input type="number" className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
        <div><label className="block text-sm font-medium mb-2">Stage</label><select className="input-field" value={form.transactionStage} onChange={(e) => setForm({ ...form, transactionStage: Number(e.target.value) })}>{STAGES.slice(1).map((s, i) => <option key={i + 1} value={i + 1}>{i + 1}. {s}</option>)}</select></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Property Address</label><input type="text" className="input-field" value={form.propertyAddress || ''} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} /></div>
      <div className="flex gap-4 justify-end pt-4 border-t">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ════════════════════════════════════════════════════════════════════════════════

function SettingsTab({ settings, loading, onSave, saving, getToken }: { settings: SiteSettings | null; loading: boolean; onSave: (s: SiteSettings) => Promise<void>; saving: boolean; getToken: () => Promise<string | null> }) {
  const [form, setForm] = useState<SiteSettings>(settings || {})
  useEffect(() => { if (settings) setForm(settings) }, [settings])

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">Agent Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Name</label><input type="text" className="input-field" value={form.agentName || ''} onChange={(e) => setForm({ ...form, agentName: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" className="input-field" value={form.agentTitle || ''} onChange={(e) => setForm({ ...form, agentTitle: e.target.value })} /></div>
        </div>
        <ImageUpload currentImage={form.agentPhoto} label="Agent Photo" onUpload={(assetId, url) => setForm({ ...form, agentPhotoAssetId: assetId, agentPhoto: url })} getToken={getToken} />
      </div>

      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Phone</label><input type="tel" className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-2">Email</label><input type="email" className="input-field" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        </div>
        <div><label className="block text-sm font-medium mb-2">Address</label><input type="text" className="input-field" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => onSave(form)} className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Settings</button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════

function AdminDashboard({ onLogout, getToken, userEmail }: { onLogout: () => void; getToken: () => Promise<string | null>; userEmail?: string }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState({ n: true, p: true, d: true, s: true })
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchWithAuth = async (url: string) => {
    const token = await getToken()
    if (!token) throw new Error('Not authenticated')
    return fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
  }

  const fetchAll = async () => {
    try {
      const [nRes, pRes, dRes, sRes] = await Promise.all([
        fetchWithAuth('/api/admin/neighborhoods'),
        fetchWithAuth('/api/admin/properties'),
        fetchWithAuth('/api/admin/deals'),
        fetchWithAuth('/api/admin/settings'),
      ])
      if (nRes.ok) setNeighborhoods(await nRes.json())
      if (pRes.ok) setProperties(await pRes.json())
      if (dRes.ok) setDeals(await dRes.json())
      if (sRes.ok) setSettings(await sRes.json())
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      setLoading({ n: false, p: false, d: false, s: false })
    }
  }

  useEffect(() => { fetchAll() }, [])

  const seed = async () => {
    setSeeding(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/seed?type=all', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        setToast({ message: 'Data loaded!', type: 'success' })
        fetchAll()
      } else {
        const data = await res.json()
        setToast({ message: data.error || 'Failed', type: 'error' })
      }
    } catch { setToast({ message: 'Failed to seed', type: 'error' }) }
    finally { setSeeding(false) }
  }

  const saveEntity = async (endpoint: string, data: unknown, method: 'POST' | 'PUT') => {
    setSaving(true)
    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/${endpoint}`, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) { setToast({ message: 'Saved!', type: 'success' }); fetchAll() }
      else { const d = await res.json(); setToast({ message: d.error || 'Failed', type: 'error' }) }
    } catch { setToast({ message: 'Failed', type: 'error' }) }
    finally { setSaving(false) }
  }

  const deleteEntity = async (endpoint: string, id: string) => {
    try {
      const token = await getToken()
      await fetch(`/api/admin/${endpoint}?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      setToast({ message: 'Deleted', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed', type: 'error' }) }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'neighborhoods', label: 'Neighborhoods', icon: MapPin },
    { id: 'deals', label: 'Deals', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
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
            {userEmail && <span className="text-white/70 text-sm hidden sm:block">{userEmail}</span>}
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

        {activeTab === 'dashboard' && <DashboardTab properties={properties} deals={deals} neighborhoods={neighborhoods} onSeed={seed} seeding={seeding} getToken={getToken} />}
        {activeTab === 'properties' && <PropertiesTab properties={properties} loading={loading.p} onSave={(p) => saveEntity('properties', p, p._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('properties', id)} saving={saving} getToken={getToken} />}
        {activeTab === 'neighborhoods' && <NeighborhoodsTab neighborhoods={neighborhoods} loading={loading.n} onSave={(n) => saveEntity('neighborhoods', n, n._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('neighborhoods', id)} saving={saving} getToken={getToken} />}
        {activeTab === 'deals' && <DealsTab deals={deals} loading={loading.d} onSave={(d) => saveEntity('deals', d, d._id ? 'PUT' : 'POST')} saving={saving} getToken={getToken} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} loading={loading.s} onSave={(s) => saveEntity('settings', s, 'PUT')} saving={saving} getToken={getToken} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const { user, loading, isAuthenticated, login, logout, getToken } = useNetlifyAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />
  }

  return <AdminDashboard onLogout={logout} getToken={getToken} userEmail={user?.email} />
}
