export interface GameScreenshot {
  id: string;
  url: string;
  caption?: string;
  isVideo?: boolean;
  videoUrl?: string;
}

export type DiscoveryIntent = 'Something Different' | 'Relax' | 'Story-driven' | 'Competitive';

export interface HardwareSpec {
  compatible: boolean;
  tier: 'High Performance' | 'Smooth 60+ FPS' | 'Great on Steam Deck';
  gpuRequirement: string;
  ramRequirement: string;
  userSystemMatch: string; // e.g. "✓ Matches your RTX 3070 & 16GB RAM"
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  heroImage: string;
  logoImage?: string;
  shortDescription: string;
  detailedDescription?: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  originalPrice: number; // in INR ₹
  discountPercent: number; // e.g. 50 for -50%
  isFreeToPlay?: boolean;
  reviewSummary: string; // e.g. "Overwhelmingly Positive"
  reviewCount: number;
  steamRating: string; // e.g. "96% Positive (4.8/5)"
  tags: string[];
  approxPlaytime: string; // e.g. "~6 hours"
  whyThisGame: string; // Specific meaningful justification
  hardware: HardwareSpec;
  
  // Weekend Discovery flags & classification
  discoveryIntents: DiscoveryIntent[];
  isDifferentFromUsual?: boolean;
  isIndieHiddenGem?: boolean;
  discoveryBadge?: string; // e.g. "Weekend Pick", "Under 6 Hours", "Hidden Gem", "98% Positive"
  usualContrastGenre?: string; // e.g. "Break away from FPS & Sports"
  
  recommendationReason?: string;
  screenshots: GameScreenshot[];
  isFeatured?: boolean;
  isPopularNewRelease?: boolean;
  isTopSeller?: boolean;
  isPopularUpcoming?: boolean;
  isSpecial?: boolean;
  isTrendingFree?: boolean;
  category?: 'Sports' | 'Action' | 'Strategy' | 'Simulation' | 'RPG' | 'Casual' | 'Adventure' | 'Puzzle';
  installed?: boolean;
  playtimeHours?: number;
  lastPlayed?: string;
  achievementsUnlocked?: number;
  totalAchievements?: number;
}

export type SteamNavTab = 'STORE' | 'DISCOVERY_MODE' | 'WEEKEND_DISCOVERY' | 'LIBRARY' | 'COMMUNITY' | 'FRIENDS' | 'WISHLIST' | 'CART' | 'PROFILE';

export type StoreCategory = 'FPS' | 'Action' | 'Sports' | 'Story Mode';

export type StoreFilter = 
  | { type: 'ALL' }
  | { type: 'SPECIAL_OFFERS' }
  | { type: 'CATEGORY'; category: StoreCategory };

export type StoreSubTab = 'FEATURED' | 'CATEGORY' | 'WISHLIST' | 'SEARCH' | 'GAME_DETAIL';

export interface UserHabitProfile {
  name: string;
  handle: string;
  avatarUrl: string;
  walletBalance: number;
  primaryGenres: string[]; // ['FPS', 'Sports Simulation', 'Competitive Multiplayer']
  recentlyPlayed: {
    gameId: string;
    title: string;
    bannerImage: string;
    hoursPast2Weeks: number;
    totalHours: number;
    genre: string;
  }[];
  pcSpecs: {
    gpu: string;
    cpu: string;
    ram: string;
    deckVerified: boolean;
  };
}
