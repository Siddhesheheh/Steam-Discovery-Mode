import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Check, 
  ShoppingBag
} from 'lucide-react';
import { Game, UserHabitProfile } from '../types';

interface GameDetailPageProps {
  game: Game;
  userProfile: UserHabitProfile;
  onReturnToDiscovery: () => void;
  onToggleWishlist: (game: Game) => void;
  isWishlisted: boolean;
  onAddToCart: (game: Game) => void;
  isInCart: boolean;
  onOpenCart: () => void;
  isPurchased?: boolean;
  fromWeekendDiscovery?: boolean;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';

export const GameDetailPage: React.FC<GameDetailPageProps> = ({
  game,
  userProfile,
  onReturnToDiscovery,
  onToggleWishlist,
  isWishlisted,
  onAddToCart,
  isInCart,
  onOpenCart,
  isPurchased = false,
  fromWeekendDiscovery = false,
}) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Land at top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setSelectedMediaIndex(0);
  }, [game.id]);

  const discountedPriceNum = game.isFreeToPlay
    ? 0
    : game.discountPercent > 0
    ? Math.round(game.originalPrice * (1 - game.discountPercent / 100))
    : game.originalPrice;

  const handleCartClick = () => {
    if (isPurchased) return;
    if (isInCart) {
      onOpenCart();
      return;
    }
    onAddToCart(game);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const screenshots = game.screenshots && game.screenshots.length > 0 
    ? game.screenshots 
    : [
        { id: 'ss-1', url: game.heroImage || game.bannerImage || DEFAULT_FALLBACK_IMAGE, caption: `${game.title} - Main Preview` },
        { id: 'ss-2', url: game.bannerImage || DEFAULT_FALLBACK_IMAGE, caption: `${game.title} - In-game Action` },
        { id: 'ss-3', url: DEFAULT_FALLBACK_IMAGE, caption: `${game.title} - Cinematic Scene` }
      ];
  
  const currentImage = screenshots[selectedMediaIndex]?.url || game.heroImage || game.bannerImage || DEFAULT_FALLBACK_IMAGE;

  return (
    <div className="min-h-screen bg-[#1b2838] text-[#c7d5e0] pb-24 select-none">
      
      {/* Return Header */}
      {fromWeekendDiscovery ? (
        <div className="bg-[#101822] border-b border-[#223344] px-3.5 sm:px-6 py-2.5 sm:py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <button
              onClick={onReturnToDiscovery}
              className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 px-3 py-1.5 rounded-lg border border-cyan-500/40 transition-all cursor-pointer shadow self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Return to Discovery Mode</span>
            </button>

            <div className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs text-[#8f98a0]">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#66c0f4]" />
              <span>Discovered via <strong>Discovery Mode</strong> • Match: <strong className="text-cyan-400">98%</strong></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#101822] border-b border-[#223344] px-3.5 sm:px-6 py-2 sm:py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={onReturnToDiscovery}
              className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-bold text-[#8f98a0] hover:text-white bg-[#172433] hover:bg-[#203247] px-3 py-1.5 rounded-lg border border-[#2d4054] transition-all cursor-pointer shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#66c0f4]" />
              <span>Back to Store</span>
            </button>

            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-[#8f98a0]">
              <span>Store</span>
              <ChevronRight className="w-3 h-3 text-[#536577]" />
              <span>{game.category || 'Games'}</span>
              <ChevronRight className="w-3 h-3 text-[#536577]" />
              <span className="text-white font-medium truncate max-w-[160px]">{game.title}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        
        {/* Game Title */}
        <div className="space-y-1">
          <div className="text-[11px] sm:text-xs text-[#8f98a0] flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <span>All Games</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span>{game.category || 'Action'}</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-[#66c0f4] truncate">{game.title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide">{game.title}</h1>
        </div>

        {/* Top Split: Media Stage (Left) & Key Metadata (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 bg-[#0f1722] border border-[#212f3f] rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-2xl">
          
          {/* Left Column: Media Stage & Screenshots */}
          <div className="lg:col-span-8 space-y-2.5 sm:space-y-3">
            {/* Main Stage View */}
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black border border-[#212f3f] shadow-inner group">
              <img
                src={currentImage}
                alt={game.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== game.bannerImage && game.bannerImage) {
                    target.src = game.bannerImage;
                  } else {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Playtime badge over main image */}
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 bg-black/80 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10 text-[10px] sm:text-xs font-semibold text-[#a4d007] flex items-center space-x-1.5 sm:space-x-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#a4d007]" />
                <span>Playtime: {game.approxPlaytime}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
              {screenshots.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => setSelectedMediaIndex(idx)}
                  className={`relative w-20 h-12 sm:w-24 sm:h-14 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    selectedMediaIndex === idx ? 'border-[#66c0f4] ring-2 ring-[#66c0f4]/40 scale-105' : 'border-[#223344] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={s.url} 
                    alt={`Thumbnail ${idx + 1}`} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== game.bannerImage && game.bannerImage) {
                        target.src = game.bannerImage;
                      } else {
                        target.src = DEFAULT_FALLBACK_IMAGE;
                      }
                    }}
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Short Description, Why This Game & System Spec Check */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3 sm:space-y-4">
            
            {/* Header Art & Short Description */}
            <div>
              <img
                src={game.bannerImage}
                alt={game.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== game.heroImage && game.heroImage) {
                    target.src = game.heroImage;
                  } else {
                    target.src = DEFAULT_FALLBACK_IMAGE;
                  }
                }}
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2.5 sm:mb-3 border border-[#212f3f]"
              />
              <p className="text-[11px] sm:text-xs text-[#c7d5e0] leading-relaxed">
                {game.shortDescription}
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs border-y border-[#212f3f] py-2.5 sm:py-3 text-[#8f98a0]">
              <div className="flex justify-between">
                <span>Release Date:</span>
                <span className="text-white font-medium">{game.releaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Developer:</span>
                <span className="text-[#66c0f4] font-medium truncate max-w-[160px] text-right">{game.developer}</span>
              </div>
              <div className="flex justify-between">
                <span>Publisher:</span>
                <span className="text-[#66c0f4] font-medium truncate max-w-[160px] text-right">{game.publisher}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reviews:</span>
                <span className="text-[#66c0f4] font-bold bg-[#1a2838] px-2 py-0.5 rounded text-[10px] sm:text-xs">
                  {game.reviewSummary} ({game.reviewCount.toLocaleString()})
                </span>
              </div>
            </div>

            {/* "Why This Game Fits You" */}
            <div className="bg-gradient-to-br from-[#122436] to-[#0c1824] border-l-4 border-cyan-400 p-2.5 sm:p-3.5 rounded-r-lg space-y-1 shadow-md">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Why This Game Fits You</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#c7d5e0] leading-relaxed">
                {game.whyThisGame}
              </p>
            </div>

            {/* System Spec Match Widget */}
            <div className="bg-[#121922] border border-[#212f3f] rounded-lg p-2.5 sm:p-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <div className="flex items-center space-x-1.5 text-[#a4d007] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#a4d007]" />
                  <span>Hardware Match Verified</span>
                </div>
                <span className="text-[10px] text-[#8f98a0]">{userProfile.pcSpecs.gpu}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#8f98a0]">
                {game.hardware.userSystemMatch}
              </p>
            </div>

          </div>
        </div>

        {/* Buy Game / Pricing & Add To Cart Section (Uncluttered on Mobile & Tablet) */}
        <div className="bg-[#182330] border border-[#2d4054] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 shadow-xl">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-black text-white">Buy {game.title}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] sm:text-xs text-[#8f98a0]">Instant Steam library activation</span>
              {game.discountPercent > 0 && (
                <span className="bg-[#4c6b22] text-[#a4d007] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded">
                  SAVE {game.discountPercent}%
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full md:w-auto">
            {/* Price Box */}
            <div className="bg-[#0b1016] border border-[#1b2633] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center space-x-2.5 sm:space-x-3">
              {game.discountPercent > 0 && (
                <div className="bg-[#4c6b22] text-[#a4d007] font-black text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  -{game.discountPercent}%
                </div>
              )}
              
              <div className="flex flex-col items-end">
                <div className="text-sm sm:text-base font-black text-white whitespace-nowrap leading-tight">
                  {game.isFreeToPlay
                    ? 'Free to Play'
                    : `₹ ${discountedPriceNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
                {game.discountPercent > 0 && (
                  <div className="text-[10px] sm:text-xs text-[#8f98a0] line-through whitespace-nowrap leading-tight mt-0.5">
                    ₹ {game.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 flex-1 sm:flex-none justify-end">
              {/* Wishlist Button */}
              <button
                onClick={() => onToggleWishlist(game)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                  isWishlisted
                    ? 'bg-amber-500 text-[#171a21]'
                    : 'bg-[#212f3f] hover:bg-[#2d4054] text-[#c7d5e0] border border-[#3b536e]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
              </button>

              {/* Add to Cart CTA Button */}
              <button
                onClick={handleCartClick}
                disabled={isPurchased}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-black transition-all flex items-center space-x-1.5 sm:space-x-2 shadow-lg cursor-pointer ${
                  isPurchased
                    ? 'bg-emerald-600 text-white cursor-default'
                    : isInCart
                    ? 'bg-[#1a9fff] hover:bg-[#66c0f4] text-[#11161f]'
                    : 'bg-gradient-to-r from-[#a4d007] to-[#759800] hover:from-[#bce31b] hover:to-[#8db800] text-[#171a21]'
                }`}
              >
                {isPurchased ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>In Library</span>
                  </>
                ) : isInCart ? (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Added to Cart Toast */}
        {addedToast && (
          <div className="bg-emerald-950/80 border-2 border-emerald-500 text-white p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold">Added {game.title} to your cart!</p>
                <p className="text-[10px] sm:text-xs text-emerald-300/80">You can continue browsing or proceed to checkout.</p>
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#101721] font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ml-2"
            >
              View Cart
            </button>
          </div>
        )}

        {/* Detailed Description & System Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* About section */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#121922] border border-[#212f3f] rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-b border-[#212f3f] pb-2">
                About This Game
              </h3>
              <p className="text-xs sm:text-sm text-[#b8d2e8] leading-relaxed">
                {game.detailedDescription || game.shortDescription}
              </p>

              <div className="pt-2">
                <h4 className="text-[10px] sm:text-xs font-bold text-[#8f98a0] uppercase tracking-wider mb-2">Popular User Tags:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {game.tags.map(tag => (
                    <span key={tag} className="bg-[#1b2838] text-[#66c0f4] text-[10px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded border border-[#2a475e]/40">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Requirements Right Box */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121922] border border-[#212f3f] rounded-xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-b border-[#212f3f] pb-2">
                System Requirements
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#8f98a0] block text-[11px]">Graphics (GPU):</span>
                  <span className="text-white font-medium">{game.hardware.gpuRequirement}</span>
                </div>
                <div>
                  <span className="text-[#8f98a0] block text-[11px]">Memory (RAM):</span>
                  <span className="text-white font-medium">{game.hardware.ramRequirement}</span>
                </div>
                <div>
                  <span className="text-[#8f98a0] block text-[11px]">Performance Tier:</span>
                  <span className="text-emerald-400 font-bold">{game.hardware.tier}</span>
                </div>
                <div className="pt-2 border-t border-[#212f3f]">
                  <span className="text-[#8f98a0] block text-[11px]">Your Rig Fit:</span>
                  <span className="text-cyan-300 font-medium">{game.hardware.userSystemMatch}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
