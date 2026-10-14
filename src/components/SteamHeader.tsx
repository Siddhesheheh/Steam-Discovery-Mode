import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Lock, 
  Search, 
  Star, 
  Sparkles,
  ShoppingBag,
  X,
  ChevronDown,
  Crosshair,
  Zap,
  Trophy,
  BookOpen,
  Tag,
  Menu
} from 'lucide-react';
import { SteamNavTab, Game, UserHabitProfile, StoreFilter, StoreCategory } from '../types';

interface SteamHeaderProps {
  activeTab: SteamNavTab;
  setActiveTab: (tab: SteamNavTab) => void;
  currentUrl: string;
  onNavigateHome: () => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onSelectGame: (game: Game) => void;
  allGames: Game[];
  userProfile: UserHabitProfile;
  storeFilter?: StoreFilter;
  onSelectSpecialOffers: () => void;
  onSelectCategory: (category: StoreCategory) => void;
  onResetStoreFilter: () => void;
}

export const SteamHeader: React.FC<SteamHeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUrl,
  onNavigateHome,
  onNavigateBack,
  onNavigateForward,
  canGoBack,
  canGoForward,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenCart,
  onSelectGame,
  allGames,
  userProfile,
  storeFilter = { type: 'ALL' } as StoreFilter,
  onSelectSpecialOffers,
  onSelectCategory,
  onResetStoreFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGames = searchQuery.trim()
    ? allGames.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.category && g.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectSearchResult = (game: Game) => {
    onSelectGame(game);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const categoriesList: { id: StoreCategory; label: string; icon: any; desc: string; count: number }[] = [
    { 
      id: 'FPS', 
      label: 'FPS', 
      icon: Crosshair, 
      desc: 'Tactical shooters, battle royales & precision gunplay',
      count: allGames.filter(g => g.tags.some(t => ['FPS', 'Shooter', 'Tactical', 'Battle Royale'].includes(t))).length
    },
    { 
      id: 'Action', 
      label: 'Action', 
      icon: Zap, 
      desc: 'Open world, crime heists & superhero adventures',
      count: allGames.filter(g => g.category === 'Action' || g.tags.includes('Action') || g.tags.includes('Open World')).length
    },
    { 
      id: 'Sports', 
      label: 'Sports', 
      icon: Trophy, 
      desc: 'Football simulation, Formula 1 racing & arcade soccer',
      count: allGames.filter(g => g.category === 'Sports' || g.tags.some(t => ['Sports', 'Football (Soccer)', 'Racing'].includes(t))).length
    },
    { 
      id: 'Story Mode', 
      label: 'Story Mode', 
      icon: BookOpen, 
      desc: 'Branching decisions, deep lore & cinematic campaigns',
      count: allGames.filter(g => g.tags.some(t => ['Story Rich', 'Masterpiece', 'Choices Matter', 'RPG', 'Atmospheric'].includes(t)) || g.category === 'Adventure' || g.category === 'RPG').length
    }
  ];

  return (
    <header className="bg-[#171a21] text-[#c7d5e0] select-none border-b border-[#0f1118] sticky top-0 z-50 shadow-md">
      
      {/* Top Application Bar with Navigation Controls, Tabs & Profile */}
      <div className="px-3 sm:px-4 py-2 bg-[#171a21] border-b border-[#21252e]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Navigation Controls & Steam URL Bar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink min-w-0">
            <div className="flex items-center space-x-1">
              <button 
                onClick={onNavigateBack} 
                disabled={!canGoBack}
                className={`p-1 sm:p-1.5 rounded hover:bg-[#212b36] transition-colors ${!canGoBack ? 'opacity-30 cursor-not-allowed' : 'hover:text-white cursor-pointer'}`}
                title="Back"
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={onNavigateForward} 
                disabled={!canGoForward}
                className={`p-1 sm:p-1.5 rounded hover:bg-[#212b36] transition-colors ${!canGoForward ? 'opacity-30 cursor-not-allowed' : 'hover:text-white cursor-pointer'}`}
                title="Forward"
                aria-label="Forward"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => { onResetStoreFilter(); onNavigateHome(); }}
                className="p-1 sm:p-1.5 rounded hover:bg-[#212b36] hover:text-white transition-colors cursor-pointer"
                title="Reload Home"
                aria-label="Reload Home"
              >
                <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>

            {/* Steam URL Bar Display - Responsive truncate */}
            <div className="hidden sm:flex items-center bg-[#101217] border border-[#2a3f5a]/40 rounded px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs text-[#8f98a0] max-w-[140px] md:max-w-xs lg:max-w-md overflow-hidden font-mono">
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#5c7e96] mr-1 flex-shrink-0" />
              <span className="truncate text-[#66c0f4]">{currentUrl}</span>
            </div>
          </div>

          {/* Center Main Steam Nav Tabs (Smooth scroll on tablet & mobile) */}
          <nav className="flex items-center space-x-3 sm:space-x-5 md:space-x-6 text-xs sm:text-sm font-bold tracking-wider overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => { onResetStoreFilter(); setActiveTab('STORE'); onNavigateHome(); }}
              className={`relative py-1 uppercase transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'STORE' 
                  ? 'text-[#1a9fff] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1a9fff]' 
                  : 'text-[#dcdedf] hover:text-white'
              }`}
            >
              STORE
            </button>

            <button
              onClick={() => setActiveTab('LIBRARY')}
              className={`relative py-1 uppercase transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'LIBRARY' 
                  ? 'text-[#1a9fff] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1a9fff]' 
                  : 'text-[#dcdedf] hover:text-white'
              }`}
            >
              LIBRARY
            </button>

            <button
              onClick={() => setActiveTab('COMMUNITY')}
              className={`relative py-1 uppercase transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'COMMUNITY' 
                  ? 'text-[#1a9fff] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1a9fff]' 
                  : 'text-[#dcdedf] hover:text-white'
              }`}
            >
              COMMUNITY
            </button>

            <button
              onClick={() => setActiveTab('FRIENDS')}
              className={`relative py-1 uppercase transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'FRIENDS' 
                  ? 'text-[#1a9fff] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1a9fff]' 
                  : 'text-[#dcdedf] hover:text-white'
              }`}
            >
              FRIENDS
            </button>
          </nav>

          {/* Right User Profile, Wallet */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs text-[#8f98a0] flex-shrink-0">
            {/* Wallet Balance */}
            <div className="flex items-center space-x-1 bg-[#212b36] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-[#2d3844] text-[11px] sm:text-xs">
              <span className="text-emerald-400 font-semibold">₹{userProfile.walletBalance.toLocaleString('en-IN')}</span>
            </div>

            {/* Profile Badge */}
            <div 
              onClick={() => setActiveTab('PROFILE')}
              className="flex items-center space-x-1.5 cursor-pointer hover:opacity-90"
              title={userProfile.name}
            >
              <div className="relative">
                <img 
                  src={userProfile.avatarUrl} 
                  alt="Profile Avatar" 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-[#5c7e96]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#171a21]" />
              </div>
              <span className="text-[#c7d5e0] font-medium hidden lg:inline max-w-[90px] truncate">{userProfile.name}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Sub-Store Header Bar */}
      <div className="bg-gradient-to-r from-[#17202c] via-[#1b2838] to-[#17202c] border-b border-[#2a475e]/30 px-3 sm:px-6 py-2 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Quick Sub-navigation (Horizontally scrollable on Mobile/Tablet without wrapping clutter) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-[#dcdedf] font-semibold overflow-x-auto no-scrollbar py-0.5">
            <button 
              onClick={() => {
                onResetStoreFilter();
                onNavigateHome();
              }}
              className={`px-2.5 sm:px-3 py-1 rounded transition-colors cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                activeTab === 'STORE' && storeFilter.type === 'ALL' 
                  ? 'bg-[#2a475e] text-white shadow-inner font-bold' 
                  : 'hover:bg-[#2a475e]/50 text-[#c7d5e0]'
              }`}
            >
              Your Store
            </button>

            <button 
              onClick={() => { setActiveTab('DISCOVERY_MODE'); }}
              className={`px-2.5 sm:px-3 py-1 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                activeTab === 'DISCOVERY_MODE' || activeTab === 'WEEKEND_DISCOVERY'
                  ? 'bg-cyan-600 text-white font-bold shadow-lg ring-1 ring-cyan-400'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-pulse" />
              <span>Discovery Mode</span>
            </button>

            {/* Special Offers Button */}
            <button 
              onClick={onSelectSpecialOffers}
              className={`px-2.5 sm:px-3 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap text-[11px] sm:text-xs ${
                activeTab === 'STORE' && storeFilter.type === 'SPECIAL_OFFERS'
                  ? 'bg-emerald-600 text-white font-bold shadow-md ring-1 ring-emerald-400'
                  : 'hover:bg-[#2a475e]/50 text-[#8f98a0] hover:text-white'
              }`}
            >
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span>Special Offers</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1 py-0.2 rounded">Sale</span>
            </button>

            {/* Categories Dropdown Container */}
            <div className="relative" ref={categoryDropdownRef}>
              <button 
                onClick={() => setIsCategoriesDropdownOpen(prev => !prev)}
                className={`px-2.5 sm:px-3 py-1 rounded transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap text-[11px] sm:text-xs ${
                  activeTab === 'STORE' && storeFilter.type === 'CATEGORY'
                    ? 'bg-[#1a9fff] text-[#111822] font-bold shadow-md'
                    : 'hover:bg-[#2a475e]/50 text-[#8f98a0] hover:text-white'
                }`}
              >
                <span>
                  {storeFilter.type === 'CATEGORY' ? `Category: ${storeFilter.category}` : 'Categories'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Dropdown Menu */}
              {isCategoriesDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-[#17202d] border border-[#2a475e] rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3.5 py-2.5 bg-[#121924] border-b border-[#2a475e]/50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#8f98a0] uppercase tracking-wider">Browse by Category</span>
                    <span className="text-[10px] text-[#66c0f4]">Filter store</span>
                  </div>
                  <div className="p-1.5 space-y-1">
                    {categoriesList.map(cat => {
                      const IconComp = cat.icon;
                      const isSelected = storeFilter.type === 'CATEGORY' && storeFilter.category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            setIsCategoriesDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start space-x-3 cursor-pointer group ${
                            isSelected 
                              ? 'bg-blue-600/30 border border-blue-400 text-white' 
                              : 'hover:bg-[#223042] text-[#c7d5e0]'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-[#121a24] text-[#66c0f4] group-hover:bg-[#1a2838] group-hover:text-white'} transition-colors mt-0.5`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white group-hover:text-[#66c0f4] transition-colors">{cat.label}</span>
                              <span className="text-[10px] bg-[#121924] text-[#8f98a0] px-1.5 py-0.5 rounded font-mono">{cat.count} games</span>
                            </div>
                            <p className="text-[11px] text-[#8f98a0] line-clamp-1 mt-0.5">{cat.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Search, Wishlist & Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Search Bar */}
            <div className="relative flex-1 md:w-60">
              <div className="flex items-center bg-[#0e141b] border border-[#212b36] focus-within:border-[#66c0f4] rounded-lg overflow-hidden shadow-inner">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search games..."
                  className="w-full bg-transparent px-2.5 sm:px-3 py-1.5 text-xs text-[#c7d5e0] placeholder-[#556778] focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-white">
                    <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                )}
                <button 
                  className="bg-[#66c0f4] hover:bg-[#1a9fff] text-[#171a21] p-1.5 sm:p-2 transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>

              {/* Instant Search Results Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-[#171a21] border border-[#2a475e] rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto">
                  {filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                      <div
                        key={game.id}
                        onClick={() => handleSelectSearchResult(game)}
                        className="flex items-center space-x-3 p-2.5 hover:bg-[#2a475e] cursor-pointer transition-colors border-b border-[#212b36] last:border-0"
                      >
                        <img src={game.bannerImage} alt={game.title} className="w-12 h-7 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{game.title}</p>
                          <p className="text-[10px] text-[#8f98a0]">{game.tags.slice(0, 2).join(', ')} • {game.approxPlaytime}</p>
                        </div>
                        <span className="text-xs font-bold text-[#66c0f4]">
                          {game.isFreeToPlay ? 'Free' : `₹ ${game.originalPrice.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-center text-[#8f98a0]">
                      No games found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border flex-shrink-0 ${
                activeTab === 'WISHLIST'
                  ? 'bg-amber-500 text-[#11161f] font-bold border-amber-400 shadow-md'
                  : 'bg-[#212b36] hover:bg-[#2a475e] text-[#c7d5e0] hover:text-white border-[#2d3844]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'WISHLIST' ? 'text-[#11161f] fill-[#11161f]' : 'text-amber-400 fill-amber-400'}`} />
              <span className="font-medium hidden sm:inline">Wishlist</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] sm:text-[11px] font-bold ${
                activeTab === 'WISHLIST' ? 'bg-black/25 text-white' : 'bg-[#171a21] text-[#66c0f4]'
              }`}>
                {wishlistCount}
              </span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border flex-shrink-0 ${
                activeTab === 'CART'
                  ? 'bg-[#1a9fff] text-[#11161f] font-black border-[#1a9fff] shadow-lg'
                  : cartCount > 0
                  ? 'bg-[#a4d007] hover:bg-[#bce31b] text-[#171a21] font-bold border-[#a4d007] shadow'
                  : 'bg-[#212b36] hover:bg-[#2a475e] text-[#c7d5e0] hover:text-white border-[#2d3844]'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${activeTab === 'CART' || cartCount > 0 ? 'text-current' : 'text-[#66c0f4]'}`} />
              <span className="font-medium hidden sm:inline">Cart</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] sm:text-[11px] font-bold ${
                activeTab === 'CART' 
                  ? 'bg-black/30 text-white' 
                  : cartCount > 0 
                  ? 'bg-black/20 text-[#171a21]' 
                  : 'bg-[#171a21] text-[#66c0f4]'
              }`}>
                {cartCount}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
