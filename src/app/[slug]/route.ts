import { supabase } from '@/lib/supabase'
import { renderTemplate } from '@/lib/templateEngine'
import { getWhatsAppLink } from '@/lib/whatsapp'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: site, error } = await supabase
    .from('websites')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !site) {
    return new Response('Not Found', { status: 404 });
  }

  if (!site.is_paid) {
    const underReviewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Under Review</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
  <div class="p-10 bg-white rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-gray-100 text-center max-w-lg mx-auto transform transition-all">
    <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>
    <h1 class="text-3xl font-black mb-4 text-gray-900 tracking-tight">Website Under Review</h1>
    <p class="text-gray-500 text-lg leading-relaxed mb-8 text-balance">This premium website has been successfully generated but is pending activation. If you are the owner, please contact the developer.</p>
    <a 
      href="${getWhatsAppLink('919000000000', `Hi! I want to activate my website: ${slug}`)}"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-lg gap-2"
    >
      Contact Admin on WhatsApp
    </a>
  </div>
</body>
</html>`;
    return new Response(underReviewHtml, { headers: { 'content-type': 'text/html' } });
  }

  const html = renderTemplate(site.type, { 
    name: site.name || slug,
    type: site.type,
    whatsapp_number: site.whatsapp_number,
    ...site.content,
    WHATSAPP_LINK: getWhatsAppLink(site.whatsapp_number, 'Hi! I want to contact you.')
  });

  return new Response(html, { headers: { 'content-type': 'text/html' } });
}
