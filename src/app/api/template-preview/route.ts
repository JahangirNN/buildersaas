import { renderTemplate } from '@/lib/templateEngine'
import { getEditorInjectionScript } from '@/lib/editorInjection'
import { NextRequest } from 'next/server'

// Demo data for each template preview
const DEMO_DATA: Record<string, Record<string, unknown>> = {
  'portfolio-v1': {
    name: 'Alex Morgan',
    HERO_HEADLINE: 'Crafting worlds\\nbetween reality\\n& imagination.',
    SUB_HEADLINE: 'Award-winning creative director specializing in brand identity, digital experiences, and visual storytelling.',
    ABOUT_SECTION: 'With over a decade of experience in design and creative direction, I transform complex ideas into compelling visual narratives. My work spans branding, digital product design, and immersive experiences for clients ranging from startups to Fortune 500 companies.',
    THEME_COLOR: '#CA8A04',
    WHATSAPP_LINK: 'https://wa.me/919876543210?text=Hello!',
    PRODUCT_LIST: [
      {
        name: 'Brand Identity System',
        desc: 'Complete visual identity including logo, typography, and brand guidelines.',
        price: '₹25,000',
        image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80'
      },
      {
        name: 'Website Redesign',
        desc: 'Modern, responsive website design with seamless user experience.',
        price: '₹40,000',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
      },
      {
        name: 'Social Media Kit',
        desc: 'Cohesive social media templates and content strategy package.',
        price: '₹15,000',
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80'
      }
    ]
  },
  'ecommerce-v1': {
    name: 'Green Leaf Co.',
    HERO_HEADLINE: 'Pure Herbal Care\\nfrom the Heart of Nature.',
    SUB_HEADLINE: 'Handcrafted skincare and haircare products made with 100% natural Indian herbs.',
    ABOUT_SECTION: 'At Green Leaf, we believe in the power of ancient herbal wisdom. Our products are small-batch crafted to ensure the highest potency and purity for your skin and hair.',
    THEME_COLOR: '#10b981',
    WHATSAPP_LINK: 'https://wa.me/919920355666?text=Hello!',
    PRODUCT_LIST: [
      {
        name: 'Herbal Hair Oil',
        desc: 'Nourishing blend for strong and lustrous hair.',
        price: '₹499',
        image_url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&q=80'
      },
      {
        name: 'Natural Face Glow',
        desc: 'Gentle cleanser for clear and radiant skin.',
        price: '₹599',
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'
      },
      {
        name: 'Herbal Hair Mask',
        desc: 'Deep conditioning treatment for silky hair.',
        price: '₹449',
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80'
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const templateId = searchParams.get('id') || 'portfolio-v1'

  // Allow overriding any field via query params (for the live editor)
  const overrides: Record<string, unknown> = {}
  const dataParam = searchParams.get('data')
  if (dataParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(dataParam))
      Object.assign(overrides, parsed)
    } catch {
      // ignore bad JSON
    }
  }

  // Normalize legacy type names to versioned IDs
  let resolvedId = templateId
  if (templateId === 'ecommerce') resolvedId = 'ecommerce-v1'
  if (templateId === 'portfolio') resolvedId = 'portfolio-v1'

  const demoData = DEMO_DATA[resolvedId] || DEMO_DATA['portfolio-v1']
  const mergedData = { ...demoData, ...overrides }

  let html = renderTemplate(resolvedId, mergedData as Record<string, unknown> & { name: string; type: string; whatsapp_number: string })

  // Inject editor script when in editor mode
  const isEditor = searchParams.get('editor') === 'true'
  if (isEditor) {
    html = html.replace('</body>', getEditorInjectionScript() + '</body>')
  }

  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  })
}
