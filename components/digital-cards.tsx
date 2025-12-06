'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Trophy, 
  Lock, 
  Gift, 
  Flame,
  Zap,
  Crown,
  Diamond,
  Eye,
  EyeOff,
  Share2,
  Heart,
  X,
  ChevronRight,
  Filter,
  Grid,
  List
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
type Element = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark' | 'neutral';

interface DigitalCardData {
  id: string;
  cardCode: string;
  name: string;
  description: string;
  imageUrl?: string;
  rarity: Rarity;
  series: string;
  seriesNumber: number;
  totalInSeries: number;
  powerLevel: number;
  element: Element;
  cardType: string;
  discoveryHint?: string;
  maxSupply?: number;
  currentSupply?: number;
}

interface UserCardData extends DigitalCardData {
  discoveredAt: string;
  instanceNumber: number;
  isFoil: boolean;
  isFirstEdition: boolean;
  isFavorite: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const RARITY_CONFIG = {
  common: {
    name: 'Common',
    color: '#9CA3AF',
    bgGradient: 'from-gray-400 to-gray-600',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    borderGradient: 'linear-gradient(135deg, #9CA3AF, #6B7280)',
    icon: Star,
  },
  uncommon: {
    name: 'Uncommon',
    color: '#22C55E',
    bgGradient: 'from-green-400 to-green-600',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    borderGradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    icon: Star,
  },
  rare: {
    name: 'Rare',
    color: '#3B82F6',
    bgGradient: 'from-blue-400 to-blue-600',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    borderGradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
    icon: Zap,
  },
  epic: {
    name: 'Epic',
    color: '#A855F7',
    bgGradient: 'from-purple-400 to-purple-600',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    borderGradient: 'linear-gradient(135deg, #A855F7, #9333EA)',
    icon: Flame,
  },
  legendary: {
    name: 'Legendary',
    color: '#F59E0B',
    bgGradient: 'from-amber-400 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    borderGradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    icon: Crown,
  },
  mythic: {
    name: 'Mythic',
    color: '#EC4899',
    bgGradient: 'from-pink-400 via-rose-500 to-red-600',
    glowColor: 'rgba(236, 72, 153, 0.7)',
    borderGradient: 'linear-gradient(135deg, #EC4899, #DB2777, #DC2626)',
    icon: Diamond,
  },
};

const ELEMENT_CONFIG = {
  fire: { color: '#EF4444', icon: '🔥', name: 'Fire' },
  water: { color: '#3B82F6', icon: '💧', name: 'Water' },
  earth: { color: '#84CC16', icon: '🌿', name: 'Earth' },
  air: { color: '#06B6D4', icon: '💨', name: 'Air' },
  light: { color: '#FBBF24', icon: '✨', name: 'Light' },
  dark: { color: '#6366F1', icon: '🌙', name: 'Dark' },
  neutral: { color: '#9CA3AF', icon: '⚪', name: 'Neutral' },
};

// ============================================================================
// DIGITAL CARD COMPONENT
// ============================================================================

interface DigitalCardProps {
  card: DigitalCardData | UserCardData;
  isOwned?: boolean;
  isLocked?: boolean;
  showHint?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onFavorite?: () => void;
}

export const DigitalCard: React.FC<DigitalCardProps> = ({
  card,
  isOwned = true,
  isLocked = false,
  showHint = false,
  size = 'md',
  onClick,
  onFavorite,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const rarityConfig = RARITY_CONFIG[card.rarity];
  const elementConfig = ELEMENT_CONFIG[card.element];
  const RarityIcon = rarityConfig.icon;
  
  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-88',
  };
  
  const userCard = card as UserCardData;
  const isFoil = 'isFoil' in card && card.isFoil;
  const isFirstEdition = 'isFirstEdition' in card && card.isFirstEdition;
  const isFavorite = 'isFavorite' in card && card.isFavorite;

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} cursor-pointer perspective-1000`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => isOwned && !isLocked && onClick?.()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl blur-xl opacity-0"
        style={{ backgroundColor: rarityConfig.glowColor }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Card Container */}
      <motion.div
        className={`relative w-full h-full rounded-xl overflow-hidden`}
        style={{
          background: rarityConfig.borderGradient,
          padding: '3px',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Card Front */}
        <div 
          className={`absolute inset-0 rounded-xl overflow-hidden backface-hidden`}
          style={{ 
            background: `linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)`,
            margin: '3px',
          }}
        >
          {/* Foil Overlay */}
          {isFoil && (
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `linear-gradient(
                  45deg,
                  transparent 0%,
                  rgba(255,255,255,0.1) 25%,
                  rgba(255,255,255,0.3) 50%,
                  rgba(255,255,255,0.1) 75%,
                  transparent 100%
                )`,
                backgroundSize: '200% 200%',
                animation: 'foilShimmer 3s ease infinite',
              }}
            />
          )}
          
          {/* Locked Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                {showHint && card.discoveryHint && (
                  <p className="text-xs text-gray-400 px-2">{card.discoveryHint}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Card Header */}
          <div className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <RarityIcon 
                className="w-4 h-4" 
                style={{ color: rarityConfig.color }}
              />
              <span 
                className="text-xs font-bold"
                style={{ color: rarityConfig.color }}
              >
                {rarityConfig.name}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              #{card.seriesNumber}/{card.totalInSeries}
            </span>
          </div>
          
          {/* Card Image Area */}
          <div className="relative mx-2 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            {card.imageUrl ? (
              <img 
                src={card.imageUrl} 
                alt={card.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">{elementConfig.icon}</span>
              </div>
            )}
            
            {/* Element Badge */}
            <div 
              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: elementConfig.color + '40' }}
            >
              {elementConfig.icon}
            </div>
            
            {/* First Edition Badge */}
            {isFirstEdition && (
              <div className="absolute top-1 left-1 bg-yellow-500 text-black text-[8px] font-bold px-1 rounded">
                1ST ED
              </div>
            )}
          </div>
          
          {/* Card Name */}
          <div className="px-2 py-1">
            <h3 className="text-sm font-bold text-white truncate">{card.name}</h3>
            <p className="text-[10px] text-gray-400 truncate">{card.series}</p>
          </div>
          
          {/* Card Stats */}
          <div className="px-2 pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-white font-bold">{card.powerLevel}</span>
            </div>
            
            {/* Favorite Button */}
            {isOwned && onFavorite && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite();
                }}
                whileTap={{ scale: 0.8 }}
                className="p-1"
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                />
              </motion.button>
            )}
            
            {/* Supply Counter */}
            {card.maxSupply && (
              <span className="text-[10px] text-gray-400">
                {card.currentSupply || 0}/{card.maxSupply}
              </span>
            )}
          </div>
        </div>
        
        {/* Card Back */}
        <div 
          className="absolute inset-0 rounded-xl overflow-hidden backface-hidden rotate-y-180"
          style={{ 
            background: `linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)`,
            margin: '3px',
          }}
        >
          <div className="p-3 h-full flex flex-col">
            <h3 className="text-sm font-bold text-white mb-2">{card.name}</h3>
            <p className="text-xs text-gray-300 flex-1">{card.description}</p>
            
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>{card.cardType}</span>
                <span>{elementConfig.name}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Discovery Instance Info */}
      {'discoveredAt' in card && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-0.5 rounded text-[8px] text-gray-400">
          #{userCard.instanceNumber}
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// CARD DISCOVERY MODAL
// ============================================================================

interface CardDiscoveryModalProps {
  card: DigitalCardData;
  instanceNumber: number;
  isFirstEdition: boolean;
  isFoil: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export const CardDiscoveryModal: React.FC<CardDiscoveryModalProps> = ({
  card,
  instanceNumber,
  isFirstEdition,
  isFoil,
  onClose,
  onShare,
}) => {
  const rarityConfig = RARITY_CONFIG[card.rarity];
  const elementConfig = ELEMENT_CONFIG[card.element];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Celebration Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  opacity: 0, 
                  scale: 1,
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300,
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.05,
                  ease: 'easeOut',
                }}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                style={{ backgroundColor: rarityConfig.color }}
              />
            ))}
          </div>
          
          {/* Title */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" style={{ color: rarityConfig.color }} />
              <h2 className="text-2xl font-bold text-white">Card Discovered!</h2>
              <Sparkles className="w-6 h-6" style={{ color: rarityConfig.color }} />
            </div>
            <p className="text-gray-400">
              You found a <span style={{ color: rarityConfig.color }}>{rarityConfig.name}</span> card!
            </p>
          </motion.div>
          
          {/* Card Display */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <DigitalCard 
              card={{
                ...card,
                isFoil,
                isFirstEdition,
                discoveredAt: new Date().toISOString(),
                instanceNumber,
                isFavorite: false,
              } as UserCardData}
              size="lg"
              isOwned={true}
            />
          </motion.div>
          
          {/* Special Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-3 mt-4"
          >
            {isFirstEdition && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Crown className="w-4 h-4" />
                First Edition!
              </div>
            )}
            {isFoil && (
              <div className="bg-purple-500/20 border border-purple-500/50 text-purple-400 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Foil Variant!
              </div>
            )}
          </motion.div>
          
          {/* Instance Number */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-400 mt-4"
          >
            You received #{instanceNumber}
            {card.maxSupply && ` of ${card.maxSupply}`}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-3 mt-6"
          >
            {onShare && (
              <button
                onClick={onShare}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-white font-semibold transition-all"
              style={{ 
                background: rarityConfig.borderGradient,
              }}
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// DIGITAL CARD COLLECTION VIEW
// ============================================================================

interface CollectionViewProps {
  ownedCards: UserCardData[];
  allCards: DigitalCardData[];
  showLocked?: boolean;
  onCardClick?: (card: UserCardData | DigitalCardData) => void;
}

export const DigitalCardCollection: React.FC<CollectionViewProps> = ({
  ownedCards,
  allCards,
  showLocked = true,
  onCardClick,
}) => {
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [selectedSeries, setSelectedSeries] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showOwned, setShowOwned] = useState<'all' | 'owned' | 'missing'>('all');
  
  const ownedCardCodes = new Set(ownedCards.map(c => c.cardCode));
  
  const series = [...new Set(allCards.map(c => c.series))];
  
  const filteredCards = allCards.filter(card => {
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
    if (selectedSeries !== 'all' && card.series !== selectedSeries) return false;
    if (showOwned === 'owned' && !ownedCardCodes.has(card.cardCode)) return false;
    if (showOwned === 'missing' && ownedCardCodes.has(card.cardCode)) return false;
    if (!showLocked && !ownedCardCodes.has(card.cardCode)) return false;
    return true;
  });
  
  const stats = {
    total: allCards.length,
    owned: ownedCards.length,
    percentage: Math.round((ownedCards.length / allCards.length) * 100),
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              Digital Card Collection
            </h2>
            <p className="text-gray-400 text-sm">
              {stats.owned} of {stats.total} cards discovered ({stats.percentage}%)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{stats.owned}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Rarity Filter */}
        <select
          value={selectedRarity}
          onChange={(e) => setSelectedRarity(e.target.value as Rarity | 'all')}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="all">All Rarities</option>
          {Object.entries(RARITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.name}</option>
          ))}
        </select>
        
        {/* Series Filter */}
        <select
          value={selectedSeries}
          onChange={(e) => setSelectedSeries(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="all">All Series</option>
          {series.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        
        {/* Owned Filter */}
        <div className="flex rounded-lg overflow-hidden border border-gray-600">
          {(['all', 'owned', 'missing'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setShowOwned(mode)}
              className={`px-3 py-2 text-sm capitalize transition-colors ${
                showOwned === mode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        
        {/* View Toggle */}
        <div className="ml-auto flex rounded-lg overflow-hidden border border-gray-600">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Card Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4' 
          : 'space-y-2'
        }
      `}>
        {filteredCards.map(card => {
          const isOwned = ownedCardCodes.has(card.cardCode);
          const userCard = ownedCards.find(c => c.cardCode === card.cardCode);
          
          return viewMode === 'grid' ? (
            <DigitalCard
              key={card.cardCode}
              card={userCard || card}
              isOwned={isOwned}
              isLocked={!isOwned}
              showHint={!isOwned}
              size="sm"
              onClick={() => onCardClick?.(userCard || card)}
            />
          ) : (
            <motion.div
              key={card.cardCode}
              className={`
                flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer
                ${isOwned 
                  ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50' 
                  : 'bg-gray-900/50 border-gray-800 opacity-50'
                }
              `}
              onClick={() => onCardClick?.(userCard || card)}
              whileHover={{ x: 5 }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: RARITY_CONFIG[card.rarity].borderGradient }}
              >
                {isOwned ? (
                  <span className="text-lg">{ELEMENT_CONFIG[card.element].icon}</span>
                ) : (
                  <Lock className="w-4 h-4 text-white/50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">{card.name}</h4>
                <p className="text-xs text-gray-400">{card.series} #{card.seriesNumber}</p>
              </div>
              <div 
                className="text-xs px-2 py-1 rounded"
                style={{ 
                  backgroundColor: RARITY_CONFIG[card.rarity].color + '20',
                  color: RARITY_CONFIG[card.rarity].color,
                }}
              >
                {RARITY_CONFIG[card.rarity].name}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </motion.div>
          );
        })}
      </div>
      
      {filteredCards.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No cards found matching your filters</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SERIES PROGRESS COMPONENT
// ============================================================================

interface SeriesProgressProps {
  seriesCode: string;
  seriesName: string;
  totalCards: number;
  ownedCards: number;
  completionReward?: string;
  onClick?: () => void;
}

export const SeriesProgress: React.FC<SeriesProgressProps> = ({
  seriesCode,
  seriesName,
  totalCards,
  ownedCards,
  completionReward,
  onClick,
}) => {
  const percentage = Math.round((ownedCards / totalCards) * 100);
  const isComplete = ownedCards >= totalCards;
  
  return (
    <motion.div
      onClick={onClick}
      className={`
        p-4 rounded-xl border cursor-pointer transition-all
        ${isComplete 
          ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50' 
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white flex items-center gap-2">
          {isComplete && <Trophy className="w-4 h-4 text-yellow-400" />}
          {seriesName}
        </h3>
        <span className="text-sm text-gray-400">
          {ownedCards}/{totalCards}
        </span>
      </div>
      
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full ${
            isComplete 
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
        />
      </div>
      
      {completionReward && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Gift className="w-3 h-3" />
          Reward: {completionReward}
        </p>
      )}
    </motion.div>
  );
};

// ============================================================================
// CSS FOR ANIMATIONS (Add to globals.css)
// ============================================================================

export const digitalCardStyles = `
@keyframes foilShimmer {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
`;

export default {
  DigitalCard,
  CardDiscoveryModal,
  DigitalCardCollection,
  SeriesProgress,
  RARITY_CONFIG,
  ELEMENT_CONFIG,
};
