import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const templates = [
  {
    id: 'portfolio-v1',
    name: 'Portfolio Noir',
    category: 'Portfolio',
    description: 'A dark, cinematic portfolio with video hero, product carousel, WhatsApp CTA, and cart functionality. Perfect for authors, creators, freelancers.',
    tags: ['Dark Mode', 'Video Hero', 'WhatsApp', 'Cart', 'Mobile-First'],
    color: '#CA8A04',
  },
  {
    id: 'portfolio-v2',
    name: 'Glassmorphism Pro',
    category: 'Portfolio',
    description: 'Premium dark glassmorphism design for freelancers and consultants. Features animated glow background, service cards, client reviews, and a bold CTA.',
    tags: ['Dark Mode', 'Glassmorphism', 'Services', 'Reviews', 'Freelancer'],
    color: '#6366f1',
  },
  {
    id: 'portfolio-v3',
    name: 'Minimal Studio',
    category: 'Portfolio',
    description: 'Light, editorial-grade creative studio template. Full-bleed hero, serif typography, hover-reveal gallery grid. Perfect for photographers and designers.',
    tags: ['Light Mode', 'Serif', 'Gallery', 'Full-Bleed', 'Creative'],
    color: '#1a1a1a',
  },
  {
    id: 'portfolio-v4',
    name: 'Dev Terminal',
    category: 'Portfolio',
    description: 'Dark developer portfolio with terminal aesthetic. Tech stack badges, animated cursor, project cards, and mono typography. For engineers and founders.',
    tags: ['Developer', 'Dark Mode', 'Terminal', 'Projects', 'Tech Stack'],
    color: '#22d3ee',
  },
  {
    id: 'ecommerce-v1',
    name: 'Natural Botanics',
    category: 'E-Commerce',
    description: 'A clean, nature-inspired e-commerce template with smooth animations, product cart, and WhatsApp checkout. Perfect for home businesses & handmade goods.',
    tags: ['Nature Theme', 'Green', 'WhatsApp', 'Cart', 'Smooth Scroll'],
    color: '#10b981',
  },
]

export default function TemplateGallery() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
      {/* Spacer for global sticky header */}
      <div className="h-24"></div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-16 md:text-center relative">
        <div className="absolute top-0 right-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 relative z-10 flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-blue-500"/> Template Library
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05] relative z-10 text-balance">
          Choose your<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">perfect design.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto relative z-10 font-medium tracking-tight">
          Every template is built with ultra-premium components. Select your favorite and our AI will inject your content.
        </p>
      </div>

      {/* Template Cards Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {templates.map((tpl) => (
            <div key={tpl.id} className="group bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative">
              
              {/* Scaled iframe Preview */}
              <div className="relative h-[420px] overflow-hidden bg-gray-50 border-b border-gray-100">
                <div className="absolute inset-0 scale-[0.5] origin-top-left w-[200%] h-[200%] pointer-events-none">
                  <iframe
                    src={`/api/template-preview?id=${tpl.id}`}
                    className="w-full h-full border-0"
                    title={`${tpl.name} preview`}
                    loading="lazy"
                  />
                </div>
                {/* Overlay to prevent iframe clicks */}
                <div className="absolute inset-0 z-10" />
                {/* Category badge */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 rounded-full text-xs font-black tracking-wide text-white shadow-lg" style={{ backgroundColor: tpl.color }}>
                    {tpl.category}
                  </span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-8 md:p-10 bg-white">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{tpl.name}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2">{tpl.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {tpl.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-100 text-xs font-bold tracking-tight">{tag}</span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/api/template-preview?id=${tpl.id}`}
                    target="_blank"
                    className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-gray-600 hover:text-black hover:border-gray-200 hover:bg-gray-50 text-sm font-bold text-center transition flex justify-center items-center gap-2"
                  >
                    Live Demo <ArrowRight size={16} />
                  </Link>
                  <Link
                    href={`/editor?template=${tpl.id}`}
                    className="flex-1 py-4 rounded-xl text-white text-sm font-black text-center transition hover:shadow-lg hover:-translate-y-0.5"
                    style={{ backgroundColor: tpl.color }}
                  >
                    Build With AI
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white/50 p-16 text-center transition-colors hover:bg-white">
          <p className="text-4xl mb-4 animate-bounce text-gray-300">🪄</p>
          <h3 className="text-2xl font-black text-gray-700 mb-2 tracking-tight">More templates en route</h3>
          <p className="text-gray-500 text-base font-medium">We&apos;re digitizing highly-converting client sites into scalable templates weekly.</p>
        </div>
      </div>
    </main>
  )
}
