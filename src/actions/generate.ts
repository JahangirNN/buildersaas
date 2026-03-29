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
  const templateId = formData.get('type') as string; // Store original template ID
  let type = templateId;
  // Denormalize all portfolio/ecommerce variants to satisfy websites_type_check constraint
  if (type.startsWith('portfolio')) type = 'portfolio';
  if (type.startsWith('ecommerce')) type = 'ecommerce';
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

    // Build a type-aware prompt so the AI generates the right field keys
    const isV2 = type === 'portfolio-v2';
    const isV3 = type === 'portfolio-v3';
    const isV4 = type === 'portfolio-v4';

    let schemaBlock = '';
    if (isV2) {
      schemaBlock = `{
  "HERO_HEADLINE": "...",
  "ROLE_TITLE": "...",
  "SUB_HEADLINE": "...",
  "ABOUT_SECTION": "...",
  "STAT_1_VAL": "...", "STAT_1_LABEL": "...",
  "STAT_2_VAL": "...", "STAT_2_LABEL": "...",
  "STAT_3_VAL": "...", "STAT_3_LABEL": "...",
  "REVIEW_1_TEXT": "...", "REVIEW_1_AUTHOR": "...",
  "REVIEW_2_TEXT": "...", "REVIEW_2_AUTHOR": "...",
  "CTA_PRIMARY_TEXT": "Book a Free Call",
  "PRODUCT_LIST": [{ "name": "...", "desc": "...", "price": "₹..." }],
  "THEME_COLOR": "#6366f1"
}`;
    } else if (isV3) {
      schemaBlock = `{
  "HERO_HEADLINE": "...",
  "TAGLINE": "...",
  "SUB_HEADLINE": "...",
  "ABOUT_SECTION": "...",
  "STAT_1_VAL": "...", "STAT_1_LABEL": "...",
  "STAT_2_VAL": "...", "STAT_2_LABEL": "...",
  "STAT_3_VAL": "...", "STAT_3_LABEL": "...",
  "CTA_PRIMARY_TEXT": "Start a Project",
  "PRODUCT_LIST": [{ "name": "...", "desc": "...", "price": "View", "image_url": "https://images.unsplash.com/photo-[real-id]?w=800&q=80" }],
  "THEME_COLOR": "#1a1a1a"
}`;
    } else if (isV4) {
      schemaBlock = `{
  "HERO_HEADLINE": "...",
  "ROLE_TITLE": "...",
  "SUB_HEADLINE": "...",
  "ABOUT_SECTION": "...",
  "STACK_TAGS": "TypeScript, React, Node.js, ...",
  "STAT_1_VAL": "...", "STAT_1_LABEL": "Years Coding",
  "STAT_2_VAL": "...", "STAT_2_LABEL": "GitHub Stars",
  "STAT_3_VAL": "...", "STAT_3_LABEL": "OSS Projects",
  "CTA_PRIMARY_TEXT": "Hire Me",
  "PRODUCT_LIST": [{ "name": "...", "desc": "...", "price": "Open Source" }],
  "THEME_COLOR": "#22d3ee"
}`;
    } else {
      // Default (portfolio-v1 / ecommerce-v1)
      schemaBlock = `{
  "HERO_HEADLINE": "...",
  "SUB_HEADLINE": "...",
  "ABOUT_SECTION": "...",
  "PRODUCT_LIST": [{ "name": "...", "desc": "...", "price": "...", "image_url": "https://images.unsplash.com/photo-[real-id]?w=600&q=80" }],
  "THEME_COLOR": "#HEXCODE"
}`;
    }

    const prompt = `You are an expert copywriter. Generate JSON content for a ${type} website.
Return EXACTLY ONE JSON object with NO markdown code blocks. Use ONLY these keys:
${schemaBlock}

Rules:
1. PRODUCT_LIST must have EXACTLY 6 items.
2. For image_url fields, use REAL valid Unsplash photo IDs. Format: https://images.unsplash.com/photo-[real-id]?w=600&q=80
3. Use \\n for linebreaks inside headlines.
4. Write compelling, professional copy tailored to the business.
5. THEME_COLOR should match the industry (e.g. creative = warm, tech = blue/cyan).

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
    // Inject the exact template ID into content so we can recover it on load
    const contentToSave = { ...generatedContent, TEMPLATE_ID: templateId };
    const { data: siteRecord, error: dbError } = await supabaseAdmin
      .from('websites')
      .upsert({
        slug,
        type,
        whatsapp_number: whatsapp,
        content: contentToSave,
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
