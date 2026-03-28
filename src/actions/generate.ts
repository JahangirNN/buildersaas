'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin } from '@/lib/supabase'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateSiteAction(formData: FormData) {
  const name = formData.get('name') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const type = formData.get('type') as string;
  const bio = formData.get('bio') as string;

  if (!name || !whatsapp || !type || !bio) {
    return { error: 'All fields are required.' };
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    // 1. Generate Content via Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `You are a content strategist. Based on the user's bio and site type (${type}), generate a website structure. Return ONLY JSON matching this exact structure:
{
  "hero": { 
    "headline": "...", 
    "subheadline": "...",
    "image_url": "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80" 
  },
  "about": "...",
  "items": [
    { 
      "name": "...", 
      "desc": "...", 
      "price": "₹...", 
      "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" 
    }
  ],
  "theme_color": "#HEXCODE"
}

Rule: Instruct Gemini to use realistic, generic Unsplash image URLs based on the user's business type, and return a strict price (like ₹999 or "Custom") instead of a fake URL.

User Bio: ${bio}
Business/Person Name: ${name}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let generatedContent;
    try {
      generatedContent = JSON.parse(responseText);
    } catch {
      return { error: 'Failed to process AI content (Invalid JSON)' };
    }

    // 2. Save to Supabase using Admin client
    const { data: siteRecord, error: dbError } = await supabaseAdmin
      .from('websites')
      .insert({
        slug,
        type,
        whatsapp_number: whatsapp,
        content: generatedContent,
        is_paid: false
      })
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return { error: 'A site with a similar name already exists! Please try a different name.' };
      }
      return { error: dbError.message };
    }

    return { success: true, site: siteRecord };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred in AI generation.' };
  }
}
