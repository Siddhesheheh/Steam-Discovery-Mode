import React from 'react';
import { Star, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Game } from '../types';

interface WishlistViewProps {
  wishlistGames: Game[];
  onRemoveFromWishlist: (game: Game) => void;
  onAddToCart: (game: Game) => void;
  onSelectGame: (game: Game) => void;
  onBackToStore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistGames,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectGame,
  onBackToStore,
}) => {
  return (
    <div className="bg-[#1b2838] min-h-screen text-[#c7d5e0] p-3.5 sm:p-6 max-w-7xl mx-auto select-none pb-28">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#2a475e]/40">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onBackToStore}
            className="p-1.5 sm:p-2 bg-[#212b36] hover:bg-[#2a475e] rounded text-white cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">WISHLIST</h1>
            <span className="bg-[#212b36] text-[#66c0f4] text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded">
              {wishlistGames.length} Items
            </span>
          </div>
        </div>
      </div>

      {/* Wishlist Items List */}
      {wishlistGames.length > 0 ? (
        <div className="space-y-3">
          {wishlistGames.map((game, idx) => {
            const finalPrice = game.isFreeToPlay
              ? 'Free To Play'
              : game.discountPercent > 0
              ? `₹ ${(game.originalPrice * (1 - game.discountPercent / 100)).toLocaleString('en-IN')}`
              : `₹ ${game.originalPrice.toLocaleString('en-IN')}`;

            return (
              <div
                key={game.id}
                className="bg-[#0e141b] border border-[#212b36] hover:border-[#66c0f4] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all shadow-lg"
              >
                <div 
                  onClick={() => onSelectGame(game)}
                  className="flex items-center space-x-3 sm:space-x-4 flex-1 cursor-pointer min-w-0"
                >
                  <span className="text-xs font-bold text-[#556778] w-5 sm:w-6 flex-shrink-0">#{idx + 1}</span>
                  <img
                    src={game.bannerImage}
                    alt={game.title}
                    className="w-24 h-14 sm:w-32 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-base font-bold text-white truncate hover:text-[#66c0f4]">
                      {game.title}
                    </h3>
                    <div className="text-[10px] sm:text-xs text-[#8f98a0] mt-0.5 sm:mt-1">
                      Reviews: <span className="text-[#66c0f4]">{game.reviewSummary}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                      {game.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-[#212b36] text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded text-[#c7d5e0]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side Price and Actions */}
                <div className="flex items-center justify-between sm:justify-end space-x-2.5 sm:space-x-3 flex-shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#212b36]">
                  <div className="bg-[#000000]/60 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-right">
                    {game.discountPercent > 0 && (
                      <div className="text-[9px] sm:text-[10px] text-[#7193a6] line-through">
                        ₹ {game.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                    <div className="text-xs sm:text-sm font-bold text-[#bcee6d]">
                      {finalPrice}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(game)}
                    className="bg-[#a4d007] hover:bg-[#bce31b] text-[#171a21] font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(game)}
                    className="p-1.5 sm:p-2 bg-[#212b36] hover:bg-rose-900/50 hover:text-rose-400 rounded-lg text-gray-400 cursor-pointer transition-colors"
                    title="Remove from Wishlist"
                    aria-label="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0e141b] border border-[#212b36] rounded-2xl p-8 sm:p-12 text-center">
          <Star className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Your wishlist is empty</h2>
          <p className="text-xs text-[#8f98a0] mb-4">Browse games in the Store and click "Add to Wishlist" to track sales.</p>
          <button
            onClick={onBackToStore}
            className="bg-[#66c0f4] hover:bg-[#1a9fff] text-[#171a21] font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Explore Store
          </button>
        </div>
      )}
    </div>
  );
};
