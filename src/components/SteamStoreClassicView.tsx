import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Play, 
  Clock, 
  Tag,
  Zap,
  Gamepad2,
  Trophy,
  ShieldCheck,
  Compass,
  Crosshair,
  BookOpen,
  Info
} from 'lucide-react';
import { Game, UserHabitProfile, StoreFilter, StoreCategory } from '../types';

interface SteamStoreClassicViewProps {
  onExploreGame: (game: Game) => void;
  onOpenWeekendDiscovery: () => void;
  featuredGames: Game[];
  popularReleases: Game[];
  discoveryGames: Game[];
  userProfile: UserHabitProfile;
  storeFilter?: StoreFilter;
  onResetStoreFilter?: () => void;
}

type TabType = 'TOP_SELLERS' | 'POPULAR_UPCOMING' | 'SPECIALS' | 'TRENDING_FREE';

export const SteamStoreClassicView: React.FC<SteamStoreClassicViewProps> = ({
  onExploreGame,
  onOpenWeekendDiscovery,
  featuredGames,
  popularReleases,
  discoveryGames,
  userProfile,
  storeFilter = { type: 'ALL' } as StoreFilter,
  onResetStoreFilter,
}) => {
  // 1. Featured Carousel State
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [hoveredThumbIndex, setHoveredThumbIndex] = useState<number | null>(null);

  // 2. Top New Releases Banner Carousel Index
  const [newReleasesPage, setNewReleasesPage] = useState(0);

  // 3. Recommended For You filter tab & pagination (4 games per page with carousel arrows)
  const [recFilter, setRecFilter] = useState<'ALL' | 'FPS_COMPETITIVE' | 'STORY_RPG' | 'SPORTS_RACING'>('ALL');
  const [recPage, setRecPage] = useState(0);

  // Reset recPage when filter changes
  useEffect(() => {
    setRecPage(0);
  }, [recFilter]);

  // 4. Steam Multi-Tab Browser State (Without Popular New Releases as requested)
  const [activeBrowseTab, setActiveBrowseTab] = useState<TabType>('TOP_SELLERS');
  const [includeFreeToPlay, setIncludeFreeToPlay] = useState(true);
  const [includeLibraryItems, setIncludeLibraryItems] = useState(false);
  const [hoveredBrowseGameId, setHoveredBrowseGameId] = useState<string | null>(null);

  // Combine all pools without duplicate IDs
  const allAvailableGames = Array.from(
    new Map([...featuredGames, ...popularReleases, ...discoveryGames].map(g => [g.id, g])).values()
  );

  const currentFeatured = featuredGames[featuredIndex] || featuredGames[0];
  const screenshots = currentFeatured?.screenshots || [];
  const activeHeroImg = hoveredThumbIndex !== null && screenshots[hoveredThumbIndex] 
    ? screenshots[hoveredThumbIndex].url 
    : currentFeatured?.heroImage || currentFeatured?.bannerImage;

  // Auto cycle carousel when in ALL mode
  useEffect(() => {
    if (storeFilter.type !== 'ALL') return;
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredGames.length);
      setHoveredThumbIndex(null);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredGames.length, storeFilter.type]);

  const handleNextFeatured = () => {
    setFeaturedIndex((featuredIndex + 1) % featuredGames.length);
    setHoveredThumbIndex(null);
  };

  const handlePrevFeatured = () => {
    setFeaturedIndex((featuredIndex - 1 + featuredGames.length) % featuredGames.length);
    setHoveredThumbIndex(null);
  };

  // -------------------------------------------------------------
  // Filtered Views Logic (for Top Navigation bar filters)
  // -------------------------------------------------------------
  
  // 1. Special Offers Filter: ONLY games with discountPercent > 0
  const discountedGames = allAvailableGames
    .filter(g => g.discountPercent > 0 && !g.isFreeToPlay)
    .sort((a, b) => b.discountPercent - a.discountPercent);

  // 2. Category Filter: ONLY games matching the selected category
  const getGamesByCategory = (category: StoreCategory): Game[] => {
    switch (category) {
      case 'FPS':
        return allAvailableGames.filter(g => 
          g.tags.some(t => ['FPS', 'Tactical', 'Competitive', 'Shooter', 'Hero Shooter', 'Third-Person Shooter', 'Battle Royale', 'PvPvE'].includes(t)) ||
          ['cs2', 'apex-legends', 'halo-campaign-evolved', 'hell-let-loose-vietnam', 'cod-modern-warfare', 'helldivers-2', 'marvel-rivals', 'mistfall-hunter'].includes(g.id)
        );
      case 'Action':
        return allAvailableGames.filter(g => 
          g.category === 'Action' || g.tags.includes('Action') || g.tags.includes('Open World') || g.tags.includes('Crime')
        );
      case 'Sports':
        return allAvailableGames.filter(g => 
          g.category === 'Sports' || g.tags.some(t => ['Sports', 'Football (Soccer)', 'Racing', 'Automobile Sim'].includes(t))
        );
      case 'Story Mode':
        return allAvailableGames.filter(g => 
          g.tags.some(t => ['Story Rich', 'Masterpiece', 'Choices Matter', 'RPG', 'Atmospheric'].includes(t)) ||
          g.category === 'Adventure' || 
          g.category === 'RPG'
        );
      default:
        return allAvailableGames;
    }
  };

  const categoryGames = storeFilter.type === 'CATEGORY' 
    ? getGamesByCategory(storeFilter.category) 
    : [];

  const categoryMeta: Record<StoreCategory, { title: string; icon: any; desc: string; color: string }> = {
    'FPS': {
      title: 'FPS & First-Person Shooters',
      icon: Crosshair,
      desc: 'Precision tactical gunplay, team competitive ladders, and thrilling battle royales.',
      color: 'from-red-500/20 to-orange-500/10 text-orange-400 border-orange-500/40'
    },
    'Action': {
      title: 'Action & Open-World Adventures',
      icon: Zap,
      desc: 'Blockbuster cinematic thrillers, living criminal underworlds, and dynamic combat.',
      color: 'from-blue-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/40'
    },
    'Sports': {
      title: 'Sports, Racing & Simulation',
      icon: Trophy,
      desc: 'Authentic football leagues, Formula 1 telemetry, and arcade competitive matches.',
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/40'
    },
    'Story Mode': {
      title: 'Story Mode, RPG & Branching Narratives',
      icon: BookOpen,
      desc: 'Emotionally gripping stories, consequential moral flowcharts, and rich fantasy worlds.',
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/40'
    }
  };

  // -------------------------------------------------------------
  // Default Store Section Pools (When storeFilter.type === 'ALL')
  // -------------------------------------------------------------
  const specialDeals = allAvailableGames
    .filter(g => g.discountPercent >= 25 && !g.isFreeToPlay)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 8);

  // Tactical & FPS and other Recommended For You categories:
  const recommendedForYouPool = allAvailableGames.filter(g => {
    if (recFilter === 'FPS_COMPETITIVE') {
      const isFPSOrTactical = g.tags.some(t => 
        ['FPS', 'Tactical', 'Competitive', 'Shooter', 'Multiplayer', 'Hero Shooter', 'Third-Person Shooter', 'Battle Royale', 'PvPvE'].includes(t)
      ) || ['cs2', 'apex-legends', 'halo-campaign-evolved', 'hell-let-loose-vietnam', 'cod-modern-warfare', 'helldivers-2', 'marvel-rivals', 'mistfall-hunter'].includes(g.id);
      return isFPSOrTactical;
    }
    if (recFilter === 'STORY_RPG') {
      return g.tags.some(t => ['Story Rich', 'Masterpiece', 'RPG', 'Atmospheric', 'Choices Matter'].includes(t)) || g.category === 'Adventure' || g.category === 'RPG';
    }
    if (recFilter === 'SPORTS_RACING') {
      return g.category === 'Sports' || g.tags.some(t => ['Sports', 'Football (Soccer)', 'Racing', 'Automobile Sim'].includes(t));
    }
    return true;
  });

  const REC_PAGE_SIZE = 4;
  const totalRecPages = Math.ceil(recommendedForYouPool.length / REC_PAGE_SIZE) || 1;
  const currentRecGames = recommendedForYouPool.slice(recPage * REC_PAGE_SIZE, (recPage + 1) * REC_PAGE_SIZE);

  const handleNextRec = () => {
    setRecPage(prev => (prev + 1) % totalRecPages);
  };

  const handlePrevRec = () => {
    setRecPage(prev => (prev - 1 + totalRecPages) % totalRecPages);
  };

  // -------------------------------------------------------------
  // TOP NEW RELEASES JULY 2026 CAROUSEL POOL
  // -------------------------------------------------------------
  const topNewReleasesJuly: (Game & { isLive?: boolean })[] = [
    {
      ...(allAvailableGames.find(g => g.id === 'mistfall-hunter') || {
        id: 'mistfall-hunter',
        title: 'Mistfall Hunter',
        slug: 'mistfall_hunter',
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
        shortDescription: 'Dark fantasy third-person PvPvE extraction action RPG.',
        releaseDate: '15 Jul, 2026',
        developer: 'Bellring Games',
        publisher: 'Bellring Games',
        originalPrice: 1249,
        discountPercent: 0,
        reviewSummary: 'Very Positive',
        reviewCount: 7850,
        steamRating: '89% Positive',
        approxPlaytime: 'Extraction Sessions',
        tags: ['PvPvE', 'Action RPG', 'Dark Fantasy', 'Dungeon Crawler'],
        whyThisGame: 'High adrenaline extraction combat.',
        hardware: { compatible: true, tier: 'High Performance', gpuRequirement: 'RTX 2060', ramRequirement: '16 GB RAM', userSystemMatch: '✓ 120 FPS' },
        discoveryIntents: ['Competitive'],
        screenshots: []
      })
    },
    {
      ...(allAvailableGames.find(g => g.id === 'shift-at-midnight') || {
        id: 'shift-at-midnight',
        title: 'Shift at Midnight',
        slug: 'shift_at_midnight',
        bannerImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1600&q=80',
        shortDescription: 'Graveyard shift at a lonely convenience store. Check IDs, survive supernatural night.',
        releaseDate: '8 Jul, 2026',
        developer: 'Midnight Shift Studios',
        publisher: 'Nightmare Interactive',
        originalPrice: 399,
        discountPercent: 0,
        reviewSummary: 'Overwhelmingly Positive',
        reviewCount: 14200,
        steamRating: '96% Positive',
        approxPlaytime: '~4 hours',
        tags: ['Psychological Horror', 'Simulation', 'Indie'],
        whyThisGame: 'Tense atmospheric retail horror.',
        hardware: { compatible: true, tier: 'Smooth 60+ FPS', gpuRequirement: 'GTX 1050', ramRequirement: '8 GB RAM', userSystemMatch: '✓ 144 FPS' },
        discoveryIntents: ['Something Different'],
        screenshots: []
      }),
      isLive: true
    },
    {
      ...(allAvailableGames.find(g => g.id === 'machine-party') || {
        id: 'machine-party',
        title: 'Machine Party',
        slug: 'machine_party',
        bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        shortDescription: 'A chaotic physics-driven party game where manic contraptions and ragdoll slapstick collide.',
        releaseDate: '22 Jul, 2026',
        developer: 'Gearbox Rascals',
        publisher: 'Party Lab',
        originalPrice: 415,
        discountPercent: 0,
        reviewSummary: 'Very Positive',
        reviewCount: 5600,
        steamRating: '92% Positive',
        approxPlaytime: 'Party Multiplayer',
        tags: ['Funny', 'Physics', 'Party Game', 'Multiplayer'],
        whyThisGame: 'Hilarious physical comedy.',
        hardware: { compatible: true, tier: 'Smooth 60+ FPS', gpuRequirement: 'GTX 960', ramRequirement: '8 GB RAM', userSystemMatch: '✓ 144 FPS' },
        discoveryIntents: ['Something Different'],
        screenshots: []
      })
    },
    {
      ...(allAvailableGames.find(g => g.id === 'halo-campaign-evolved') || {
        id: 'halo-campaign-evolved',
        title: 'Halo: Campaign Evolved',
        slug: 'halo_campaign_evolved',
        bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
        shortDescription: 'Master Chief returns in a sprawling open-world ring campaign with next-generation visuals.',
        releaseDate: '10 Jul, 2026',
        developer: '343 Industries',
        publisher: 'Xbox Game Studios',
        originalPrice: 4999,
        discountPercent: 0,
        reviewSummary: 'Overwhelmingly Positive',
        reviewCount: 38900,
        steamRating: '95% Positive',
        approxPlaytime: '~30 hours',
        tags: ['FPS', 'Sci-Fi', 'Shooter', 'Action', 'Co-op'],
        whyThisGame: 'Epic sci-fi military campaign.',
        hardware: { compatible: true, tier: 'High Performance', gpuRequirement: 'RTX 3070', ramRequirement: '16 GB RAM', userSystemMatch: '✓ 90+ FPS' },
        discoveryIntents: ['Story-driven'],
        screenshots: []
      })
    },
    {
      ...(allAvailableGames.find(g => g.id === 'hell-let-loose-vietnam') || allAvailableGames[0])
    },
    {
      ...(allAvailableGames.find(g => g.id === 'big-walk') || allAvailableGames[1])
    }
  ];

  // -------------------------------------------------------------
  // STEAM MULTI-TAB BROWSER POOLS (Without POPULAR_NEW_RELEASES)
  // -------------------------------------------------------------
  const getTabGames = (tab: TabType): Game[] => {
    let list: Game[] = [];
    switch (tab) {
      case 'TOP_SELLERS': {
        const priorityIds = ['dota-2', 'kingdom-hearts-hd', 'helldivers-2', 'big-walk', 'hell-let-loose-vietnam', 'marvel-rivals', 'cs2', 'ea-fc-26'];
        const matches = priorityIds.map(id => allAvailableGames.find(g => g.id === id)).filter(Boolean) as Game[];
        list = matches.length > 0 ? matches : allAvailableGames.slice(0, 8);
        break;
      }
      case 'POPULAR_UPCOMING': {
        const priorityIds = ['ea-fc-27', 'gta-6', 'rematch', 'judas', 'f1-25', 'big-walk', 'halo-campaign-evolved'];
        const matches = priorityIds.map(id => allAvailableGames.find(g => g.id === id)).filter(Boolean) as Game[];
        list = matches.length > 0 ? matches : allAvailableGames.slice(2, 8);
        break;
      }
      case 'SPECIALS': {
        list = allAvailableGames.filter(g => g.discountPercent > 0).sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      }
      case 'TRENDING_FREE': {
        list = allAvailableGames.filter(g => g.isFreeToPlay || g.originalPrice === 0);
        if (list.length === 0) list = allAvailableGames.slice(0, 6);
        break;
      }
    }

    // Apply Checkbox filters
    if (!includeFreeToPlay) {
      list = list.filter(g => !g.isFreeToPlay && g.originalPrice > 0);
    }
    if (!includeLibraryItems) {
      list = list.filter(g => !userProfile.recentlyPlayed.some(rp => rp.gameId === g.id));
    }

    return list;
  };

  const activeTabGames = getTabGames(activeBrowseTab);
  const activeBrowseGame = (hoveredBrowseGameId ? activeTabGames.find(g => g.id === hoveredBrowseGameId) : null) || activeTabGames[0] || allAvailableGames[0];

  // Helper for pricing formatting
  const renderPriceBadge = (game: Game) => {
    if (game.isFreeToPlay || game.originalPrice === 0) {
      return (
        <span className="text-[11px] sm:text-xs font-semibold text-white px-2 py-0.5 sm:py-1 bg-[#101822] rounded border border-[#213144] whitespace-nowrap">
          Free
        </span>
      );
    }

    const discounted = game.discountPercent > 0 
      ? Math.round(game.originalPrice * (1 - game.discountPercent / 100))
      : game.originalPrice;

    if (game.discountPercent > 0) {
      return (
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="bg-[#a4d007] text-[#171a21] text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded">
            -{game.discountPercent}%
          </span>
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[9px] sm:text-[10px] text-[#738895] line-through">
              ₹{game.originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-[#bcee30]">
              ₹{discounted.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      );
    }

    return (
      <span className="text-[11px] sm:text-xs font-bold text-white whitespace-nowrap">
        ₹{game.originalPrice.toLocaleString('en-IN')}
      </span>
    );
  };

  // =========================================================================
  // RENDER: FILTERED CATEGORY VIEW (When storeFilter.type === 'CATEGORY')
  // =========================================================================
  if (storeFilter.type === 'CATEGORY') {
    const meta = categoryMeta[storeFilter.category] || {
      title: `${storeFilter.category} Games`,
      icon: Trophy,
      desc: 'Top-rated games in this genre.',
      color: 'from-blue-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/40'
    };
    const CategoryIcon = meta.icon;

    return (
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6 space-y-6 sm:space-y-8 select-none pb-28">
        
        {/* Category Header Banner */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${meta.color} bg-[#111923] border p-4 sm:p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div className="flex items-start space-x-3.5 sm:space-x-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 text-white shadow-inner flex-shrink-0">
              <CategoryIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold text-white/70 uppercase tracking-wider">
                  Category Filter Active
                </span>
                <span className="text-xs text-white/40">•</span>
                <span className="text-[11px] sm:text-xs font-mono bg-black/30 px-2 py-0.5 rounded text-white font-bold">
                  {categoryGames.length} Games Found
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{meta.title}</h1>
              <p className="text-xs sm:text-sm text-white/70 max-w-2xl">{meta.desc}</p>
            </div>
          </div>

          <button
            onClick={onResetStoreFilter}
            className="bg-[#2a475e] hover:bg-[#3d6585] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer self-start md:self-auto shadow flex items-center space-x-1.5"
          >
            <span>Clear Filter & Return Home</span>
          </button>
        </div>

        {/* Category Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {categoryGames.map(game => {
            const discountedPrice = Math.round(game.originalPrice * (1 - game.discountPercent / 100));
            return (
              <div
                key={game.id}
                onClick={() => onExploreGame(game)}
                className="bg-[#111923] hover:bg-[#162230] border border-[#213144] hover:border-cyan-400/60 rounded-xl overflow-hidden transition-all duration-200 shadow-lg group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-video overflow-hidden bg-black relative">
                  <img src={game.bannerImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {game.discountPercent > 0 && (
                    <span className="absolute bottom-2 right-2 bg-[#a4d007] text-[#171a21] text-xs font-black px-2 py-0.5 rounded shadow">
                      -{game.discountPercent}%
                    </span>
                  )}
                  {game.isFreeToPlay && (
                    <span className="absolute bottom-2 right-2 bg-[#1a9fff] text-[#101721] text-xs font-black px-2 py-0.5 rounded shadow">
                      Free To Play
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                      {game.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#8f98a0] truncate mt-0.5">
                      {game.tags.slice(0, 3).join(' • ')}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-2.5 border-t border-[#1e2c3c] flex items-center justify-between text-xs">
                    <span className="text-[10px] bg-[#172433] text-[#66c0f4] border border-[#21384f] px-1.5 py-0.5 rounded font-bold">
                      {game.steamRating.split(' ')[0]}
                    </span>
                    <span className="font-extrabold text-white text-xs sm:text-sm">
                      {game.isFreeToPlay ? 'Free' : game.discountPercent > 0 ? `₹ ${discountedPrice.toLocaleString('en-IN')}` : `₹ ${game.originalPrice.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: FILTERED SPECIAL OFFERS VIEW (When storeFilter.type === 'SPECIAL_OFFERS')
  // =========================================================================
  if (storeFilter.type === 'SPECIAL_OFFERS') {
    return (
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6 space-y-6 sm:space-y-8 select-none pb-28">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#102a1c] to-[#0c1815] border border-emerald-500/40 p-4 sm:p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5 sm:space-x-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex-shrink-0">
              <Tag className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Weekend Deals Filter Active
                </span>
                <span className="text-xs text-[#556778]">•</span>
                <span className="text-[11px] sm:text-xs font-mono bg-black/40 px-2 py-0.5 rounded text-emerald-300 font-bold">
                  {discountedGames.length} Games on Sale
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Special Offers & Weekend Sales</h1>
              <p className="text-xs sm:text-sm text-[#a3c9b8] max-w-2xl">
                Browse all active discounts across top blockbuster franchises and acclaimed indie titles.
              </p>
            </div>
          </div>

          <button
            onClick={onResetStoreFilter}
            className="bg-[#2a475e] hover:bg-[#3d6585] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer self-start md:self-auto shadow"
          >
            Clear Filter & Return Home
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {discountedGames.map(game => {
            const discountedPrice = Math.round(game.originalPrice * (1 - game.discountPercent / 100));
            return (
              <div
                key={game.id}
                onClick={() => onExploreGame(game)}
                className="bg-[#111923] hover:bg-[#162230] border border-[#213144] hover:border-emerald-400/60 rounded-xl overflow-hidden transition-all duration-200 shadow-lg group cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-video overflow-hidden bg-black relative">
                  <img src={game.bannerImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 right-2 bg-[#a4d007] text-[#171a21] text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.5 rounded shadow">
                    -{game.discountPercent}%
                  </span>
                </div>

                <div className="p-3 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 truncate">
                      {game.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#8f98a0] truncate mt-0.5">
                      {game.tags.slice(0, 3).join(' • ')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1e2c3c] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#8f98a0] line-through">
                      ₹ {game.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="font-extrabold text-[#a4d007] text-xs sm:text-sm">
                      ₹ {discountedPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: DEFAULT COMPLETE STORE VIEW (When storeFilter.type === 'ALL')
  // ORDER:
  // 1. FEATURED & RECOMMENDED
  // 2. CONTINUE PLAYING
  // 3. TOP NEW RELEASES
  // 4. SPECIAL OFFERS / DEALS
  // 5. RECOMMENDED FOR YOU (4 per row + side arrows + working Tactical/FPS)
  // 6. TOP SELLERS & POPULAR UPCOMING
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-10 lg:px-14 py-4 sm:py-6 space-y-8 sm:space-y-12 select-none pb-28">
      
      {/* ========================================================================= */}
      {/* 1. FEATURED & RECOMMENDED (HERO CAROUSEL + DISCOVERY MODE BANNER)         */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        
        {/* DISCOVERY MODE SPOTLIGHT BANNER */}
        <div 
          onClick={onOpenWeekendDiscovery}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0d2238] via-[#122e4d] to-[#151c2e] border-2 border-cyan-500/50 hover:border-cyan-400 shadow-2xl p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 cursor-pointer group transition-all duration-300 hover:shadow-cyan-500/10"
        >
          <div className="flex items-start space-x-3.5 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-cyan-300" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#0c1219] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                  ✨ DISCOVERY MODE
                </span>
                <span className="text-[11px] sm:text-xs text-cyan-300 font-semibold flex items-center space-x-1">
                  <span>For {userProfile.name}</span>
                  <span className="text-[#556778]">•</span>
                  <span className="text-emerald-400">RTX 3070 Verified</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-cyan-200 transition-colors">
                Not sure what to play? Click to enter Discovery Mode
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8f98a0] max-w-2xl leading-relaxed">
                Filter games by playtime session (~2h, ~4h, 6–14h) or mood. Curated picks with zero endless scrolling.
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenWeekendDiscovery();
            }}
            className="bg-gradient-to-r from-[#1a9fff] to-[#0077dd] hover:from-[#66c0f4] hover:to-[#1a9fff] text-[#0e1620] font-black text-xs md:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0 w-full sm:w-auto group-hover:translate-x-1"
          >
            <span>Enter Discovery Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured & Recommended Hero Carousel */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#66c0f4] fill-[#66c0f4]/20" />
              <span>Featured & Recommended</span>
            </h2>
            <div className="text-xs text-[#8f98a0]">
              {featuredIndex + 1} of {featuredGames.length}
            </div>
          </div>

          {/* Wrapper with clean navigation */}
          <div className="relative flex items-center">

            {/* Desktop-only Outside Left Arrow (Hidden on mobile & tablet to avoid clipping) */}
            <button
              onClick={handlePrevFeatured}
              className="hidden lg:flex absolute -left-10 xl:-left-12 top-1/2 -translate-y-1/2 w-9 xl:w-11 h-28 xl:h-32 bg-gradient-to-r from-[#111a24] to-[#182738] hover:from-[#1e344e] hover:to-[#274668] border border-[#2b3e54] text-[#8f98a0] hover:text-white rounded-l-lg shadow-2xl transition-all cursor-pointer z-20 items-center justify-center group hover:border-[#66c0f4]/70"
              title="Previous Game"
              aria-label="Previous Featured Game"
            >
              <ChevronLeft className="w-6 h-6 xl:w-7 xl:h-7 group-hover:scale-125 group-hover:text-[#66c0f4] transition-all" />
            </button>

            {/* Main Featured Window / Box */}
            <div className="w-full bg-[#0b1015] rounded-xl overflow-hidden border border-[#212f3f] shadow-2xl flex flex-col lg:flex-row h-auto lg:h-[415px]">
              
              {/* Main Hero Media Stage */}
              <div 
                onClick={() => onExploreGame(currentFeatured)}
                className="w-full lg:w-[65%] h-[220px] sm:h-[300px] lg:h-full relative bg-black cursor-pointer group overflow-hidden flex-shrink-0"
              >
                <img
                  src={activeHeroImg}
                  alt={currentFeatured.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== currentFeatured.bannerImage && currentFeatured.bannerImage) {
                      target.src = currentFeatured.bannerImage;
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Floating Title on Tablet & Mobile */}
                <div className="absolute bottom-3 left-3 lg:hidden">
                  <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-md">{currentFeatured.title}</h3>
                </div>

                {/* On-image Touch Nav Controls for Tablet & Mobile */}
                <div className="lg:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePrevFeatured(); }}
                    className="pointer-events-auto bg-black/60 hover:bg-black/90 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-sm shadow border border-white/10"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleNextFeatured(); }}
                    className="pointer-events-auto bg-black/60 hover:bg-black/90 text-white p-1.5 sm:p-2 rounded-full backdrop-blur-sm shadow border border-white/10"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Right Info & Thumbnail Strip */}
              <div className="w-full lg:w-[35%] h-full bg-[#0e1620] p-4 sm:p-5 flex flex-col justify-between space-y-3 overflow-hidden">
                
                <div>
                  <h3 
                    onClick={() => onExploreGame(currentFeatured)}
                    className="text-lg sm:text-xl lg:text-2xl font-black text-white hover:text-[#66c0f4] cursor-pointer transition-colors truncate hidden lg:block"
                  >
                    {currentFeatured.title}
                  </h3>
                  
                  {/* Thumbnail Screenshots Grid (Compact on mobile/tablet) */}
                  {screenshots.length > 1 ? (
                    <div className="grid grid-cols-4 lg:grid-cols-2 gap-1.5 sm:gap-2 my-2 sm:my-2.5">
                      {screenshots.slice(0, 4).map((s, idx) => (
                        <div
                          key={s.id || idx}
                          onMouseEnter={() => setHoveredThumbIndex(idx)}
                          onMouseLeave={() => setHoveredThumbIndex(null)}
                          onClick={() => onExploreGame(currentFeatured)}
                          className={`h-12 sm:h-14 lg:h-16 rounded-md overflow-hidden cursor-pointer border transition-all ${
                            hoveredThumbIndex === idx ? 'border-[#66c0f4] scale-102 ring-1 ring-[#66c0f4]' : 'border-[#212f3f] opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={s.url} 
                            alt={`Preview ${idx + 1}`} 
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', currentFeatured.bannerImage);
                            }}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      onClick={() => onExploreGame(currentFeatured)}
                      className="my-2 h-20 sm:h-24 lg:h-28 rounded-lg overflow-hidden border border-[#212f3f] cursor-pointer hover:border-[#66c0f4]/50 transition-colors"
                    >
                      <img 
                        src={currentFeatured.bannerImage} 
                        alt={currentFeatured.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  {/* Status / Why text */}
                  <div className="text-xs text-[#8f98a0] space-y-1.5">
                    <div className="text-[#c7d5e0] font-semibold flex items-center space-x-1.5 text-[10px] sm:text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                      <span>Now Available • {currentFeatured.approxPlaytime}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#66c0f4] font-medium bg-[#141f2d] p-2 rounded-lg border border-[#213144] line-clamp-2 leading-relaxed">
                      {currentFeatured.recommendationReason || currentFeatured.whyThisGame}
                    </div>
                  </div>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {currentFeatured.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-[#1b2838] text-[#66c0f4] text-[9px] sm:text-[10px] px-2 py-0.5 rounded border border-[#2a475e]/40 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2.5 border-t border-[#212f3f] flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      {currentFeatured.discountPercent > 0 && (
                        <span className="bg-[#a4d007] text-[#171a21] text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded">
                          -{currentFeatured.discountPercent}%
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {currentFeatured.isFreeToPlay 
                          ? 'Free To Play' 
                          : currentFeatured.discountPercent > 0 
                          ? `₹ ${(currentFeatured.originalPrice * (1 - currentFeatured.discountPercent / 100)).toLocaleString('en-IN')}` 
                          : `₹ ${currentFeatured.originalPrice.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onExploreGame(currentFeatured)}
                    className="bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-white text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors cursor-pointer"
                  >
                    Explore Details
                  </button>
                </div>

              </div>

            </div>

            {/* Desktop-only Outside Right Arrow */}
            <button
              onClick={handleNextFeatured}
              className="hidden lg:flex absolute -right-10 xl:-right-12 top-1/2 -translate-y-1/2 w-9 xl:w-11 h-28 xl:h-32 bg-gradient-to-l from-[#111a24] to-[#182738] hover:from-[#1e344e] hover:to-[#274668] border border-[#2b3e54] text-[#8f98a0] hover:text-white rounded-r-lg shadow-2xl transition-all cursor-pointer z-20 items-center justify-center group hover:border-[#66c0f4]/70"
              title="Next Game"
              aria-label="Next Featured Game"
            >
              <ChevronRight className="w-6 h-6 xl:w-7 xl:h-7 group-hover:scale-125 group-hover:text-[#66c0f4] transition-all" />
            </button>

          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-2.5 sm:mt-3">
            {featuredGames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setFeaturedIndex(idx); setHoveredThumbIndex(null); }}
                className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                  featuredIndex === idx ? 'w-5 sm:w-6 bg-[#66c0f4]' : 'w-1.5 sm:w-2 bg-[#2d3a48] hover:bg-[#43576c]'
                }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. CONTINUE PLAYING (User Recent Games)                                    */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-b from-[#111923] to-[#0c1219] border border-[#213144] rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3.5 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#1f2d3d]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center space-x-1.5 sm:space-x-2">
                <span>Continue Playing</span>
                <span className="text-xs font-normal text-[#8f98a0] hidden sm:inline">• For {userProfile.name}</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8f98a0]">
                Jump right back into your active games.
              </p>
            </div>
          </div>
          <div className="text-[11px] sm:text-xs text-[#8f98a0] hidden md:flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-[#66c0f4]" />
            <span>27.8 hrs past 2 weeks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {userProfile.recentlyPlayed.map((item) => (
            <div
              key={`continue-${item.gameId}`}
              className="bg-[#151f2b] hover:bg-[#1c2a3a] border border-[#26374a] hover:border-emerald-500/60 rounded-xl p-3 sm:p-4 transition-all duration-200 shadow-md group flex flex-col justify-between"
            >
              <div className="flex items-start space-x-3">
                <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-black flex-shrink-0 relative border border-[#2d3e52]">
                  <img src={item.bannerImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-300 truncate">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-[#66c0f4] font-medium truncate">
                    {item.genre}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-[#8f98a0] mt-0.5 sm:mt-1">
                    <span>{item.hoursPast2Weeks}h recent</span>
                    <span>•</span>
                    <span className="text-[#c7d5e0]">{item.totalHours}h total</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#213144] flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Ready to Play</span>
                </span>
                
                <button 
                  onClick={() => {
                    const match = allAvailableGames.find(g => g.id === item.gameId || g.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 5)));
                    if (match) onExploreGame(match);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold px-3 py-1 sm:py-1.5 rounded-lg flex items-center space-x-1.5 shadow transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. TOP NEW RELEASES JULY 2026                                             */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#092236] via-[#0b1c2b] to-[#07131e] border border-[#1d466b]/60 shadow-2xl p-4 sm:p-5 md:p-6">
        
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#184870_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

        {/* Section Header */}
        <div className="relative flex items-center justify-between mb-4 sm:mb-5 z-10">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-wide flex items-center space-x-2">
              <span>Top New Releases</span>
            </h2>
            <span className="bg-[#194b70] text-cyan-200 text-[10px] sm:text-xs md:text-sm font-extrabold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md shadow border border-[#2b689a]/50">
              July 2026
            </span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button 
              onClick={() => setNewReleasesPage(prev => (prev === 0 ? 1 : 0))}
              className="bg-[#13304a] hover:bg-[#1f4a70] text-white p-1 sm:p-1.5 rounded border border-[#26537d] cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button 
              onClick={() => setNewReleasesPage(prev => (prev === 0 ? 1 : 0))}
              className="bg-[#13304a] hover:bg-[#1f4a70] text-white p-1 sm:p-1.5 rounded border border-[#26537d] cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
          {topNewReleasesJuly.slice(newReleasesPage * 4, newReleasesPage * 4 + 4).map((game) => (
            <div
              key={`top-new-${game.id}`}
              onClick={() => onExploreGame(game)}
              className="bg-[#091522] hover:bg-[#0f243a] border border-[#1b3a58] hover:border-[#66c0f4] rounded-xl overflow-hidden shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Media Box */}
              <div className="aspect-[16/9] bg-black relative overflow-hidden">
                <img 
                  src={game.bannerImage} 
                  alt={game.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Live tag on Shift at Midnight */}
                {game.isLive && (
                  <div className="absolute top-1.5 left-1.5 bg-black/80 border border-red-500/80 text-white text-[9px] font-black px-1.5 py-0.2 rounded flex items-center space-x-1 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                    <span>LIVE</span>
                  </div>
                )}

                {/* Price Tag */}
                <div className="absolute bottom-1.5 right-1.5 bg-[#0c1824]/90 backdrop-blur-md border border-[#214364] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 sm:py-1 rounded shadow-lg">
                  {game.isFreeToPlay 
                    ? 'Free' 
                    : `₹ ${game.originalPrice.toLocaleString('en-IN')}`}
                </div>
              </div>

              {/* Subtitle / Title Bottom Info */}
              <div className="p-2.5 sm:p-3 bg-[#0a1826] border-t border-[#132c45]">
                <h3 className="text-xs sm:text-xs font-black text-white group-hover:text-[#66c0f4] truncate transition-colors">
                  {game.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-[#7092b0] truncate mt-0.5">
                  {game.tags.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-3.5 sm:mt-4">
          {[0, 1].map((dot) => (
            <button
              key={dot}
              onClick={() => setNewReleasesPage(dot)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                newReleasesPage === dot ? 'w-5 sm:w-6 bg-white' : 'w-1.5 sm:w-2 bg-[#1b4366]'
              }`}
            />
          ))}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. SPECIAL OFFERS / DEALS                                                 */}
      {/* ========================================================================= */}
      <section className="space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center space-x-1.5 sm:space-x-2">
                <span>Special Offers / Deals</span>
                <span className="bg-[#a4d007] text-[#171a21] text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded">
                  UP TO -75%
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8f98a0]">
                Biggest weekend discounts on critically acclaimed titles.
              </p>
            </div>
          </div>
          <span className="text-xs text-[#66c0f4] font-semibold hidden md:inline">
            Offers end Monday 10:00 AM
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {specialDeals.map((game) => {
            const discountedPrice = Math.round(game.originalPrice * (1 - game.discountPercent / 100));
            return (
              <div
                key={`deal-${game.id}`}
                onClick={() => onExploreGame(game)}
                className="bg-[#111923] hover:bg-[#172230] border border-[#213144] hover:border-amber-400/50 rounded-xl overflow-hidden transition-all duration-200 shadow-lg group cursor-pointer flex flex-col justify-between"
              >
                {/* Banner Thumbnail with Discount Tag */}
                <div className="aspect-[16/9] overflow-hidden bg-black relative">
                  <img 
                    src={game.bannerImage} 
                    alt={game.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-1.5 left-1.5 bg-[#101822]/90 backdrop-blur-sm border border-amber-400/40 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                    Weekend Deal
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 bg-[#a4d007] text-[#171a21] text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded shadow-lg">
                    -{game.discountPercent}%
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-2.5 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 truncate">
                      {game.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#8f98a0] truncate mt-0.5">
                      {game.tags.slice(0, 2).join(' • ')}
                    </p>
                  </div>

                  {/* Price Box */}
                  <div className="pt-2 border-t border-[#1f2d3d] flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1.5">
                      <span className="text-[10px] sm:text-xs text-[#8f98a0] line-through">
                        ₹ {game.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#a4d007]">
                        ₹ {discountedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onExploreGame(game);
                      }}
                      className="bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-[10px] sm:text-[11px] font-bold text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. RECOMMENDED FOR YOU (4 per row + side browse arrows + working filters)   */}
      {/* ========================================================================= */}
      <section className="space-y-3.5 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-[#213144]">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex-shrink-0">
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                Recommended For You
              </h2>
              <p className="text-[11px] sm:text-xs text-[#8f98a0]">
                Curated based on your play habits in tactical shooters, sports, and cinematic epics.
              </p>
            </div>
          </div>

          {/* Filter Pills (Smooth horizontal scroll on mobile/tablet) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-[11px] font-semibold py-1">
            {[
              { id: 'ALL', label: 'All For You' },
              { id: 'FPS_COMPETITIVE', label: 'Tactical & FPS' },
              { id: 'STORY_RPG', label: 'Deep Story & RPG' },
              { id: 'SPORTS_RACING', label: 'Sports & Racing' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRecFilter(tab.id as any)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap text-[10px] sm:text-[11px] ${
                  recFilter === tab.id
                    ? 'bg-[#1a9fff] text-[#0d151e] font-black shadow'
                    : 'bg-[#151f2b] hover:bg-[#1f2d3d] text-[#8f98a0] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Games per Row with Side Browse Arrows */}
        <div className="relative flex items-center">
          
          {/* Left Arrow (Desktop / Tablet) */}
          {totalRecPages > 1 && (
            <button
              onClick={handlePrevRec}
              className="hidden lg:flex absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2 w-8 xl:w-9 h-14 bg-gradient-to-r from-[#101924] to-[#182738] hover:from-[#1e344e] hover:to-[#28486b] border border-[#2b3e54] text-[#8f98a0] hover:text-white rounded-l-lg shadow-2xl transition-all cursor-pointer z-20 items-center justify-center group hover:border-cyan-400"
              title="Previous recommendations"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 group-hover:scale-125 group-hover:text-cyan-300 transition-transform" />
            </button>
          )}

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            {currentRecGames.map((game) => (
              <div
                key={`rec-for-you-${game.id}`}
                onClick={() => onExploreGame(game)}
                className="bg-[#111923] hover:bg-[#162230] border border-[#213144] hover:border-cyan-400/60 rounded-xl overflow-hidden transition-all duration-200 shadow-lg group cursor-pointer flex flex-col justify-between"
              >
                {/* Media Header */}
                <div className="aspect-[16/9] overflow-hidden bg-black relative">
                  <img src={game.bannerImage} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  {/* Playtime & Status Pill */}
                  <div className="absolute top-2 left-2 bg-[#0c131c]/85 backdrop-blur-sm border border-[#21354a] text-cyan-300 text-[10px] font-semibold px-2 py-0.5 rounded shadow flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{game.approxPlaytime}</span>
                  </div>

                  {game.discountPercent > 0 && (
                    <span className="absolute bottom-2 right-2 bg-[#a4d007] text-[#171a21] text-xs font-black px-2 py-0.5 rounded shadow">
                      -{game.discountPercent}%
                    </span>
                  )}
                  {game.isFreeToPlay && (
                    <span className="absolute bottom-2 right-2 bg-[#1a9fff] text-[#101721] text-xs font-black px-2 py-0.5 rounded shadow">
                      Free To Play
                    </span>
                  )}
                </div>

                {/* Info Body */}
                <div className="p-3 sm:p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                        {game.title}
                      </h3>
                    </div>

                    <p className="text-[10px] sm:text-[11px] text-[#8f98a0] truncate mt-0.5">
                      {game.tags.slice(0, 3).join(' • ')}
                    </p>

                    {/* Why this is recommended Box */}
                    <div className="bg-[#091119] border border-[#1b2c3d] rounded-lg p-2 sm:p-2.5 mt-2 sm:mt-2.5 space-y-1 group-hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                        <span>Recommendation Rationale</span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#a9bccc] line-clamp-2 leading-relaxed">
                        {game.whyThisGame || game.recommendationReason}
                      </p>
                      {game.hardware && (
                        <div className="text-[9px] sm:text-[10px] text-emerald-400/90 font-medium pt-0.5 flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{game.hardware.userSystemMatch}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Rating Footer */}
                  <div className="pt-2 sm:pt-2.5 border-t border-[#1e2c3c] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] bg-[#172433] text-[#66c0f4] border border-[#21384f] px-1.5 py-0.5 rounded font-bold">
                        {game.steamRating.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <span className="font-extrabold text-white text-xs sm:text-sm">
                        {game.isFreeToPlay 
                          ? 'Free' 
                          : game.discountPercent > 0
                          ? `₹ ${(game.originalPrice * (1 - game.discountPercent / 100)).toLocaleString('en-IN')}`
                          : `₹ ${game.originalPrice.toLocaleString('en-IN')}`}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onExploreGame(game);
                        }}
                        className="bg-[#21354b] hover:bg-cyan-500 hover:text-[#0b1219] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow (Desktop / Tablet) */}
          {totalRecPages > 1 && (
            <button
              onClick={handleNextRec}
              className="hidden lg:flex absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2 w-8 xl:w-9 h-14 bg-gradient-to-l from-[#101924] to-[#182738] hover:from-[#1e344e] hover:to-[#28486b] border border-[#2b3e54] text-[#8f98a0] hover:text-white rounded-r-lg shadow-2xl transition-all cursor-pointer z-20 items-center justify-center group hover:border-cyan-400"
              title="Next recommendations"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 group-hover:scale-125 group-hover:text-cyan-300 transition-transform" />
            </button>
          )}
        </div>

        {/* Carousel Pagination Indicator with Mobile Touch Controls */}
        {totalRecPages > 1 && (
          <div className="flex justify-center items-center space-x-2 pt-1">
            <button 
              onClick={handlePrevRec}
              className="lg:hidden bg-[#151f2b] p-1 rounded border border-[#213144] text-white"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex space-x-1.5">
              {Array.from({ length: totalRecPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setRecPage(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    recPage === idx ? 'w-5 sm:w-6 bg-cyan-400' : 'w-1.5 sm:w-2 bg-[#2d3a48]'
                  }`}
                />
              ))}
            </div>
            <button 
              onClick={handleNextRec}
              className="lg:hidden bg-[#151f2b] p-1 rounded border border-[#213144] text-white"
              aria-label="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>


      {/* ========================================================================= */}
      {/* 6. TOP SELLERS & POPULAR UPCOMING (STEAM MULTI-TAB BROWSE)                 */}
      {/* ========================================================================= */}
      <section className="space-y-3.5 sm:space-y-4">
        
        {/* Top Tab Bar & Filter Checkboxes */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#213144]">
          
          {/* Tab Navigation (Horizontal touch scroll on mobile/tablet) */}
          <div className="flex items-center space-x-3 sm:space-x-5 overflow-x-auto no-scrollbar text-xs md:text-sm font-bold">
            {[
              { id: 'TOP_SELLERS', label: 'Top Sellers' },
              { id: 'POPULAR_UPCOMING', label: 'Popular Upcoming' },
              { id: 'SPECIALS', label: 'Specials' },
              { id: 'TRENDING_FREE', label: 'Trending Free' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveBrowseTab(tab.id as TabType);
                  setHoveredBrowseGameId(null);
                }}
                className={`py-1.5 sm:py-2 relative transition-all cursor-pointer whitespace-nowrap ${
                  activeBrowseTab === tab.id
                    ? 'text-white font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1a9fff]'
                    : 'text-[#8f98a0] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Steam Authentic Checkboxes */}
          <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-[#8f98a0] flex-wrap gap-y-1">
            <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={includeFreeToPlay}
                onChange={(e) => setIncludeFreeToPlay(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#101822] border-[#2a3f5a] text-[#1a9fff] focus:ring-0 cursor-pointer"
              />
              <span className="text-[10px] sm:text-[11px]">Include free to play</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white select-none">
              <input
                type="checkbox"
                checked={includeLibraryItems}
                onChange={(e) => setIncludeLibraryItems(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#101822] border-[#2a3f5a] text-[#1a9fff] focus:ring-0 cursor-pointer"
              />
              <span className="text-[10px] sm:text-[11px]">Include items in library</span>
            </label>
          </div>
        </div>

        {/* Clean Split: List on Left + Desktop-only Hover Preview Pane on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
          
          {/* Game List Container (Takes full width on tablet & mobile, 7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-1.5">
            {activeTabGames.map((game) => {
              const isHovered = (hoveredBrowseGameId === game.id) || (!hoveredBrowseGameId && activeBrowseGame?.id === game.id);
              return (
                <div
                  key={`tab-game-${game.id}`}
                  onMouseEnter={() => setHoveredBrowseGameId(game.id)}
                  onClick={() => onExploreGame(game)}
                  className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? 'bg-gradient-to-r from-[#1b3a58] to-[#14283d] border-[#66c0f4]/80 shadow-lg'
                      : 'bg-[#0f1823] hover:bg-[#142232] border-[#1f2f42] text-[#c7d5e0]'
                  }`}
                >
                  {/* Left Capsule + Title + Meta */}
                  <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-18 h-10 sm:w-24 sm:h-12 rounded overflow-hidden bg-black flex-shrink-0 relative border border-[#2b3e52]">
                      <img 
                        src={game.bannerImage} 
                        alt={game.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {game.title}
                      </h4>
                      <p className="text-[9px] sm:text-[10px] text-[#8f98a0] truncate mt-0.5">
                        {game.tags.slice(0, 3).join(', ')}
                      </p>
                      <p className="text-[8px] sm:text-[9px] text-[#556778] mt-0.5">
                        {game.releaseDate}
                      </p>
                    </div>
                  </div>

                  {/* Right Price & Discount Block */}
                  <div className="flex-shrink-0 pl-2 sm:pl-3">
                    {renderPriceBadge(game)}
                  </div>
                </div>
              );
            })}

            {activeTabGames.length === 0 && (
              <div className="p-8 text-center text-xs text-[#8f98a0] bg-[#0f1823] rounded-xl border border-[#1f2f42]">
                No games match your active filters. Try checking "Include free to play".
              </div>
            )}
          </div>

          {/* Desktop-only Right Hover Preview Pane (Hidden on Mobile & Tablet to eliminate clutter!) */}
          <div className="hidden lg:block lg:col-span-5 bg-[#101a26] border border-[#21354b] rounded-xl p-4 shadow-2xl sticky top-20">
            {activeBrowseGame && (
              <div 
                onClick={() => onExploreGame(activeBrowseGame)}
                className="space-y-3 cursor-pointer group"
              >
                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-[#66c0f4] transition-colors truncate">
                    {activeBrowseGame.title}
                  </h3>
                  
                  {/* Reviews Summary */}
                  <div className="text-xs text-[#8f98a0] mt-1 flex items-center space-x-1.5">
                    <span>English Reviews:</span>
                    <span className="text-[#66c0f4] font-bold">
                      {activeBrowseGame.reviewSummary || 'Very Positive'}
                    </span>
                    <span>({activeBrowseGame.reviewCount ? activeBrowseGame.reviewCount.toLocaleString('en-IN') : '11,339'})</span>
                  </div>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {activeBrowseGame.tags.slice(0, 5).map(tag => (
                      <span key={tag} className="bg-[#1b2838] text-[#c7d5e0] text-[10px] px-2 py-0.5 rounded border border-[#2a475e]/40 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2 High-Resolution Preview Screenshots */}
                <div className="space-y-2 pt-1">
                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black border border-[#1d3147] shadow">
                    <img 
                      src={activeBrowseGame.screenshots?.[0]?.url || activeBrowseGame.heroImage || activeBrowseGame.bannerImage} 
                      alt="Screenshot 1"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                    />
                  </div>

                  <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black border border-[#1d3147] shadow">
                    <img 
                      src={activeBrowseGame.screenshots?.[1]?.url || activeBrowseGame.bannerImage || activeBrowseGame.heroImage} 
                      alt="Screenshot 2"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                    />
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-[#66c0f4] font-bold group-hover:underline">
                  Click to view full game details & system specs →
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
