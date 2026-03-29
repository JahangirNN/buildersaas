'use client'

import { useState, useEffect } from 'react'
import { generateSiteAction } from '@/actions/generate'
import { Loader2, Monitor, Smartphone, CheckCircle, Sparkles, Image as ImageIcon, ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { AssetUploader } from '@/components/AssetUploader'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface SiteResult {
  slug: string;
  type: string;
  whatsapp_number: string;
  content: Record<string, unknown>;
  bio?: string;
}

export default function BuilderForm() {
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('slug')
  const templateParam = searchParams.get('template')
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!editSlug)
  const [result, setResult] = useState<null | SiteResult>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [userId, setUserId] = useState<string | undefined>()

  const defaultType = result?.type || templateParam || 'portfolio-v1'

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    async function loadInitial() {
      const { data: { session } } = await supabase.auth.getSession()
      setUserId(session?.user?.id)

      if (editSlug) {
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .eq('slug', editSlug)
          .single()

        if (!error && data) {
          setResult(data)
        }
        setInitialLoading(false)
      }
    }
    loadInitial()
  }, [editSlug])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    if (editSlug) {
      formData.append('existing_slug', editSlug)
    }

    const res = await generateSiteAction(formData, userId)

    if (res.error) {
      setErrorMsg(res.error)
    } else if (res.success) {
      setResult(res.site)
    }
    setLoading(false)
  }

  const adminWhatsAppLink = result ? getWhatsAppLink('919000000000', `Hi! I want to activate my website: ${origin}/${result.slug}`) : '#';

  const handleAssetUpload = () => {
    // In a real app, you'd send this to the backend to update the JSON
    // For now, we just refresh the iframe by forcing a rerender
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
    alert('Asset uploaded! It will be applied to your site data.');
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[800px] max-w-7xl mx-auto w-full px-4 md:px-8 py-12">
      {/* Left side: Flow Container */}
      <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 flex flex-col">
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-gray-100 flex-1 flex flex-col relative overflow-hidden">
          
          {/* Subtle background gradient top right */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          {!initialLoading && (
            <div className="flex flex-col h-full gap-8">
              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-6 text-gray-700 flex flex-col z-10 shrink-0">
                <div className="mb-4">
                  <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    Site Configuration
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Website Details</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">Business/Brand Name</label>
                  <input name="name" defaultValue={result?.slug || ''} required className="w-full border-2 border-transparent bg-gray-50 p-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all shadow-sm text-sm" placeholder="e.g. Apex Studio" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">WhatsApp Number</label>
                  <input name="whatsapp" defaultValue={result?.whatsapp_number || ''} required className="w-full border-2 border-transparent bg-gray-50 p-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all shadow-sm text-sm" placeholder="e.g. 919876543210" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-800">Website Layout Type</label>
                  <select name="type" defaultValue={defaultType} className="w-full border-2 border-transparent bg-gray-50 p-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all shadow-sm cursor-pointer appearance-none font-medium text-sm">
                    <option value="portfolio-v1">Portfolio Noir</option>
                    <option value="ecommerce-v1">Natural Botanics</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col min-h-[120px]">
                  <label className="block text-sm font-bold mb-2 text-gray-800">Brand Biography & Mission</label>
                  <textarea name="bio" defaultValue={(result?.content as Record<string, unknown>)?.ABOUT_SECTION as string || ''} required className="w-full border-2 border-transparent bg-gray-50 p-3 rounded-xl outline-none focus:border-black focus:bg-white transition-all shadow-sm flex-1 resize-none text-sm" placeholder="Describe your philosophy, products, or services." />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> AI Generating...</>
                  ) : (
                    <><Sparkles size={18}/> {result ? 'Regenerate Content' : 'Generate Premium Site'}</>
                  )}
                </button>
                {errorMsg && <p className="text-red-500 text-xs font-bold flex items-center gap-2">{errorMsg}</p>}
              </form>

              {/* Success / Asset Uploader Section */}
              {result && (
                <div className="pt-8 border-t border-gray-100 flex-1 flex flex-col z-10 animate-fade-in">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-4">
                      <CheckCircle size={14} /> Live on Edge
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-inner flex items-center justify-between">
                      <Link href={`/${result.slug}`} className="font-bold text-sm text-black hover:underline truncate" target="_blank">
                        {origin}/{result.slug}
                      </Link>
                      <ExternalLink size={16} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="mb-6 flex-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2 text-sm">
                      <ImageIcon size={16} /> Asset Management
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">Upload your real logo or background to override the AI placeholder.</p>
                    <AssetUploader onUploadComplete={handleAssetUpload} />
                  </div>

                  <div className="mt-auto">
                    <a href={adminWhatsAppLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white text-center py-3.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition hover:-translate-y-0.5 flex justify-center items-center gap-2">
                      <MessageCircle size={18} /> Attach Custom Domain via WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Live Preview as iframe */}
      <div className="flex-1 flex flex-col bg-[#f5f5f7] rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-inner relative">
        <div className="h-20 px-8 bg-white/40 backdrop-blur-xl border-b border-white/50 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 absolute top-0 left-0 right-0 z-20">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Edge Preview Engine
          </h2>
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-white mt-2 md:mt-0">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-black font-bold' : 'text-gray-500 hover:text-black font-medium'}`}
              title="Desktop View"
            >
              <Monitor size={16} /> Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-black font-bold' : 'text-gray-500 hover:text-black font-medium'}`}
              title="Mobile View"
            >
              <Smartphone size={16} /> Mobile
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden relative p-8 pt-28">
          {loading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-gray-900">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                 <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                 <Sparkles className="text-blue-500 animate-pulse" />
              </div>
              <h3 className="font-black text-2xl tracking-tight text-center mb-2">Designing Layout...</h3>
              <p className="text-gray-500 font-medium text-center max-w-sm">Generating intelligent copy, structuring data, and orchestrating components.</p>
            </div>
          ) : result ? (
            <div
              className={`h-full bg-white transition-all duration-700 shadow-2xl rounded-[2rem] ring-8 ring-white overflow-hidden relative ${viewMode === 'desktop' ? 'w-full' : 'w-full max-w-[375px]'}`}
            >
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 flex items-center px-4 gap-1.5 border-b border-gray-200">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <iframe
                id="preview-iframe"
                key={result.slug}
                src={`/${result.slug}`}
                className="w-full h-full border-0 pt-6"
                title="Site Preview"
              />
            </div>
          ) : (
            <div className="h-full w-full max-w-2xl bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-12 text-center transition-all hover:bg-white/80">
              <Monitor size={48} className="text-gray-300 mb-6" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Generation Yet</h3>
              <p className="text-base font-medium">Configure your brand details on the left panel. Your high-fidelity, interactive preview will deploy here instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
