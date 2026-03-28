'use client'

import { useState } from 'react'
import { generateSiteAction } from '@/actions/generate'
import { Loader2, Monitor, Smartphone, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import PortfolioTemplate from '@/components/templates/PortfolioTemplate'
import EcommerceTemplate from '@/components/templates/EcommerceTemplate'
import { getWhatsAppLink } from '@/lib/whatsapp'

export default function BuilderForm() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const res = await generateSiteAction(formData)

    if (res.error) {
      setErrorMsg(res.error)
    } else if (res.success) {
      setResult(res.site)
    }
    setLoading(false)
  }

  // Pre-fill WhatsApp admin activation message
  const adminWhatsAppLink = result ? getWhatsAppLink('919000000000', `Hi! I want to activate my website: ${origin}/${result.slug}`) : '#';

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
      {/* Left side: Input Form (Admin Dashboard style) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col">
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Website Details</h2>
            <p className="text-gray-500 text-sm">Fill in the details below and let AI design a premium site instantly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 text-gray-700 flex flex-col">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">Business/Person Name</label>
              <input name="name" required className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-sm" placeholder="e.g. Rahul Portfolio" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">WhatsApp Number</label>
              <input name="whatsapp" required className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-sm" placeholder="e.g. 919876543210" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-800">Website Type</label>
              <select name="type" className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-sm cursor-pointer appearance-none">
                <option value="portfolio">Portfolio</option>
                <option value="ecommerce">Home Business / E-Commerce</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col min-h-[160px]">
              <label className="block text-sm font-semibold mb-2 text-gray-800">Bio / Description</label>
              <textarea name="bio" required className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-sm flex-1 resize-none" placeholder="Describe your business or yourself here..." />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-black"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  AI is designing your site...
                </>
              ) : "Generate Site"}
            </button>

            {errorMsg && <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-3 rounded-lg border border-red-100">{errorMsg}</p>}
          </form>

          {/* Success Banner */}
          {result && !loading && (
            <div className="mt-8 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3 text-emerald-800 font-bold">
                <CheckCircle size={20} className="text-emerald-500" />
                <span>Website Generated!</span>
              </div>
              <p className="text-sm text-emerald-700 leading-relaxed mb-4">
                Your live link is: <Link href={`/${result.slug}`} className="font-bold underline text-emerald-900" target="_blank">{origin}/{result.slug}</Link>
              </p>
              <a href={adminWhatsAppLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-emerald-600 text-white text-center py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition">
                Click Here to WhatsApp our team to activate it
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Live Preview */}
      <div className="flex-1 flex flex-col bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
        {/* Top Control Bar */}
        <div className="h-16 px-6 bg-white/50 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Preview
          </h2>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('desktop')} 
              className={`p-2 rounded-md flex items-center gap-2 transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
              title="Desktop View"
            >
              <Monitor size={18} />
            </button>
            <button 
              onClick={() => setViewMode('mobile')} 
              className={`p-2 rounded-md flex items-center gap-2 transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-500 hover:text-black'}`}
              title="Mobile View"
            >
              <Smartphone size={18} />
            </button>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden relative p-4 md:p-8">
          {loading ? (
             <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center text-gray-900 rounded-2xl mx-4 md:mx-8 my-4 md:my-8 shadow-2xl">
               <Loader2 className="animate-spin w-12 h-12 mb-4 text-black" />
               <p className="font-bold text-lg">AI is crafting your masterpiece...</p>
               <p className="text-gray-500 text-sm mt-2">Selecting images, writing copy, and building components.</p>
             </div>
          ) : result ? (
            <div 
              style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className={`h-full bg-white transition-all duration-500 shadow-xl rounded-2xl ring-4 ring-black/5 ${viewMode === 'desktop' ? 'w-full' : 'w-full max-w-[375px]'}`}
            >
                 {result.type === 'portfolio' ? (
                   <PortfolioTemplate content={result.content} whatsapp_number={result.whatsapp_number} />
                 ) : (
                   <EcommerceTemplate content={result.content} whatsapp_number={result.whatsapp_number} />
                 )}
            </div>
          ) : (
            <div className="h-full w-full bg-white rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 p-12 text-center">
              <p className="max-w-md text-lg">Fill out the form on the left and hit generate to see the resulting premium website preview right here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
