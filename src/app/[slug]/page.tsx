import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import PortfolioTemplate from '@/components/templates/PortfolioTemplate'
import EcommerceTemplate from '@/components/templates/EcommerceTemplate'
import { Lock } from 'lucide-react'
import { getWhatsAppLink } from '@/lib/whatsapp'

export default async function PublicSite({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const { data: site, error } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !site) {
    notFound();
  }

  if (!site.is_paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
        <div className="p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-100 text-center max-w-lg mx-auto transform transition-all">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <Lock className="w-10 h-10 text-gray-700" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-black mb-4 text-gray-900 tracking-tight">Website Under Review</h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 text-balance">This premium website has been successfully generated but is pending activation. If you are the owner, please contact the developer.</p>
          <a 
            href={getWhatsAppLink('919000000000', `Hi! I want to activate my website: ${slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-lg gap-2"
          >
            Contact Admin on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (site.type === 'portfolio') {
    return <PortfolioTemplate content={site.content} whatsapp_number={site.whatsapp_number} />
  }

  if (site.type === 'ecommerce') {
    return <EcommerceTemplate content={site.content} whatsapp_number={site.whatsapp_number} />
  }

  // Fallback for other types
  return (
    <div className="min-h-screen bg-gray-900 text-emerald-400 p-8 font-mono overflow-auto">
      <h1 className="text-xl text-white mb-4">RAW JSON DATA (Template Phase 2)</h1>
      <pre className="p-4 bg-gray-800 rounded-lg whitespace-pre-wrap text-sm">
        {JSON.stringify(site, null, 2)}
      </pre>
    </div>
  );
}
