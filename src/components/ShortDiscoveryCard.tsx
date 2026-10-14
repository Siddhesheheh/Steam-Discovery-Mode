import React, { useState } from 'react';
import { Star, Clock, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Game } from '../types';

interface ShortDiscoveryCardProps {
  game: Game;
  onExploreGame: (game: Game) => void;
  onToggleWishlist: (game: Game) => void;
  isWishlisted: boolean;
}

export const ShortDiscoveryCard: React.FC<ShortDiscoveryCardProps> = ({
  game,
  onExploreGame,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [showWhyTooltip, setShowWhyTooltip] = useState(false);

  const finalPrice = game.isFreeToPlay
    ? 'Free To Play'
    : game.discountPercent > 0
    ? `₹ ${(game.originalPrice * (1 - game.discountPercent / 100)).toLocaleString('en-IN')}`
    : `₹ ${game.originalPrice.toLocaleString('en-IN')}`;

  return (
    <div className="group relative bg-[#131c26] hover:bg-[#182330] border border-[#223344] hover:border-[#66c0f4] rounded-lg overflow-hidden transition-all duration-200 shadow-lg hover:shadow-2xl flex flex-col justify-between">
      
      {/* Top Banner Image with Playtime & Badge overlay */}
      <div 
        onClick={() => onExploreGame(game)}
        className="relative aspect-[16/9] overflow-hidden bg-black cursor-pointer"
      >
        <img
          src={game.bannerImage}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131c26] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {game.discoveryBadge && (
            <span className="bg-[#171a21]/90 backdrop-blur-sm text-[#66c0f4] text-[10px] font-bold px-2 py-0.5 rounded border border-[#66c0f4]/40 flex items-center space-x-1 shadow">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{game.discoveryBadge}</span>
            </span>
          )}
        </div>

        {/* Wishlist Quick Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(game);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-amber-500 text-[#171a21]'
              : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90'
          }`}
          title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
        >
          <Star className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Playtime Pill */}
        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-[#a4d007] text-[11px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1">
          <Clock className="w-3 h-3 text-[#a4d007]" />
          <span>{game.approxPlaytime}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-3">
        {/* Title, Genre, Rating & Price Line */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 
              onClick={() => onExploreGame(game)}
              className="text-sm font-bold text-white group-hover:text-[#66c0f4] cursor-pointer line-clamp-1 transition-colors"
            >
              {game.title}
            </h3>
            {/* Price Pill */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {game.discountPercent > 0 && (
                <span className="bg-[#a4d007] text-[#171a21] text-[10px] font-black px-1.5 py-0.5 rounded">
                  -{game.discountPercent}%
                </span>
              )}
              <span className="text-xs font-bold text-[#c7d5e0]">
                {finalPrice}
              </span>
            </div>
          </div>

          {/* Sub-line: Genre & Steam Score */}
          <div className="flex items-center justify-between text-[11px] text-[#8f98a0] mb-2.5">
            <span className="truncate">{game.category || game.tags[0]} • {game.tags.slice(0, 2).join(', ')}</span>
            <span className="text-[#66c0f4] font-medium flex-shrink-0 ml-1">
              ★ {game.steamRating.split(' ')[0]}
            </span>
          </div>

          {/* Hardware Compatibility Signal */}
          <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate font-medium">{game.hardware.userSystemMatch}</span>
          </div>
        </div>

        {/* "Why This Game?" Elevated Context Box */}
        <div className="bg-[#0e141b] border-l-2 border-[#66c0f4] p-2.5 rounded-r text-[11px] text-[#c7d5e0] leading-snug">
          <div className="flex items-center justify-between text-[#66c0f4] font-semibold text-[10px] uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#66c0f4]" />
              <span>Why This Game?</span>
            </span>
            {game.usualContrastGenre && (
              <span className="text-[#8f98a0] lowercase font-normal truncate max-w-[120px] text-[9px]">
                {game.usualContrastGenre}
              </span>
            )}
          </div>
          <p className="line-clamp-2 text-[#9bb3c7] italic">
            "{game.whyThisGame}"
          </p>
        </div>

        {/* Action Button: Explore Game */}
        <button
          onClick={() => onExploreGame(game)}
          className="w-full bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-[#c7d5e0] text-xs font-bold py-2 px-3 rounded flex items-center justify-center space-x-1.5 transition-all duration-150 cursor-pointer shadow border border-[#3b5d78]/50"
        >
          <span>Explore Game</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
