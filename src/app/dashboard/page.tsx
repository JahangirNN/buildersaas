'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Loader2, Globe, ExternalLink, Plus, Layout, Settings, Trash2 } from 'lucide-react'
import Link from 'next/link'


interface UserSite {
  id: string
  slug: string
  type: string
  created_at: string
  content: any
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sites, setSites] = useState<UserSite[]>([])

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        // Fetch sites for this user
        // Note: Currently sites table might not have user_id. 
        // We will fetch all sites for now, or filter if user_id exists.
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          setSites(data)
        }
      }
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) return

    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('slug', slug)

    if (error) {
      alert('Error deleting site: ' + error.message)
    } else {
      setSites(sites.filter(s => s.slug !== slug))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-6 text-center">
        <h2 className="text-2xl font-black mb-4">Access Denied</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Please sign in with Google to view your dashboard and manage your generated websites.</p>
        <Link href="/" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg">Return Home</Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafafa] transition-all selection:bg-black selection:text-white">
      <div className="h-20" /> {/* Navbar spacer */}
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-2">My Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage your generated sites and customize assets.</p>
          </div>
          <Link 
            href="/templates" 
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
          >
            <Plus size={18} /> Create New Site
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 p-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Layout size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No sites found</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">You haven't generated any websites yet. Pick a template to get started.</p>
            <Link href="/templates" className="text-black font-bold border-b-2 border-black pb-1 hover:opacity-70 transition">Browse Templates →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site) => (
              <div key={site.id} className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-black/10 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1">
                <div className="h-44 bg-gray-50 border-b border-gray-100 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                      <Globe size={20} className="text-blue-500" />
                    </div>
                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {site.type}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 truncate mb-1">{site.slug}</h3>
                    <p className="text-xs text-gray-400 font-bold">{new Date(site.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="p-6 bg-white flex gap-3">
                  <Link 
                    href={`/${site.slug}`} 
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-black hover:text-white transition-all rounded-xl text-sm font-bold text-gray-600 shadow-sm"
                  >
                    View Live <ExternalLink size={14} />
                  </Link>
                  <Link 
                    href={`/editor?slug=${site.slug}`}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition-all"
                    title="Site Settings"
                  >
                    <Settings size={18} className="text-gray-400 group-hover:text-black" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(site.slug)}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-xl transition-all group/del"
                    title="Delete Site"
                  >
                    <Trash2 size={18} className="text-gray-400 group-hover/del:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
