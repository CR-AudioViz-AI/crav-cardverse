'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Plus,
  Search,
  Crown,
  Shield,
  Star,
  TrendingUp,
  MessageCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  Globe,
  Trophy,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const CLUB_TYPES = [
  { id: 'all', name: 'All Clubs', icon: '🎴' },
  { id: 'braggers', name: 'Braggers', icon: '👑' },
  { id: 'regional', name: 'Regional', icon: '📍' },
  { id: 'team', name: 'Team Fans', icon: '🏆' },
  { id: 'tcg', name: 'TCG', icon: '✨' },
  { id: 'grading', name: 'Grading', icon: '📊' },
  { id: 'vintage', name: 'Vintage', icon: '🏛️' },
]

const SAMPLE_CLUBS = [
  {
    id: '1',
    name: 'Braggers Club',
    slug: 'braggers',
    description: 'For collectors with impressive $10K+ collections. Show off your best pulls and rare finds!',
    club_type: 'braggers',
    icon: '👑',
    banner_color: 'from-yellow-600 to-orange-600',
    member_count: 245,
    is_public: true,
    requirements: { min_collection_value: 10000 },
    recent_posts: 23,
    is_member: true,
  },
  {
    id: '2',
    name: 'PSA 10 Hunters',
    slug: 'psa-10-hunters',
    description: 'Dedicated to the pursuit of gem mint perfection. Share your PSA 10s and grading tips.',
    club_type: 'grading',
    icon: '💎',
    banner_color: 'from-blue-600 to-cyan-600',
    member_count: 567,
    is_public: true,
    requirements: { min_psa_10s: 5 },
    recent_posts: 45,
    is_member: true,
  },
  {
    id: '3',
    name: 'Pokemon Masters',
    slug: 'pokemon-masters',
    description: 'The ultimate community for serious Pokemon TCG collectors. From Base Set to modern!',
    club_type: 'tcg',
    icon: '⚡',
    banner_color: 'from-yellow-500 to-red-500',
    member_count: 3421,
    is_public: true,
    requirements: {},
    recent_posts: 156,
    is_member: false,
  },
  {
    id: '4',
    name: 'Reds Fan Club',
    slug: 'reds-fan-club',
    description: 'Cincinnati Reds baseball card collectors. From Big Red Machine to modern stars!',
    club_type: 'team',
    icon: '⚾',
    banner_color: 'from-red-600 to-red-800',
    member_count: 1832,
    is_public: true,
    requirements: {},
    recent_posts: 67,
    is_member: true,
  },
  {
    id: '5',
    name: 'Kentucky Collectors',
    slug: 'kentucky-collectors',
    description: 'Card collectors from the Bluegrass State. Local meetups and shows!',
    club_type: 'regional',
    icon: '🏇',
    banner_color: 'from-blue-700 to-blue-900',
    member_count: 423,
    is_public: true,
    requirements: {},
    recent_posts: 34,
    is_member: false,
  },
  {
    id: '6',
    name: 'MTG Commander Club',
    slug: 'mtg-commander',
    description: 'For Commander format enthusiasts. Deck techs, card discussions, and game nights!',
    club_type: 'tcg',
    icon: '⚔️',
    banner_color: 'from-purple-600 to-indigo-600',
    member_count: 2891,
    is_public: true,
    requirements: {},
    recent_posts: 234,
    is_member: false,
  },
  {
    id: '7',
    name: 'Vintage Baseball Elite',
    slug: 'vintage-baseball-elite',
    description: 'Pre-war and vintage baseball card collectors. T206, Goudey, and more!',
    club_type: 'vintage',
    icon: '🏛️',
    banner_color: 'from-amber-700 to-amber-900',
    member_count: 178,
    is_public: false,
    requirements: { min_collection_value: 25000, invite_only: true },
    recent_posts: 12,
    is_member: false,
  },
  {
    id: '8',
    name: 'New Collectors Welcome',
    slug: 'new-collectors',
    description: 'Just starting out? This is your safe space to learn and ask questions!',
    club_type: 'newbie',
    icon: '🌱',
    banner_color: 'from-green-500 to-emerald-500',
    member_count: 4521,
    is_public: true,
    requirements: {},
    recent_posts: 89,
    is_member: false,
  },
]

const MY_CLUBS = SAMPLE_CLUBS.filter(c => c.is_member)

export default function ClubsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('discover')

  const filteredClubs = SAMPLE_CLUBS.filter(club => 
    (selectedType === 'all' || club.club_type === selectedType) &&
    (club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     club.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              <Users className="h-8 w-8" />
              Clubs
            </h1>
            <p className="text-muted-foreground">Connect with fellow collectors</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Club
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="discover">Discover Clubs</TabsTrigger>
          <TabsTrigger value="my-clubs">My Clubs ({MY_CLUBS.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search & Filters */}
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
                  className="gap-1 whitespace-nowrap"
                >
                  <span>{type.icon}</span>
                  {type.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Clubs */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Featured Clubs
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClubs.slice(0, 6).map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:scale-[1.02] transition-all cursor-pointer h-full">
                    <div className={`h-24 bg-gradient-to-r ${club.banner_color} flex items-center justify-center`}>
                      <span className="text-5xl">{club.icon}</span>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {club.name}
                            {!club.is_public && <Lock className="h-3 w-3 text-muted-foreground" />}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {club.member_count.toLocaleString()} members
                          </div>
                        </div>
                        {club.is_member && (
                          <Badge variant="secondary">Joined</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {club.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3" />
                          {club.recent_posts} posts this week
                        </div>
                        {!club.is_member && (
                          <Button size="sm" variant={club.is_public ? 'default' : 'outline'}>
                            {club.is_public ? 'Join' : 'Request'}
                          </Button>
                        )}
                      </div>
                      {club.requirements && Object.keys(club.requirements).length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            Requirements: 
                            {club.requirements.min_collection_value && ` $${club.requirements.min_collection_value.toLocaleString()}+ collection`}
                            {club.requirements.min_psa_10s && ` ${club.requirements.min_psa_10s}+ PSA 10s`}
                            {club.requirements.invite_only && ' Invite only'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Clubs */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Clubs</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${club.banner_color} flex items-center justify-center text-2xl`}>
                        {club.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{club.name}</h3>
                          {!club.is_public && <Lock className="h-3 w-3 text-muted-foreground" />}
                          {club.is_member && <Badge variant="secondary" className="text-xs">Joined</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{club.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {club.member_count.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {club.recent_posts} posts
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-clubs" className="space-y-6">
          {MY_CLUBS.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No clubs yet</h3>
              <p className="text-muted-foreground mb-4">Join clubs to connect with fellow collectors</p>
              <Button onClick={() => setActiveTab('discover')}>Discover Clubs</Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MY_CLUBS.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:scale-[1.02] transition-all cursor-pointer">
                    <div className={`h-20 bg-gradient-to-r ${club.banner_color} flex items-center justify-center relative`}>
                      <span className="text-4xl">{club.icon}</span>
                      <Badge className="absolute top-2 right-2" variant="secondary">Member</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{club.name}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {club.member_count.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {club.recent_posts} new
                        </span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        Open Club
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
