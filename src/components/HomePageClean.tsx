import React from 'react';
import { 
  Play, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Compass, 
  Gem, 
  ChevronRight, 
  Layers, 
  Gift, 
  Gamepad2,
  ShieldCheck
} from 'lucide-react';
import { Game, UserHabitProfile, DiscoveryIntent } from '../types';
import { ShortDiscoveryCard } from './ShortDiscoveryCard';

interface HomePageCleanProps {
  userProfile: UserHabitProfile;
  games: Game[];
  onOpenWeekendDiscovery: () => void;
  onSelectIntent: (intent: DiscoveryIntent) => void;
  onExploreGame: (game: Game) => void;
  onToggleWishlist: (game: Game) => void;
  wishlist: Game[];
}

export const HomePageClean: React.FC<HomePageCleanProps> = ({
  userProfile,
  games,
  onOpenWeekendDiscovery,
  onSelectIntent,
  onExploreGame,
  onToggleWishlist,
  wishlist,
}) => {
  const differentFromUsual = games.filter(g => g.isDifferentFromUsual).slice(0, 4);
  const hiddenGems = games.filter(g => g.isIndieHiddenGem).slice(0, 4);

  const isGameWishlisted = (id: string) => wishlist.some(w => w.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10 select-none pb-20">
      
      {/* 1. Continue Playing (Your Habitual Baseline) */}
      <section className="bg-[#121922] border border-[#223142] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-4 h-4 text-[#66c0f4]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#c7d5e0]">
              Continue Playing
            </h2>
            <span className="text-xs text-[#5f748c]">({userProfile.recentlyPlayed.length} Games)</span>
          </div>
          <span className="text-xs text-[#8f98a0]">
            Primary Habit: <strong className="text-white">{userProfile.primaryGenres.join(' • ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userProfile.recentlyPlayed.map((item) => (
            <div
              key={item.gameId}
              className="bg-[#0e141c] hover:bg-[#15202c] border border-[#1e2c3b] hover:border-[#2a435c] rounded-lg p-3 flex items-center justify-between gap-3 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={item.bannerImage}
                  alt={item.title}
                  className="w-16 h-10 object-cover rounded flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate group-hover:text-[#66c0f4]">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-[#8f98a0] truncate">
                    {item.hoursPast2Weeks}h past 2 wks • {item.totalHours}h total
                  </p>
                </div>
              </div>

              <button 
                className="bg-[#2a475e] group-hover:bg-[#a4d007] text-white group-hover:text-[#171a21] p-2 rounded transition-colors cursor-pointer flex-shrink-0"
                title="Launch Game"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. WEEKEND DISCOVERY SPOTLIGHT HERO BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f2338] via-[#122a45] to-[#1a1c2e] border-2 border-[#1a9fff]/40 shadow-2xl p-7 md:p-8">
        
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a9fff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Hero Message */}
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="bg-[#66c0f4] text-[#11161f] text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1.5 shadow">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WEEKEND DISCOVERY</span>
              </span>
              <span className="text-xs text-[#66c0f4] font-medium">
                Active for Saturday & Sunday
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Not sure what to play this weekend?
            </h1>

            <p className="text-sm text-[#c7d5e0] leading-relaxed">
              Step away from repetitive multiplayer grinds. Explore a small, hand-crafted set of <strong>5–7 games</strong> tailored around your free time, verified on your PC hardware, with zero noise.
            </p>

            {/* Direct Intent Quick Filters */}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="text-xs text-[#8f98a0] self-center mr-1">Quick Intent:</span>
              <button
                onClick={() => { onSelectIntent('Something Different'); onOpenWeekendDiscovery(); }}
                className="bg-[#1b2b3d] hover:bg-[#66c0f4] hover:text-[#171a21] text-xs font-semibold text-[#c7d5e0] px-3 py-1.5 rounded-lg border border-[#2c4560] transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>✨ Something Different</span>
              </button>
              <button
                onClick={() => { onSelectIntent('Relax'); onOpenWeekendDiscovery(); }}
                className="bg-[#1b2b3d] hover:bg-[#66c0f4] hover:text-[#171a21] text-xs font-semibold text-[#c7d5e0] px-3 py-1.5 rounded-lg border border-[#2c4560] transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>☕ Relax</span>
              </button>
              <button
                onClick={() => { onSelectIntent('Story-driven'); onOpenWeekendDiscovery(); }}
                className="bg-[#1b2b3d] hover:bg-[#66c0f4] hover:text-[#171a21] text-xs font-semibold text-[#c7d5e0] px-3 py-1.5 rounded-lg border border-[#2c4560] transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <span>📖 Story-driven</span>
              </button>
            </div>
          </div>

          {/* Right Action Hero Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 flex-shrink-0">
            <button
              onClick={onOpenWeekendDiscovery}
              className="bg-gradient-to-r from-[#1a9fff] to-[#0077dd] hover:from-[#66c0f4] hover:to-[#1a9fff] text-[#11161f] font-black text-base px-7 py-3.5 rounded-xl shadow-xl hover:shadow-[#1a9fff]/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2.5 cursor-pointer"
            >
              <span>Enter Weekend Discovery</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 text-xs text-[#8f98a0] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Runs on your RTX 3070 PC</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Different From Your Usual Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-black text-white tracking-wide">
                Different From Your Usual
              </h2>
            </div>
            <p className="text-xs text-[#8f98a0] mt-0.5">
              Games outside the genres and styles you normally play — controlled novelty that still connects to your play style.
            </p>
          </div>

          <button
            onClick={() => { onSelectIntent('Something Different'); onOpenWeekendDiscovery(); }}
            className="text-xs text-[#66c0f4] hover:text-white flex items-center space-x-1 font-semibold cursor-pointer"
          >
            <span>See All Weekend Picks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {differentFromUsual.map((game) => (
            <ShortDiscoveryCard
              key={`home-diff-${game.id}`}
              game={game}
              onExploreGame={onExploreGame}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isGameWishlisted(game.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. Indie & Hidden Gems Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Gem className="w-5 h-5 text-[#66c0f4]" />
              <h2 className="text-xl font-black text-white tracking-wide">
                Indie & Hidden Gems
              </h2>
            </div>
            <p className="text-xs text-[#8f98a0] mt-0.5">
              Less-known games worth checking out. Curated by quality signals (95%+ positive reviews) and hardware compatibility.
            </p>
          </div>

          <button
            onClick={() => { onSelectIntent('Something Different'); onOpenWeekendDiscovery(); }}
            className="text-xs text-[#66c0f4] hover:text-white flex items-center space-x-1 font-semibold cursor-pointer"
          >
            <span>Explore Gems</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hiddenGems.map((game) => (
            <ShortDiscoveryCard
              key={`home-gem-${game.id}`}
              game={game}
              onExploreGame={onExploreGame}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={isGameWishlisted(game.id)}
            />
          ))}
        </div>
      </section>

      {/* 5. Secondary Steam Content (De-emphasized cleanly to prevent noise overload) */}
      <section className="pt-6 border-t border-[#1e2a38]">
        <div className="bg-[#0e141c]/60 border border-[#1c2734] rounded-xl p-5 text-xs text-[#8f98a0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-[#556778]" />
            <div>
              <h3 className="text-white font-bold">Looking for standard store categories & publisher sales?</h3>
              <p className="text-[11px] text-[#6e7f91]">All Steam catalog shelves remain available without cluttering your weekend discovery.</p>
            </div>
          </div>
          <button 
            onClick={() => onSelectIntent('Competitive')}
            className="bg-[#1b2532] hover:bg-[#253446] text-[#c7d5e0] hover:text-white px-4 py-2 rounded-lg border border-[#2b3a4c] font-medium transition-colors cursor-pointer self-start sm:self-auto"
          >
            Browse Full Catalog
          </button>
        </div>
      </section>

    </div>
  );
};
