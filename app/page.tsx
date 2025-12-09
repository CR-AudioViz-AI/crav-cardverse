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
            The ultimate platform for card collectors. Track sports cards, 
            Pokémon, Magic: The Gathering, and any collectible cards in one 
            beautiful app.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition transform hover:scale-105"
            >
              Start Collecting Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition border border-white/20"
            >
              View Pricing
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Free plan includes 50 cards • No credit card required
          </p>
        </div>
      </section>

      {/* Card Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Collect <span className="text-purple-400">Any Type</span> of Card
            </h2>
            <p className="text-xl text-gray-400">
              From vintage sports cards to the latest Pokémon releases, CravCards supports
              every collecting hobby.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cardCategories.map((category) => (
              <div 
                key={category.name}
                className="group p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-700/50 transition-all hover:transform hover:scale-[1.02]"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {category.emoji}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.examples.map((example) => (
                    <span key={example} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
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
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="text-pink-400">Collect</span>
            </h2>
            <p className="text-xl text-gray-400">
              Powerful tools designed for serious collectors.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Collection?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of collectors tracking their cards with CravCards.
          </p>
          <Link 
            href="/auth/signup" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition transform hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Cross-sell CravBarrels */}
      <section className="py-12 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-y border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center text-3xl">
                🥃
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Also Collect Spirits?</h3>
                <p className="text-gray-400">Try CravBarrels - Track your whiskey & spirits collection</p>
              </div>
            </div>
            <Link
              href="https://cravbarrels.com"
              target="_blank"
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition"
            >
              Explore CravBarrels →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎴</span>
                <span className="text-xl font-bold text-white">CravCards</span>
              </div>
              <p className="text-gray-400 text-sm">
                Part of the CR AudioViz AI ecosystem.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/collection" className="hover:text-white">My Collection</Link></li>
                <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/trivia" className="hover:text-white">Daily Trivia</Link></li>
                <li><Link href="/clubs" className="hover:text-white">Collector Clubs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Card Types</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/collection?type=sports" className="hover:text-white">Sports Cards</Link></li>
                <li><Link href="/collection?type=pokemon" className="hover:text-white">Pokémon</Link></li>
                <li><Link href="/collection?type=mtg" className="hover:text-white">Magic: The Gathering</Link></li>
                <li><Link href="/collection?type=entertainment" className="hover:text-white">Entertainment</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="https://craudiovizai.com" className="hover:text-white">CR AudioViz AI</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2025 CR AudioViz AI, LLC. Part of the CRAV ecosystem.
          </div>
        </div>
      </footer>
    </div>
  );
}
