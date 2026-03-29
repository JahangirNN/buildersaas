'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabaseAdmin } from '@/lib/supabase'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function generateSiteAction(formData: FormData, userId?: string) {
  // In Cloudflare Workers, secrets live on the env binding, not process.env.
  // getCloudflareContext({async:true}) is the correct way to access them in Server Actions.
  let apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    try {
      const ctx = await getCloudflareContext({ async: true });
      apiKey = (ctx.env as Record<string, string>).GEMINI_API_KEY;
    } catch {
    }
  }

  if (!apiKey || apiKey.trim() === '') {
    return { error: 'Server Error: GEMINI_API_KEY is not set. Check wrangler.jsonc or Cloudflare Dashboard.' };
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const name = formData.get('name') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const type = formData.get('type') as string;
  const bio = formData.get('bio') as string;
  const existingSlug = formData.get('existing_slug') as string | null;

  if (!name || !whatsapp || !type || !bio) {
    return { error: 'All fields are required.' };
  }

  // Use existing slug if editing, otherwise generate new from name
  const slug = existingSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    // 1. Generate Content via Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `You are an expert copywriter and UI designer. Generate JSON content for a ${type} website based on the user's bio and name.
You MUST return EXACTLY ONE JSON object and NO markdown formatting or inside quotes that can break parsing. You MUST strictly use these keys:
{
  "HERO_HEADLINE": "...", 
  "SUB_HEADLINE": "...",
  "ABOUT_SECTION": "...",
  "PRODUCT_LIST": [
    { 
      "name": "...", 
      "desc": "...", 
      "price": "...", 
      "image_url": "https://images.unsplash.com/photo-[real-id]?w=600&q=80" 
    }
  ],
  "THEME_COLOR": "#HEXCODE"
}

Important Rules:
1. Provide EXACTLY 6 items in the PRODUCT_LIST array (so the user has backups if an image breaks).
2. For image_url, you MUST use REAL, valid Unsplash photo IDs from your training data (e.g. photos of aesthetics, products, nature). NEVER use generic placeholders like picsum. Use format: https://images.unsplash.com/photo-[real-id]?w=600&q=80
3. Replace linebreaks in headlines with \\n.
4. Keep descriptions short and compelling.

Name: ${name}
Bio: ${bio}
Type: ${type}`;

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
      .upsert({
        slug,
        type,
        whatsapp_number: whatsapp,
        content: generatedContent,
        is_paid: false,
        user_id: userId || null
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (dbError) {
      if (dbError.code === '23505') {
        return { error: 'A site with a similar name already exists! Please try a different name.' };
      }
      return { error: dbError.message };
    }

    return { success: true, site: siteRecord };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred in AI generation.';
    return { error: message };
  }
}
