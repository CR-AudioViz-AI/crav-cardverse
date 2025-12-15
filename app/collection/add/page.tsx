// ============================================================================
// ADD CARD PAGE - BULLETPROOF SEARCH
// Search 156,000+ cards (Pokemon, MTG, Yu-Gi-Oh, Lorcana, Sports)
// CravCards - CR AudioViz AI, LLC
// Fixed: December 14, 2025
// ============================================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Camera, 
  X, 
  Loader2, 
  Upload,
  Star,
  CheckCircle2,
  ArrowLeft,
  Filter,
  AlertCircle,
} from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  market_price: number | null;
  source: string;
  team?: string;
  sport?: string;
}

export default function AddCardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Selected card state
  const [selectedCard, setSelectedCard] = useState<SearchResult | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [condition, setCondition] = useState('near_mint');
  const [isGraded, setIsGraded] = useState(false);
  const [grade, setGrade] = useState('');
  const [gradingCompany, setGradingCompany] = useState('PSA');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Search function
  const doSearch = async (query: string, category: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        q: query,
        category: category,
        limit: '30',
      });

      console.log('Searching:', `/api/cards/search?${params}`);
      
      const response = await fetch(`/api/cards/search?${params}`);
      const data = await response.json();

      console.log('Search response:', data);

      if (data.success) {
        setSearchResults(data.results || []);
        if (data.results?.length === 0) {
          setSearchError(`No results found for "${query}"`);
        }
      } else {
        setSearchError(data.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Network error. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(searchQuery, categoryFilter);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  // Handle search submit (for enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(searchQuery, categoryFilter);
  };

  // Handle card selection
  const handleSelectCard = (card: SearchResult) => {
    setSelectedCard(card);
    setUserImage(null);
    setCondition('near_mint');
    setIsGraded(false);
    setGrade('');
    setPurchasePrice('');
    setNotes('');
    setSaveSuccess(false);
  };

  // Handle user image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save to collection
  const handleSave = async () => {
    if (!selectedCard) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: selectedCard.id,
          card_name: selectedCard.name,
          category: selectedCard.category,
          set_name: selectedCard.set_name,
          card_number: selectedCard.card_number,
          rarity: selectedCard.rarity,
          image_url: selectedCard.image_url,
          user_image_url: userImage,
          condition,
          is_graded: isGraded,
          grade: isGraded ? grade : null,
          grading_company: isGraded ? gradingCompany : null,
          purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
          notes,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSelectedCard(null);
          setSearchQuery('');
          setSearchResults([]);
          setHasSearched(false);
        }, 1500);
      } else {
        alert(data.error || 'Failed to save card');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    if (category.includes('pokemon')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (category.includes('mtg')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (category.includes('yugioh')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (category.includes('lorcana')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (category.includes('sports')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Get display name for category
  const getCategoryDisplay = (cat: string) => {
    const names: Record<string, string> = {
      'all': 'All Cards',
      'pokemon': 'Pokemon',
      'mtg': 'Magic',
      'yugioh': 'Yu-Gi-Oh',
      'lorcana': 'Lorcana',
      'sports': 'Sports',
    };
    return names[cat] || cat;
  };

  const CONDITIONS = [
    { value: 'mint', label: 'Mint (M)' },
    { value: 'near_mint', label: 'Near Mint (NM)' },
    { value: 'excellent', label: 'Excellent (EX)' },
    { value: 'very_good', label: 'Very Good (VG)' },
    { value: 'good', label: 'Good (G)' },
    { value: 'fair', label: 'Fair (F)' },
    { value: 'poor', label: 'Poor (P)' },
  ];

  const GRADING_COMPANIES = ['PSA', 'BGS', 'CGC', 'SGC', 'Other'];
  const CATEGORIES = ['all', 'pokemon', 'mtg', 'yugioh', 'lorcana', 'sports'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Add Card</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!selectedCard ? (
          // Search View
          <>
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pete Rose, Charizard, Black Lotus..."
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-lg"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </form>

            {/* Category Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {getCategoryDisplay(cat)}
                </button>
              ))}
            </div>

            {/* Search Results */}
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Searching 156,000+ cards...</p>
              </div>
            ) : searchError && hasSearched ? (
              <div className="text-center py-16">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <p className="text-yellow-400">{searchError}</p>
                <p className="text-sm mt-2 text-gray-500">Try a different search term</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {searchResults.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCard(card)}
                    className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left"
                  >
                    {/* Card Image */}
                    <div className="aspect-[3/4] relative bg-black/50">
                      {card.image_url ? (
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎴</text></svg>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-4xl">🎴</span>
                        </div>
                      )}
                      
                      {/* Price Badge */}
                      {card.market_price && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-600/90 rounded-md text-xs font-medium">
                          ${card.market_price.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {card.team || card.set_name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(card.category)}`}>
                          {card.category.replace('sports_', '').replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 && hasSearched ? (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cards found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Search for any card</p>
                <p className="text-sm">Pokemon, Magic, Yu-Gi-Oh, Lorcana, Sports</p>
                <p className="text-xs mt-4 text-gray-500">156,000+ cards available</p>
              </div>
            )}
          </>
        ) : (
          // Card Details / Add Form
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Back button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to search
            </button>

            {saveSuccess ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Card Added!</h2>
                <p className="text-gray-400">Your card has been saved to your collection</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Card Preview */}
                <div>
                  <div className="relative aspect-[3/4] bg-black/30 rounded-xl overflow-hidden">
                    <img
                      src={userImage || selectedCard.image_url}
                      alt={selectedCard.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎴</text></svg>';
                      }}
                    />
                  </div>

                  {/* Upload Photo Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-white/20 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    {userImage ? 'Change Your Photo' : 'Add Your Photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Card Details Form */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
                    <p className="text-gray-400">{selectedCard.team || selectedCard.set_name}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full border ${getCategoryColor(selectedCard.category)}`}>
                      {selectedCard.category.replace('sports_', '').replace('_', ' ')}
                    </span>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grading Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Professionally Graded?</label>
                    <button
                      onClick={() => setIsGraded(!isGraded)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        isGraded ? 'bg-blue-600' : 'bg-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        isGraded ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Grading Details */}
                  {isGraded && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <select
                          value={gradingCompany}
                          onChange={(e) => setGradingCompany(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        >
                          {GRADING_COMPANIES.map((gc) => (
                            <option key={gc} value={gc}>{gc}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Grade</label>
                        <input
                          type="text"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          placeholder="e.g. 10, 9.5"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Purchase Price */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Price (optional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special notes about this card..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Star className="w-5 h-5" />
                        Add to Collection
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
