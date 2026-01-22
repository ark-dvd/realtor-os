'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, Home, FileText, Settings, LogOut, Plus, Search, Edit, Trash2, MapPin, TrendingUp, Save, X, Upload, Loader2, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

// Simple password authentication
const ADMIN_PASSWORD = 'Peace&Love202^'

function useSimpleAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = sessionStorage.getItem('admin_session')
    if (session === 'authenticated') {
      setIsAuthenticated(true)
    }
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
    // For simple auth, we use a basic token
    if (isAuthenticated) {
      return btoa(ADMIN_PASSWORD)
    }
    return null
  }

  return { isAuthenticated, loading, login, logout, getToken }
}

interface Neighborhood { _id?: string; name: string; slug: string; tagline: string; vibe: string; description: string; population?: string; commute?: { toDowntown?: string; toDomain?: string }; schoolDistrict?: string; schools?: { _key?: string; name: string; type: string; rating: number }[]; whyPeopleLove?: string[]; highlights?: { _key?: string; name: string; description: string }[]; avgPrice: string; image?: string; imageAssetId?: string; order?: number; isActive?: boolean }
interface Property { _id?: string; title: string; slug: string; status: string; price: number; address?: { street?: string; city?: string; state?: string; zip?: string }; beds?: number; baths?: number; sqft?: number; heroImage?: string; heroImageAssetId?: string; shortDescription?: string; features?: string[] }
interface Deal { _id?: string; clientName: string; clientEmail: string; clientPhone?: string; dealType: 'buying' | 'selling'; propertyAddress?: string; price?: number; transactionStage: number; keyDates?: { contractDate?: string; closingDate?: string }; notes?: string; isActive: boolean }
interface SiteSettings { _id?: string; heroHeadline?: string; heroSubheadline?: string; agentName?: string; agentTitle?: string; agentPhoto?: string; agentPhotoAssetId?: string; aboutText?: string; phone?: string; email?: string; address?: string; instagram?: string; facebook?: string; linkedin?: string }

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p || 0)
const STAGES = ['', 'Contract Signed', 'Option Period', 'Inspection', 'Appraisal', 'Financing', 'Title Work', 'Final Walk', 'Closing']
const STATUS_STYLES: Record<string, string> = { 'for-sale': 'bg-green-100 text-green-700', 'pending': 'bg-amber-100 text-amber-700', 'sold': 'bg-blue-100 text-blue-700' }

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>{type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}<span>{message}</span></div>
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null
  return <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"><div className="bg-white w-full max-w-4xl my-8 rounded-lg shadow-xl"><div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between rounded-t-lg z-10"><h2 className="font-display text-xl text-brand-navy">{title}</h2><button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button></div><div className="p-6">{children}</div></div></div>
}

function ImageUpload({ currentImage, onUpload, label, getToken }: { currentImage?: string; onUpload: (assetId: string, url: string) => void; label?: string; getToken: () => Promise<string | null> }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setPreview(currentImage) }, [currentImage])
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader(); reader.onload = (ev) => setPreview(ev.target?.result as string); reader.readAsDataURL(file)
    setUploading(true)
    try {
      const token = await getToken(); if (!token) throw new Error('Not authenticated')
      const formData = new FormData(); formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData })
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed')
      const data = await res.json(); onUpload(data.assetId, data.url)
    } catch (err) { alert(err instanceof Error ? err.message : 'Failed'); setPreview(currentImage) }
    finally { setUploading(false) }
  }
  return <div><label className="block text-sm font-medium mb-2">{label || 'Image'}</label><div className="flex items-center gap-4"><div className="w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center border">{preview ? <Image src={preview} alt="" width={128} height={128} className="w-full h-full object-cover" /> : <Upload className="text-neutral-400" />}</div><div><input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} /><button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-secondary">{uploading ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : 'Choose Image'}</button></div></div></div>
}

function LoginScreen({ onLogin }: { onLogin: (password: string) => boolean }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      const success = onLogin(password)
      if (!success) {
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
          <div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full text-center"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={loading || !password}
            className="btn-gold w-full justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t">
          <Link href="/" className="text-brand-gold hover:text-brand-gold/80 text-sm">
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}

function DashboardTab({ properties, deals, neighborhoods, onSeed, seeding }: { properties: Property[]; deals: Deal[]; neighborhoods: Neighborhood[]; onSeed: () => void; seeding: boolean }) {
  const activeDeals = deals.filter(d => d.isActive)
  const totalValue = activeDeals.reduce((sum, d) => sum + (d.price || 0), 0)
  return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[{ label: 'Active Listings', value: properties.filter(p => p.status === 'for-sale').length, color: 'bg-green-500' }, { label: 'Pending', value: properties.filter(p => p.status === 'pending').length, color: 'bg-amber-500' }, { label: 'Active Deals', value: activeDeals.length, color: 'bg-blue-500' }, { label: 'Pipeline Value', value: formatPrice(totalValue), color: 'bg-purple-500' }].map(s => <div key={s.label} className="bg-white p-6 rounded-xl border"><div className={`w-3 h-3 rounded-full ${s.color} mb-3`} /><div className="text-2xl font-semibold text-brand-navy">{s.value}</div><div className="text-neutral-500 text-sm">{s.label}</div></div>)}</div><div className="bg-white p-6 rounded-xl border"><div className="flex items-center justify-between mb-4"><h3 className="font-display text-lg text-brand-navy">Quick Actions</h3></div><div className="flex gap-3"><button onClick={onSeed} disabled={seeding} className="btn-secondary">{seeding ? <><Loader2 className="animate-spin" size={16} /> Loading...</> : <><RefreshCw size={16} /> Load Demo Data</>}</button></div><p className="text-sm text-neutral-500 mt-3">This will populate your site with Austin neighborhoods data.</p></div></div>
}

function PropertiesTab({ properties, loading, onSave, onDelete, saving, getToken }: { properties: Property[]; loading: boolean; onSave: (p: Property) => Promise<void>; onDelete: (id: string) => void; saving: boolean; getToken: () => Promise<string | null> }) {
  const [modal, setModal] = useState<{ open: boolean; property?: Property }>({ open: false })
  const [form, setForm] = useState<Property>({ title: '', slug: '', status: 'for-sale', price: 0 })
  const [search, setSearch] = useState('')
  
  useEffect(() => { if (modal.property) setForm(modal.property); else setForm({ title: '', slug: '', status: 'for-sale', price: 0 }) }, [modal])
  
  const filtered = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
  
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  
  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} /><input type="text" placeholder="Search properties..." className="input-field pl-10 w-full" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      <button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add Property</button>
    </div>
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b"><tr><th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Property</th><th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Price</th><th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Status</th><th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">Actions</th></tr></thead>
        <tbody className="divide-y">{filtered.map(p => <tr key={p._id} className="hover:bg-neutral-50"><td className="px-4 py-3"><div className="flex items-center gap-3">{p.heroImage && <Image src={p.heroImage} alt="" width={48} height={48} className="w-12 h-12 object-cover rounded" />}<div><div className="font-medium text-brand-navy">{p.title}</div><div className="text-sm text-neutral-500">{p.beds} bed • {p.baths} bath • {p.sqft?.toLocaleString()} sqft</div></div></div></td><td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[p.status] || 'bg-neutral-100'}`}>{p.status}</span></td><td className="px-4 py-3 text-right"><button onClick={() => setModal({ open: true, property: p })} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button><button onClick={() => p._id && confirm('Delete?') && onDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button></td></tr>)}</tbody>
      </table>
      {filtered.length === 0 && <div className="p-8 text-center text-neutral-500">No properties found</div>}
    </div>
    <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.property ? 'Edit Property' : 'Add Property'}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form).then(() => setModal({ open: false })) }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Title *</label><input type="text" required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} /></div><div><label className="block text-sm font-medium mb-2">Status</label><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="for-sale">For Sale</option><option value="pending">Pending</option><option value="sold">Sold</option></select></div></div>
        <div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium mb-2">Price *</label><input type="number" required className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div><div><label className="block text-sm font-medium mb-2">Beds</label><input type="number" className="input-field" value={form.beds || ''} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} /></div><div><label className="block text-sm font-medium mb-2">Baths</label><input type="number" className="input-field" value={form.baths || ''} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} /></div></div>
        <div><label className="block text-sm font-medium mb-2">Square Feet</label><input type="number" className="input-field" value={form.sqft || ''} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} /></div>
        <ImageUpload currentImage={form.heroImage} label="Hero Image" onUpload={(assetId, url) => setForm({ ...form, heroImageAssetId: assetId, heroImage: url })} getToken={getToken} />
        <div className="flex gap-4 justify-end pt-4 border-t"><button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button><button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button></div>
      </form>
    </Modal>
  </div>
}

function NeighborhoodsTab({ neighborhoods, loading, onSave, onDelete, saving, getToken }: { neighborhoods: Neighborhood[]; loading: boolean; onSave: (n: Neighborhood) => Promise<void>; onDelete: (id: string) => void; saving: boolean; getToken: () => Promise<string | null> }) {
  const [modal, setModal] = useState<{ open: boolean; neighborhood?: Neighborhood }>({ open: false })
  const [form, setForm] = useState<Neighborhood>({ name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '' })
  
  useEffect(() => { if (modal.neighborhood) setForm(modal.neighborhood); else setForm({ name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '' }) }, [modal])
  
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><h2 className="font-display text-xl text-brand-navy">Neighborhoods ({neighborhoods.length})</h2><button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{neighborhoods.map(n => <div key={n._id} className="bg-white rounded-xl border overflow-hidden"><div className="h-32 bg-neutral-200">{n.image && <Image src={n.image} alt={n.name} width={400} height={128} className="w-full h-full object-cover" />}</div><div className="p-4"><div className="flex items-center justify-between mb-2"><h3 className="font-display text-lg text-brand-navy">{n.name}</h3><span className="text-brand-gold font-medium text-sm">{n.avgPrice}</span></div><p className="text-sm text-neutral-500 mb-3 line-clamp-2">{n.tagline}</p><div className="flex justify-end gap-2"><button onClick={() => setModal({ open: true, neighborhood: n })} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button><button onClick={() => n._id && confirm('Delete?') && onDelete(n._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button></div></div></div>)}</div>
    {neighborhoods.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-neutral-500">No neighborhoods yet. Click "Load Demo Data" in Dashboard to add Austin neighborhoods.</div>}
    <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.neighborhood ? 'Edit Neighborhood' : 'Add Neighborhood'}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form).then(() => setModal({ open: false })) }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Name *</label><input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} /></div><div><label className="block text-sm font-medium mb-2">Avg Price *</label><input type="text" required className="input-field" placeholder="$500K - $700K" value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} /></div></div>
        <div><label className="block text-sm font-medium mb-2">Tagline *</label><input type="text" required className="input-field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Vibe *</label><textarea className="input-field" rows={2} value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Description *</label><textarea required className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">School District</label><input type="text" className="input-field" value={form.schoolDistrict || ''} onChange={(e) => setForm({ ...form, schoolDistrict: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Population</label><input type="text" className="input-field" value={form.population || ''} onChange={(e) => setForm({ ...form, population: e.target.value })} /></div></div>
        <ImageUpload currentImage={form.image} label="Cover Image" onUpload={(assetId, url) => setForm({ ...form, imageAssetId: assetId, image: url })} getToken={getToken} />
        <div className="flex gap-4 justify-end pt-4 border-t"><button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button><button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button></div>
      </form>
    </Modal>
  </div>
}

function DealsTab({ deals, loading, onSave, saving }: { deals: Deal[]; loading: boolean; onSave: (d: Deal) => Promise<void>; saving: boolean }) {
  const [modal, setModal] = useState<{ open: boolean; deal?: Deal }>({ open: false })
  const [form, setForm] = useState<Deal>({ clientName: '', clientEmail: '', dealType: 'buying', transactionStage: 1, isActive: true })
  
  useEffect(() => { if (modal.deal) setForm(modal.deal); else setForm({ clientName: '', clientEmail: '', dealType: 'buying', transactionStage: 1, isActive: true }) }, [modal])
  
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><h2 className="font-display text-xl text-brand-navy">Active Deals ({deals.filter(d => d.isActive).length})</h2><button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add Deal</button></div>
    <div className="space-y-3">{deals.map(d => <div key={d._id} className="bg-white p-4 rounded-xl border"><div className="flex items-center justify-between mb-3"><div><h3 className="font-medium text-brand-navy">{d.clientName}</h3><p className="text-sm text-neutral-500">{d.propertyAddress || 'No address'}</p></div><div className="text-right"><span className={`px-2 py-1 rounded-full text-xs font-medium ${d.dealType === 'buying' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{d.dealType}</span>{d.price && <div className="font-medium mt-1">{formatPrice(d.price)}</div>}</div></div><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden"><div className="h-full bg-brand-gold rounded-full transition-all" style={{ width: `${(d.transactionStage / 8) * 100}%` }} /></div><span className="text-sm text-neutral-600 whitespace-nowrap">{d.transactionStage}/8 {STAGES[d.transactionStage]}</span><button onClick={() => setModal({ open: true, deal: d })} className="p-2 hover:bg-neutral-100 rounded ml-2"><Edit size={16} /></button></div></div>)}</div>
    {deals.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-neutral-500">No active deals</div>}
    <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.deal ? 'Edit Deal' : 'Add Deal'}>
      <form onSubmit={(e) => { e.preventDefault(); onSave(form).then(() => setModal({ open: false })) }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Client Name *</label><input type="text" required className="input-field" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Email *</label><input type="email" required className="input-field" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} /></div></div>
        <div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium mb-2">Type</label><select className="input-field" value={form.dealType} onChange={(e) => setForm({ ...form, dealType: e.target.value as 'buying' | 'selling' })}><option value="buying">Buying</option><option value="selling">Selling</option></select></div><div><label className="block text-sm font-medium mb-2">Price</label><input type="number" className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div><div><label className="block text-sm font-medium mb-2">Stage</label><select className="input-field" value={form.transactionStage} onChange={(e) => setForm({ ...form, transactionStage: Number(e.target.value) })}>{STAGES.slice(1).map((s, i) => <option key={i + 1} value={i + 1}>{i + 1}. {s}</option>)}</select></div></div>
        <div><label className="block text-sm font-medium mb-2">Property Address</label><input type="text" className="input-field" value={form.propertyAddress || ''} onChange={(e) => setForm({ ...form, propertyAddress: e.target.value })} /></div>
        <div className="flex gap-4 justify-end pt-4 border-t"><button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button><button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button></div>
      </form>
    </Modal>
  </div>
}

function SettingsTab({ settings, loading, onSave, saving, getToken }: { settings: SiteSettings | null; loading: boolean; onSave: (s: SiteSettings) => Promise<void>; saving: boolean; getToken: () => Promise<string | null> }) {
  const [form, setForm] = useState<SiteSettings>(settings || {}); useEffect(() => { if (settings) setForm(settings) }, [settings])
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  return <div className="max-w-3xl space-y-6"><div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Agent Information</h3><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Name</label><input type="text" className="input-field" value={form.agentName || ''} onChange={(e) => setForm({ ...form, agentName: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Title</label><input type="text" className="input-field" value={form.agentTitle || ''} onChange={(e) => setForm({ ...form, agentTitle: e.target.value })} /></div></div><ImageUpload currentImage={form.agentPhoto} label="Agent Photo" onUpload={(assetId, url) => setForm({ ...form, agentPhotoAssetId: assetId, agentPhoto: url })} getToken={getToken} /></div><div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Contact</h3><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Phone</label><input type="tel" className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Email</label><input type="email" className="input-field" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div></div><div><label className="block text-sm font-medium mb-2">Address</label><input type="text" className="input-field" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div></div><div className="flex justify-end"><button onClick={() => onSave(form)} className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Settings</button></div></div>
}

function AdminDashboard({ onLogout, getToken }: { onLogout: () => void; getToken: () => Promise<string | null> }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]), [properties, setProperties] = useState<Property[]>([]), [deals, setDeals] = useState<Deal[]>([]), [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState({ n: true, p: true, d: true, s: true }), [saving, setSaving] = useState(false), [seeding, setSeeding] = useState(false), [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchWithAuth = useCallback(async (url: string) => { 
    const token = await getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
    if (res.status === 401 || res.status === 403) throw new Error(res.status === 403 ? 'Admin access required' : 'Auth failed')
    return res 
  }, [getToken])

  const fetchAll = useCallback(async () => {
    try {
      const [nRes, pRes, dRes, sRes] = await Promise.all([fetchWithAuth('/api/admin/neighborhoods'), fetchWithAuth('/api/admin/properties'), fetchWithAuth('/api/admin/deals'), fetchWithAuth('/api/admin/settings')])
      if (nRes.ok) setNeighborhoods(await nRes.json()); if (pRes.ok) setProperties(await pRes.json()); if (dRes.ok) setDeals(await dRes.json()); if (sRes.ok) setSettings(await sRes.json())
    } catch (e) { setToast({ message: e instanceof Error ? e.message : 'Failed to load', type: 'error' }) }
    finally { setLoading({ n: false, p: false, d: false, s: false }) }
  }, [fetchWithAuth])

  useEffect(() => { fetchAll() }, [fetchAll])

  const seed = async () => { setSeeding(true); try { const token = await getToken(); const res = await fetch('/api/admin/seed?type=all', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); if (res.ok) { setToast({ message: 'Data loaded!', type: 'success' }); fetchAll() } else { const d = await res.json(); setToast({ message: d.error || 'Failed', type: 'error' }) } } catch { setToast({ message: 'Failed', type: 'error' }) } finally { setSeeding(false) } }

  const saveEntity = async (endpoint: string, data: unknown, method: 'POST' | 'PUT') => { setSaving(true); try { const token = await getToken(); const res = await fetch(`/api/admin/${endpoint}`, { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); if (res.ok) { setToast({ message: 'Saved!', type: 'success' }); fetchAll() } else { const d = await res.json(); setToast({ message: d.error || 'Failed', type: 'error' }) } } catch { setToast({ message: 'Failed', type: 'error' }) } finally { setSaving(false) } }

  const deleteEntity = async (endpoint: string, id: string) => { try { const token = await getToken(); await fetch(`/api/admin/${endpoint}?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); setToast({ message: 'Deleted', type: 'success' }); fetchAll() } catch { setToast({ message: 'Failed', type: 'error' }) } }

  const tabs = [{ id: 'dashboard', label: 'Dashboard', icon: TrendingUp }, { id: 'properties', label: 'Properties', icon: Home }, { id: 'neighborhoods', label: 'Neighborhoods', icon: MapPin }, { id: 'deals', label: 'Deals', icon: FileText }, { id: 'settings', label: 'Settings', icon: Settings }]

  return <div className="min-h-screen bg-neutral-100"><header className="bg-brand-navy text-white sticky top-0 z-40"><div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-4"><Link href="/" className="font-display text-xl hover:text-brand-gold">Merrav Berko</Link><span className="text-white/40">|</span><span className="text-white/70 text-sm">Back Office</span></div><div className="flex items-center gap-4"><button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full" title="Logout"><LogOut size={20} /></button></div></div></header><div className="max-w-7xl mx-auto px-6 py-8"><div className="flex gap-2 mb-8 overflow-x-auto pb-2">{tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-brand-navy text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50 border'}`}><t.icon size={18} />{t.label}</button>)}</div>{activeTab === 'dashboard' && <DashboardTab properties={properties} deals={deals} neighborhoods={neighborhoods} onSeed={seed} seeding={seeding} />}{activeTab === 'properties' && <PropertiesTab properties={properties} loading={loading.p} onSave={(p) => saveEntity('properties', p, p._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('properties', id)} saving={saving} getToken={getToken} />}{activeTab === 'neighborhoods' && <NeighborhoodsTab neighborhoods={neighborhoods} loading={loading.n} onSave={(n) => saveEntity('neighborhoods', n, n._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('neighborhoods', id)} saving={saving} getToken={getToken} />}{activeTab === 'deals' && <DealsTab deals={deals} loading={loading.d} onSave={(d) => saveEntity('deals', d, d._id ? 'PUT' : 'POST')} saving={saving} />}{activeTab === 'settings' && <SettingsTab settings={settings} loading={loading.s} onSave={(s) => saveEntity('settings', s, 'PUT')} saving={saving} getToken={getToken} />}</div>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</div>
}

export default function AdminPage() {
  const { isAuthenticated, loading, login, logout, getToken } = useSimpleAuth()
  
  if (loading) return <div className="min-h-screen bg-brand-cream flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  if (!isAuthenticated) return <LoginScreen onLogin={login} />
  return <AdminDashboard onLogout={logout} getToken={getToken} />
}
