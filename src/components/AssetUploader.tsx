'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, UploadCloud } from 'lucide-react'

export function AssetUploader({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [errorMSG, setErrorMSG] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMSG('')
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    // Strict validation
    if (!file.type.startsWith('image/')) {
      setErrorMSG('Only image files are allowed. No videos.')
      return
    }

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `public/${fileName}`

    try {
      // Assuming a supabase bucket named "user-assets" exists
      const { error: uploadError } = await supabase.storage
        .from('user-assets')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('user-assets')
        .getPublicUrl(filePath)

      onUploadComplete(data.publicUrl)
    } catch (err: any) {
      setErrorMSG('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
        {uploading ? (
          <Loader2 className="animate-spin text-black" size={24} />
        ) : (
          <UploadCloud className="text-gray-400" size={24} />
        )}
        <span className="text-sm font-semibold text-gray-700">
          {uploading ? 'Uploading...' : 'Click or drag image to upload'}
        </span>
      </div>
      {errorMSG && <p className="text-red-500 text-xs font-semibold mt-2">{errorMSG}</p>}
    </div>
  )
}
