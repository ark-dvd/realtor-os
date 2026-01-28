'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Home, FileText, Settings, LogOut, Plus, Search, Edit, Trash2, MapPin, TrendingUp, Save, X, Upload, Loader2, RefreshCw, AlertCircle, CheckCircle, GraduationCap, Star, ImageIcon, ChevronDown, ChevronUp, Construction, LogIn } from 'lucide-react'

// Image compression function - resizes and compresses large images before upload
async function compressImage(file: File, maxWidth = 2000, maxHeight = 2000, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    // If file is already small (< 2MB), skip compression
    if (file.size < 2 * 1024 * 1024) {
      resolve(file)
      return
    }

    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      let { width, height } = img

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      canvas.width = width
      canvas.height = height

      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw and compress
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Compression failed'))
            return
          }
          // Create new file with compressed data
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          console.log(`Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

interface School { _key?: string; name: string; type: string; rating: number; note?: string }
interface Highlight { _key?: string; name: string; description: string }
interface HeroImage { _key?: string; url: string; alt?: string; assetId?: string }
interface Stat { _key?: string; value: string; label: string }
interface GalleryImage { _key?: string; url: string; alt?: string; assetId?: string }
interface Neighborhood { _id?: string; name: string; slug: string; tagline: string; vibe: string; description: string; population?: string; commute?: { toDowntown?: string; toDomain?: string }; schoolDistrict?: string; schools?: School[]; whyPeopleLove?: string[]; highlights?: Highlight[]; avgPrice: string; image?: string; imageAssetId?: string; gallery?: GalleryImage[]; order?: number; isActive?: boolean }
interface Property { _id?: string; title: string; slug: string; status: string; price: number; address?: { street?: string; city?: string; state?: string; zip?: string }; neighborhoodId?: string; beds?: number; baths?: number; sqft?: number; heroImage?: string; heroImageAssetId?: string; heroVideo?: string; gallery?: GalleryImage[]; floorPlan?: string; floorPlanAssetId?: string; shortDescription?: string; description?: string; features?: string[]; seoTitle?: string; seoDescription?: string }
interface Deal { _id?: string; clientName: string; clientEmail: string; dealType: 'buying' | 'selling'; transactionStage: number; price?: number; isActive: boolean }
interface SiteSettings { _id?: string; heroHeadline?: string; heroSubheadline?: string; heroMediaType?: 'images' | 'video'; heroImages?: HeroImage[]; heroVideoUrl?: string; heroVideoAssetId?: string; agentName?: string; agentTitle?: string; agentPhoto?: string; agentPhotoAssetId?: string; aboutHeadline?: string; aboutText?: string; aboutStats?: Stat[]; phone?: string; email?: string; address?: string; officeHours?: string; instagram?: string; facebook?: string; linkedin?: string; youtube?: string; trecLink?: string; logo?: string; logoAssetId?: string }

const formatPrice = (p: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p || 0)
const STATUS_STYLES: Record<string, string> = { 'for-sale': 'bg-green-100 text-green-700', 'pending': 'bg-amber-100 text-amber-700', 'sold': 'bg-blue-100 text-blue-700' }
const genKey = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  return <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white max-w-md`}>{type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}<span>{message}</span><button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1"><X size={16} /></button></div>
}

function Modal({ isOpen, onClose, title, children, size = 'lg' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' }) {
  if (!isOpen) return null
  const maxW = size === 'xl' ? 'max-w-6xl' : size === 'lg' ? 'max-w-4xl' : 'max-w-2xl'
  return <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto"><div className={`bg-white w-full ${maxW} my-8 rounded-lg shadow-xl`}><div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between rounded-t-lg z-10"><h2 className="font-display text-xl text-brand-navy">{title}</h2><button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full"><X size={20} /></button></div><div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div></div></div>
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return <div className="border rounded-lg"><button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-left font-medium text-brand-navy hover:bg-neutral-50">{title}{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>{isOpen && <div className="p-4 pt-0 border-t">{children}</div>}</div>
}

function ImageUpload({ currentImage, onUpload, label }: { currentImage?: string; onUpload: (assetId: string, url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setPreview(currentImage) }, [currentImage])
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader(); reader.onload = (ev) => setPreview(ev.target?.result as string); reader.readAsDataURL(file)
    setUploading(true)
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file)
      const formData = new FormData(); formData.append('file', compressedFile)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error(text || 'Upload failed - invalid response') }
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onUpload(data.assetId, data.url)
    } catch (err) { alert(err instanceof Error ? err.message : 'Failed'); setPreview(currentImage) }
    finally { setUploading(false) }
  }
  return <div><label className="block text-sm font-medium mb-2">{label || 'Image'}</label><div className="flex items-center gap-4"><div className="w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center border">{preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="text-neutral-400" size={32} />}</div><div><input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} /><button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-secondary">{uploading ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : <><Upload size={16} /> Choose</>}</button>{preview && <button type="button" onClick={() => { setPreview(''); onUpload('', '') }} className="block mt-2 text-sm text-red-500">Remove</button>}</div></div></div>
}

function GalleryUpload({ images, onChange, label }: { images: GalleryImage[]; onChange: (images: GalleryImage[]) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return
    setUploading(true)
    try {
      const newImages: GalleryImage[] = []
      for (const file of Array.from(files)) {
        // Compress each image before upload
        const compressedFile = await compressImage(file)
        const formData = new FormData(); formData.append('file', compressedFile)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' })
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          if (res.ok) newImages.push({ _key: genKey(), url: data.url, assetId: data.assetId, alt: '' })
        } catch { console.error('Upload response:', text) }
      }
      onChange([...images, ...newImages])
    } catch (err) { alert(err instanceof Error ? err.message : 'Failed') }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = '' }
  }
  return <div><label className="block text-sm font-medium mb-2">{label || 'Gallery'}</label><div className="grid grid-cols-4 gap-3 mb-3">{images.map((img, i) => <div key={img._key || i} className="relative group"><div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden"><img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" /></div><button type="button" onClick={() => onChange(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X size={14} /></button></div>)}</div><input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} /><button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn-secondary w-full">{uploading ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : <><Plus size={16} /> Add Images</>}</button></div>
}

function LoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = () => {
    setLoading(true)
    signIn('google', { callbackUrl: '/admin' })
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-brand-navy rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="text-brand-gold" size={28} />
        </div>
        <h1 className="font-display text-2xl text-brand-navy mb-2">Back Office</h1>
        <p className="text-neutral-500 mb-8">Merrav Berko Real Estate</p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn-gold w-full justify-center flex items-center gap-3"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <p className="text-xs text-neutral-400 mt-6">
          Access restricted to authorized administrators only.
        </p>

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
  const stats = [
    { label: 'Active Listings', value: properties.filter(p => p.status === 'for-sale').length, color: 'bg-green-500' },
    { label: 'Pending', value: properties.filter(p => p.status === 'pending').length, color: 'bg-amber-500' },
    { label: 'Active Deals', value: activeDeals.length, color: 'bg-blue-500' },
    { label: 'Pipeline Value', value: formatPrice(activeDeals.reduce((sum, d) => sum + (d.price || 0), 0)), color: 'bg-purple-500' },
  ]
  return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{stats.map(s => <div key={s.label} className="bg-white p-6 rounded-xl border"><div className={`w-3 h-3 rounded-full ${s.color} mb-3`} /><div className="text-2xl font-semibold text-brand-navy">{s.value}</div><div className="text-neutral-500 text-sm">{s.label}</div></div>)}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-white p-6 rounded-xl border"><h3 className="font-display text-lg text-brand-navy mb-4">Quick Stats</h3><div className="space-y-3"><div className="flex justify-between"><span className="text-neutral-600">Communities</span><span className="font-medium">{neighborhoods.length}</span></div><div className="flex justify-between"><span className="text-neutral-600">Total Properties</span><span className="font-medium">{properties.length}</span></div></div></div><div className="bg-white p-6 rounded-xl border"><h3 className="font-display text-lg text-brand-navy mb-4">Quick Actions</h3><button onClick={onSeed} disabled={seeding} className="btn-secondary w-full justify-center">{seeding ? <><Loader2 className="animate-spin" size={16} /> Loading...</> : <><RefreshCw size={16} /> Load Demo Data</>}</button><p className="text-sm text-neutral-500 mt-2">Populates communities with Greater Austin data.</p></div></div></div>
}

function PropertiesTab({ properties, neighborhoods, loading, onSave, onDelete, saving }: { properties: Property[]; neighborhoods: Neighborhood[]; loading: boolean; onSave: (p: Property) => Promise<void>; onDelete: (id: string) => void; saving: boolean }) {
  const [modal, setModal] = useState<{ open: boolean; property?: Property }>({ open: false })
  const [form, setForm] = useState<Property>({ title: '', slug: '', status: 'for-sale', price: 0 })
  const [search, setSearch] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [gallery, setGallery] = useState<GalleryImage[]>([])

  useEffect(() => {
    if (modal.property) { setForm(modal.property); setFeatures(modal.property.features || []); setGallery(modal.property.gallery || []) }
    else { setForm({ title: '', slug: '', status: 'for-sale', price: 0, address: { city: 'Austin', state: 'TX' } }); setFeatures([]); setGallery([]) }
  }, [modal])

  const addFeature = () => { if (newFeature.trim()) { setFeatures([...features, newFeature.trim()]); setNewFeature('') } }
  const handleSave = async () => { await onSave({ ...form, features, gallery }); setModal({ open: false }) }
  const filtered = properties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} /><input type="text" placeholder="Search properties..." className="input-field pl-10 w-full" value={search} onChange={(e) => setSearch(e.target.value)} /></div><button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add Property</button></div>
    <div className="bg-white rounded-xl border overflow-hidden"><table className="w-full"><thead className="bg-neutral-50 border-b"><tr><th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Property</th><th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Price</th><th className="px-4 py-3 text-left text-sm font-medium text-neutral-600">Status</th><th className="px-4 py-3 text-right text-sm font-medium text-neutral-600">Actions</th></tr></thead><tbody className="divide-y">{filtered.map(p => <tr key={p._id} className="hover:bg-neutral-50"><td className="px-4 py-3"><div className="flex items-center gap-3">{p.heroImage && <img src={p.heroImage} alt="" className="w-12 h-12 object-cover rounded" />}<div><div className="font-medium text-brand-navy">{p.title}</div><div className="text-sm text-neutral-500">{p.beds} bed • {p.baths} bath</div></div></div></td><td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[p.status] || 'bg-neutral-100'}`}>{p.status}</span></td><td className="px-4 py-3 text-right"><button onClick={() => setModal({ open: true, property: p })} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button><button onClick={() => p._id && confirm('Delete?') && onDelete(p._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="p-8 text-center text-neutral-500">No properties found</div>}</div>
    <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.property ? 'Edit Property' : 'Add Property'} size="xl">
      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Title *</label><input type="text" required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} /></div><div><label className="block text-sm font-medium mb-2">Status</label><select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="for-sale">For Sale</option><option value="pending">Pending</option><option value="sold">Sold</option></select></div></div>
        <div className="grid grid-cols-4 gap-4"><div><label className="block text-sm font-medium mb-2">Price *</label><input type="number" required className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div><div><label className="block text-sm font-medium mb-2">Beds</label><input type="number" className="input-field" value={form.beds || ''} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} /></div><div><label className="block text-sm font-medium mb-2">Baths</label><input type="number" step="0.5" className="input-field" value={form.baths || ''} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} /></div><div><label className="block text-sm font-medium mb-2">Sqft</label><input type="number" className="input-field" value={form.sqft || ''} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} /></div></div>
        <Accordion title="Address"><div className="grid grid-cols-2 gap-4"><div className="col-span-2"><label className="block text-sm font-medium mb-2">Street</label><input type="text" className="input-field" value={form.address?.street || ''} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} /></div><div><label className="block text-sm font-medium mb-2">City</label><input type="text" className="input-field" value={form.address?.city || 'Austin'} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} /></div><div><label className="block text-sm font-medium mb-2">Community</label><select className="input-field" value={form.neighborhoodId || ''} onChange={(e) => setForm({ ...form, neighborhoodId: e.target.value })}><option value="">Select...</option>{neighborhoods.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}</select></div></div></Accordion>
        <Accordion title="Description"><div className="space-y-4"><div><label className="block text-sm font-medium mb-2">Short Description</label><textarea className="input-field" rows={2} value={form.shortDescription || ''} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Full Description</label><textarea className="input-field" rows={6} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div></div></Accordion>
        <Accordion title="Features"><div className="space-y-3"><div className="flex gap-2"><input type="text" className="input-field flex-1" placeholder="Add feature..." value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} /><button type="button" onClick={addFeature} className="btn-secondary"><Plus size={16} /></button></div><div className="flex flex-wrap gap-2">{features.map((f, i) => <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full text-sm">{f}<button type="button" onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="hover:text-red-500"><X size={14} /></button></span>)}</div></div></Accordion>
        <Accordion title="Media" defaultOpen><div className="space-y-6"><ImageUpload currentImage={form.heroImage} label="Main Image *" onUpload={(assetId, url) => setForm({ ...form, heroImageAssetId: assetId, heroImage: url })} /><div><label className="block text-sm font-medium mb-2">Video URL</label><input type="url" className="input-field" value={form.heroVideo || ''} onChange={(e) => setForm({ ...form, heroVideo: e.target.value })} /></div><GalleryUpload images={gallery} onChange={setGallery} label="Gallery" /><ImageUpload currentImage={form.floorPlan} label="Floor Plan" onUpload={(assetId, url) => setForm({ ...form, floorPlanAssetId: assetId, floorPlan: url })} /></div></Accordion>
        <Accordion title="SEO"><div className="space-y-4"><div><label className="block text-sm font-medium mb-2">SEO Title</label><input type="text" className="input-field" value={form.seoTitle || ''} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">SEO Description</label><textarea className="input-field" rows={2} value={form.seoDescription || ''} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></div></div></Accordion>
        <div className="flex gap-4 justify-end pt-4 border-t"><button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button><button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button></div>
      </form>
    </Modal>
  </div>
}

function NeighborhoodsTab({ neighborhoods, loading, onSave, onDelete, saving }: { neighborhoods: Neighborhood[]; loading: boolean; onSave: (n: Neighborhood) => Promise<void>; onDelete: (id: string) => void; saving: boolean }) {
  const [modal, setModal] = useState<{ open: boolean; neighborhood?: Neighborhood }>({ open: false })
  const [form, setForm] = useState<Neighborhood>({ name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '' })
  const [schools, setSchools] = useState<School[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [whyLove, setWhyLove] = useState<string[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])

  useEffect(() => {
    if (modal.neighborhood) { setForm(modal.neighborhood); setSchools(modal.neighborhood.schools || []); setHighlights(modal.neighborhood.highlights || []); setWhyLove(modal.neighborhood.whyPeopleLove || []); setGallery(modal.neighborhood.gallery || []) }
    else { setForm({ name: '', slug: '', tagline: '', vibe: '', description: '', avgPrice: '', isActive: true }); setSchools([]); setHighlights([]); setWhyLove([]); setGallery([]) }
  }, [modal])

  const addSchool = () => setSchools([...schools, { _key: genKey(), name: '', type: 'Elementary', rating: 5 }])
  const updateSchool = (i: number, field: keyof School, value: string | number) => { const updated = [...schools]; updated[i] = { ...updated[i], [field]: value }; setSchools(updated) }
  const addHighlight = () => setHighlights([...highlights, { _key: genKey(), name: '', description: '' }])
  const updateHighlight = (i: number, field: keyof Highlight, value: string) => { const updated = [...highlights]; updated[i] = { ...updated[i], [field]: value }; setHighlights(updated) }
  const addWhyLove = () => setWhyLove([...whyLove, ''])
  const updateWhyLove = (i: number, value: string) => { const updated = [...whyLove]; updated[i] = value; setWhyLove(updated) }
  const handleSave = async () => { await onSave({ ...form, schools, highlights, whyPeopleLove: whyLove, gallery }); setModal({ open: false }) }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><h2 className="font-display text-xl text-brand-navy">Communities ({neighborhoods.length})</h2><button onClick={() => setModal({ open: true })} className="btn-gold"><Plus size={18} /> Add</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{neighborhoods.map(n => <div key={n._id} className="bg-white rounded-xl border overflow-hidden"><div className="h-32 bg-neutral-200 relative">{n.image && <img src={n.image} alt={n.name} className="w-full h-full object-cover" />}</div><div className="p-4"><div className="flex items-center justify-between mb-2"><h3 className="font-display text-lg text-brand-navy">{n.name}</h3><span className="text-brand-gold font-medium text-sm">{n.avgPrice}</span></div><p className="text-sm text-neutral-500 mb-3 line-clamp-2">{n.tagline}</p><div className="flex justify-end gap-2"><button onClick={() => setModal({ open: true, neighborhood: n })} className="p-2 hover:bg-neutral-100 rounded"><Edit size={16} /></button><button onClick={() => n._id && confirm('Delete?') && onDelete(n._id)} className="p-2 hover:bg-red-50 text-red-500 rounded"><Trash2 size={16} /></button></div></div></div>)}</div>
    {neighborhoods.length === 0 && <div className="bg-white rounded-xl border p-8 text-center text-neutral-500">No communities yet. Click Load Demo Data in Dashboard.</div>}
    <Modal isOpen={modal.open} onClose={() => setModal({ open: false })} title={modal.neighborhood ? 'Edit Community' : 'Add Community'} size="xl">
      <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Name *</label><input type="text" required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} /></div><div><label className="block text-sm font-medium mb-2">Avg Price *</label><input type="text" required className="input-field" placeholder="$500K - $700K" value={form.avgPrice} onChange={(e) => setForm({ ...form, avgPrice: e.target.value })} /></div></div>
        <div><label className="block text-sm font-medium mb-2">Tagline *</label><input type="text" required className="input-field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Vibe *</label><textarea className="input-field" rows={2} value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Description *</label><textarea required className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <Accordion title="Location Details"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">School District</label><input type="text" className="input-field" value={form.schoolDistrict || ''} onChange={(e) => setForm({ ...form, schoolDistrict: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Population</label><input type="text" className="input-field" value={form.population || ''} onChange={(e) => setForm({ ...form, population: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Commute to Downtown</label><input type="text" className="input-field" value={form.commute?.toDowntown || ''} onChange={(e) => setForm({ ...form, commute: { ...form.commute, toDowntown: e.target.value } })} /></div><div><label className="block text-sm font-medium mb-2">Commute to Domain</label><input type="text" className="input-field" value={form.commute?.toDomain || ''} onChange={(e) => setForm({ ...form, commute: { ...form.commute, toDomain: e.target.value } })} /></div></div></Accordion>
        <Accordion title={`Schools (${schools.length})`}><div className="space-y-3">{schools.map((s, i) => <div key={s._key || i} className="flex gap-2 items-center p-2 bg-neutral-50 rounded"><input type="text" className="input-field flex-1" placeholder="Name" value={s.name} onChange={(e) => updateSchool(i, 'name', e.target.value)} /><select className="input-field w-28" value={s.type} onChange={(e) => updateSchool(i, 'type', e.target.value)}><option>Elementary</option><option>Middle</option><option>High School</option></select><div className="flex items-center gap-1"><Star size={14} className="text-brand-gold" /><input type="number" min="1" max="10" className="input-field w-14" value={s.rating} onChange={(e) => updateSchool(i, 'rating', Number(e.target.value))} /></div><button type="button" onClick={() => setSchools(schools.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><X size={16} /></button></div>)}<button type="button" onClick={addSchool} className="btn-secondary w-full"><Plus size={16} /> Add School</button></div></Accordion>
        <Accordion title={`Why People Love It (${whyLove.length})`}><div className="space-y-3">{whyLove.map((r, i) => <div key={i} className="flex gap-2"><textarea className="input-field flex-1" rows={2} value={r} onChange={(e) => updateWhyLove(i, e.target.value)} /><button type="button" onClick={() => setWhyLove(whyLove.filter((_, idx) => idx !== i))} className="p-1 text-red-500 self-start"><X size={16} /></button></div>)}<button type="button" onClick={addWhyLove} className="btn-secondary w-full"><Plus size={16} /> Add</button></div></Accordion>
        <Accordion title={`Highlights (${highlights.length})`}><div className="space-y-3">{highlights.map((h, i) => <div key={h._key || i} className="flex gap-2"><input type="text" className="input-field w-1/3" placeholder="Name" value={h.name} onChange={(e) => updateHighlight(i, 'name', e.target.value)} /><input type="text" className="input-field flex-1" placeholder="Description" value={h.description} onChange={(e) => updateHighlight(i, 'description', e.target.value)} /><button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="p-1 text-red-500"><X size={16} /></button></div>)}<button type="button" onClick={addHighlight} className="btn-secondary w-full"><Plus size={16} /> Add</button></div></Accordion>
        <Accordion title="Media" defaultOpen><div className="space-y-6"><ImageUpload currentImage={form.image} label="Cover Image *" onUpload={(assetId, url) => setForm({ ...form, imageAssetId: assetId, image: url })} /><GalleryUpload images={gallery} onChange={setGallery} label="Gallery" /></div></Accordion>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Display Order</label><input type="number" className="input-field" value={form.order || ''} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></div><div className="flex items-end pb-2"><label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" /><span className="text-sm">Show on website</span></label></div></div>
        <div className="flex gap-4 justify-end pt-4 border-t"><button type="button" onClick={() => setModal({ open: false })} className="btn-secondary">Cancel</button><button type="submit" className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save</button></div>
      </form>
    </Modal>
  </div>
}

function DealsTab() {
  return <div className="space-y-6"><div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-8 text-center"><Construction className="mx-auto text-amber-500 mb-4" size={48} /><h2 className="font-display text-2xl text-brand-navy mb-3">מודול זה בבנייה</h2><p className="text-neutral-600 max-w-lg mx-auto">מודול ניהול העסקאות (Deals) נמצא בפיתוח ועדיין לא מוכן לשימוש.</p><p className="text-amber-600 font-medium mt-4">Coming Soon!</p></div></div>
}

function SettingsTab({ settings, loading, onSave, saving }: { settings: SiteSettings | null; loading: boolean; onSave: (s: SiteSettings) => Promise<void>; saving: boolean }) {
  const [form, setForm] = useState<SiteSettings>(settings || {})
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  useEffect(() => { if (settings) { setForm(settings); setHeroImages(settings.heroImages || []); setStats(settings.aboutStats || []) } }, [settings])

  const handleHeroImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index)
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file)
      const formData = new FormData(); formData.append('file', compressedFile)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData, credentials: 'include' })
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { throw new Error(text || 'Upload failed - invalid response') }
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      const updated = [...heroImages]; updated[index] = { ...updated[index], url: data.url, assetId: data.assetId }; setHeroImages(updated)
    } catch (err) { alert(err instanceof Error ? err.message : 'Failed') }
    finally { setUploadingIndex(null) }
  }

  const addHeroImage = () => setHeroImages([...heroImages, { _key: genKey(), url: '', alt: '' }])
  const updateHeroImageAlt = (i: number, alt: string) => { const updated = [...heroImages]; updated[i] = { ...updated[i], alt }; setHeroImages(updated) }
  const addStat = () => setStats([...stats, { _key: genKey(), value: '', label: '' }])
  const updateStat = (i: number, field: keyof Stat, value: string) => { const updated = [...stats]; updated[i] = { ...updated[i], [field]: value }; setStats(updated) }
  const handleSave = async () => { await onSave({ ...form, heroImages, aboutStats: stats }) }

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-gold" size={40} /></div>
  return <div className="max-w-4xl space-y-6">
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Hero Section</h3><div><label className="block text-sm font-medium mb-2">Headline</label><input type="text" className="input-field" value={form.heroHeadline || ''} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Subheadline</label><textarea className="input-field" rows={2} value={form.heroSubheadline || ''} onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Hero Type</label><div className="flex gap-4"><label className="flex items-center gap-2"><input type="radio" name="heroMediaType" checked={form.heroMediaType !== 'video'} onChange={() => setForm({ ...form, heroMediaType: 'images' })} /><span>Image Slider</span></label><label className="flex items-center gap-2"><input type="radio" name="heroMediaType" checked={form.heroMediaType === 'video'} onChange={() => setForm({ ...form, heroMediaType: 'video' })} /><span>Video</span></label></div></div>
      {form.heroMediaType !== 'video' ? <Accordion title={`Hero Images (${heroImages.length})`} defaultOpen><div className="space-y-3">{heroImages.map((img, i) => <div key={img._key || i} className="flex gap-3 items-center p-3 bg-neutral-50 rounded-lg"><div className="w-24 h-16 bg-neutral-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">{img.url ? <img src={img.url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="text-neutral-400" size={20} />}</div><div className="flex-1 space-y-2"><input type="file" accept="image/*" className="text-sm" onChange={(e) => e.target.files?.[0] && handleHeroImageUpload(e.target.files[0], i)} disabled={uploadingIndex === i} />{uploadingIndex === i && <span className="text-xs text-brand-gold">Uploading...</span>}<input type="text" className="input-field text-sm" placeholder="Alt text" value={img.alt || ''} onChange={(e) => updateHeroImageAlt(i, e.target.value)} /></div><button type="button" onClick={() => setHeroImages(heroImages.filter((_, idx) => idx !== i))} className="p-2 text-red-500"><X size={16} /></button></div>)}<button type="button" onClick={addHeroImage} className="btn-secondary w-full"><Plus size={16} /> Add Hero Image</button></div></Accordion> : <div><label className="block text-sm font-medium mb-2">Hero Video URL</label><input type="url" className="input-field" value={form.heroVideoUrl || ''} onChange={(e) => setForm({ ...form, heroVideoUrl: e.target.value })} placeholder="Direct MP4 URL" /></div>}
    </div>
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Branding</h3><ImageUpload currentImage={form.logo} label="Logo" onUpload={(assetId, url) => setForm({ ...form, logoAssetId: assetId, logo: url })} /></div>
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Agent Information</h3><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Name</label><input type="text" className="input-field" value={form.agentName || ''} onChange={(e) => setForm({ ...form, agentName: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Title</label><input type="text" className="input-field" value={form.agentTitle || ''} onChange={(e) => setForm({ ...form, agentTitle: e.target.value })} /></div></div><ImageUpload currentImage={form.agentPhoto} label="Agent Photo" onUpload={(assetId, url) => setForm({ ...form, agentPhotoAssetId: assetId, agentPhoto: url })} /></div>
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">About Section</h3><div><label className="block text-sm font-medium mb-2">About Headline</label><input type="text" className="input-field" value={form.aboutHeadline || ''} onChange={(e) => setForm({ ...form, aboutHeadline: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">About Text</label><textarea className="input-field" rows={6} value={form.aboutText || ''} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} /></div><Accordion title={`Stats (${stats.length})`}><div className="space-y-3">{stats.map((s, i) => <div key={s._key || i} className="grid grid-cols-12 gap-2"><input type="text" className="input-field col-span-4" placeholder="Value" value={s.value} onChange={(e) => updateStat(i, 'value', e.target.value)} /><input type="text" className="input-field col-span-7" placeholder="Label" value={s.label} onChange={(e) => updateStat(i, 'label', e.target.value)} /><button type="button" onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className="p-2 text-red-500"><X size={16} /></button></div>)}<button type="button" onClick={addStat} className="btn-secondary w-full"><Plus size={16} /> Add Stat</button></div></Accordion></div>
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Contact Info</h3><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Phone</label><input type="tel" className="input-field" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Email</label><input type="email" className="input-field" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div></div><div><label className="block text-sm font-medium mb-2">Address</label><input type="text" className="input-field" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Office Hours</label><textarea className="input-field" rows={3} value={form.officeHours || ''} onChange={(e) => setForm({ ...form, officeHours: e.target.value })} /></div></div>
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Social Media</h3><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Instagram</label><input type="url" className="input-field" value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">Facebook</label><input type="url" className="input-field" value={form.facebook || ''} onChange={(e) => setForm({ ...form, facebook: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">LinkedIn</label><input type="url" className="input-field" value={form.linkedin || ''} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} /></div><div><label className="block text-sm font-medium mb-2">YouTube</label><input type="url" className="input-field" value={form.youtube || ''} onChange={(e) => setForm({ ...form, youtube: e.target.value })} /></div></div></div>
    <div className="bg-white p-6 border rounded-xl space-y-4"><h3 className="font-display text-lg text-brand-navy">Legal</h3><div><label className="block text-sm font-medium mb-2">TREC Link</label><input type="url" className="input-field" value={form.trecLink || ''} onChange={(e) => setForm({ ...form, trecLink: e.target.value })} /></div></div>
    <div className="flex justify-end"><button onClick={handleSave} className="btn-gold" disabled={saving}>{saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Settings</button></div>
  </div>
}

function AdminDashboard({ user, onLogout }: { user: { name?: string | null; email?: string | null }; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState({ n: true, p: true, d: true, s: true })
  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [nRes, pRes, dRes, sRes] = await Promise.all([
        fetch('/api/admin/neighborhoods', { credentials: 'include' }),
        fetch('/api/admin/properties', { credentials: 'include' }),
        fetch('/api/admin/deals', { credentials: 'include' }),
        fetch('/api/admin/settings', { credentials: 'include' })
      ])
      if (nRes.ok) setNeighborhoods(await nRes.json())
      if (pRes.ok) setProperties(await pRes.json())
      if (dRes.ok) setDeals(await dRes.json())
      if (sRes.ok) setSettings(await sRes.json())
    } catch (e) { setToast({ message: e instanceof Error ? e.message : 'Failed', type: 'error' }) }
    finally { setLoading({ n: false, p: false, d: false, s: false }) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const seed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/seed?type=all', { method: 'POST', credentials: 'include' })
      if (res.ok) { setToast({ message: 'Demo data loaded!', type: 'success' }); fetchAll() }
      else { setToast({ message: 'Failed', type: 'error' }) }
    } catch { setToast({ message: 'Failed', type: 'error' }) }
    finally { setSeeding(false) }
  }

  const saveEntity = async (endpoint: string, data: unknown, method: 'POST' | 'PUT') => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })
      if (res.ok) { setToast({ message: 'Saved!', type: 'success' }); fetchAll() }
      else { const d = await res.json(); setToast({ message: d.error || 'Failed', type: 'error' }) }
    } catch { setToast({ message: 'Failed', type: 'error' }) }
    finally { setSaving(false) }
  }

  const deleteEntity = async (endpoint: string, id: string) => {
    try {
      await fetch(`/api/admin/${endpoint}?id=${id}`, { method: 'DELETE', credentials: 'include' })
      setToast({ message: 'Deleted', type: 'success' })
      fetchAll()
    } catch { setToast({ message: 'Failed', type: 'error' }) }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'neighborhoods', label: 'Communities', icon: MapPin },
    { id: 'deals', label: 'Deals', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
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
            <span className="text-sm text-white/70">{user.email}</span>
            <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-brand-navy text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50 border'}`}
            >
              <t.icon size={18} />
              {t.label}
              {t.id === 'deals' && <Construction size={14} className="text-amber-500" />}
            </button>
          ))}
        </div>
        {activeTab === 'dashboard' && <DashboardTab properties={properties} deals={deals} neighborhoods={neighborhoods} onSeed={seed} seeding={seeding} />}
        {activeTab === 'properties' && <PropertiesTab properties={properties} neighborhoods={neighborhoods} loading={loading.p} onSave={(p) => saveEntity('properties', p, p._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('properties', id)} saving={saving} />}
        {activeTab === 'neighborhoods' && <NeighborhoodsTab neighborhoods={neighborhoods} loading={loading.n} onSave={(n) => saveEntity('neighborhoods', n, n._id ? 'PUT' : 'POST')} onDelete={(id) => deleteEntity('neighborhoods', id)} saving={saving} />}
        {activeTab === 'deals' && <DealsTab />}
        {activeTab === 'settings' && <SettingsTab settings={settings} loading={loading.s} onSave={(s) => saveEntity('settings', s, 'PUT')} saving={saving} />}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default function AdminPage() {
  // Handle undefined during SSR prerender (treat as loading)
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status ?? 'loading'

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    )
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <AdminDashboard
      user={session.user || {}}
      onLogout={() => signOut({ callbackUrl: '/' })}
    />
  )
}
