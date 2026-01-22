'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Lock, Home, FileText, Settings, LogOut, Plus, Search, Edit, Trash2, 
  MapPin, TrendingUp, Save, X, Upload, Loader2, RefreshCw, AlertCircle, 
  CheckCircle, GraduationCap, Star, ImageIcon, ChevronDown, ChevronUp
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════

const ADMIN_PASSWORD = 'Peace&Love202^'

function useSimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session')
    if (session === 'authenticated') setIsAuthenticated(true)
    setLoading(false)
  }, [])

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_session', 'authenticated')
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem('admin_session')
    setIsAuthenticated(false)
  }

  const getToken = async (): Promise<string | null> => {
    if (isAuthenticated) return btoa(ADMIN_PASSWORD)
    return null
  }

  return { isAuthenticated, loading, login, logout, getToken }
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface School { _key?: string; name: string; type: string; rating: number; note?: string }
interface Highlight { _key?: string; name: string; description: string }
interface HeroImage { _key?: string; url: string; alt?: string; assetId?: string }
interface Stat { _key?: string; value: string; label: string }

interface Neighborhood { 
  _id?: string; name: string; slug: string; tagline: string; vibe: string; description: string; 
  population?: string; commute?: { toDowntown?: string; toDomain?: string }; schoolDistrict?: string; 
  schools?: School[]; whyPeopleLove?: string[]; highlights?: Highlight[]; avgPrice: string; 
  image?: string; imageAssetId?: string; order?: number; isActive?: boolean 
}

interface Property { 
  _id?: string; title: string; slug: string; status: string; price: number; 
  address?: { street?: string; city?: string; state?: string; zip?: string }; 
  neighborhoodId?: string; neighborhoodName?: string;
  beds?: number; baths?: number; sqft?: number; lotSize?: number; yearBuilt?: number; garage?: number;
  mlsNumber?: string; heroImage?: string; heroImageAssetId?: string; shortDescription?: string; features?: string[] 
}

interface Deal { 
  _id?: string; clientName: string; clientEmail: string; clientPhone?: string; 
  dealType: 'buying' | 'selling'; propertyAddress?: string; price?: number; 
  transactionStage: number; keyDates?: { contractDate?: string; optionExpiry?: string; closingDate?: string }; 
  notes?: string; isActive: boolean 
}

interface SiteSettings { 
  _id?: string; siteTitle?: string; heroHeadline?: string; heroSubheadline?: string; 
  heroMediaType?: string; heroImages?: HeroImage[]; heroVideoUrl?: string;
  agentName?: string; agentTitle?: string; agentPhoto?: string; agentPhotoAssetId?: string; 
  aboutHeadline?: string; aboutText?: string; aboutStats?: Stat[];
  phone?: string; email?: string; address?: string; officeHours?: string;
  instagram?: string; facebook?: string; linkedin?: string; youtube?: string 
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p || 0)
const STAGES = ['', 'Contract Signed', 'Option Period', 'Inspection', 'Appraisal', 'Financing', 'Title Work', 'Final Walk', 'Closing']
const STATUS_STYLES: Record<string, string> = { 'for-sale': 'bg-green-100 text-green-700', 'pending': 'bg-amber-100 text-amber-700', 'sold': 'bg-blue-100 text-blue-700' }
const genKey = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white max-w-md`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1"><X size={16} /></button>
    </div>
  )
}

function Modal({ isOpen, onClose, title, children, size = 'lg' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' }) {
  if (!isOpen) return null
  const maxW = size === 'xl' ? 'max-w-6xl' : size === 'lg' ? 'max-w-4xl' : 'max-w-2xl'
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white w-full ${maxW} my-8 rounded-lg shadow-xl`}>
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between rounded-t-lg z-10">
          <h2 className="font-display text-xl text-brand-navy">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
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
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    
    setUploading(true)
    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData })
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed')
      const data = await res.json()
      onUpload(data.assetId, data.url)
    } catch (err) { 
      alert(err instanceof Error ? err.message : 'Failed')
      setPreview(currentImage) 
    } finally { 
      setUploading(false) 
    }
  }
  
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label || 'Image'}</label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center border">
          {preview ? (
            <Image src={preview} alt="" width={128} height={128} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="text-neutral-400" size={32} />
          )}
        </div>
        <div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-secondary">
            {uploading ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : <><Upload size={16} /> Choose Image</>}
          </button>
          {preview && (
            <button type="button" onClick={() => { setPreview(''); onUpload('', '') }} className="block mt-2 text-sm text-red-500 hover:text-red-700">
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border rounded-lg">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left font-medium text-brand-navy hover:bg-neutral-50">
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="p-4 pt-0 border-t">{children}</div>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════════════════

function LoginScreen({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (!onLogin(password)) {
        setError('Invalid password')
        setPassword('')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-brand-gold" size={28} />
        </div>
        <h1 className="font-display text-2xl text-brand-navy mb-2">Back Office</h1>
        <p className="text-neutral-500 mb-8">Merrav Berko Real Estate</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full text-center" autoFocus />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading || !password} className="btn-gold w-full justify-center">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-brand-gold hover:text-brand-gold/80 text-sm">← Back to Website</Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ═══════════════════════════════════════════════════════════════════════════

function DashboardTab({ properties, deals, neighborhoods, onSeed, seeding }: { properties: Property[]; deals: Deal[]; neighborhoods: Neighborhood[]; onSeed: () => void; seeding: boolean }) {
  const activeDeals = deals.filter(d => d.isActive)
  const totalValue = activeDeals.reduce((sum, d) => sum + (d.price || 0), 0)
  
  const stats = [
    { label: 'Active Listings', value: properties.filter(p => p.status === 'for-sale').length, color: 'bg-green-500' },
    { label: 'Pending', value: properties.filter(p => p.status === 'pending').length, color: 'bg-amber-500' },
    { label: 'Active Deals', value: activeDeals.length, color: 'bg-blue-500' },
    { label: 'Pipeline Value', value: formatPrice(totalValue), color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-xl border">
            <div className={`w-3 h-3 rounded-full ${s.color} mb-3`} />
            <div className="text-2xl font-semibold text-brand-navy">{s.value}</div>
            <div className="text-neutral-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-display text-lg text-brand-navy mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-neutral-600">Neighborhoods</span><span className="font-medium">{neighborhoods.length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Total Properties</span><span className="font-medium">{properties.length}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Sold This Year</span><span className="font-medium">{properties.filter(p => p.status === 'sold').length}</span></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-display text-lg text-brand-navy mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={onSeed} disabled={seeding} className="btn-secondary w-full justify-center">
              {seeding ? <><Loader2 className="animate-spin" size={16} /> Loading...</> : <><RefreshCw size={16} /> Load Demo Data</>}
            </button>
            <p className="text-sm text-neutral-500">Populates neighborhoods with Austin data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES TAB
// ═══════════════════════════════════════════════════════════════════════════

function PropertiesTab({ properties, neighborhoods, loading, onSave, onDelete, saving, getToken }: { 
  properties: Property[]; neighborhoods: Neighborhood[]; loading: boolean; 
  onSave: (p: Property) => Promise<void>; onDelete: (id: string) => void; saving: boolean; 
  getToken: () => Promise<string | null> 
}) {
  const [modal, setModal] = useState<{ open: boolean; property?: Property }>({ open: false })
  const [form, setForm] = useState<Property>({ title: '', slug: '', status: 'for-sale', price: 0 })
  const [search, setSearch] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
    if (modal.property) {
      setForm(modal.property)
      setFeatures(modal.property.features || [])
    } else {
      setForm({ title: '', slug: '', status: 'for-sale', price: 0, address: { city: 'Austin', state: 'TX' } })
      setFeatures([])
    }
  }, [modal])

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    await onSave({ ...form, features })
    setModal({ open: false })
  }

  const filtered = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input type="text" placeholder="Search properties..." className="input-field pl-10 w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add Property</button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Property</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.heroImage && <Image src={p.heroImage} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded" />}
                    <div>
                      <div className="font-medium text-brand-navy">{p.title}</div>
                      <div className="text-sm text-neutral-500">{p.beds} bed • {p.baths} bath • {p.sqft?.toLocaleString()} sqft</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[p.status] || 'bg-neutral-100'}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setModal({ open: true, property: p })} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button>
                  <button onClick={() => p._id && confirm('Delete this property?') && onDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="p-8 text-center text-neutral-500">No properties found</div>}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.property ? 'Edit Property' : 'Add Property'} size="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input type="text" required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="for-sale">For Sale</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="off-market">Off Market</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <input type="number" required className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Beds</label>
              <input type="number" className="input-field" value={form.beds || ''} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Baths</label>
              <input type="number" step="0.5" className="input-field" value={form.baths || ''} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sqft</label>
              <input type="number" className="input-field" value={form.sqft || ''} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} />
            </div>
          </div>

          <Accordion title="Address & Location">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Street Address</label>
                <input type="text" className="input-field" value={form.address?.street || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input type="text" className="input-field" value={form.address?.city || 'Austin'} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input type="text" className="input-field" value={form.address?.state || 'TX'} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP</label>
                  <input type="text" className="input-field" value={form.address?.zip || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, zip: e.target.value } })} />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Neighborhood</label>
                <select className="input-field" value={form.neighborhoodId || ''} onChange={(e) => setForm({ ...form, neighborhoodId: e.target.value })}>
                  <option value="">Select neighborhood...</option>
                  {neighborhoods.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
                </select>
              </div>
            </div>
          </Accordion>

          <Accordion title="Additional Details">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lot Size (acres)</label>
                <input type="number" step="0.01" className="input-field" value={form.lotSize || ''} onChange={(e) => setForm({ ...form, lotSize: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Year Built</label>
                <input type="number" className="input-field" value={form.yearBuilt || ''} onChange={(e) => setForm({ ...form, yearBuilt: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Garage Spaces</label>
                <input type="number" className="input-field" value={form.garage || ''} onChange={(e) => setForm({ ...form, garage: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">MLS #</label>
                <input type="text" className="input-field" value={form.mlsNumber || ''} onChange={(e) => setForm({ ...form, mlsNumber: e.target.value })} />
              </div>
            </div>
          </Accordion>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea className="input-field" rows={2} value={form.shortDescription || ''} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief summary for property cards..." />
          </div>

          <Accordion title="Features">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" className="input-field flex-1" placeholder="Add feature..." value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                <button type="button" onClick={addFeature} className="btn-secondary"><Plus size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    {f}
                    <button type="button" onClick={() => removeFeature(i)} className="hover:text-red-500"><X size={14} /></button>
                  </span>
                ))}
              </div>
            </div>
          </Accordion>

          <ImageUpload currentImage={form.heroImage} label="Main Image" onUpload={(assetId, url) => setForm({ ...form, heroImageAssetId: assetId, heroImage: url })} getToken={getToken} />

          <div className="flex gap-4 justify-end pt-4 border-t">
            <button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// NEIGHBORHOODS TAB
// ═══════════════════════════════════════════════════════════════════════════

function NeighborhoodsTab({ neighborhoods, loading, onSave, onDelete, saving, getToken }: { 
  neighborhoods: Neighborhood[]; loading: boolean; 
  onSave: (n: Neighborhood) => Promise<void>; onDelete: (id: string) => void; saving: boolean;
  getToken: () => Promise<string | null>
}) {
  const [modal, setModal] = useState<{ open: boolean; neighborhood?: Neighborhood }>({ open: false })
  const [form, setForm] = useState<Neighborhood>({ name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '' })
  const [schools, setSchools] = useState<School[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [whyLove, setWhyLove] = useState<string[]>([])

  useEffect(() => {
    if (modal.neighborhood) {
      setForm(modal.neighborhood)
      setSchools(modal.neighborhood.schools || [])
      setHighlights(modal.neighborhood.highlights || [])
      setWhyLove(modal.neighborhood.whyPeopleLove || [])
    } else {
      setForm({ name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '', isActive: true })
      setSchools([])
      setHighlights([])
      setWhyLove([])
    }
  }, [modal])

  const addSchool = () => setSchools([...schools, { _key: genKey(), name: '', type: 'Elementary', rating: 5 }])
  const updateSchool = (index: number, field: keyof School, value: string | number) => {
    const updated = [...schools]
    updated[index] = { ...updated[index], [field]: value }
    setSchools(updated)
  }
  const removeSchool = (index: number) => setSchools(schools.filter((_, i) => i !== index))

  const addHighlight = () => setHighlights([...highlights, { _key: genKey(), name: '', description: '' }])
  const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
    const updated = [...highlights]
    updated[index] = { ...updated[index], [field]: value }
    setHighlights(updated)
  }
  const removeHighlight = (index: number) => setHighlights(highlights.filter((_, i) => i !== index))

  const addWhyLove = () => setWhyLove([...whyLove, ''])
  const updateWhyLove = (index: number, value: string) => {
    const updated = [...whyLove]
    updated[index] = value
    setWhyLove(updated)
  }
  const removeWhyLove = (index: number) => setWhyLove(whyLove.filter((_, i) => i !== index))

  const handleSave = async () => {
    await onSave({ ...form, schools, highlights, whyPeopleLove: whyLove })
    setModal({ open: false })
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">Neighborhoods ({neighborhoods.length})</h2>
        <button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {neighborhoods.map(n => (
          <div key={n._id} className="bg-white rounded-xl border overflow-hidden">
            <div className="h-32 bg-neutral-200 relative">
              {n.image && <Image src={n.image} alt={n.name} fill className="object-cover" />}
              {n.isActive === false && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-medium">Hidden</span></div>}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg text-brand-navy">{n.name}</h3>
                <span className="text-brand-gold font-medium text-sm">{n.avgPrice}</span>
              </div>
              <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{n.tagline}</p>
              {n.schools && n.schools.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-neutral-400 mb-3">
                  <GraduationCap size={12} />
                  {n.schools.length} schools
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setModal({ open: true, neighborhood: n })} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button>
                <button onClick={() => n._id && confirm('Delete this neighborhood?') && onDelete(n._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {neighborhoods.length === 0 && (
        <div className="bg-white rounded-xl border p-8 text-center text-neutral-500">
          No neighborhoods yet. Click &quot;Load Demo Data&quot; in Dashboard to add Austin neighborhoods.
        </div>
      )}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.neighborhood ? 'Edit Neighborhood' : 'Add Neighborhood'} size="xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Avg Price *</label>
              <input type="text" required className="input-field" placeholder="$500K - $700K" value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline *</label>
            <input type="text" required className="input-field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short catchy description..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Vibe / Atmosphere *</label>
            <textarea className="input-field" rows={2} value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} placeholder="Describe the feel of the neighborhood..." />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea required className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <Accordion title="Location Details">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">School District</label>
                <input type="text" className="input-field" value={form.schoolDistrict || ''} onChange={(e) => setForm({ ...form, schoolDistrict: e.target.value })} placeholder="e.g., Austin ISD" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Population</label>
                <input type="text" className="input-field" value={form.population || ''} onChange={(e) => setForm({ ...form, population: e.target.value })} placeholder="e.g., ~13,000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Commute to Downtown</label>
                <input type="text" className="input-field" value={form.commute?.toDowntown || ''} onChange={(e) => setForm({ ...form, commute: { ...form.commute, toDowntown: e.target.value } })} placeholder="e.g., 5-10 mins" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Commute to The Domain</label>
                <input type="text" className="input-field" value={form.commute?.toDomain || ''} onChange={(e) => setForm({ ...form, commute: { ...form.commute, toDomain: e.target.value } })} placeholder="e.g., 20-30 mins" />
              </div>
            </div>
          </Accordion>

          <Accordion title={`Schools (${schools.length})`}>
            <div className="space-y-4">
              {schools.map((school, index) => (
                <div key={school._key || index} className="grid grid-cols-12 gap-2 items-start p-3 bg-neutral-50 rounded-lg">
                  <input type="text" className="input-field col-span-4" placeholder="School name" value={school.name} onChange={(e) => updateSchool(index, 'name', e.target.value)} />
                  <select className="input-field col-span-3" value={school.type} onChange={(e) => updateSchool(index, 'type', e.target.value)}>
                    <option value="Elementary">Elementary</option>
                    <option value="Middle">Middle</option>
                    <option value="High School">High School</option>
                  </select>
                  <div className="col-span-2 flex items-center gap-1">
                    <Star size={14} className="text-brand-gold" />
                    <input type="number" min="1" max="10" className="input-field w-16" value={school.rating} onChange={(e) => updateSchool(index, 'rating', Number(e.target.value))} />
                  </div>
                  <input type="text" className="input-field col-span-2" placeholder="Note" value={school.note || ''} onChange={(e) => updateSchool(index, 'note', e.target.value)} />
                  <button type="button" onClick={() => removeSchool(index)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={addSchool} className="btn-secondary w-full"><Plus size={16} /> Add School</button>
            </div>
          </Accordion>

          <Accordion title={`Why People Love It (${whyLove.length})`}>
            <div className="space-y-3">
              {whyLove.map((reason, index) => (
                <div key={index} className="flex gap-2">
                  <textarea className="input-field flex-1" rows={2} value={reason} onChange={(e) => updateWhyLove(index, e.target.value)} placeholder="Reason people love this neighborhood..." />
                  <button type="button" onClick={() => removeWhyLove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded self-start"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={addWhyLove} className="btn-secondary w-full"><Plus size={16} /> Add Reason</button>
            </div>
          </Accordion>

          <Accordion title={`Highlights & Landmarks (${highlights.length})`}>
            <div className="space-y-3">
              {highlights.map((h, index) => (
                <div key={h._key || index} className="grid grid-cols-12 gap-2 items-start">
                  <input type="text" className="input-field col-span-4" placeholder="Place/Feature name" value={h.name} onChange={(e) => updateHighlight(index, 'name', e.target.value)} />
                  <input type="text" className="input-field col-span-7" placeholder="Description" value={h.description} onChange={(e) => updateHighlight(index, 'description', e.target.value)} />
                  <button type="button" onClick={() => removeHighlight(index)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={addHighlight} className="btn-secondary w-full"><Plus size={16} /> Add Highlight</button>
            </div>
          </Accordion>

          <div className="grid grid-cols-2 gap-4">
            <ImageUpload currentImage={form.image} label="Cover Image" onUpload={(assetId, url) => setForm({ ...form, imageAssetId: assetId, image: url })} getToken={getToken} />
            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <input type="number" className="input-field" value={form.order || ''} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="Lower = first" />
              <label className="flex items-center gap-2 mt-4">
                <input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
                <span className="text-sm">Show on website</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DEALS TAB
// ═══════════════════════════════════════════════════════════════════════════

function DealsTab({ deals, loading, onSave, saving }: { deals: Deal[]; loading: boolean; onSave: (d: Deal) => Promise<void>; saving: boolean }) {
  const [modal, setModal] = useState<{ open: boolean; deal?: Deal }>({ open: false })
  const [form, setForm] = useState<Deal>({ clientName: '', clientEmail: '', dealType: 'buying', transactionStage: 1, isActive: true })

  useEffect(() => {
    if (modal.deal) setForm(modal.deal)
    else setForm({ clientName: '', clientEmail: '', dealType: 'buying', transactionStage: 1, isActive: true })
  }, [modal])

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-brand-navy">Active Deals ({deals.filter(d => d.isActive).length})</h2>
        <button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add Deal</button>
      </div>

      <div className="space-y-3">
        {deals.map(d => (
          <div key={d._id} className="bg-white p-4 rounded-xl border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-brand-navy">{d.clientName}</h3>
                <p className="text-sm text-neutral-500">{d.propertyAddress || 'No address'}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {d.dealType}
                </span>
                {d.price && <div className="font-medium mt-1">{formatPrice(d.price)}</div>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${(d.transactionStage / 8) * 100}%` }} />
              </div>
              <span className="text-sm text-neutral-600 whitespace-nowrap">{d.transactionStage}/8 {STAGES[d.transactionStage]}</span>
              <button onClick={() => setModal({ open: true, deal: d })} className="p-2 hover:bg-neutral-100 rounded ml-2"><Edit size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {deals.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-neutral-500">No active deals</div>}

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.deal ? 'Edit Deal' : 'Add Deal'}>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form).then(() => setModal({ open: false })) }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Client Name *</label>
              <input type="text" required className="input-field" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input type="email" required className="input-field" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select className="input-field" value={form.dealType} onChange={(e) => setForm({ ...form, dealType: e.target.value as 'buying' | 'selling' })}>
                <option value="buying">Buying</option>
                <option value="selling">Selling</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input type="number" className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stage</label>
              <select className="input-field" value={form.transactionStage} onChange={(e) => setForm({ ...form, transactionStage: Number(e.target.value) })}>
                {STAGES.slice(1).map((s, i) => <option key={i + 1} value={i + 1}>{i + 1}. {s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Property Address</label>
            <input type="text" className="input-field" value={form.propertyAddress || ''} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea className="input-field" rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
            <span className="text-sm">Active deal</span>
          </label>
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════════════

function SettingsTab({ settings, loading, onSave, saving, getToken }: { settings: SiteSettings | null; loading: boolean; onSave: (s: SiteSettings) => Promise<void>; saving: boolean; getToken: () => Promise<string | null> }) {
  const [form, setForm] = useState<SiteSettings>(settings || {})
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    if (settings) {
      setForm(settings)
      setHeroImages(settings.heroImages || [])
      setStats(settings.aboutStats || [])
    }
  }, [settings])

  const addHeroImage = () => setHeroImages([...heroImages, { _key: genKey(), url: '', alt: '' }])
  const updateHeroImage = (index: number, field: keyof HeroImage, value: string) => {
    const updated = [...heroImages]
    updated[index] = { ...updated[index], [field]: value }
    setHeroImages(updated)
  }
  const removeHeroImage = (index: number) => setHeroImages(heroImages.filter((_, i) => i !== index))

  const addStat = () => setStats([...stats, { _key: genKey(), value: '', label: '' }])
  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const updated = [...stats]
    updated[index] = { ...updated[index], [field]: value }
    setStats(updated)
  }
  const removeStat = (index: number) => setStats(stats.filter((_, i) => i !== index))

  const handleSave = async () => {
    await onSave({ ...form, heroImages, aboutStats: stats })
  }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>

  return (
    <div className="max-w-4xl space-y-6">
      {/* Hero Section */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">Hero Section</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Headline</label>
          <input type="text" className="input-field" value={form.heroHeadline || ''} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} placeholder="Find Your Home in Austin" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subheadline</label>
          <textarea className="input-field" rows={2} value={form.heroSubheadline || ''} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} />
        </div>
        
        <Accordion title={`Hero Images (${heroImages.length})`} defaultOpen>
          <div className="space-y-3">
            {heroImages.map((img, index) => (
              <div key={img._key || index} className="flex gap-3 items-center p-3 bg-neutral-50 rounded-lg">
                <div className="w-20 h-14 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                  {img.url && <Image src={img.url} alt="" width={80} height={56} className="w-full h-full object-cover" />}
                </div>
                <input type="text" className="input-field flex-1" placeholder="Image URL" value={img.url} onChange={(e) => updateHeroImage(index, 'url', e.target.value)} />
                <input type="text" className="input-field w-40" placeholder="Alt text" value={img.alt || ''} onChange={(e) => updateHeroImage(index, 'alt', e.target.value)} />
                <button type="button" onClick={() => removeHeroImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addHeroImage} className="btn-secondary w-full"><Plus size={16} /> Add Hero Image</button>
            <p className="text-xs text-neutral-500">Use high-quality images (1920x1080 or larger). You can use Unsplash URLs or upload to Sanity.</p>
          </div>
        </Accordion>
      </div>

      {/* Agent Information */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">Agent Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" className="input-field" value={form.agentName || ''} onChange={(e) => setForm({ ...form, agentName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input type="text" className="input-field" value={form.agentTitle || ''} onChange={(e) => setForm({ ...form, agentTitle: e.target.value })} placeholder="REALTOR® | Austin Specialist" />
          </div>
        </div>
        <ImageUpload currentImage={form.agentPhoto} label="Agent Photo" onUpload={(assetId, url) => setForm({ ...form, agentPhotoAssetId: assetId, agentPhoto: url })} getToken={getToken} />
      </div>

      {/* About Section */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">About Section</h3>
        <div>
          <label className="block text-sm font-medium mb-2">About Headline</label>
          <input type="text" className="input-field" value={form.aboutHeadline || ''} onChange={(e) => setForm({ ...form, aboutHeadline: e.target.value })} placeholder="Meet Merrav Berko" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">About Text</label>
          <textarea className="input-field" rows={6} value={form.aboutText || ''} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} placeholder="Your bio and story... Use double line breaks for paragraphs." />
        </div>
        
        <Accordion title={`Stats (${stats.length})`}>
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={stat._key || index} className="grid grid-cols-12 gap-2 items-center">
                <input type="text" className="input-field col-span-4" placeholder="Value (e.g., 12+)" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} />
                <input type="text" className="input-field col-span-7" placeholder="Label (e.g., Years in Austin)" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} />
                <button type="button" onClick={() => removeStat(index)} className="p-2 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addStat} className="btn-secondary w-full"><Plus size={16} /> Add Stat</button>
          </div>
        </Accordion>
      </div>

      {/* Contact Info */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="input-field" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <input type="text" className="input-field" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Office Hours</label>
          <textarea className="input-field" rows={3} value={form.officeHours || ''} onChange={(e) => setForm({ ...form, officeHours: e.target.value })} placeholder="Monday - Friday: 9am - 6pm&#10;Saturday: 10am - 4pm&#10;Sunday: By appointment" />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white p-6 border rounded-xl space-y-4">
        <h3 className="font-display text-lg text-brand-navy">Social Media</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Instagram URL</label>
            <input type="url" className="input-field" value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Facebook URL</label>
            <input type="url" className="input-field" value={form.facebook || ''} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input type="url" className="input-field" value={form.linkedin || ''} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">YouTube URL</label>
            <input type="url" className="input-field" value={form.youtube || ''} onChange={(e) => setForm({ ...form, youtube: e.target.value })} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-gold" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Settings
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

function AdminDashboard({ onLogout, getToken }: { onLogout: () => void; getToken: () => Promise<string | null> }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState({ n: true, p: true, d: true, s: true })
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchWithAuth = useCallback(async (url: string) => {
    const token = await getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    if (res.status === 401 || res.status === 403) throw new Error(res.status === 403 ? 'Admin access required' : 'Auth failed')
    return res
  }, [getToken])

  const fetchAll = useCallback(async () => {
    try {
      const [nRes, pRes, dRes, sRes] = await Promise.all([
        fetchWithAuth('/api/admin/neighborhoods'),
        fetchWithAuth('/api/admin/properties'),
        fetchWithAuth('/api/admin/deals'),
        fetchWithAuth('/api/admin/settings')
      ])
      if (nRes.ok) setNeighborhoods(await nRes.json())
      if (pRes.ok) setProperties(await pRes.json())
      if (dRes.ok) setDeals(await dRes.json())
      if (sRes.ok) setSettings(await sRes.json())
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Failed to load data', type: 'error' })
    } finally {
      setLoading({ n: false, p: false, d: false, s: false })
    }
  }, [fetchWithAuth])

  useEffect(() => { fetchAll() }, [fetchAll])

  const seed = async () => {
    setSeeding(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/seed?type=all', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        setToast({ message: 'Demo data loaded successfully!', type: 'success' })
        fetchAll()
      } else {
        const d = await res.json()
        setToast({ message: d.error || 'Failed to load demo data', type: 'error' })
      }
    } catch {
      setToast({ message: 'Failed to load demo data', type: 'error' })
    } finally {
      setSeeding(false)
    }
  }

  const saveEntity = async (endpoint: string, data: unknown, method: 'POST' | 'PUT') => {
    setSaving(true)
    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/${endpoint}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        setToast({ message: 'Saved successfully!', type: 'success' })
        fetchAll()
      } else {
        const d = await res.json()
        setToast({ message: d.error || 'Failed to save', type: 'error' })
      }
    } catch {
      setToast({ message: 'Failed to save', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const deleteEntity = async (endpoint: string, id: string) => {
    try {
      const token = await getToken()
      await fetch(`/api/admin/${endpoint}?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      setToast({ message: 'Deleted successfully', type: 'success' })
      fetchAll()
    } catch {
      setToast({ message: 'Failed to delete', type: 'error' })
    }
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
          <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full" title="Logout"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === t.id ? 'bg-brand-navy text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50 border'
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && <DashboardTab properties={properties} deals={deals} neighborhoods={neighborhoods} onSeed={seed} seeding={seeding} />}
        {activeTab === 'properties' && <PropertiesTab properties={properties} neighborhoods={neighborhoods} loading={loading.p} onSave={(p) => saveEntity('properties', p, p._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('properties', id)} saving={saving} getToken={getToken} />}
        {activeTab === 'neighborhoods' && <NeighborhoodsTab neighborhoods={neighborhoods} loading={loading.n} onSave={(n) => saveEntity('neighborhoods', n, n._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('neighborhoods', id)} saving={saving} getToken={getToken} />}
        {activeTab === 'deals' && <DealsTab deals={deals} loading={loading.d} onSave={(d) => saveEntity('deals', d, d._id ? 'PUT' : 'POST')} saving={saving} />}
        {activeTab === 'settings' && <SettingsTab settings={settings} loading={loading.s} onSave={(s) => saveEntity('settings', s, 'PUT')} saving={saving} getToken={getToken} />}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default function AdminPage() {
  const { isAuthenticated, loading, login, logout, getToken } = useSimpleAuth()

  if (loading) return <div className="min-h-screen bg-brand-cream flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  if (!isAuthenticated) return <LoginScreen onLogin={login} />
  return <AdminDashboard onLogout={logout} getToken={getToken} />
}
