'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import {
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronRight,
  Trophy,
  Sparkles,
  Target,
  Loader2,
  Lock,
  CheckCircle,
  Play,
  Zap,
} from 'lucide-react'
import GlobalHeader from '@/components/GlobalHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Types matching cv_courses table
interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_minutes: number
  thumbnail_url: string | null
  digital_card_reward: string | null
  xp_reward: number
  is_premium: boolean
  is_active: boolean
  order_index: number
  created_at: string
}

const CATEGORIES = [
  { id: 'all', name: 'All Courses', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { id: 'pokemon', name: 'Pokémon', icon: Sparkles, color: 'from-yellow-500 to-orange-500' },
  { id: 'mtg', name: 'Magic: The Gathering', icon: Target, color: 'from-blue-500 to-purple-500' },
  { id: 'sports', name: 'Sports Cards', icon: Trophy, color: 'from-green-500 to-emerald-500' },
  { id: 'grading', name: 'Grading', icon: Star, color: 'from-red-500 to-orange-500' },
  { id: 'investment', name: 'Investment', icon: Target, color: 'from-indigo-500 to-purple-500' },
  { id: 'general', name: 'General', icon: BookOpen, color: 'from-gray-500 to-gray-600' },
]

const DIFFICULTIES: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
  advanced: { label: 'Advanced', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export default function AcademyPage() {
  const supabase = createClient()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [selectedCategory])

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('cv_courses')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setCourses(data || [])
    } catch (err) {
      console.error('Error loading courses:', err)
      setError('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Separate free and premium courses
  const freeCourses = courses.filter(c => !c.is_premium)
  const premiumCourses = courses.filter(c => c.is_premium)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full mb-6">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">CravCards Academy</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Master the Art of
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                {' '}Card Collecting
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              From beginner basics to advanced investment strategies. 
              Learn everything about Pokemon, Sports Cards, Magic: The Gathering, and more.
            </p>

            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>{courses.length} Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Earn XP & Digital Cards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-gray-900/30 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(category => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id 
                    ? `bg-gradient-to-r ${category.color}` 
                    : ''}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <p className="text-gray-400">Loading courses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={loadCourses} variant="outline">
                Try Again
              </Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Courses Found</h3>
              <p className="text-gray-400 mb-4">
                {selectedCategory !== 'all'
                  ? 'No courses in this category yet.'
                  : 'Courses are being created. Check back soon!'}
              </p>
              {selectedCategory !== 'all' && (
                <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                  View All Courses
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {/* Free Courses */}
              {freeCourses.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">Free Courses</h2>
                    <Badge className="bg-green-500/20 text-green-400">
                      {freeCourses.length} available
                    </Badge>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {freeCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Courses */}
              {premiumCourses.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">Premium Courses</h2>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      <Lock className="w-3 h-3 mr-1" />
                      {premiumCourses.length} exclusive
                    </Badge>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {premiumCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Learning Today
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of collectors improving their skills and building valuable collections.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Play className="w-5 h-5 mr-2" />
              Browse Courses
            </Button>
            <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
              View Collection
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const difficulty = DIFFICULTIES[course.difficulty] || DIFFICULTIES.beginner

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all h-full flex flex-col">
      {course.thumbnail_url && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          {course.is_premium && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-purple-500/90 text-white">
                <Lock className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className={difficulty.color}>
            {difficulty.label}
          </Badge>
          <div className="flex items-center gap-1 text-amber-400 text-sm">
            <Zap className="w-4 h-4" />
            {course.xp_reward} XP
          </div>
        </div>
        <CardTitle className="text-white mt-2 text-lg">{course.title}</CardTitle>
        <CardDescription className="text-gray-400 capitalize">
          {course.category}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-gray-300 text-sm line-clamp-2 flex-1">
          {course.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            {formatDuration(course.duration_minutes)}
          </div>
          
          {course.digital_card_reward && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
              🎴 Card Reward
            </Badge>
          )}
        </div>

        <Button 
          className="mt-4 w-full"
          variant={course.is_premium ? 'outline' : 'default'}
        >
          {course.is_premium ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Unlock Course
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Learning
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
