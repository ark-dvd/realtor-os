'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Lock, Home, Users, FileText, Settings, LogOut, Plus, 
  Search, Edit, Trash2, Eye, MoreVertical, DollarSign,
  TrendingUp, Calendar, Bell
} from 'lucide-react'

// Demo properties for the admin panel
const demoProperties = [
  {
    id: '1',
    title: 'Modern Lakefront Estate',
    address: '1234 Lake Austin Blvd',
    price: 2850000,
    status: 'For Sale',
    beds: 5,
    baths: 4.5,
    sqft: 4800,
    views: 342,
    inquiries: 12,
    lastUpdated: '2024-01-15',
  },
  {
    id: '2',
    title: 'Downtown Luxury Condo',
    address: '200 Congress Ave #2001',
    price: 975000,
    status: 'For Sale',
    beds: 2,
    baths: 2,
    sqft: 1650,
    views: 256,
    inquiries: 8,
    lastUpdated: '2024-01-14',
  },
  {
    id: '3',
    title: 'Tarrytown Family Home',
    address: '3456 Windsor Rd',
    price: 1650000,
    status: 'Pending',
    beds: 4,
    baths: 3,
    sqft: 3200,
    views: 189,
    inquiries: 15,
    lastUpdated: '2024-01-13',
  },
  {
    id: '4',
    title: 'Zilker Modern Retreat',
    address: '789 Zilker Park Way',
    price: 1425000,
    status: 'Sold',
    beds: 3,
    baths: 2.5,
    sqft: 2400,
    views: 421,
    inquiries: 23,
    lastUpdated: '2024-01-10',
  },
]

const demoDeals = [
  { id: '1', client: 'John Smith', property: 'Modern Lakefront Estate', stage: 4, type: 'Buying' },
  { id: '2', client: 'Sarah Johnson', property: '456 Oak Lane', stage: 6, type: 'Selling' },
  { id: '3', client: 'Michael Brown', property: 'Downtown Luxury Condo', stage: 2, type: 'Buying' },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple demo password - in production, use proper authentication
    if (password === 'merav2024') {
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

          <p className="text-center text-sm text-neutral-400 mt-6">
            Demo password: merav2024
          </p>

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

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showPropertyForm, setShowPropertyForm] = useState(false)

  const stats = [
    { label: 'Active Listings', value: '6', icon: Home, change: '+2 this month' },
    { label: 'Active Deals', value: '3', icon: FileText, change: '+1 this week' },
    { label: 'Total Views', value: '1,208', icon: Eye, change: '+15% vs last month' },
    { label: 'Inquiries', value: '58', icon: Users, change: '+8 this week' },
  ]

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top Bar */}
      <header className="bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-display text-xl">Merav Berko</Link>
            <span className="text-white/40">|</span>
            <span className="text-white/70 text-sm">Back Office</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-gold rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/images/merav-berko.jpg"
                  alt="Merav Berko"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm">Merav</span>
            </div>
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
        <div className="flex gap-2 mb-8 border-b border-neutral-200">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
            { id: 'properties', label: 'Properties', icon: Home },
            { id: 'deals', label: 'Active Deals', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-brand-gold text-brand-navy' 
                  : 'border-transparent text-neutral-500 hover:text-brand-navy'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6 border border-neutral-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                      <stat.icon className="text-brand-gold" size={20} />
                    </div>
                  </div>
                  <p className="font-display text-3xl text-brand-navy mb-1">{stat.value}</p>
                  <p className="text-neutral-500 text-sm">{stat.label}</p>
                  <p className="text-green-600 text-xs mt-2">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <div className="bg-white p-6 border border-neutral-200">
                <h3 className="font-display text-lg text-brand-navy mb-4">Recent Inquiries</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Emily Chen', property: 'Modern Lakefront Estate', time: '2 hours ago' },
                    { name: 'David Miller', property: 'Downtown Luxury Condo', time: '5 hours ago' },
                    { name: 'Jessica Wong', property: 'Tarrytown Family Home', time: 'Yesterday' },
                  ].map((inquiry, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                      <div>
                        <p className="font-medium text-brand-navy">{inquiry.name}</p>
                        <p className="text-sm text-neutral-500">{inquiry.property}</p>
                      </div>
                      <span className="text-xs text-neutral-400">{inquiry.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Deals */}
              <div className="bg-white p-6 border border-neutral-200">
                <h3 className="font-display text-lg text-brand-navy mb-4">Active Deals</h3>
                <div className="space-y-4">
                  {demoDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                      <div>
                        <p className="font-medium text-brand-navy">{deal.client}</p>
                        <p className="text-sm text-neutral-500">{deal.property}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          deal.type === 'Buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {deal.type}
                        </span>
                        <p className="text-xs text-neutral-400 mt-1">Stage {deal.stage}/8</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="input-field pl-10"
                />
              </div>
              <button 
                onClick={() => setShowPropertyForm(true)}
                className="btn-gold"
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
                      <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Views</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Inquiries</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Updated</th>
                      <th className="text-right px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {demoProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-brand-navy">{property.title}</p>
                            <p className="text-sm text-neutral-500">{property.address}</p>
                            <p className="text-xs text-neutral-400 mt-1">
                              {property.beds} bed • {property.baths} bath • {property.sqft.toLocaleString()} sqft
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-display text-lg text-brand-navy">{formatPrice(property.price)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            property.status === 'For Sale' 
                              ? 'bg-green-100 text-green-700'
                              : property.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">{property.views}</td>
                        <td className="px-6 py-4 text-neutral-600">{property.inquiries}</td>
                        <td className="px-6 py-4 text-neutral-500 text-sm">{property.lastUpdated}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-neutral-100 rounded transition-colors" title="View">
                              <Eye size={16} className="text-neutral-500" />
                            </button>
                            <button className="p-2 hover:bg-neutral-100 rounded transition-colors" title="Edit">
                              <Edit size={16} className="text-neutral-500" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded transition-colors" title="Delete">
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-brand-navy">Active Transactions</h2>
              <button className="btn-gold">
                <Plus size={18} />
                New Deal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoDeals.map((deal) => (
                <div key={deal.id} className="bg-white p-6 border border-neutral-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-display text-lg text-brand-navy">{deal.client}</p>
                      <p className="text-sm text-neutral-500">{deal.property}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      deal.type === 'Buying' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {deal.type}
                    </span>
                  </div>
                  
                  {/* Mini Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-neutral-500 mb-2">
                      <span>Progress</span>
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
                    <button className="btn-secondary flex-1 py-2 text-sm">View Details</button>
                    <button className="btn-primary flex-1 py-2 text-sm">Update Stage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="font-display text-lg text-brand-navy mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Name</label>
                  <input type="text" className="input-field" defaultValue="Merav Berko" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Email</label>
                  <input type="email" className="input-field" defaultValue="merav@meravberko.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Phone</label>
                  <input type="tel" className="input-field" defaultValue="(512) 599-9995" />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>

            <div className="bg-white p-6 border border-neutral-200">
              <h3 className="font-display text-lg text-brand-navy mb-4">Website Settings</h3>
              <p className="text-neutral-500 text-sm mb-4">
                To update website content, branding, and settings, connect to Sanity CMS.
              </p>
              <a 
                href="https://www.sanity.io/manage" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Open Sanity Studio
              </a>
            </div>
          </div>
        )}

        {/* Property Form Modal */}
        {showPropertyForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="font-display text-xl text-brand-navy">Add New Property</h2>
                <button 
                  onClick={() => setShowPropertyForm(false)}
                  className="p-2 hover:bg-neutral-100 rounded"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Property Title *</label>
                  <input type="text" className="input-field" placeholder="e.g., Modern Lakefront Estate" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Price *</label>
                    <input type="number" className="input-field" placeholder="850000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Status</label>
                    <select className="input-field">
                      <option>For Sale</option>
                      <option>Pending</option>
                      <option>Sold</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Address *</label>
                  <input type="text" className="input-field" placeholder="123 Main St, Austin, TX" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Beds</label>
                    <input type="number" className="input-field" placeholder="4" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Baths</label>
                    <input type="number" step="0.5" className="input-field" placeholder="2.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">Sq Ft</label>
                    <input type="number" className="input-field" placeholder="2500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Description</label>
                  <textarea rows={4} className="input-field resize-none" placeholder="Describe the property..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">Photos</label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <p className="text-neutral-500">Drag and drop images here, or click to upload</p>
                    <input type="file" multiple accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-neutral-200 flex gap-4 justify-end">
                <button 
                  onClick={() => setShowPropertyForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-gold">
                  Save Property
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />
  }

  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
}
