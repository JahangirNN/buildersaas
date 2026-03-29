import { Suspense } from 'react'
import EditorContent from './EditorContent'
import { Loader2 } from 'lucide-react'

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#F8F8F8]">
          <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
