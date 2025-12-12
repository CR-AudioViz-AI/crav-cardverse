'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
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
} from 'lucide-react'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  category: string
  difficulty: string
  estimated_time: string
  module_count: number
  is_free: boolean
  is_featured: boolean
  thumbnail_url: string | null
  created_at: string
}

interface UserProgress {
  course_id: string
  status: string
  current_module: number
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

const DIFFICULTIES = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-500/20 text-green-400' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-500/20 text-yellow-400' },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-500/20 text-red-400' },
]

export default function AcademyPage() {
  const supabase = createClientComponentClient()
  const { user } = useAuth()
  
  const [courses, setCourses] = useState<Course[]>([])
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadCourses()
    if (user) {
      loadUserProgress()
    }
  }, [user])

  const loadCourses = async () => {
    setLoading(true)
    try {
      // Get featured courses
      const { data: featured } = await supabase
        .from('card_courses')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3)
      
      setFeaturedCourses(featured || [])

      // Get all courses
      const { data: all } = await supabase
        .from('card_courses')
        .select('*')
        .order('created_at', { ascending: false })
      
      setCourses(all || [])
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProgress = async () => {
    if (!user) return
    
    const { data } = await supabase
      .from('course_progress')
      .select('course_id, status, current_module')
      .eq('user_id', user.id)
    
    setUserProgress(data || [])
  }

  const getProgress = (courseId: string): UserProgress | undefined => {
    return userProgress.find(p => p.course_id === courseId)
  }

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0]
  }

  const getDifficultyInfo = (difficulty: string) => {
    return DIFFICULTIES.find(d => d.id === difficulty) || DIFFICULTIES[0]
  }

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">CravCards Academy</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master the art of card collecting with expert-led courses. From beginner basics to advanced investment strategies.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
            <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{courses.length}</p>
            <p className="text-sm text-gray-400">Courses</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">5K+</p>
            <p className="text-sm text-gray-400">Students</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {userProgress.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-400">Completed</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">50+</p>
            <p className="text-sm text-gray-400">Hours of Content</p>
          </div>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Courses</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCourses.map((course) => {
                const category = getCategoryInfo(course.category)
                const difficulty = getDifficultyInfo(course.difficulty)
                const progress = getProgress(course.id)
                const CategoryIcon = category.icon

                return (
                  <Link
                    key={course.id}
                    href={`/academy/${course.slug}`}
                    className="group bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition"
                  >
                    {/* Thumbnail */}
                    <div className={`h-40 bg-gradient-to-r ${category.color} flex items-center justify-center relative`}>
                      <CategoryIcon className="w-16 h-16 text-white/30" />
                      {course.is_featured && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                          FEATURED
                        </div>
                      )}
                      {progress?.status === 'completed' && (
                        <div className="absolute top-3 left-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${difficulty.color}`}>
                          {difficulty.name}
                        </span>
                        {!course.is_free && (
                          <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                            Premium
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.module_count} modules
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.estimated_time}
                        </div>
                      </div>

                      {progress && progress.status === 'in_progress' && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-purple-400">
                              {Math.round((progress.current_module / course.module_count) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${(progress.current_module / course.module_count) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">All Courses</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Courses Found</h3>
            <p className="text-gray-400">
              {selectedCategory !== 'all' 
                ? 'No courses in this category yet. Check back soon!'
                : 'Courses are being added. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const category = getCategoryInfo(course.category)
              const difficulty = getDifficultyInfo(course.difficulty)
              const progress = getProgress(course.id)
              const CategoryIcon = category.icon

              return (
                <Link
                  key={course.id}
                  href={`/academy/${course.slug}`}
                  className="group bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition"
                >
                  {/* Thumbnail */}
                  <div className={`h-32 bg-gradient-to-r ${category.color} flex items-center justify-center relative`}>
                    <CategoryIcon className="w-12 h-12 text-white/30" />
                    {!course.is_free && (
                      <Lock className="absolute top-3 right-3 w-5 h-5 text-white/70" />
                    )}
                    {progress?.status === 'completed' && (
                      <div className="absolute top-3 left-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${difficulty.color}`}>
                        {difficulty.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{course.category}</span>
                    </div>

                    <h3 className="font-bold text-white mb-2 group-hover:text-purple-400 transition line-clamp-1">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course.module_count} modules
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.estimated_time}
                      </div>
                    </div>

                    {progress && progress.status === 'in_progress' && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(progress.current_module / course.module_count) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA */}
        {!user && (
          <div className="mt-12 text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30">
            <GraduationCap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Track Your Progress</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Sign up to save your progress, earn certificates, and unlock premium courses.
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
