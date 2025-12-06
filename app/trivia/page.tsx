'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2,
  Trophy,
  Zap,
  Timer,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Play,
  Flame,
  Star,
  Target,
  Brain,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🎴', color: 'from-purple-500 to-pink-500' },
  { id: 'pokemon', name: 'Pokémon', icon: '⚡', color: 'from-yellow-500 to-red-500' },
  { id: 'mtg', name: 'Magic: The Gathering', icon: '✨', color: 'from-blue-500 to-purple-500' },
  { id: 'sports', name: 'Sports Cards', icon: '🏆', color: 'from-green-500 to-emerald-500' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', icon: '🐉', color: 'from-orange-500 to-red-500' },
  { id: 'history', name: 'Card History', icon: '🏛️', color: 'from-amber-500 to-orange-500' },
  { id: 'grading', name: 'Grading Knowledge', icon: '📊', color: 'from-cyan-500 to-blue-500' },
]

const SAMPLE_QUESTIONS = [
  {
    id: '1',
    category: 'pokemon',
    difficulty: 'easy',
    question: 'What is the first Pokémon in the National Pokédex?',
    options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'],
    correct_answer: 1,
    explanation: 'Bulbasaur is #001 in the National Pokédex.',
    xp_reward: 10,
  },
  {
    id: '2',
    category: 'pokemon',
    difficulty: 'medium',
    question: 'Which Pokémon card is known as the "Holy Grail" of Pokémon collecting?',
    options: ['Pikachu Illustrator', '1st Ed Charizard', 'Ancient Mew', 'Shining Charizard'],
    correct_answer: 0,
    explanation: 'The Pikachu Illustrator card is the rarest, with only 39 copies known to exist.',
    xp_reward: 20,
  },
  {
    id: '3',
    category: 'mtg',
    difficulty: 'easy',
    question: 'What is the most valuable Magic: The Gathering card?',
    options: ['Black Lotus', 'Time Walk', 'Ancestral Recall', 'Mox Sapphire'],
    correct_answer: 0,
    explanation: 'Black Lotus from Alpha is the most valuable MTG card.',
    xp_reward: 10,
  },
  {
    id: '4',
    category: 'sports',
    difficulty: 'medium',
    question: 'What was the "Junk Wax Era"?',
    options: ['1970-1979', '1980-1985', '1986-1993', '1994-2000'],
    correct_answer: 2,
    explanation: 'The Junk Wax Era (1986-1993) saw massive overproduction of sports cards.',
    xp_reward: 20,
  },
  {
    id: '5',
    category: 'grading',
    difficulty: 'easy',
    question: 'What is the highest grade a card can receive from PSA?',
    options: ['9', '9.5', '10', '11'],
    correct_answer: 2,
    explanation: 'PSA 10 Gem Mint is the highest grade.',
    xp_reward: 10,
  },
]

const LEADERBOARD = [
  { rank: 1, name: 'CardMaster99', score: 15420, streak: 45, avatar: '🥇' },
  { rank: 2, name: 'PokeFan2000', score: 12350, streak: 32, avatar: '🥈' },
  { rank: 3, name: 'VintageKing', score: 11200, streak: 28, avatar: '🥉' },
  { rank: 4, name: 'MTGWizard', score: 9800, streak: 22, avatar: '🎴' },
  { rank: 5, name: 'RookieHunter', score: 8500, streak: 18, avatar: '🏆' },
]

export default function TriviaPage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'results'>('menu')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (timeLeft === 0 && selectedAnswer === null) {
      handleAnswer(-1) // Time's up
    }
  }, [timeLeft, gameState, selectedAnswer])

  const startGame = () => {
    const filtered = selectedCategory === 'all' 
      ? SAMPLE_QUESTIONS 
      : SAMPLE_QUESTIONS.filter(q => q.category === selectedCategory)
    setQuestions(filtered.sort(() => Math.random() - 0.5))
    setCurrentQuestion(0)
    setScore(0)
    setStreak(0)
    setXpEarned(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setTimeLeft(30)
    setGameState('playing')
  }

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answerIndex)
    const question = questions[currentQuestion]
    const isCorrect = answerIndex === question.correct_answer

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
      setXpEarned(xpEarned + question.xp_reward)
      if (streak + 1 > bestStreak) setBestStreak(streak + 1)
    } else {
      setStreak(0)
    }

    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentQuestion + 1 >= questions.length) {
      setGameState('results')
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(30)
    }
  }

  const question = questions[currentQuestion]

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
              <Gamepad2 className="h-8 w-8" />
              Card Trivia
            </h1>
            <p className="text-muted-foreground">Test your card knowledge!</p>
          </div>
        </div>
        {gameState === 'playing' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold">{streak} streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">{xpEarned} XP</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* MENU STATE */}
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Category Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose a Category</CardTitle>
                <CardDescription>Select a category to test your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${
                        selectedCategory === cat.id ? `bg-gradient-to-br ${cat.color}` : ''
                      }`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Start Game */}
            <div className="text-center">
              <Button size="lg" className="gap-2 px-8" onClick={startGame}>
                <Play className="h-5 w-5" />
                Start Game
              </Button>
            </div>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {LEADERBOARD.map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        player.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' : 'bg-muted/50'
                      }`}
                    >
                      <span className="text-2xl">{player.avatar}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{player.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Flame className="h-3 w-3 text-orange-500" />
                          Best streak: {player.streak}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{player.score.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && question && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="flex items-center gap-2">
                  <Timer className={`h-4 w-4 ${timeLeft <= 10 ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
                </div>
              </div>
              <Progress value={(currentQuestion / questions.length) * 100} />
            </div>

            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={question.category as any}>{question.category}</Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                  <Badge variant="secondary">+{question.xp_reward} XP</Badge>
                </div>
                <CardTitle className="text-xl">{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => {
                  let buttonClass = 'w-full justify-start text-left h-auto p-4'
                  
                  if (selectedAnswer !== null) {
                    if (index === question.correct_answer) {
                      buttonClass += ' bg-green-500/20 border-green-500 text-green-400'
                    } else if (index === selectedAnswer && index !== question.correct_answer) {
                      buttonClass += ' bg-red-500/20 border-red-500 text-red-400'
                    }
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={buttonClass}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                        {selectedAnswer !== null && index === question.correct_answer && (
                          <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                        )}
                        {selectedAnswer !== null && index === selectedAnswer && index !== question.correct_answer && (
                          <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                        )}
                      </span>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Card className={`mb-6 ${
                    selectedAnswer === question.correct_answer 
                      ? 'border-green-500/50 bg-green-500/5' 
                      : 'border-red-500/50 bg-red-500/5'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {selectedAnswer === question.correct_answer ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-semibold text-green-500">Correct! +{question.xp_reward} XP</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="font-semibold text-red-500">Incorrect</span>
                          </>
                        )}
                      </div>
                      <p className="text-muted-foreground">{question.explanation}</p>
                    </CardContent>
                  </Card>
                  <Button className="w-full" onClick={nextQuestion}>
                    {currentQuestion + 1 >= questions.length ? 'See Results' : 'Next Question'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* RESULTS STATE */}
        {gameState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Trophy className="h-16 w-16 text-white" />
              </div>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
                <p className="text-muted-foreground mb-6">Great job testing your card knowledge!</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{score}</div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500">{xpEarned}</div>
                    <div className="text-sm text-muted-foreground">XP Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500">{bestStreak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" onClick={startGame}>
                    Play Again
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setGameState('menu')}>
                    Back to Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
