'use client';

import Link from 'next/link';
import { 
  Sparkles, Trophy, Users, Gamepad2, Store, Shield, 
  TrendingUp, Star, ArrowRight, Check, Zap, Crown,
  CreditCard
} from 'lucide-react';

const cardCategories = [
  {
    name: 'Sports Cards',
    description: 'Baseball, Football, Basketball, Hockey, Soccer',
    emoji: '⚾',
    examples: ['Topps', 'Panini', 'Upper Deck', 'Bowman'],
    color: 'from-red-600 to-orange-600',
  },
  {
    name: 'Trading Card Games',
    description: 'Pokémon, Magic, Yu-Gi-Oh!, One Piece',
    emoji: '🎴',
    examples: ['Pokémon TCG', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Dragon Ball'],
    color: 'from-yellow-500 to-amber-600',
  },
  {
    name: 'Entertainment',
    description: 'Movies, TV Shows, Music, Wrestling',
    emoji: '🎬',
    examples: ['Star Wars', 'Marvel', 'WWE', 'Disney'],
    color: 'from-blue-600 to-cyan-600',
  },
  {
    name: 'Gaming Cards',
    description: 'Video game collectibles and promos',
    emoji: '🎮',
    examples: ['Fortnite', 'Minecraft', 'Xbox', 'PlayStation'],
    color: 'from-green-600 to-emerald-600',
  },
  {
    name: 'Non-Sport Cards',
    description: 'History, Science, Art, Nature',
    emoji: '🌍',
    examples: ['Garbage Pail Kids', 'Wacky Packages', 'Historical', 'Nature'],
    color: 'from-purple-600 to-pink-600',
  },
  {
    name: 'Vintage & Rare',
    description: 'Pre-1980 classics and graded cards',
    emoji: '💎',
    examples: ['T206', 'Goudey', 'Bowman 1950s', 'PSA Graded'],
    color: 'from-amber-700 to-yellow-600',
  },
];

const features = [
  {
    icon: CreditCard,
    title: 'Unlimited Collection Types',
    description: 'Track ANY type of card - sports, Pokémon, MTG, entertainment, and more.',
  },
  {
    icon: TrendingUp,
    title: 'Value Tracking',
    description: 'Monitor your collection\'s worth with market price integration.',
  },
  {
    icon: Store,
    title: 'Trading Marketplace',
    description: 'Buy, sell, and trade with collectors worldwide.',
  },
  {
    icon: Gamepad2,
    title: 'Daily Trivia',
    description: 'Test your knowledge and earn XP rewards every day.',
  },
  {
    icon: Trophy,
    title: 'Achievements',
    description: 'Unlock badges as you grow your collection.',
  },
  {
    icon: Users,
    title: 'Collector Clubs',
    description: 'Join communities of like-minded collectors.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-purple-900/30 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🎴</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CravCards
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/collection" className="text-gray-300 hover:text-white transition">
                Collection
              </Link>
              <Link href="/marketplace" className="text-gray-300 hover:text-white transition">
                Marketplace
              </Link>
              <Link href="/trivia" className="text-gray-300 hover:text-white transition">
                Trivia
              </Link>
              <Link href="/clubs" className="text-gray-300 hover:text-white transition">
                Clubs
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition">
                Pricing
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/auth/login" 
                className="text-gray-300 hover:text-white transition px-4 py-2"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Track Any Card Collection
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Your Cards.<br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Your Collection.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            The ultimate platform for card collectors. Track sports cards, Pokémon, 
            Magic: The Gathering, and any collectible cards in one beautiful app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              Start Collecting Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/pricing"
              className="px-8 py-4 bg-purple-900/50 hover:bg-purple-900/70 text-purple-300 font-semibold rounded-xl border border-purple-700/50 transition"
            >
              View Pricing
            </Link>
          </div>
          
          <p className="text-gray-500 text-sm mt-4">
            Free plan includes 50 cards • No credit card required
          </p>
        </div>
      </section>

      {/* Card Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Collect <span className="text-purple-400">Any Type</span> of Card
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From vintage sports cards to the latest Pokémon releases, CravCards supports every collecting hobby.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardCategories.map((category) => (
              <div 
                key={category.name}
                className="group bg-purple-900/20 border border-purple-700/30 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} mb-4`}>
                  <span className="text-2xl">{category.emoji}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {category.examples.map((example) => (
                    <span 
                      key={example}
                      className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-md"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-purple-950/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="text-purple-400">Collect</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features designed for serious collectors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Collection?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of collectors tracking their cards on CravCards. 
              Free to start, powerful enough to scale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link 
                href="/auth/signup"
                className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-xl transition hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Create Free Account
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                50 cards free
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                No credit card
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                Upgrade anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Sell Banner */}
      <section className="py-10 border-t border-purple-900/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-700/30 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="text-4xl">🥃</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-amber-100">Also collect spirits?</h3>
              <p className="text-amber-200/70 text-sm">
                Try CravBarrels - track your whiskey, bourbon, and spirits collection!
              </p>
            </div>
            <Link 
              href="https://cravbarrels.com" 
              target="_blank"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition whitespace-nowrap"
            >
              Explore CravBarrels
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎴</span>
                <span className="text-xl font-bold text-purple-400">CravCards</span>
              </div>
              <p className="text-gray-500 text-sm">
                The ultimate platform for card collectors of all types.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/collection" className="hover:text-white transition">Collection</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition">Marketplace</Link></li>
                <li><Link href="/trivia" className="hover:text-white transition">Trivia</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Card Types</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/collection?type=sports" className="hover:text-white transition">Sports Cards</Link></li>
                <li><Link href="/collection?type=pokemon" className="hover:text-white transition">Pokémon</Link></li>
                <li><Link href="/collection?type=mtg" className="hover:text-white transition">Magic: The Gathering</Link></li>
                <li><Link href="/collection?type=yugioh" className="hover:text-white transition">Yu-Gi-Oh!</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="https://craudiovizai.com" className="hover:text-white transition">CR AudioViz AI</Link></li>
                <li><Link href="https://cravbarrels.com" className="hover:text-white transition">CravBarrels</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-900/30 pt-8 text-center text-gray-500 text-sm">
            <p>© 2025 CR AudioViz AI, LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
