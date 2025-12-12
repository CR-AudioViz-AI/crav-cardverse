'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
  Play,
  ChevronRight,
  Loader2,
  GraduationCap,
  Trophy,
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
  content: {
    modules?: Array<{
      title: string
      lessons: Array<{
        title: string
        duration: string
        type: string
      }>
    }>
    objectives?: string[]
    requirements?: string[]
  }
}

interface UserProgress {
  course_id: string
  status: string
  current_module: number
  completed_modules: number[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user } = useAuth()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    loadCourse()
  }, [params.slug])

  useEffect(() => {
    if (user && course) {
      loadProgress()
    }
  }, [user, course])

  const loadCourse = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('card_courses')
        .select('*')
        .eq('slug', params.slug)
        .single()
      
      if (error) throw error
      setCourse(data)
    } catch (error) {
      console.error('Error loading course:', error)
      router.push('/academy')
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async () => {
    if (!user || !course) return
    
    const { data } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single()
    
    setProgress(data)
  }

  const startCourse = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/academy/${params.slug}`)
      return
    }

    setEnrolling(true)
    try {
      // Create progress record
      const { error } = await supabase
        .from('course_progress')
        .insert({
          user_id: user.id,
          course_id: course?.id,
          status: 'in_progress',
          current_module: 1,
          completed_modules: [],
        })
      
      if (error && error.code !== '23505') throw error // Ignore duplicate key error
      
      // Reload progress
      await loadProgress()
    } catch (error) {
      console.error('Error enrolling:', error)
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  if (!course) {
    return null
  }

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400',
  }

  const categoryColors: Record<string, string> = {
    pokemon: 'from-yellow-500 to-orange-500',
    mtg: 'from-blue-500 to-purple-500',
    sports: 'from-green-500 to-emerald-500',
    grading: 'from-red-500 to-orange-500',
    investment: 'from-indigo-500 to-purple-500',
    general: 'from-gray-500 to-gray-600',
  }

  const modules = course.content?.modules || []
  const objectives = course.content?.objectives || []
  const requirements = course.content?.requirements || []
  const completedCount = progress?.completed_modules?.length || 0
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Academy
        </Link>

        {/* Header */}
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden mb-8">
          <div className={`h-48 bg-gradient-to-r ${categoryColors[course.category] || categoryColors.general} flex items-center justify-center`}>
            <GraduationCap className="w-24 h-24 text-white/20" />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-sm px-3 py-1 rounded-full ${difficultyColors[course.difficulty] || difficultyColors.beginner}`}>
                {course.difficulty}
              </span>
              <span className="text-sm text-gray-400 capitalize">{course.category}</span>
              {!course.is_free && (
                <span className="text-sm px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                  Premium
                </span>
              )}
              {course.is_featured && (
                <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
            <p className="text-gray-400 text-lg mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {course.module_count} modules
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {course.estimated_time}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                1.2K enrolled
              </div>
            </div>

            {/* Progress Bar (if enrolled) */}
            {progress && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Your Progress</span>
                  <span className="text-purple-400">{progressPercent}% Complete</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            {progress ? (
              <button
                onClick={() => {/* Navigate to current lesson */}}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                {progress.status === 'completed' ? 'Review Course' : 'Continue Learning'}
              </button>
            ) : (
              <button
                onClick={startCourse}
                disabled={enrolling}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Course {course.is_free ? '(Free)' : ''}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {objectives.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-4">What You'll Learn</h2>
                <ul className="space-y-3">
                  {objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Course Content</h2>
              
              {modules.length > 0 ? (
                <div className="space-y-4">
                  {modules.map((module, moduleIndex) => {
                    const isCompleted = progress?.completed_modules?.includes(moduleIndex + 1)
                    const isCurrent = progress?.current_module === moduleIndex + 1
                    
                    return (
                      <div key={moduleIndex} className="border border-gray-700 rounded-lg overflow-hidden">
                        <div className={`p-4 flex items-center justify-between ${isCurrent ? 'bg-purple-900/20' : 'bg-gray-800/50'}`}>
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrent ? 'bg-purple-500' : 'bg-gray-700'}`}>
                                <span className="text-white text-sm font-bold">{moduleIndex + 1}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold text-white">{module.title}</h3>
                              <p className="text-sm text-gray-400">{module.lessons?.length || 0} lessons</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </div>
                        
                        {module.lessons && module.lessons.length > 0 && (
                          <div className="border-t border-gray-700 divide-y divide-gray-700">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lessonIndex} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition">
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-300">{lesson.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400">Course modules are being finalized. Check back soon!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            {requirements.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h3 className="font-bold text-white mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Certificate */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30 p-6">
              <Trophy className="w-10 h-10 text-yellow-500 mb-3" />
              <h3 className="font-bold text-white mb-2">Earn a Certificate</h3>
              <p className="text-sm text-gray-400">
                Complete all modules to earn your CravCards Academy certificate.
              </p>
            </div>

            {/* Related */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <h3 className="font-bold text-white mb-4">Related Courses</h3>
              <div className="space-y-3">
                <Link href="/academy" className="block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition">
                  <p className="text-sm font-medium text-white">Grading 101</p>
                  <p className="text-xs text-gray-500">Master PSA & BGS grading</p>
                </Link>
                <Link href="/academy" className="block p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition">
                  <p className="text-sm font-medium text-white">Investment Basics</p>
                  <p className="text-xs text-gray-500">Build a valuable portfolio</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
