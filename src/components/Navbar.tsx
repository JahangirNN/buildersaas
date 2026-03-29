'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, LayoutDashboard } from 'lucide-react'

export function Navbar(): React.ReactNode {
  const [user, setUser] = useState<User | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Hide entirely on the editor route as it has its own dedicated toolbar
  if (pathname?.startsWith('/editor')) {
    return null
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:rotate-6 transition-transform">S</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">SiteForge</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/templates" className="text-sm font-medium text-gray-600 hover:text-black hidden sm:block transition-colors">Templates</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">My Sites</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors bg-white hover:bg-red-50 p-2 rounded-full border border-gray-100 shadow-sm"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
