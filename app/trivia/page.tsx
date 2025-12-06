'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gamepad2,
  Trophy,
  Zap,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Flame,
  Target,
  Award,
  Brain,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Comprehensive trivia questions
const TRIVIA_QUESTIONS = [
  {
    id: '1',
    category: 'pokemon',
    difficulty: 'easy',
    question: 'What is the first Pokémon in the National Pokédex?',
    options: ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'],
    correct: 1,
    explanation: 'Bulbasaur is #001 in the National Pokédex, making it the first Pokémon ever listed.',
    xp: 10,
  },
  {
    id: '2',
    category: 'pokemon',
    difficulty: 'medium',
    question: 'Which Pokémon card sold for over $5 million, making it the most expensive Pokémon card ever?',
    options: ['1st Edition Charizard', 'Pikachu Illustrator', 'Shining Charizard', 'Trophy Pikachu'],
    correct: 1,
    explanation: 'The Pikachu Illustrator card sold for $5.275 million in 2021. Only 39 copies exist.',
    xp: 20,
  },
  {
    id: '3',
    category: 'pokemon',
    difficulty: 'hard',
    question: 'What makes a "Shadowless" Base Set card different from unlimited prints?',
    options: ['Different artwork', 'No shadow under the image box', 'Gold borders', 'Holographic back'],
    correct: 1,
    explanation: 'Shadowless cards lack the drop shadow under the character image box that appears on unlimited prints.',
    xp: 30,
  },
  {
    id: '4',
    category: 'mtg',
    difficulty: 'easy',
    question: 'What is the most powerful and valuable card in Magic: The Gathering?',
    options: ['Time Walk', 'Black Lotus', 'Ancestral Recall', 'Mox Sapphire'],
    correct: 1,
    explanation: 'Black Lotus provides 3 mana of any color for free, making it the most powerful and valuable MTG card.',
    xp: 10,
  },
  {
    id: '5',
    category: 'mtg',
    difficulty: 'medium',
    question: 'What year was Magic: The Gathering first released?',
    options: ['1991', '1992', '1993', '1994'],
    correct: 2,
    explanation: 'MTG was created by Richard Garfield and released by Wizards of the Coast in 1993.',
    xp: 20,
  },
  {
    id: '6',
    category: 'mtg',
    difficulty: 'hard',
    question: 'What is the "Reserved List" in Magic: The Gathering?',
    options: [
      'Cards banned in tournaments',
      'Cards that will never be reprinted',
      'First edition cards only',
      'Cards with special artwork'
    ],
    correct: 1,
    explanation: 'The Reserved List is a commitment by Wizards to never reprint certain powerful/valuable cards.',
    xp: 30,
  },
  {
    id: '7',
    category: 'sports',
    difficulty: 'easy',
    question: 'What does "RC" stand for on a sports card?',
    options: ['Rare Card', 'Rookie Card', 'Regular Card', 'Rated Card'],
    correct: 1,
    explanation: 'RC stands for Rookie Card - a players first officially licensed trading card.',
    xp: 10,
  },
  {
    id: '8',
    category: 'sports',
    difficulty: 'medium',
    question: 'Which baseball card is known as the "Holy Grail" of collecting?',
    options: ['1952 Mickey Mantle', 'T206 Honus Wagner', '1989 Ken Griffey Jr.', '1933 Babe Ruth'],
    correct: 1,
    explanation: 'The T206 Honus Wagner is considered the most valuable baseball card, selling for over $7 million.',
    xp: 20,
  },
  {
    id: '9',
    category: 'sports',
    difficulty: 'hard',
    question: 'What was the "Junk Wax Era" in sports card collecting?',
    options: ['1970-1979', '1980-1985', '1986-1993', '1994-2000'],
    correct: 2,
    explanation: 'The Junk Wax Era (1986-1993) saw massive overproduction, making most cards from this period worthless.',
    xp: 30,
  },
  {
    id: '10',
    category: 'grading',
    difficulty: 'easy',
    question: 'What is the highest grade a card can receive from PSA?',
    options: ['9', '9.5', '10', '11'],
    correct: 2,
    explanation: 'PSA 10 Gem Mint is the highest grade, indicating perfect condition.',
    xp: 10,
  },
  {
    id: '11',
    category: 'grading',
    difficulty: 'medium',
    question: 'What does BGS stand for?',
    options: ['Best Grading Service', 'Beckett Grading Services', 'Baseball Grading System', 'Basic Grade Score'],
    correct: 1,
    explanation: 'BGS stands for Beckett Grading Services, known for their subgrades system.',
    xp: 20,
  },
  {
    id: '12',
    category: 'grading',
    difficulty: 'hard',
    question: 'What is a "Black Label" BGS 10?',
    options: [
      'A card with a black border',
      'A BGS 10 with all four subgrades also being 10',
      'A graded card in a black case',
      'A card graded before 2010'
    ],
    correct: 1,
    explanation: 'A Black Label BGS 10 means all four subgrades (centering, corners, edges, surface) are perfect 10s.',
    xp: 30,
  },
  {
    id: '13',
    category: 'history',
    difficulty: 'medium',
    question: 'Why did Topps dump 1952 baseball cards into the Atlantic Ocean?',
    options: ['They were defective', 'Unsold inventory storage costs', 'Licensing dispute', 'Government regulation'],
    correct: 1,
    explanation: 'Topps dumped unsold inventory to avoid storage costs, accidentally creating the scarcity that makes 1952 cards so valuable.',
    xp: 25,
  },
  {
    id: '14',
    category: 'yugioh',
    difficulty: 'easy',
    question: 'What is the most iconic Yu-Gi-Oh! monster card?',
    options: ['Dark Magician', 'Blue-Eyes White Dragon', 'Red-Eyes Black Dragon', 'Exodia'],
    correct: 1,
    explanation: 'Blue-Eyes White Dragon is the signature card of Seto Kaiba and the most recognizable Yu-Gi-Oh! card.',
    xp: 10,
  },
  {
    id: '15',
    category: 'general',
    difficulty: 'medium',
    question: 'What company currently owns the exclusive MLB trading card license?',
    options: ['Topps', 'Panini', 'Upper Deck', 'Fanatics'],
    correct: 3,
    explanation: 'Fanatics acquired Topps and now holds the exclusive MLB license starting in 2025.',
    xp: 20,
  },
]

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🎯', color: 'from-purple-500 to-pink-500' },
  { id: 'pokemon', name: 'Pokémon', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { id: 'mtg', name: 'Magic: The Gathering', icon: '🌀', color: 'from-blue-500 to-purple-500' },
  { id: 'sports', name: 'Sports Cards', icon: '⚾', color: 'from-green-500 to-emerald-500' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', icon: '🐉', color: 'from-indigo-500 to-purple-500' },
  { id: 'grading', name: 'Grading', icon: '📊', color: 'from-red-500 to-orange-500' },
  { id: 'history', name: 'Card History', icon: '📜', color: 'from-amber-500 to-yellow-500' },
]

type GameState = 'menu' | 'playing' | 'result' | 'answer'

export default function TriviaPage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [questions, setQuestions] = useState<typeof TRIVIA_QUESTIONS>([])
  const [answers, setAnswers] = useState<boolean[]>([])

  // Filter and shuffle questions
  const startGame = (category: string) => {
    setSelectedCategory(category)
    const filtered = category === 'all' 
      ? TRIVIA_QUESTIONS 
      : TRIVIA_QUESTIONS.filter(q => q.category === category)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
    setCurrentQuestionIndex(0)
    setScore(0)
    setStreak(0)
    setXpEarned(0)
    setAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(30)
    setGameState('playing')
  }

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswer(-1) // Time's up, wrong answer
    }
  }, [gameState, timeLeft])

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answerIndex === currentQuestion.correct
    
    setAnswers([...answers, isCorrect])
    
    if (isCorrect) {
      const streakBonus = streak >= 3 ? Math.floor(currentQuestion.xp * 0.5) : 0
      const timeBonus = Math.floor(timeLeft / 3)
      const totalXp = currentQuestion.xp + streakBonus + timeBonus
      
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setXpEarned(x => x + totalXp)
      if (streak + 1 > bestStreak) setBestStreak(streak + 1)
    } else {
      setStreak(0)
    }
    
    setGameState('answer')
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
      setGameState('playing')
    } else {
      setGameState('result')
    }
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Menu State */}
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                  <Gamepad2 className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-display font-bold">Card Trivia</h1>
                <p className="text-muted-foreground mt-2">
                  Test your trading card knowledge and earn XP!
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-muted-foreground">Total XP Earned</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{bestStreak}</p>
                    <p className="text-xs text-muted-foreground">Best Streak</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose a Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CATEGORIES.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startGame(category.id)}
                        className={`p-4 rounded-xl bg-gradient-to-br ${category.color} text-white text-center transition-all hover:shadow-lg`}
                      >
                        <span className="text-2xl block mb-1">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Games */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Daily Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Mixed Categories Challenge</p>
                        <p className="text-sm text-muted-foreground">20 questions • 50 XP bonus</p>
                      </div>
                      <Button onClick={() => startGame('all')}>
                        Play Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Playing State */}
          {(gameState === 'playing' || gameState === 'answer') && currentQuestion && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="flex items-center gap-4">
                <Progress value={(currentQuestionIndex / questions.length) * 100} className="flex-1" />
                <span className="text-sm text-muted-foreground">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    {score} correct
                  </Badge>
                  {streak > 0 && (
                    <Badge className="bg-orange-500 text-lg px-3 py-1">
                      <Flame className="h-4 w-4 mr-1" />
                      {streak} streak!
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`h-5 w-5 ${timeLeft <= 10 ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              {/* Question Card */}
              <Card className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${CATEGORIES.find(c => c.id === currentQuestion.category)?.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{currentQuestion.category}</Badge>
                    <Badge variant={
                      currentQuestion.difficulty === 'easy' ? 'secondary' :
                      currentQuestion.difficulty === 'medium' ? 'default' : 'destructive'
                    }>
                      {currentQuestion.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="ml-auto">
                      +{currentQuestion.xp} XP
                    </Badge>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
                  
                  <div className="grid gap-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = selectedAnswer === index
                      const isCorrect = index === currentQuestion.correct
                      const showResult = gameState === 'answer'
                      
                      let buttonClass = 'w-full p-4 text-left rounded-xl border-2 transition-all '
                      
                      if (showResult) {
                        if (isCorrect) {
                          buttonClass += 'border-green-500 bg-green-500/10 text-green-400'
                        } else if (isSelected && !isCorrect) {
                          buttonClass += 'border-red-500 bg-red-500/10 text-red-400'
                        } else {
                          buttonClass += 'border-muted bg-muted/50 opacity-50'
                        }
                      } else {
                        buttonClass += 'border-muted hover:border-primary hover:bg-primary/5'
                      }
                      
                      return (
                        <motion.button
                          key={index}
                          whileHover={gameState === 'playing' ? { scale: 1.01 } : {}}
                          whileTap={gameState === 'playing' ? { scale: 0.99 } : {}}
                          onClick={() => gameState === 'playing' && handleAnswer(index)}
                          disabled={gameState === 'answer'}
                          className={buttonClass}
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-medium">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1">{option}</span>
                            {showResult && isCorrect && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Answer Explanation */}
              {gameState === 'answer' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {selectedAnswer === currentQuestion.correct ? (
                          <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">
                            {selectedAnswer === currentQuestion.correct ? 'Correct!' : 'Not quite!'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {currentQuestion.explanation}
                          </p>
                        </div>
                      </div>
                      <Button onClick={nextQuestion} className="w-full mt-4">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Result State */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mb-4">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-display font-bold">Game Complete!</h1>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-green-400">{score}</p>
                    <p className="text-xs text-muted-foreground">Correct</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-purple-400">+{xpEarned}</p>
                    <p className="text-xs text-muted-foreground">XP Earned</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-3xl font-bold text-orange-400">{bestStreak}</p>
                    <p className="text-xs text-muted-foreground">Best Streak</p>
                  </CardContent>
                </Card>
              </div>

              {/* Answer Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-center gap-2">
                    {answers.map((correct, i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-full ${correct ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setGameState('menu')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
                <Button onClick={() => startGame(selectedCategory)}>
                  Same Category
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
