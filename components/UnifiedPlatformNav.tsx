'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Bot,
  Layers,
  Wine,
  Home,
  LogIn,
  UserPlus,
  User,
  Settings,
  LogOut,
  CreditCard,
  Crown
} from 'lucide-react'

interface PlatformNavProps {
  currentPlatform: 'website' | 'javari' | 'barrelverse' | 'cardverse'
  user?: {
    name: string
    email: string
    avatar?: string
    credits?: number
    level?: number
  } | null
  onSignOut?: () => void
}

const PLATFORMS = [
  {
    id: 'website',
    name: 'CR AudioViz AI',
    description: 'Main Platform',
    url: 'https://craudiovizai.com',
    icon: Home,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'javari',
    name: 'Javari AI',
    description: 'AI Assistant',
    url: 'https://craudiovizai.com/javari',
    icon: Bot,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'barrelverse',
    name: 'BarrelVerse',
    description: 'Spirits Platform',
    url: 'https://barrelverse.vercel.app',
    icon: Wine,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'cardverse',
    name: 'CardVerse',
    description: 'Card Collecting',
    url: 'https://crav-cardverse.vercel.app',
    icon: Layers,
    color: 'from-purple-500 to-pink-500',
  },
]

export function UnifiedPlatformNav({ currentPlatform, user, onSignOut }: PlatformNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const currentPlatformData = PLATFORMS.find(p => p.id === currentPlatform)

  return (
    <>
      {/* Top Platform Bar */}
      <div className="bg-slate-950 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Platform Switcher */}
            <div className="relative">
              <button
                onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="hidden sm:inline">CR AudioViz AI</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${platformMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {platformMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Switch Platform
                      </p>
                      {PLATFORMS.map((platform) => {
                        const Icon = platform.icon
                        const isActive = platform.id === currentPlatform
                        return (
                          <a
                            key={platform.id}
                            href={platform.url}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-slate-800 text-white' 
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                            }`}
                            onClick={() => setPlatformMenuOpen(false)}
                          >
                            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{platform.name}</p>
                              <p className="text-xs text-slate-500">{platform.description}</p>
                            </div>
                            {!isActive && <ExternalLink className="h-3 w-3 ml-auto text-slate-500" />}
                          </a>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Links */}
            <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
              <a href="https://craudiovizai.com/pricing" className="hover:text-white transition-colors">Pricing</a>
              <span>•</span>
              <a href="https://craudiovizai.com/apps" className="hover:text-white transition-colors">60+ Apps</a>
              <span>•</span>
              <a href="https://craudiovizai.com/support" className="hover:text-white transition-colors">Support</a>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2"
                  >
                    {user.credits !== undefined && (
                      <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                        <CreditCard className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">{user.credits}</span>
                      </div>
                    )}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-800">
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                          {user.level && (
                            <div className="flex items-center gap-1 mt-2">
                              <Crown className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs text-yellow-400">Level {user.level}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <a href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <User className="h-4 w-4" />
                            Profile
                          </a>
                          <a href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <Settings className="h-4 w-4" />
                            Settings
                          </a>
                          <button
                            onClick={onSignOut}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/auth/login"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </a>
                  <a
                    href="/auth/signup"
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(platformMenuOpen || userMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setPlatformMenuOpen(false)
            setUserMenuOpen(false)
          }}
        />
      )}
    </>
  )
}

export default UnifiedPlatformNav
