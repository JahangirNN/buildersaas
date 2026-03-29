import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Smartphone } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-black selection:text-white">
      {/* Spacer for sticky header */}
      <div className="h-20"></div>
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold mb-8 border border-gray-200 shadow-sm text-gray-700 mx-auto relative z-10">
          <Sparkles size={14} className="text-yellow-500" />
          <span>AI Template Creation Engine v1.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-balance max-w-5xl relative z-10 text-gray-900">
          Design beautiful sites in seconds. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">No code required.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 text-balance leading-relaxed relative z-10 font-medium tracking-tight">
          Pick a world-class template, let our AI write your copy, and instantly edit images with a single click. Publish lightning-fast on the Edge.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full sm:w-auto">
          <Link
            href="/editor?template=portfolio-v1"
            className="w-full sm:w-auto bg-black text-white text-base font-bold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 ring-4 ring-black/10"
          >
            Start Building Free
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/templates"
            className="w-full sm:w-auto bg-white border border-gray-200 text-gray-900 text-base font-bold px-8 py-4 rounded-full transition-all shadow-sm hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            View Templates
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-white py-24 border-t border-gray-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-16 md:text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">Everything you need to launch.</h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto text-balance">We removed the complex canvas and replaced it with an ultra-fast generation pipeline.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#fafafa] border border-gray-100 p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">AI Copywriting</h3>
              <p className="text-gray-500 leading-relaxed text-sm">Describe your business in one sentence, and Gemini generates a high-converting landing page instantly.</p>
            </div>
            
            <div className="bg-[#fafafa] border border-gray-100 p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Live Preview</h3>
              <p className="text-gray-500 leading-relaxed text-sm">See exactly what your customers see via our immediate device-responsive split-screen iframe.</p>
            </div>

            <div className="bg-[#fafafa] border border-gray-100 p-8 rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Asset Management</h3>
              <p className="text-gray-500 leading-relaxed text-sm">Securely upload your own logo, hero backgrounds, and product images directly into your generated template.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-bold tracking-tight text-gray-900">SiteForge</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">© 2026 SiteForge. Deploying globally on Cloudflare Edge.</p>
        </div>
      </footer>
    </main>
  )
}
