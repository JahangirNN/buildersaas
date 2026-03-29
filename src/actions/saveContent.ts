'use server'

import { supabaseAdmin } from '@/lib/supabase'

export async function saveContentAction(
  slug: string,
  content: Record<string, unknown>,
  type: string,
  whatsapp_number: string
) {
  if (!slug) return { error: 'No slug provided.' }

  const { error } = await supabaseAdmin
    .from('websites')
    .update({
      content,
      type,
      whatsapp_number,
    })
    .eq('slug', slug)

  if (error) return { error: error.message }
  return { success: true }
}
