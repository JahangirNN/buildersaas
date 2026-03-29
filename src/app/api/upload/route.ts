import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Using supabaseAdmin bypasses RLS policies
    const { data, error } = await supabaseAdmin.storage
      .from('user-assets')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('user-assets')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl })

  } catch (err: any) {
    console.error('Upload API Exception:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
