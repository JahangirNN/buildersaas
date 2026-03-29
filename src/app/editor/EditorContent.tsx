'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Loader2, Monitor, Smartphone, Sparkles, Save, ArrowLeft, Plus, Trash2,
  Eye, Type, ShoppingBag, Palette, Settings2, ImageIcon, MousePointerClick,
  CheckCircle, ChevronDown, Upload, X, Zap, ExternalLink,
  Undo2, Redo2
} from 'lucide-react'
import { generateSiteAction } from '@/actions/generate'
import { saveContentAction } from '@/actions/saveContent'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

/* ─── Undo/Redo Hook ────────────────────────── */
function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<T[]>([initialState])

  const pushState = useCallback((newState: T) => {
    setHistory(prev => {
      const copy = prev.slice(0, index + 1)
      copy.push(newState)
      return copy
    })
    setIndex(prev => prev + 1)
  }, [index])

  const undo = useCallback(() => {
    if (index > 0) setIndex(prev => prev - 1)
  }, [index])

  const redo = useCallback(() => {
    if (index < history.length - 1) setIndex(prev => prev + 1)
  }, [index, history.length])

  return {
    state: history[index],
    pushState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    resetTo: (state: T) => {
      setHistory([state])
      setIndex(0)
    }
  }
}

/* ─── Inline Image Uploader ──────────────────────── */
function ImageUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      if (res.ok && data.url) {
        onChange(data.url)
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) upload(e.target.files[0])
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">{label}</label>}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-28 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <label className="px-3 py-1.5 bg-white text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-gray-200 transition">
              Replace
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            <button onClick={() => onChange('')} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition">
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <label
          className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]) }}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-white/40 mx-auto" />
          ) : (
            <>
              <Upload size={20} className="text-white/30 mx-auto mb-2" />
              <span className="text-xs text-white/40 font-medium">Drop image or click to upload</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  )
}

/* ─── Collapsible Section ────────────────────────── */
function Section({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-white/5 transition"
      >
        <Icon size={15} className="text-white/40 shrink-0" />
        <span className="text-[13px] font-semibold text-white/80 flex-1">{title}</span>
        <ChevronDown size={14} className={`text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

/* ─── Text Input Field ────────────────────────── */
function Field({ label, value, onChange, multiline, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string; rows?: number
}) {
  const cls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-white/90 placeholder-white/25 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition resize-none font-[inherit]"
  return (
    <div>
      <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} rows={rows || 3} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  )
}

/* ─── Types ────────────────────────── */
interface ProductItem {
  name: string
  desc: string
  price: string
  image_url: string
}

/* ═══════════════════════════════════════════════════
   MAIN EDITOR COMPONENT
   ═══════════════════════════════════════════════════ */
export default function EditorContent() {
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('slug')
  const templateParam = searchParams.get('template') || 'portfolio-v1'

  const [templateId, setTemplateId] = useState(templateParam)
  const [initialLoading, setInitialLoading] = useState(!!editSlug)

  // Content state (Unified object to handle any template field)
  const [content, setContent] = useState<Record<string, any>>({
    HERO_HEADLINE: 'Crafting worlds\\nbetween reality\\n& imagination.',
    SUB_HEADLINE: 'Award-winning creative director specializing in brand identity and visual storytelling.',
    ABOUT_SECTION: 'With over a decade of experience in design and creative direction, I transform complex ideas into compelling visual narratives.',
    CTA_PRIMARY_TEXT: 'Get Started',
    CTA_SECONDARY_TEXT: 'Learn More',
    HERO_BG_IMAGE: '',
    LOGO_URL: '',
    PRODUCT_LIST: [
      { name: 'Service One', desc: 'A great service we offer.', price: '₹10,000', image_url: '' },
      { name: 'Service Two', desc: 'Another amazing offering.', price: '₹20,000', image_url: '' },
      { name: 'Service Three', desc: 'Our premium package.', price: '₹35,000', image_url: '' },
    ]
  })

  const [name, setName] = useState('My Business')
  const [whatsapp, setWhatsapp] = useState('')
  const [bio, setBio] = useState('')
  const [themeColor, setThemeColor] = useState('#CA8A04')
  
  // Dynamic fields discovered from the template iframe
  const [discoveredFields, setDiscoveredFields] = useState<Array<{ id: string; label: string; type: 'text' | 'image'; value: string }>>([])

  // UI state
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveResult, setSaveResult] = useState<{ slug: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeField, setActiveField] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  // Set up Undo/Redo history tracking
  const history = useHistory({ content, name, whatsapp, themeColor })

  // Silent sync to history when non-typing events occur (like debounced structural changes)
  useEffect(() => {
    const currentStateStr = JSON.stringify({ content, name, whatsapp, themeColor })
    const historyStateStr = JSON.stringify(history.state)
    if (currentStateStr !== historyStateStr && !initialLoading) {
      const timeout = setTimeout(() => {
        history.pushState({ content, name, whatsapp, themeColor })
      }, 800)
      return () => clearTimeout(timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, name, whatsapp, themeColor])

  // Sync OUT of history block when undo/redo is clicked
  const isUndoing = useRef(false)
  useEffect(() => {
    if (isUndoing.current) {
      setContent(history.state.content)
      setName(history.state.name)
      setWhatsapp(history.state.whatsapp)
      setThemeColor(history.state.themeColor)
      isUndoing.current = false
    }
  }, [history.state])

  const handleUndo = useCallback(() => { isUndoing.current = true; history.undo() }, [history])
  const handleRedo = useCallback(() => { isUndoing.current = true; history.redo() }, [history])

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) handleRedo()
        else handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo])

  // Normalize legacy type names
  const normalizeType = (t: string) => {
    if (t === 'ecommerce') return 'ecommerce-v1'
    if (t === 'portfolio') return 'portfolio-v1'
    return t
  }

  // Load existing site
  useEffect(() => {
    if (!editSlug) return
    async function loadSite() {
      const { data, error } = await supabase
        .from('websites').select('*').eq('slug', editSlug).single()
      if (!error && data) {
        const c = data.content as Record<string, unknown>
        setTemplateId(normalizeType(data.type))
        setName(data.slug)
        if (c) {
          setContent(prev => ({ ...prev, ...c }))
        }
        setSaveResult({ slug: data.slug })
        
        // Reset history baseline to loaded state
        history.resetTo({
          name: data.slug, whatsapp: data.whatsapp_number || '',
          themeColor: (c.THEME_COLOR as string) || themeColor,
          content: { ...content, ...c }
        })
      }
      setInitialLoading(false)
    }
    loadSite()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editSlug])

  // Build preview URL
  const buildPreviewUrl = useCallback(() => {
    const data = {
      ...content,
      name,
      THEME_COLOR: themeColor,
      WHATSAPP_LINK: whatsapp ? getWhatsAppLink(whatsapp, 'Hello!') : '#',
    }
    const encoded = encodeURIComponent(JSON.stringify(data))
    return `/api/template-preview?id=${templateId}&data=${encoded}&editor=true`
  }, [name, themeColor, whatsapp, content, templateId])

  // Calculate structural state to only trigger full iframe reloads when structural layout changes
  const structuralState = JSON.stringify({ themeColor, products: content.PRODUCT_LIST, logoUrl: content.LOGO_URL, heroBgImage: content.HERO_BG_IMAGE, whatsapp, templateId })

  // Debounced structural preview refresh (avoids full reload on text typing)
  const [previewUrl, setPreviewUrl] = useState('')
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setPreviewUrl(buildPreviewUrl()), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structuralState]) // Explicitly omit buildPreviewUrl to prevent reload on text changes

  // Push real-time text edits to iframe seamlessly via postMessage
  // We use isolated hooks so we don't accidentally broadcast an empty string from an untouched field (which would erase template fallbacks)
  const isReadyForSync = useRef(false)
  useEffect(() => {
    if (!initialLoading) {
      const t = setTimeout(() => { isReadyForSync.current = true }, 600)
      return () => clearTimeout(t)
    }
  }, [initialLoading])

  const useIframeSync = (field: string, value: any) => {
    useEffect(() => {
      if (!isReadyForSync.current || !iframeRef.current?.contentWindow) return
      iframeRef.current.contentWindow.postMessage({ type: 'sf-set-field', field, value }, '*')
    }, [value, field])
  }

  // Sync core discovered fields
  useEffect(() => {
    if (!isReadyForSync.current || !iframeRef.current?.contentWindow) return
    const win = iframeRef.current.contentWindow
    Object.entries(content).forEach(([field, value]) => {
      if (field !== 'PRODUCT_LIST') {
        win.postMessage({ type: 'sf-set-field', field, value }, '*')
      }
    })
  }, [content])
  // Listen for inline edits from iframe
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!e.data?.type) return
      if (e.data.type === 'sf-discover-fields') {
        setDiscoveredFields(e.data.fields)
      }
      if (e.data.type === 'sf-field-select') {
        const fieldId = e.data.field
        setActiveField(fieldId)
        let targetId = `field-${fieldId}`
        
        // Handle sub-fields (like products) by finding the parent container
        if (fieldId.startsWith('PRODUCT_')) {
          const parts = fieldId.split('_')
          if (parts.length >= 2) {
            targetId = `field-PRODUCT_${parts[1]}`
          }
        }

        // Auto-scroll the sidebar to the corresponding field
        setTimeout(() => {
          const element = document.getElementById(targetId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Add a temporary glow/pulse effect
            element.classList.add('ring-2', 'ring-blue-500/50', 'bg-blue-500/10', 'duration-500')
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-blue-500/50', 'bg-blue-500/10')
            }, 2000)
          }
        }, 100)
      }
      if (e.data.type === 'sf-field-update') {
        const { field, value } = e.data
        if (field === 'name') {
           setName(value)
        } else {
          setContent(prev => ({ ...prev, [field]: value }))
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // AI Auto-fill
  async function handleAiFill() {
    if (!name || !bio) { setErrorMsg('Enter a name and bio first.'); return }
    setAiLoading(true); setErrorMsg('')
    const formData = new FormData()
    formData.set('name', name)
    formData.set('whatsapp', whatsapp || '919876543210')
    formData.set('type', templateId)
    formData.set('bio', bio)
    const res = await generateSiteAction(formData)
    if (res.error) { setErrorMsg(res.error) }
    else if (res.success && res.site) {
      const c = res.site.content as Record<string, unknown>
      if (c) {
        setContent(prev => ({ ...prev, ...c }))
      }
      setSaveResult({ slug: res.site.slug })
    }
    setAiLoading(false)
  }

  // Save
  async function handleSave() {
    setSaving(true); setErrorMsg(''); setSaved(false)
    if (editSlug && saveResult?.slug) {
      const res = await saveContentAction(editSlug, content, templateId, whatsapp)
      if (res.error) setErrorMsg(res.error)
      else setSaved(true)
      setSaving(false); return
    }
    const formData = new FormData()
    formData.set('name', name); formData.set('whatsapp', whatsapp || '919876543210')
    formData.set('type', templateId); formData.set('bio', bio || (content.ABOUT_SECTION as string))
    const res = await generateSiteAction(formData)
    if (res.error) setErrorMsg(res.error)
    else if (res.success && res.site) { setSaveResult({ slug: res.site.slug }); setSaved(true) }
    setSaving(false)
  }

  // Product helpers
  function updateProduct(i: number, field: string, value: string) {
    setContent(prev => {
      const next = { ...prev }
      if (next.PRODUCT_LIST && Array.isArray(next.PRODUCT_LIST)) {
        next.PRODUCT_LIST = next.PRODUCT_LIST.map((p: any, idx: number) => 
          idx === i ? { ...p, [field]: value } : p
        )
      }
      return next
    })
  }

  function updateField(id: string, value: string) {
    setContent(prev => ({ ...prev, [id]: value }))
  }

  if (initialLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0c0c0c]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin w-8 h-8 text-white/30" />
          <span className="text-white/40 text-sm font-medium">Loading your site...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0c0c0c] overflow-hidden text-white">

      {/* ═══ TOP TOOLBAR ═══ */}
      <div className="h-12 bg-[#141414] border-b border-white/5 flex items-center justify-between px-3 shrink-0 z-50">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-1.5 text-white/40 hover:text-white transition text-xs font-medium px-2 py-1 rounded-md hover:bg-white/5 shrink-0">
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="w-px h-5 bg-white/10 hidden sm:block" />
          <span className="text-xs font-semibold text-white/60 truncate hidden md:block">{editSlug || 'New Site'}</span>
          <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full font-medium hidden lg:block">{templateId}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Undo/Redo */}
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5 mr-2">
            <button
              onClick={handleUndo} disabled={!history.canUndo}
              className="p-1.5 rounded-md transition-all text-white/40 hover:text-white disabled:opacity-30 disabled:hover:text-white/40" title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={handleRedo} disabled={!history.canRedo}
              className="p-1.5 rounded-md transition-all text-white/40 hover:text-white disabled:opacity-30 disabled:hover:text-white/40" title="Redo (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>

          {/* Sidebar toggle (always visible) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-md transition-all ${sidebarOpen ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
            title="Toggle sidebar"
          >
            <Settings2 size={14} />
          </button>

          {/* View Toggle */}
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <Smartphone size={14} />
            </button>
          </div>

          {saveResult && (
            <Link
              href={`/${saveResult.slug}`}
              target="_blank"
              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-white/50 hover:text-white bg-white/5 rounded-lg border border-white/5 transition hover:bg-white/10"
            >
              <Eye size={12} /> View Live
            </Link>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold transition shadow-lg disabled:opacity-50 ${
              saved
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20'
            }`}
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : saved ? <CheckCircle size={12} /> : <Save size={12} />}
            {saving ? 'Saving...' : saved ? 'Saved!' : editSlug ? 'Save Changes' : 'Publish'}
          </button>
        </div>
      </div>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── LEFT SIDEBAR ─── */}
        {sidebarOpen && (
        <div className="w-full md:w-[340px] bg-[#141414] border-r border-white/5 flex flex-col shrink-0 overflow-hidden absolute md:relative z-40 h-full">

          {/* Active field indicator */}
          {activeField && (
            <div className="mx-4 mt-3 flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
              <MousePointerClick size={12} className="text-blue-400" />
              <span className="text-[11px] text-blue-300 font-semibold">Editing: {activeField.replace(/_/g, ' ')}</span>
            </div>
          )}

          {/* Scrollable sidebar content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">

            {/* AI Section */}
            <div className="p-4 border-b border-white/5">
              <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <Zap size={12} className="text-white" />
                  </div>
                  <span className="text-[13px] font-bold text-white/80">AI Content Writer</span>
                </div>
                <p className="text-[11px] text-white/40 mb-3">Enter your business info and let AI write professional copy.</p>
                <div className="space-y-2 mb-3">
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/90 outline-none focus:border-violet-500/50 placeholder-white/25"
                    placeholder="Business name..."
                  />
                  <textarea
                    value={bio} onChange={e => setBio(e.target.value)} rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/90 outline-none focus:border-violet-500/50 resize-none placeholder-white/25"
                    placeholder="Describe your business in 2-3 sentences..."
                  />
                </div>
                <button
                  onClick={handleAiFill} disabled={aiLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-violet-500/10"
                >
                  {aiLoading ? <><Loader2 size={14} className="animate-spin" /> Writing...</> : <><Sparkles size={14} /> Generate with AI</>}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mx-4 mt-3 bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] p-3 rounded-xl font-medium">{errorMsg}</div>
            )}

            {/* Dynamic Template Fields */}
            {discoveredFields.length > 0 && (
              <Section title="Template Features" icon={Type}>
                <div className="space-y-4">
                  {discoveredFields.filter(f => !f.id.startsWith('PRODUCT_')).map(field => (
                    <div key={field.id} id={`field-${field.id}`}>
                      {field.type === 'image' ? (
                        <ImageUpload 
                          label={field.label} 
                          value={content[field.id] || field.value} 
                          onChange={val => updateField(field.id, val)}
                        />
                      ) : (
                        <Field 
                          label={field.label} 
                          value={content[field.id] || field.value} 
                          onChange={val => updateField(field.id, val)} 
                          multiline={field.id.includes('DESC') || field.id.includes('SECTION') || field.id.includes('HEADLINE')}
                          rows={field.id.includes('SECTION') ? 4 : 2}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Products / Services" icon={ShoppingBag} defaultOpen={false}>
              <div className="space-y-3">
                {(content.PRODUCT_LIST || []).map((product: any, i: number) => (
                  <div key={i} id={`field-PRODUCT_${i}`} className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2.5 relative group scroll-mt-20">
                    <button
                      onClick={() => setContent(prev => ({ ...prev, PRODUCT_LIST: prev.PRODUCT_LIST.filter((_: any, idx: number) => idx !== i) }))}
                      className="absolute top-2 right-2 p-1 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Product {i + 1}</div>
                    <input value={product.name} onChange={e => updateProduct(i, 'name', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/90 outline-none focus:border-blue-500/50 placeholder-white/25" placeholder="Product name" />
                    <textarea value={product.desc} onChange={e => updateProduct(i, 'desc', e.target.value)} rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/90 outline-none focus:border-blue-500/50 resize-none placeholder-white/25" placeholder="Description" />
                    <input value={product.price} onChange={e => updateProduct(i, 'price', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/90 outline-none focus:border-blue-500/50 placeholder-white/25" placeholder="₹ Price" />
                    <ImageUpload value={product.image_url} onChange={url => updateProduct(i, 'image_url', url)} label="Product Image" />
                  </div>
                ))}
                <button
                  onClick={() => setContent(prev => ({ ...prev, PRODUCT_LIST: [...(prev.PRODUCT_LIST || []), { name: '', desc: '', price: '', image_url: '' }] }))}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-white/30 text-xs font-semibold flex items-center justify-center gap-2 hover:border-white/20 hover:text-white/50 transition"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>
            </Section>

            <Section title="Brand Assets" icon={ImageIcon} defaultOpen={false}>
              <ImageUpload value={content.LOGO_URL} onChange={val => updateField('LOGO_URL', val)} label="Logo" />
              <ImageUpload value={content.HERO_BG_IMAGE} onChange={val => updateField('HERO_BG_IMAGE', val)} label="Hero Background Image" />
            </Section>

            <Section title="Style & Settings" icon={Palette} defaultOpen={false}>
              <div>
                <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Theme Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    value={themeColor} onChange={e => setThemeColor(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white/90 outline-none focus:border-blue-500/50 font-mono"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['#CA8A04', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#84CC16', '#F43F5E'].map(c => (
                    <button
                      key={c} onClick={() => setThemeColor(c)}
                      className={`w-7 h-7 rounded-lg transition-all hover:scale-110 ${themeColor === c ? 'ring-2 ring-offset-1 ring-white ring-offset-[#141414]' : 'ring-1 ring-white/10'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <Field label="WhatsApp Number" value={whatsapp} onChange={setWhatsapp} placeholder="919876543210" />
              <Field label="Business Name" value={name} onChange={setName} placeholder="Your brand name" />
            </Section>

          </div>

          {/* Bottom status bar */}
          {saveResult && (
            <div className="shrink-0 p-3 border-t border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/40 font-medium">Live at</span>
                <Link href={`/${saveResult.slug}`} target="_blank" className="text-blue-400 font-semibold hover:underline flex items-center gap-1 truncate">
                  {origin}/{saveResult.slug} <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          )}
        </div>
        )}

        <div className="flex-1 flex items-center justify-center p-2 md:p-4 bg-[#0a0a0a] overflow-hidden relative">

          <div
            className={`h-full bg-white transition-all duration-500 shadow-2xl overflow-hidden relative ${
              viewMode === 'desktop'
                ? 'w-full rounded-xl'
                : 'w-full max-w-[375px] rounded-[2rem] ring-4 ring-white/5'
            }`}
          >
            {/* Browser chrome bar */}
            <div className="h-7 bg-[#e8e8e8] flex items-center px-3 gap-1.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <div className="flex-1 mx-8 h-4 bg-white rounded-md" />
            </div>

            {previewUrl ? (
              <iframe
                ref={iframeRef}
                key={previewUrl}
                src={previewUrl}
                className="w-full border-0"
                style={{ height: 'calc(100% - 28px)' }}
                title="Live Preview"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <Loader2 className="animate-spin w-8 h-8" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
