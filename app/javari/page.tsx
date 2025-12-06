'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bot,
  Send,
  ChevronLeft,
  Sparkles,
  User,
  Loader2,
  BookOpen,
  TrendingUp,
  Shield,
  History,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { icon: TrendingUp, text: 'What cards should I invest in?', category: 'investment' },
  { icon: Shield, text: 'How do I spot fake cards?', category: 'authentication' },
  { icon: BookOpen, text: 'Explain PSA grading', category: 'grading' },
  { icon: History, text: 'Tell me about the T206 Wagner', category: 'history' },
  { icon: Lightbulb, text: 'Tips for new collectors', category: 'beginner' },
  { icon: HelpCircle, text: 'When should I grade a card?', category: 'grading' },
]

const SAMPLE_RESPONSES: Record<string, string> = {
  'What cards should I invest in?': `Great question! Here are my top investment recommendations for 2024:

**Blue-Chip Investments (Lower Risk):**
• PSA 10 1st Edition Charizard - Still the king of Pokémon
• Vintage Jordan rookies (1986 Fleer) - Always in demand
• Reserved List MTG cards - Can never be reprinted

**Emerging Opportunities:**
• Modern soccer cards (Mbappe, Haaland)
• Japanese Pokémon Alt Arts
• Panini Prizm basketball parallels

**Tips:**
1. Buy what you love - passion helps you hold through dips
2. Condition is king - always aim for high grades
3. Diversify across categories
4. Be patient - cards are long-term investments

Want me to dive deeper into any of these categories?`,

  'How do I spot fake cards?': `Counterfeit detection is crucial! Here's how to protect yourself:

**The Light Test (Pokémon):**
Hold the card up to a bright light. Real Pokémon cards have a black layer in the middle that blocks most light. Fakes often let more light through.

**Texture Check:**
• Real holos have specific patterns you can feel
• Fakes often have flat or wrong textures
• Compare to a known authentic card

**Print Quality:**
• Look for the rosette pattern under magnification
• Check for consistent font sizes
• Colors should match reference images

**The Rip Test (Last Resort!):**
Real cards have a black layer between the front and back. Only do this on worthless cards to practice recognition.

**Red Flags When Buying:**
🚩 Price too good to be true
🚩 Seller has no return policy
🚩 Poor quality photos
🚩 New account with no history

Would you like specific tips for any card type?`,

  'Explain PSA grading': `PSA (Professional Sports Authenticator) is the most popular grading service. Here's the breakdown:

**The Scale:**
• PSA 10 (Gem Mint) - Perfect card, commands huge premium
• PSA 9 (Mint) - Near perfect, minor flaw
• PSA 8 (NM-MT) - Light wear acceptable
• PSA 7 and below - Visible wear, lower premiums

**What They Check:**
1. **Centering** - 60/40 or better for a 10
2. **Corners** - Must be sharp
3. **Edges** - No whitening or chips
4. **Surface** - No scratches, print lines

**Current Costs (2024):**
• Value tier: ~$25 (up to $499 value)
• Regular: ~$50 (45 business days)
• Express: ~$150 (10 business days)

**When to Grade:**
✅ Card is worth 10x+ grading cost
✅ You want to sell at premium
✅ Long-term storage/protection
✅ Card appears to be 8+ quality

❌ Common cards with low ceiling
❌ Cards with obvious damage
❌ Cards you'll play with

Need help deciding if a specific card is worth grading?`,
}

export default function JavariPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey there! 👋 I'm Javari, your AI trading card expert!

I know everything about Pokémon, Magic: The Gathering, Sports Cards, Yu-Gi-Oh!, and more. I can help you with:

🔍 **Card Identification & Valuation**
📊 **Grading Advice** (PSA, BGS, CGC)
💰 **Investment Strategies**
🛡️ **Counterfeit Detection**
📚 **Card History & Trivia**
🎯 **Collection Building Tips**

What would you like to know today?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate API call - in production, this would call /api/javari
    setTimeout(() => {
      const response = SAMPLE_RESPONSES[content] || `That's a great question about "${content}"! 

As your card expert, I'd need a bit more context to give you the best answer. Could you tell me:

1. What type of cards are you asking about? (Pokémon, Sports, MTG, etc.)
2. Are you looking for investment advice, grading tips, or general information?
3. Do you have a specific budget or goal in mind?

I'm here to help you make the best decisions for your collection! 🎴`

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold">Javari AI</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Card Expert Online
                </p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Powered by GPT-4
          </Badge>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <Card className={`max-w-2xl ${message.role === 'user' ? 'bg-primary/10' : ''}`}>
                <CardContent className="p-4">
                  <div className="prose prose-invert prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">Javari is thinking...</span>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => sendMessage(prompt.text)}
              >
                <prompt.icon className="h-4 w-4" />
                {prompt.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Javari anything about cards..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Javari uses AI to provide card expertise. Always verify important decisions.
        </p>
      </div>
    </div>
  )
}
