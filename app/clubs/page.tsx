'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import {
  Search,
  Plus,
  Users,
  Crown,
  MapPin,
  Trophy,
  Sparkles,
  Shield,
  TrendingUp,
  Loader2,
  Lock,
  Check,
} from 'lucide-react'

interface Club {
  id: string
  name: string
  slug: string
  description: string
  club_type: string
  is_private: boolean
  is_verified: boolean
  member_count: number
  banner_emoji: string
  owner_id: string
  requirement: string
  created_at: string
}

const CLUB_TYPES = [
  { id: 'all', name: 'All Clubs', icon: Users, color: 'from-gray-500 to-gray-600' },
  { id: 'braggers', name: 'Braggers', icon: Crown, color: 'from-yellow-500 to-orange-500' },
  { id: 'regional', name: 'Regional', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
  { id: 'team', name: 'Team Fans', icon: Trophy, color: 'from-red-500 to-pink-500' },
  { id: 'tcg', name: 'TCG', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'grading', name: 'Grading', icon: Shield, color: 'from-green-500 to-emerald-500' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
]

export default function ClubsPage() {
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()
  
  const [myClubs, setMyClubs] = useState<Club[]>([])
  const [publicClubs, setPublicClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [userClubIds, setUserClubIds] = useState<string[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchData()
  }, [user, selectedType, searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      let memberClubIds: string[] = []
      
      // If user is logged in, fetch their clubs
      if (user) {
        // First check clubs they own directly
        const { data: ownedClubs } = await supabase
          .from('clubs')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })
        
        // Then check club memberships
        const { data: memberships } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', user.id)
        
        memberClubIds = memberships?.map(m => m.club_id) || []
        
        // Combine owned + member clubs
        const allMyClubIds = new Set([
          ...(ownedClubs?.map(c => c.id) || []),
          ...memberClubIds
        ])
        
        setUserClubIds(Array.from(allMyClubIds))

        // Fetch full details for all user's clubs
        if (allMyClubIds.size > 0) {
          const { data: userClubsData } = await supabase
            .from('clubs')
            .select('*')
            .in('id', Array.from(allMyClubIds))
            .order('created_at', { ascending: false })
          
          setMyClubs(userClubsData || [])
        } else {
          setMyClubs(ownedClubs || [])
        }
      }

      // Fetch public clubs for browsing
      let query = supabase
        .from('clubs')
        .select('*')
        .eq('is_private', false)
        .order('member_count', { ascending: false })
      
      if (selectedType !== 'all') {
        query = query.eq('club_type', selectedType)
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
      }
      
      const { data: publicData } = await query.limit(50)
      setPublicClubs(publicData || [])
    } catch (error) {
      console.error('Error fetching clubs:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinClub = async (clubId: string) => {
    if (!user) {
      window.location.href = '/auth/login?redirect=/clubs'
      return
    }
    
    try {
      await supabase.from('club_members').insert({
        club_id: clubId,
        user_id: user.id,
        role: 'member',
      })
      
      setUserClubIds([...userClubIds, clubId])
      fetchData()
    } catch (error) {
      console.error('Error joining club:', error)
    }
  }

  const getTypeColor = (type: string) => {
    const found = CLUB_TYPES.find(t => t.id === type)
    return found?.color || 'from-gray-500 to-gray-600'
  }

  const ClubCard = ({ club }: { club: Club }) => {
    const isMember = userClubIds.includes(club.id)
    const isOwner = user?.id === club.owner_id
    
    return (
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition">
        {/* Banner */}
        <div className={`h-24 bg-gradient-to-r ${getTypeColor(club.club_type)} flex items-center justify-center relative`}>
          <span className="text-5xl">{club.banner_emoji || '🎴'}</span>
          {isOwner && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 rounded text-yellow-900 text-xs font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Owner
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-white">{club.name}</h3>
                {club.is_verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {club.is_private && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="capitalize">{club.club_type}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {club.description || 'No description yet'}
          </p>
          
          {club.requirement && (
            <div className="text-xs text-gray-500 mb-4 px-2 py-1 bg-gray-800/50 rounded inline-block">
              📋 {club.requirement}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              {(club.member_count || 1).toLocaleString()} member{club.member_count !== 1 ? 's' : ''}
            </div>
            
            {isMember || isOwner ? (
              <Link
                href={`/clubs/${club.slug}`}
                className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-600/30 transition"
              >
                View Club
              </Link>
            ) : (
              <button
                onClick={() => joinClub(club.id)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
              >
                Join
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Clubs</h1>
            <p className="text-gray-400">Join communities of collectors who share your passion</p>
          </div>
          
          {user && (
            <Link
              href="/clubs/create"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Create Club
            </Link>
          )}
        </div>

        {/* My Clubs Section - Show if user has clubs */}
        {user && myClubs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-white">My Clubs</h2>
              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
                {myClubs.length}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clubs..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {CLUB_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Browse Public Clubs */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Browse Clubs</h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && publicClubs.length === 0 && myClubs.length === 0 && (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Clubs Found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || selectedType !== 'all'
                ? 'Try adjusting your filters'
                : 'Be the first to create a club!'
              }
            </p>
            {user && (
              <Link
                href="/clubs/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
              >
                <Plus className="w-5 h-5" />
                Create a Club
              </Link>
            )}
          </div>
        )}

        {/* Public Clubs Grid */}
        {!loading && publicClubs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}

        {/* Create CTA - Only show if NOT logged in */}
        {!authLoading && !user && (
          <div className="mt-12 text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Start Your Own Club</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create a community around your favorite team, player, set, or collecting style.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
