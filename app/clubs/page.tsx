'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Crown,
  MapPin,
  Trophy,
  Target,
  Sparkles,
  Search,
  Plus,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Filter,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Club types with icons and colors
const CLUB_TYPES = [
  { id: 'all', name: 'All Clubs', icon: Users, color: 'from-gray-500 to-gray-600' },
  { id: 'braggers', name: 'Braggers', icon: Crown, color: 'from-yellow-500 to-orange-500' },
  { id: 'regional', name: 'Regional', icon: MapPin, color: 'from-blue-500 to-cyan-500' },
  { id: 'team', name: 'Team Fans', icon: Trophy, color: 'from-red-500 to-pink-500' },
  { id: 'tcg', name: 'TCG', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { id: 'grading', name: 'Grading', icon: Shield, color: 'from-green-500 to-emerald-500' },
  { id: 'investment', name: 'Investment', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
]

const FEATURED_CLUBS = [
  {
    id: '1',
    name: 'Braggers Club',
    slug: 'braggers',
    description: 'Elite collectors with $10K+ collections. Show off your best pulls and grails.',
    club_type: 'braggers',
    member_count: 2847,
    banner_color: 'from-yellow-600 via-orange-500 to-red-500',
    icon: '👑',
    requirement: '$10,000+ collection value',
    is_verified: true,
    recent_activity: 'Member shared PSA 10 1st Ed Charizard',
  },
  {
    id: '2',
    name: 'PSA 10 Hunters',
    slug: 'psa-10-hunters',
    description: 'Dedicated to the pursuit of gem mint perfection. Share tips, finds, and grading stories.',
    club_type: 'grading',
    member_count: 5621,
    banner_color: 'from-red-600 via-red-500 to-orange-500',
    icon: '💎',
    requirement: 'Own 5+ PSA 10 cards',
    is_verified: true,
    recent_activity: 'Discussion: Best cards to submit right now',
  },
  {
    id: '3',
    name: 'Pokémon Masters',
    slug: 'pokemon-masters',
    description: 'The largest Pokémon TCG collecting community. From Base Set to modern.',
    club_type: 'tcg',
    member_count: 18432,
    banner_color: 'from-yellow-500 via-yellow-400 to-orange-400',
    icon: '⚡',
    requirement: 'Open to all',
    is_verified: true,
    recent_activity: 'New set predictions for 2025',
  },
  {
    id: '4',
    name: 'MTG Commander Club',
    slug: 'mtg-commander',
    description: 'Commander/EDH enthusiasts. Deck building, collecting, and gameplay discussion.',
    club_type: 'tcg',
    member_count: 12847,
    banner_color: 'from-purple-600 via-purple-500 to-pink-500',
    icon: '⚔️',
    requirement: 'Open to all',
    is_verified: true,
    recent_activity: 'Top 10 undervalued Commander staples',
  },
]

const ALL_CLUBS = [
  ...FEATURED_CLUBS,
  {
    id: '5',
    name: 'Cincinnati Reds Collectors',
    slug: 'reds-collectors',
    description: 'Dedicated to Big Red Machine and all Reds baseball cards.',
    club_type: 'team',
    member_count: 1832,
    banner_color: 'from-red-700 to-red-500',
    icon: '⚾',
    requirement: 'Open to all',
    is_verified: false,
  },
  {
    id: '6',
    name: 'Kentucky Card Collectors',
    slug: 'kentucky-collectors',
    description: 'Local collectors from the Bluegrass State. Meetups and trades.',
    club_type: 'regional',
    member_count: 847,
    banner_color: 'from-blue-600 to-blue-400',
    icon: '🐎',
    requirement: 'Kentucky residents',
    is_verified: false,
  },
  {
    id: '7',
    name: 'Vintage Pre-War Society',
    slug: 'vintage-prewar',
    description: 'Collectors of T206, Goudey, and other pre-war treasures.',
    club_type: 'investment',
    member_count: 423,
    banner_color: 'from-amber-700 to-amber-500',
    icon: '🏛️',
    requirement: 'Own at least 1 pre-war card',
    is_verified: true,
  },
  {
    id: '8',
    name: 'Yu-Gi-Oh! Duelists',
    slug: 'yugioh-duelists',
    description: 'Its time to d-d-d-duel! Collectors and players unite.',
    club_type: 'tcg',
    member_count: 7234,
    banner_color: 'from-indigo-600 to-purple-500',
    icon: '🐉',
    requirement: 'Open to all',
    is_verified: true,
  },
  {
    id: '9',
    name: 'Card Flippers Anonymous',
    slug: 'card-flippers',
    description: 'Buy low, sell high. Investment strategies and market analysis.',
    club_type: 'investment',
    member_count: 3421,
    banner_color: 'from-green-600 to-emerald-500',
    icon: '💰',
    requirement: 'Open to all',
    is_verified: false,
  },
  {
    id: '10',
    name: 'New Collector Support',
    slug: 'new-collectors',
    description: 'Welcoming space for beginners. Ask questions, learn the hobby.',
    club_type: 'newbie',
    member_count: 9823,
    banner_color: 'from-cyan-500 to-blue-500',
    icon: '🌱',
    requirement: 'Open to all',
    is_verified: true,
  },
]

export default function ClubsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [userClubs] = useState(['1', '3']) // IDs of clubs user has joined

  const filteredClubs = ALL_CLUBS.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || club.club_type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Clubs
            </h1>
            <p className="text-muted-foreground mt-1">
              Join communities of collectors who share your passion
            </p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="h-4 w-4 mr-2" />
            Create Club
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CLUB_TYPES.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className="whitespace-nowrap"
              >
                <type.icon className="h-4 w-4 mr-1" />
                {type.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Clubs */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Clubs
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURED_CLUBS.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className={`h-24 bg-gradient-to-r ${club.banner_color} relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-background/90 flex items-center justify-center text-2xl shadow-lg">
                        {club.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-lg">{club.name}</h3>
                          {club.is_verified && (
                            <Shield className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <p className="text-white/80 text-sm">
                          {club.member_count.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {club.requirement}
                      </Badge>
                      {userClubs.includes(club.id) ? (
                        <Badge variant="secondary">Joined</Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                          Join Club
                        </Button>
                      )}
                    </div>
                    {club.recent_activity && (
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {club.recent_activity}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* All Clubs */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {selectedType === 'all' ? 'All Clubs' : CLUB_TYPES.find(t => t.id === selectedType)?.name}
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredClubs.length})
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${club.banner_color} flex items-center justify-center text-xl flex-shrink-0`}>
                        {club.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{club.name}</h3>
                          {club.is_verified && (
                            <Shield className="h-3 w-3 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {club.member_count.toLocaleString()} members
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <Badge variant="outline" className="text-xs">
                        {club.requirement}
                      </Badge>
                      {userClubs.includes(club.id) ? (
                        <Badge variant="secondary" className="text-xs">Member</Badge>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-xs">
                          Join
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Create Club CTA */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Start Your Own Club</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a community around your favorite team, player, set, or collecting style. 
              Lead discussions, organize meetups, and build your collector network.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Plus className="h-5 w-5 mr-2" />
              Create Your Club
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
