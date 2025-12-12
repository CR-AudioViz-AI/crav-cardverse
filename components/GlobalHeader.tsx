'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import {
  LayoutDashboard,
  Library,
  ShoppingBag,
  Gamepad2,
  Users,
  GraduationCap,
  Landmark,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'

export default function GlobalHeader() {
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
    { href: '/collection', label: 'Collection', icon: Library, authRequired: false },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag, authRequired: false },
    { href: '/academy', label: 'Academy', icon: GraduationCap, authRequired: false },
    { href: '/trivia', label: 'Trivia', icon: Gamepad2, authRequired: false },
    { href: '/clubs', label: 'Clubs', icon: Users, authRequired: false },
    { href: '/museum', label: 'Museum', icon: Landmark, authRequired: false },
  ]

  const filteredLinks = navLinks.filter(link => !link.authRequired || user)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">CravCards</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-purple-600/20 text-purple-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Side - Auth */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">
                        {(user.email?.[0] || 'U').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm text-gray-300 max-w-[100px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-20 py-1">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white truncate">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <User className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          signOut()
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col gap-1">
              {filteredLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
            
            {/* Mobile Auth */}
            {!user && !loading && (
              <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-2 px-4">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-gray-300 hover:text-white border border-gray-700 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
