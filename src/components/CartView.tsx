import React, { useState } from 'react';
import { Game, UserHabitProfile } from '../types';
import { 
  ShoppingBag, 
  Trash2, 
  Star, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Gift, 
  ChevronRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface CartViewProps {
  cart: Game[];
  userProfile: UserHabitProfile;
  onRemoveFromCart: (gameId: string) => void;
  onMoveToWishlist: (game: Game) => void;
  onClearCart: () => void;
  onCheckout: (games: Game[]) => void;
  onReturnToStore: () => void;
  onExploreGame: (game: Game) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  userProfile,
  onRemoveFromCart,
  onMoveToWishlist,
  onClearCart,
  onCheckout,
  onReturnToStore,
  onExploreGame,
}) => {
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [lastPurchasedGames, setLastPurchasedGames] = useState<Game[]>([]);

  // Calculations
  const rawSubtotal = cart.reduce((sum, g) => sum + (g.isFreeToPlay ? 0 : g.originalPrice), 0);
  const totalAmount = cart.reduce((sum, g) => {
    if (g.isFreeToPlay) return sum;
    const finalPrice = g.discountPercent > 0 
      ? Math.round(g.originalPrice * (1 - g.discountPercent / 100)) 
      : g.originalPrice;
    return sum + finalPrice;
  }, 0);
  const totalSavings = rawSubtotal - totalAmount;

  const hasEnoughFunds = userProfile.walletBalance >= totalAmount;

  const handlePurchase = () => {
    if (cart.length === 0) return;
    setLastPurchasedGames([...cart]);
    onCheckout(cart);
    setPurchaseSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 select-none space-y-8 pb-32">
      
      {/* Top Breadcrumb & Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#212f3f]">
        <div>
          <div className="text-xs text-[#8f98a0] flex items-center space-x-1 mb-1">
            <span onClick={onReturnToStore} className="hover:text-white cursor-pointer">Store</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#66c0f4]">Shopping Cart</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center space-x-3">
            <ShoppingBag className="w-7 h-7 text-[#66c0f4]" />
            <span>Your Shopping Cart ({cart.length})</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-xs text-[#8f98a0] hover:text-red-400 font-semibold px-3 py-1.5 rounded border border-[#212f3f] hover:border-red-500/40 transition-colors cursor-pointer"
            >
              Remove All Items
            </button>
          )}
          <button
            onClick={onReturnToStore}
            className="bg-[#212b36] hover:bg-[#2a475e] text-xs font-bold text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer border border-[#2f3d4f]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>

      {/* Main Cart Content */}
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-[#121922] border border-[#212f3f] rounded-2xl p-8 space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-[#1a2533] border border-[#2a3f5a] rounded-2xl flex items-center justify-center mx-auto text-[#66c0f4]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Your Steam Cart is Empty</h2>
          <p className="text-xs text-[#8f98a0] max-w-md mx-auto leading-relaxed">
            Looks like you haven't added any games to your cart yet. Explore our featured store catalog or discover games tailored for your weekend.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onReturnToStore}
              className="bg-[#1a9fff] hover:bg-[#66c0f4] text-[#11161f] font-bold text-xs px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg"
            >
              Browse Featured Games
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((game) => {
              const discountedPriceNum = game.isFreeToPlay 
                ? 0 
                : game.discountPercent > 0 
                ? Math.round(game.originalPrice * (1 - game.discountPercent / 100)) 
                : game.originalPrice;

              return (
                <div
                  key={`cart-item-${game.id}`}
                  className="bg-[#121922] border border-[#212f3f] hover:border-[#2f4358] rounded-xl p-4 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Game Info with Thumbnail */}
                  <div 
                    onClick={() => onExploreGame(game)}
                    className="flex items-center space-x-4 cursor-pointer flex-1 min-w-0 group"
                  >
                    <img 
                      src={game.bannerImage} 
                      alt={game.title} 
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', game.heroImage || '/images/fc26_cover.jpg');
                      }}
                      className="w-28 h-16 sm:w-36 sm:h-20 object-cover rounded-lg flex-shrink-0 border border-[#212f3f] group-hover:border-[#66c0f4]/50 transition-colors" 
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#66c0f4] truncate transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-[#8f98a0] truncate mt-0.5">
                        {game.tags.slice(0, 3).join(' • ')}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-[10px] bg-[#1a2533] text-cyan-300 font-bold px-2 py-0.5 rounded border border-[#2a3f5a]">
                          {game.approxPlaytime}
                        </span>
                        <span className="text-[10px] text-[#8f98a0]">
                          {game.reviewSummary}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Block & Removal Actions */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1f2b38]">
                    
                    {/* Price Widget with Rupee Symbol in One Line */}
                    <div className="flex items-center bg-[#000000]/70 rounded-lg p-2 border border-[#2d4054]">
                      {game.discountPercent > 0 && (
                        <div className="bg-[#a4d007] text-[#171a21] text-xs font-black px-2 py-1.5 rounded mr-2.5 select-none">
                          -{game.discountPercent}%
                        </div>
                      )}
                      <div className="flex flex-col justify-center items-end px-1">
                        {/* Sales Price ABOVE */}
                        <div className="text-sm md:text-base font-black text-white whitespace-nowrap leading-tight">
                          {game.isFreeToPlay 
                            ? 'Free To Play' 
                            : `₹ ${discountedPriceNum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </div>
                        {/* Strikedown Price BELOW */}
                        {game.discountPercent > 0 && (
                          <div className="text-[11px] text-[#8f98a0] line-through whitespace-nowrap leading-tight mt-0.5">
                            ₹ {game.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onMoveToWishlist(game)}
                        title="Move to Wishlist"
                        className="p-2 bg-[#1b2532] hover:bg-amber-500/20 text-[#8f98a0] hover:text-amber-300 rounded-lg border border-[#263546] transition-colors cursor-pointer"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(game.id)}
                        title="Remove from Cart"
                        className="p-2 bg-[#1b2532] hover:bg-red-500/20 text-[#8f98a0] hover:text-red-400 rounded-lg border border-[#263546] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Delivery Notice */}
            <div className="bg-[#0e1620] border border-[#1b2838] rounded-xl p-4 text-xs text-[#8f98a0] flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                All purchases are instant digital licenses associated directly with your Steam Account (<strong>{userProfile.name}</strong>).
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-b from-[#151f2b] to-[#0e1622] border border-[#2a3d52] rounded-2xl p-6 shadow-2xl space-y-5 sticky top-24">
              
              <h2 className="text-base font-black text-white uppercase tracking-wider pb-3 border-b border-[#212f3f]">
                Order Summary
              </h2>

              {/* Price calculations */}
              <div className="space-y-2.5 text-xs text-[#8f98a0]">
                <div className="flex justify-between items-center">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span className="text-white font-medium whitespace-nowrap">₹ {rawSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between items-center text-emerald-400">
                    <span>Discount Savings</span>
                    <span className="font-bold whitespace-nowrap">- ₹ {totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#212f3f] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Estimated Total</span>
                  <span className="text-xl font-black text-[#66c0f4] whitespace-nowrap">
                    ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Wallet status */}
              <div className="bg-[#0a1017] rounded-xl p-3.5 border border-[#1b2838] space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8f98a0]">Steam Wallet Balance:</span>
                  <span className="text-emerald-400 font-bold whitespace-nowrap">
                    ₹ {userProfile.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#6b7b8c] pt-1 border-t border-[#162230]">
                  <span>Balance after purchase:</span>
                  <span className={`font-semibold whitespace-nowrap ${hasEnoughFunds ? 'text-white' : 'text-red-400'}`}>
                    ₹ {Math.max(0, userProfile.walletBalance - totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-[#a4d007] to-[#759800] hover:from-[#bce31b] hover:to-[#8db800] text-[#171a21] font-black text-sm py-3.5 px-4 rounded-xl transition-all shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Purchase for myself</span>
                </button>

                <button
                  onClick={handlePurchase}
                  className="w-full bg-[#212f3f] hover:bg-[#2c3d50] text-[#c7d5e0] font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-[#3b536e]"
                >
                  <Gift className="w-4 h-4 text-[#66c0f4]" />
                  <span>Purchase as a gift</span>
                </button>
              </div>

              <div className="text-[11px] text-[#6b7b8c] text-center leading-relaxed">
                Sales tax included where applicable. Refunds available within 14 days and under 2 hours playtime.
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PURCHASE COMPLETE SUCCESS MODAL */}
      {/* ========================================================================= */}
      {purchaseSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121922] border-2 border-emerald-500/80 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white">Thank you for your purchase!</h2>
              <p className="text-xs text-[#8f98a0]">
                Your transaction is complete. The receipt has been saved and your games are ready in your Steam Library.
              </p>
            </div>

            {/* Purchased Items List */}
            <div className="bg-[#0b1016] rounded-xl p-3 border border-[#1b2838] max-h-48 overflow-y-auto space-y-2">
              {lastPurchasedGames.map(g => (
                <div key={`receipt-${g.id}`} className="flex items-center space-x-3 p-2 bg-[#121b26] rounded-lg">
                  <img src={g.bannerImage} alt={g.title} className="w-12 h-8 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{g.title}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">✓ Added to Library</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setPurchaseSuccess(false);
                  onReturnToStore();
                }}
                className="flex-1 bg-[#1a9fff] hover:bg-[#66c0f4] text-[#11161f] font-bold text-xs py-3 rounded-lg transition-colors cursor-pointer"
              >
                Continue Browsing Store
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
