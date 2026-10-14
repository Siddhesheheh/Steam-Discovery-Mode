import React, { useState } from 'react';
import { 
  Sparkles, 
  Coffee, 
  BookOpen, 
  Swords, 
  Gem, 
  ShieldCheck, 
  SlidersHorizontal,
  Check,
  ArrowLeft
} from 'lucide-react';
import { Game, DiscoveryIntent, UserHabitProfile } from '../types';
import { ShortDiscoveryCard } from './ShortDiscoveryCard';

interface WeekendDiscoveryViewProps {
  games: Game[];
  userProfile: UserHabitProfile;
  onExploreGame: (game: Game) => void;
  onToggleWishlist: (game: Game) => void;
  wishlist: Game[];
  onBackToHome: () => void;
}

// Playtime matcher helper
const matchesPlaytime = (game: Game, filter: 'All' | 'Under 6h' | '6-14h' | 'Longer'): boolean => {
  if (filter === 'All') return true;

  const text = (game.approxPlaytime || '').toLowerCase();
  
  // Extract all numbers
  const numbers = (text.match(/\d+(\.\d+)?/g) || []).map(Number);
  
  let hours = 0;
  if (numbers.length > 0) {
    if (numbers.length === 1) {
      hours = numbers[0];
    } else {
      hours = (numbers[0] + numbers[1]) / 2;
    }
  }

  // Handle minutes or bursts explicitly (e.g. "15-30 min", "20 min")
  if (text.includes('min') && !text.includes('hr')) {
    hours = 0.5;
  }

  const isExplicitEndlessOrLong = 
    text.includes('endless') || 
    text.includes('multiplayer') || 
    text.includes('ranked') || 
    text.includes('50v50') || 
    text.includes('100+') || 
    text.includes('60+') ||
    text.includes('50+') ||
    text.includes('75+') ||
    hours >= 18;

  if (filter === 'Under 6h') {
    if (isExplicitEndlessOrLong && !text.includes('burst') && !text.includes('min')) return false;
    return (hours > 0 && hours <= 5.5) || text.includes('1 sitting') || text.includes('zen') || (text.includes('min') && !text.includes('hr'));
  }

  if (filter === '6-14h') {
    if (isExplicitEndlessOrLong && hours < 6) return false;
    return hours >= 5.5 && hours <= 16;
  }

  if (filter === 'Longer') {
    return isExplicitEndlessOrLong || hours > 16;
  }

  return true;
};

export const WeekendDiscoveryView: React.FC<WeekendDiscoveryViewProps> = ({
  games,
  userProfile,
  onExploreGame,
  onToggleWishlist,
  wishlist,
  onBackToHome,
}) => {
  const [selectedIntent, setSelectedIntent] = useState<DiscoveryIntent>('Relax');
  const [activePlaytimeFilter, setActivePlaytimeFilter] = useState<'All' | 'Under 6h' | '6-14h' | 'Longer'>('All');

  // 1. Filter curated set for current intent AND active playtime filter
  const curatedSet = games.filter(g => {
    const matchesIntent = g.discoveryIntents.includes(selectedIntent);
    if (!matchesIntent) return false;
    return matchesPlaytime(g, activePlaytimeFilter);
  });

  // 2. Filter Different from your usual subset with active playtime filter (no duplicates)
  const differentFromUsualGames: Game[] = Array.from(
    new Map<string, Game>(
      games
        .filter(g => g.isDifferentFromUsual && matchesPlaytime(g, activePlaytimeFilter))
        .map(g => [g.id, g])
    ).values()
  ).slice(0, 8);

  // 3. Filter Indie & Hidden Gems subset with active playtime filter (no duplicates)
  const hiddenGems: Game[] = Array.from(
    new Map<string, Game>(
      games
        .filter(g => (g.isIndieHiddenGem || g.tags.includes('Indie')) && matchesPlaytime(g, activePlaytimeFilter))
        .map(g => [g.id, g])
    ).values()
  ).slice(0, 8);

  const isGameWishlisted = (id: string) => wishlist.some(w => w.id === id);

  const intentDetails = {
    'Something Different': {
      label: 'Something Different',
      icon: Sparkles,
      tagline: 'Outside your usual picks',
      description: `Tailored for you: We noticed you usually play ${userProfile.primaryGenres.join(' & ')}. Here are games offering fresh mechanics, satisfying deduction, and novel loops without overwhelming grind.`,
      color: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/40 text-cyan-400'
    },
    'Relax': {
      label: 'Relax',
      icon: Coffee,
      tagline: 'Low-stress & soothing flow states',
      description: 'Zero death penalties, cozy vibes, and warm soundtracks designed to help you decompress and unwind during your weekend off.',
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/40 text-emerald-400'
    },
    'Story-driven': {
      label: 'Story-driven',
      icon: BookOpen,
      tagline: 'Rich narrative arcs you can finish this weekend',
      description: 'Engaging character writing, mystery, and atmosphere in 4–10 hour self-contained arcs that respect your available time.',
      color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/40 text-purple-400'
    },
    'Competitive': {
      label: 'Competitive',
      icon: Swords,
      tagline: 'Reflex & skill, but fresh formats',
      description: 'Tactical duels and fast-paced rounds that reward mechanical mastery without the toxicity of mainstream ranked ladders.',
      color: 'from-amber-500/20 to-orange-600/10 border-amber-500/40 text-amber-400'
    }
  };

  const currentIntentConfig = intentDetails[selectedIntent];
  const IntentIcon = currentIntentConfig.icon;

  return (
    <div className="min-h-screen bg-[#11161f] text-[#c7d5e0] pb-24 select-none">
      
      {/* Top Ambient Weekend Discovery Hero */}
      <div className="bg-gradient-to-b from-[#1b2838] via-[#141d27] to-[#11161f] border-b border-[#223344] px-3.5 sm:px-6 py-5 sm:py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Back to Store Quick Button */}
          <div className="mb-3.5 sm:mb-4">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold text-[#8f98a0] hover:text-white bg-[#151f2b] hover:bg-[#1f2d3d] border border-[#26374a] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          </div>
          
          {/* Header Top Meta */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="bg-[#66c0f4]/15 text-[#66c0f4] border border-[#66c0f4]/30 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#66c0f4] animate-pulse" />
                  <span>DISCOVERY MODE</span>
                </span>
                <span className="text-[11px] sm:text-xs text-[#8f98a0]">
                  Curated for <strong className="text-white">{userProfile.name}</strong>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide">
                Not sure what to play next?
              </h1>
              <p className="text-xs sm:text-sm text-[#8f98a0] max-w-2xl">
                Hand-picked games worth discovering. High-quality recommendations filtered for your hardware and taste without endless scrolling.
              </p>
            </div>

            {/* Hardware Status Chip */}
            <div className="bg-[#0e141b] border border-[#212b36] rounded-lg p-2.5 sm:p-3 text-xs flex items-center space-x-2.5 sm:space-x-3 shadow-inner self-start md:self-auto">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-white font-semibold flex items-center space-x-1 text-[11px] sm:text-xs">
                  <span>Hardware Filter Active</span>
                  <span className="text-[10px] text-emerald-400">● Verified</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8f98a0]">
                  {userProfile.pcSpecs.gpu}
                </div>
              </div>
            </div>
          </div>

          {/* Discovery Intent Selection Tabs */}
          <div className="mt-5 sm:mt-8">
            <div className="text-[11px] sm:text-xs font-bold text-[#8f98a0] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#66c0f4]" />
              <span>Choose your gaming mood:</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
              {(['Something Different', 'Relax', 'Story-driven', 'Competitive'] as DiscoveryIntent[]).map((intent) => {
                const config = intentDetails[intent];
                const Icon = config.icon;
                const isSelected = selectedIntent === intent;

                return (
                  <button
                    key={intent}
                    onClick={() => setSelectedIntent(intent)}
                    className={`flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3.5 rounded-lg border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1a9fff]/20 to-[#66c0f4]/10 border-[#1a9fff] shadow-lg ring-1 ring-[#1a9fff]/40'
                        : 'bg-[#0f1722]/80 border-[#212f3f] hover:bg-[#162230] hover:border-[#384f66]'
                    }`}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-md flex-shrink-0 ${isSelected ? 'bg-[#1a9fff] text-[#11161f]' : 'bg-[#1b2838] text-[#8f98a0]'}`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[11px] sm:text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#c7d5e0]'}`}>
                        {config.label}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[#8f98a0] truncate">
                        {intent === 'Something Different' ? 'Outside usual picks' : intent === 'Relax' ? 'Cozy & Chill' : intent === 'Story-driven' ? 'Short story arcs' : 'Fast-paced PvP'}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#66c0f4] flex-shrink-0 hidden sm:block" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Intent Explanation Banner */}
          <div className="mt-3.5 sm:mt-4 p-3.5 sm:p-4 rounded-lg bg-[#0d1520] border border-[#1f2e3d] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start space-x-2.5 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded bg-[#172433] text-[#66c0f4] flex-shrink-0 mt-0.5">
                <IntentIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-2">
                  <span className="text-[#66c0f4] uppercase tracking-wider">{currentIntentConfig.tagline}</span>
                  <span className="text-[9px] sm:text-[10px] bg-[#1a2838] text-[#8f98a0] px-1.5 py-0.2 rounded">
                    {curatedSet.length} Curated Picks
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#9bb3c7] mt-0.5 max-w-3xl leading-relaxed">
                  {currentIntentConfig.description}
                </p>
              </div>
            </div>

            {/* Playtime length sub-filter */}
            <div className="flex items-center space-x-1 self-start md:self-auto bg-[#131d28] p-1 rounded border border-[#213144] text-[10px] sm:text-[11px] overflow-x-auto no-scrollbar max-w-full">
              <span className="text-[#6c7b8c] px-1.5 font-medium whitespace-nowrap">Time:</span>
              {(['All', 'Under 6h', '6-14h', 'Longer'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActivePlaytimeFilter(filter)}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                    activePlaytimeFilter === filter
                      ? 'bg-[#2a475e] text-white font-bold'
                      : 'text-[#8f98a0] hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 mt-6 sm:mt-8 space-y-8 sm:space-y-12">
        
        {/* Section 1: Curated Intent Games (Short Discovery Cards) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-3.5 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>Recommended for you</span>
                <span className="text-xs font-normal text-[#8f98a0]">• Short Discovery Cards</span>
                {activePlaytimeFilter !== 'All' && (
                  <span className="bg-[#2a475e] text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {activePlaytimeFilter} ({curatedSet.length})
                  </span>
                )}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8f98a0]">
                Scannable cards with playtime duration, hardware compatibility, and exact recommendation rationale.
              </p>
            </div>
          </div>

          {curatedSet.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {curatedSet.map((game) => (
                <ShortDiscoveryCard
                  key={game.id}
                  game={game}
                  onExploreGame={onExploreGame}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={isGameWishlisted(game.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#0e141b] border border-[#212b36] rounded-xl p-8 text-center space-y-2">
              <p className="text-sm font-bold text-white">No games match this playtime filter</p>
              <p className="text-xs text-[#8f98a0]">Try selecting "All" to view all {selectedIntent} recommendations.</p>
              <button
                onClick={() => setActivePlaytimeFilter('All')}
                className="mt-2 bg-[#2a475e] hover:bg-[#3d6585] text-white text-xs font-bold px-3 py-1.5 rounded cursor-pointer"
              >
                Reset Time Filter
              </button>
            </div>
          )}
        </section>

        {/* Section 2: Different From What You Usually Play */}
        {differentFromUsualGames.length > 0 && (
          <section className="bg-gradient-to-r from-[#111923] to-[#0d141c] border border-[#223344] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-[#213144]">
              <div className="p-1.5 sm:p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                  Different From What You Usually Play
                </h2>
                <p className="text-[11px] sm:text-xs text-[#8f98a0]">
                  Great palate cleansers outside tactical shooters and sports.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {differentFromUsualGames.map((game) => (
                <div
                  key={`diff-${game.id}`}
                  onClick={() => onExploreGame(game)}
                  className="bg-[#151f2b] hover:bg-[#1c2a3a] border border-[#26374a] hover:border-cyan-400/60 rounded-xl overflow-hidden transition-all duration-200 shadow-md group cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-black relative">
                    <img src={game.bannerImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-1.5 left-1.5 bg-[#0e1722]/90 backdrop-blur-xs text-cyan-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-cyan-500/30">
                      Palate Cleanser
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {game.isFreeToPlay ? 'Free' : `₹ ${game.originalPrice.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                        {game.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-[#8f98a0] truncate">
                        {game.tags.slice(0, 2).join(' • ')} • {game.approxPlaytime}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#213144] flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-medium truncate text-[10px]">
                        ★ {game.steamRating.split(' ')[0]}
                      </span>
                      <span className="text-[#66c0f4] font-bold text-[10px] hover:underline">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Indie & Hidden Gems */}
        {hiddenGems.length > 0 && (
          <section className="bg-gradient-to-r from-[#171424] to-[#0f1118] border border-[#2d2244] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-[#2d2244]">
              <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 flex-shrink-0">
                <Gem className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                  Indie & Hidden Gems
                </h2>
                <p className="text-[11px] sm:text-xs text-[#8f98a0]">
                  Standout indie titles with overwhelming player praise.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {hiddenGems.map((game) => (
                <div
                  key={`gem-${game.id}`}
                  onClick={() => onExploreGame(game)}
                  className="bg-[#181528] hover:bg-[#221c38] border border-[#31254d] hover:border-purple-400/60 rounded-xl overflow-hidden transition-all duration-200 shadow-md group cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-black relative">
                    <img src={game.bannerImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-1.5 left-1.5 bg-[#171224]/90 backdrop-blur-xs text-purple-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-purple-500/30">
                      Hidden Gem
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {game.isFreeToPlay ? 'Free' : `₹ ${game.originalPrice.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 truncate">
                        {game.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-[#8f98a0] truncate">
                        {game.tags.slice(0, 2).join(' • ')} • {game.approxPlaytime}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#2d2244] flex items-center justify-between text-[11px]">
                      <span className="text-purple-300 font-medium truncate text-[10px]">
                        ★ {game.steamRating.split(' ')[0]}
                      </span>
                      <span className="text-purple-400 font-bold text-[10px] hover:underline">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
