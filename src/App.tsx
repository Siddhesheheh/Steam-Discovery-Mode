import React, { useState } from 'react';
import { SteamHeader } from './components/SteamHeader';
import { SteamStoreClassicView } from './components/SteamStoreClassicView';
import { WeekendDiscoveryView } from './components/WeekendDiscoveryView';
import { GameDetailPage } from './components/GameDetailPage';
import { WishlistView, LibraryView, FriendsView } from './components/SteamAuxViews';
import { CartView } from './components/CartView';
import { CommunityView } from './components/CommunityView';
import { 
  STORE_FEATURED_GAMES, 
  POPULAR_NEW_RELEASES, 
  WEEKEND_DISCOVERY_GAMES, 
  ALL_GAMES_COMBINED,
  USER_HABIT_PROFILE 
} from './data/games';
import { Game, SteamNavTab, UserHabitProfile, StoreFilter, StoreCategory } from './types';

interface HistoryEntry {
  tab: SteamNavTab;
  game: Game | null;
  url: string;
  origin?: 'DISCOVERY_MODE' | 'STORE';
}

export function App() {
  const [activeTab, setActiveTab] = useState<SteamNavTab>('STORE');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameDetailOrigin, setGameDetailOrigin] = useState<'DISCOVERY_MODE' | 'STORE'>('STORE');
  const [storeFilter, setStoreFilter] = useState<StoreFilter>({ type: 'ALL' });
  const [userProfile, setUserProfile] = useState<UserHabitProfile>(USER_HABIT_PROFILE);
  const [wishlist, setWishlist] = useState<Game[]>([
    WEEKEND_DISCOVERY_GAMES[2], // Cocoon
    WEEKEND_DISCOVERY_GAMES[3]  // A Short Hike
  ]);
  const [cart, setCart] = useState<Game[]>([]);
  const [purchasedGames, setPurchasedGames] = useState<Game[]>([]);

  // Navigation History Stack for Back/Forward in Steam Client
  const [history, setHistory] = useState<HistoryEntry[]>([
    { tab: 'STORE', game: null, url: 'https://store.steampowered.com/', origin: 'STORE' }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentUrl = selectedGame
    ? `https://store.steampowered.com/app/${selectedGame.slug}/`
    : activeTab === 'DISCOVERY_MODE' || activeTab === 'WEEKEND_DISCOVERY'
    ? 'https://store.steampowered.com/discovery-mode/'
    : activeTab === 'LIBRARY'
    ? 'steam://nav/games/details'
    : activeTab === 'WISHLIST'
    ? 'https://store.steampowered.com/wishlist/id/siddhesh/'
    : activeTab === 'CART'
    ? 'https://store.steampowered.com/cart/'
    : activeTab === 'FRIENDS'
    ? 'steam://friends/'
    : activeTab === 'COMMUNITY'
    ? 'https://steamcommunity.com/'
    : 'https://store.steampowered.com/';

  const pushNavigation = (tab: SteamNavTab, game: Game | null = null, origin: 'DISCOVERY_MODE' | 'STORE' = 'STORE') => {
    let url = 'https://store.steampowered.com/';
    if (game) {
      url = `https://store.steampowered.com/app/${game.slug}/`;
    } else if (tab === 'DISCOVERY_MODE' || tab === 'WEEKEND_DISCOVERY') {
      url = 'https://store.steampowered.com/discovery-mode/';
    } else if (tab === 'LIBRARY') {
      url = 'steam://nav/games/details';
    } else if (tab === 'WISHLIST') {
      url = 'https://store.steampowered.com/wishlist/id/siddhesh/';
    } else if (tab === 'CART') {
      url = 'https://store.steampowered.com/cart/';
    } else if (tab === 'FRIENDS') {
      url = 'steam://friends/';
    } else if (tab === 'COMMUNITY') {
      url = 'https://steamcommunity.com/';
    }

    const nextEntry: HistoryEntry = { tab, game, url, origin };
    const updated = history.slice(0, historyIndex + 1);
    updated.push(nextEntry);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
    setActiveTab(tab);
    setSelectedGame(game);
    setGameDetailOrigin(origin);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setActiveTab(prev.tab);
      setSelectedGame(prev.game);
      if (prev.origin) setGameDetailOrigin(prev.origin);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setActiveTab(next.tab);
      setSelectedGame(next.game);
      if (next.origin) setGameDetailOrigin(next.origin);
    }
  };

  const handleNavigateHome = () => {
    setStoreFilter({ type: 'ALL' });
    pushNavigation('STORE', null, 'STORE');
  };

  const handleSelectSpecialOffers = () => {
    setStoreFilter({ type: 'SPECIAL_OFFERS' });
    setSelectedGame(null);
    setActiveTab('STORE');
  };

  const handleSelectCategory = (category: StoreCategory) => {
    setStoreFilter({ type: 'CATEGORY', category });
    setSelectedGame(null);
    setActiveTab('STORE');
  };

  const handleResetStoreFilter = () => {
    setStoreFilter({ type: 'ALL' });
  };

  const handleOpenDiscoveryMode = () => {
    pushNavigation('DISCOVERY_MODE', null, 'DISCOVERY_MODE');
  };

  const handleExploreGameFromStore = (game: Game) => {
    pushNavigation('STORE', game, 'STORE');
  };

  const handleExploreGameFromDiscovery = (game: Game) => {
    pushNavigation('DISCOVERY_MODE', game, 'DISCOVERY_MODE');
  };

  const handleReturnFromGameDetail = () => {
    if (gameDetailOrigin === 'DISCOVERY_MODE') {
      pushNavigation('DISCOVERY_MODE', null, 'DISCOVERY_MODE');
    } else {
      pushNavigation('STORE', null, 'STORE');
    }
  };

  const handleToggleWishlist = (game: Game) => {
    setWishlist(prev => {
      const exists = prev.some(g => g.id === game.id);
      if (exists) {
        return prev.filter(g => g.id !== game.id);
      } else {
        return [...prev, game];
      }
    });
  };

  // Cart operations
  const handleAddToCart = (game: Game) => {
    if (!cart.some(g => g.id === game.id)) {
      setCart(prev => [...prev, game]);
    }
  };

  const handleRemoveFromCart = (gameId: string) => {
    setCart(prev => prev.filter(g => g.id !== gameId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleMoveToWishlist = (game: Game) => {
    handleAddToCart(game);
    handleToggleWishlist(game);
    handleRemoveFromCart(game.id);
  };

  const handleCheckout = (gamesToBuy: Game[]) => {
    const totalCost = gamesToBuy.reduce((sum, g) => {
      if (g.isFreeToPlay) return sum;
      const finalPrice = g.discountPercent > 0 
        ? Math.round(gamePriceAfterDiscount(g)) 
        : g.originalPrice;
      return sum + finalPrice;
    }, 0);

    // Deduct wallet balance
    setUserProfile(prev => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - totalCost)
    }));

    // Add to purchased games
    setPurchasedGames(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newItems = gamesToBuy.filter(g => !existingIds.has(g.id));
      return [...prev, ...newItems];
    });

    // Clear cart items
    setCart([]);
  };

  const gamePriceAfterDiscount = (game: Game) => {
    return game.discountPercent > 0
      ? Math.round(game.originalPrice * (1 - game.discountPercent / 100))
      : game.originalPrice;
  };

  return (
    <div className="min-h-screen bg-[#171a21] text-[#c7d5e0] flex flex-col font-sans selection:bg-[#1a9fff] selection:text-white">
      
      {/* Top Steam Header / Browser Navigation */}
      <SteamHeader
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'STORE') setStoreFilter({ type: 'ALL' });
          pushNavigation(tab, null, tab === 'DISCOVERY_MODE' || tab === 'WEEKEND_DISCOVERY' ? 'DISCOVERY_MODE' : 'STORE');
        }}
        currentUrl={currentUrl}
        onNavigateHome={handleNavigateHome}
        onNavigateBack={handleNavigateBack}
        onNavigateForward={handleNavigateForward}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        wishlistCount={wishlist.length}
        cartCount={cart.length}
        onOpenWishlist={() => pushNavigation('WISHLIST', null, 'STORE')}
        onOpenCart={() => pushNavigation('CART', null, 'STORE')}
        onSelectGame={handleExploreGameFromStore}
        allGames={ALL_GAMES_COMBINED}
        userProfile={userProfile}
        storeFilter={storeFilter}
        onSelectSpecialOffers={handleSelectSpecialOffers}
        onSelectCategory={handleSelectCategory}
        onResetStoreFilter={handleResetStoreFilter}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1">
        {selectedGame ? (
          <GameDetailPage
            game={selectedGame}
            userProfile={userProfile}
            onReturnToDiscovery={handleReturnFromGameDetail}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.some(w => w.id === selectedGame.id)}
            onAddToCart={handleAddToCart}
            isInCart={cart.some(c => c.id === selectedGame.id)}
            onOpenCart={() => pushNavigation('CART', null, 'STORE')}
            isPurchased={purchasedGames.some(p => p.id === selectedGame.id)}
            fromWeekendDiscovery={gameDetailOrigin === 'DISCOVERY_MODE'}
          />
        ) : activeTab === 'DISCOVERY_MODE' || activeTab === 'WEEKEND_DISCOVERY' ? (
          /* Dedicated DISCOVERY MODE View */
          <WeekendDiscoveryView
            games={WEEKEND_DISCOVERY_GAMES}
            userProfile={userProfile}
            onExploreGame={handleExploreGameFromDiscovery}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
            onBackToHome={handleNavigateHome}
          />
        ) : activeTab === 'COMMUNITY' ? (
          /* Dedicated Steam COMMUNITY View */
          <CommunityView
            onExploreGame={handleExploreGameFromStore}
          />
        ) : activeTab === 'WISHLIST' ? (
          <WishlistView
            wishlist={wishlist}
            onExploreGame={handleExploreGameFromStore}
            onToggleWishlist={handleToggleWishlist}
            onReturnToStore={handleOpenDiscoveryMode}
          />
        ) : activeTab === 'CART' ? (
          <CartView
            cart={cart}
            userProfile={userProfile}
            onRemoveFromCart={handleRemoveFromCart}
            onMoveToWishlist={handleMoveToWishlist}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            onReturnToStore={handleNavigateHome}
            onExploreGame={handleExploreGameFromStore}
          />
        ) : activeTab === 'LIBRARY' ? (
          <LibraryView
            userProfile={userProfile}
            purchasedGames={purchasedGames}
            onExploreGame={handleExploreGameFromStore}
          />
        ) : activeTab === 'FRIENDS' ? (
          <FriendsView />
        ) : (
          /* Default STORE View: Authentic Steam Store Look */
          <SteamStoreClassicView
            featuredGames={STORE_FEATURED_GAMES}
            popularReleases={POPULAR_NEW_RELEASES}
            discoveryGames={WEEKEND_DISCOVERY_GAMES}
            userProfile={userProfile}
            onExploreGame={handleExploreGameFromStore}
            onOpenWeekendDiscovery={handleOpenDiscoveryMode}
            storeFilter={storeFilter}
            onResetStoreFilter={handleResetStoreFilter}
          />
        )}
      </main>

    </div>
  );
}

export default App;
