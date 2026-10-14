import React, { useState } from 'react';
import { 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  Radio, 
  Wrench, 
  BookOpen, 
  Award, 
  Heart, 
  Share2, 
  Eye, 
  Flame, 
  Search, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import { Game } from '../types';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge: string;
    level: number;
  };
  gameTitle: string;
  gameId?: string;
  type: 'SCREENSHOT' | 'ARTWORK' | 'WORKSHOP' | 'GUIDE' | 'DISCUSSION' | 'BROADCAST';
  title: string;
  description?: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  views?: number;
  awardsCount: number;
  timeAgo: string;
  isLiked?: boolean;
}

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'comm-1',
    author: {
      name: 'Valkyrie_Rider',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      badge: '10 Years of Service',
      level: 74
    },
    gameTitle: 'Grand Theft Auto V',
    gameId: 'gta-v',
    type: 'SCREENSHOT',
    title: 'Sunset over Del Perro Pier with 4K Photorealism Mod',
    description: 'Captured on max settings at 1440p using the ultra realistic weather & ray-traced reflections preset. Los Santos never looked cleaner.',
    mediaUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    likes: 1420,
    comments: 138,
    views: 18400,
    awardsCount: 16,
    timeAgo: '2 hours ago'
  },
  {
    id: 'comm-2',
    author: {
      name: 'PixelRonin',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
      badge: 'Workshop Creator',
      level: 52
    },
    gameTitle: 'Cyberpunk 2077',
    gameId: 'cyberpunk-2077',
    type: 'ARTWORK',
    title: 'Night City Holograms & Rain (Hand-drawn Fan Poster)',
    description: 'Original digital art inspired by the Badlands sunset and downtown Kabuki neon lights. Free 4K wallpaper download in comments!',
    mediaUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    likes: 2890,
    comments: 245,
    views: 34200,
    awardsCount: 32,
    timeAgo: '5 hours ago'
  },
  {
    id: 'comm-3',
    author: {
      name: 'TacticalGhost',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80',
      badge: 'Guide Contributor',
      level: 61
    },
    gameTitle: 'Call of Duty®: Modern Warfare®',
    gameId: 'cod-modern-warfare',
    type: 'GUIDE',
    title: 'Complete Veteran Campaign Strategy & Secret Weapon Intel',
    description: 'A comprehensive walkthrough for the hardest mission checkpoints, optimal attachment tunings, and night-vision room clearing tips for maximum efficiency.',
    mediaUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    likes: 980,
    comments: 87,
    views: 12900,
    awardsCount: 8,
    timeAgo: 'Yesterday'
  },
  {
    id: 'comm-4',
    author: {
      name: 'StrikerLegend',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      badge: 'eSports Veteran',
      level: 45
    },
    gameTitle: 'EA SPORTS FC™ 26',
    gameId: 'ea-fc-26',
    type: 'DISCUSSION',
    title: 'Top 5 Meta Formations for Weekend League Domination',
    description: 'After 250+ matches in Division 1, here is why the 4-3-2-1 counter press and dynamic winger overloads are dominating the current tactical meta.',
    likes: 760,
    comments: 194,
    views: 9800,
    awardsCount: 6,
    timeAgo: '1 day ago'
  },
  {
    id: 'comm-5',
    author: {
      name: 'DeepSeaDiver',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      badge: 'Community Ambassador',
      level: 38
    },
    gameTitle: 'DREDGE',
    gameId: 'dredge',
    type: 'SCREENSHOT',
    title: 'Midnight Fog & The Whispering Lighthouse',
    description: 'Never drop anchor when the panic meter turns red. Took this eerie photo right before escaping the pale leviathan.',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    likes: 1850,
    comments: 112,
    views: 21000,
    awardsCount: 21,
    timeAgo: '2 days ago'
  },
  {
    id: 'comm-6',
    author: {
      name: 'ModMaster_99',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      badge: 'Master Modder',
      level: 82
    },
    gameTitle: 'Baldur\'s Gate 3',
    gameId: 'baldurs-gate-3',
    type: 'WORKSHOP',
    title: 'Custom Dice & Campfire Visual Overhaul v2.4 (Workshop)',
    description: 'Over 50 custom glowing d20 dice models, enhanced campfire ambient lighting, and immersive companion idle animations.',
    mediaUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    likes: 4120,
    comments: 380,
    views: 52000,
    awardsCount: 45,
    timeAgo: '3 days ago'
  }
];

interface CommunityViewProps {
  onExploreGame?: (game: Game) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ALL' | 'SCREENSHOTS' | 'ARTWORK' | 'WORKSHOP' | 'GUIDES' | 'DISCUSSIONS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const filteredPosts = posts.filter(post => {
    // Sub-tab filter
    if (activeSubTab === 'SCREENSHOTS' && post.type !== 'SCREENSHOT') return false;
    if (activeSubTab === 'ARTWORK' && post.type !== 'ARTWORK') return false;
    if (activeSubTab === 'WORKSHOP' && post.type !== 'WORKSHOP') return false;
    if (activeSubTab === 'GUIDES' && post.type !== 'GUIDE') return false;
    if (activeSubTab === 'DISCUSSIONS' && post.type !== 'DISCUSSION') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.gameTitle.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        (post.description && post.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const popularGameHubs = [
    { title: 'Counter-Strike 2', members: '3.8M', icon: '🔫' },
    { title: 'EA SPORTS FC™ 26', members: '840K', icon: '⚽' },
    { title: 'Grand Theft Auto V', members: '2.4M', icon: '🚗' },
    { title: 'Cyberpunk 2077', members: '1.2M', icon: '⚡' },
    { title: 'Baldur\'s Gate 3', members: '1.6M', icon: '🎲' },
    { title: 'DREDGE', members: '180K', icon: '🎣' }
  ];

  return (
    <div className="min-h-screen bg-[#1b2838] text-[#c7d5e0] pb-24 select-none">
      
      {/* Community Banner Hero */}
      <div className="bg-gradient-to-r from-[#17202d] via-[#1e3047] to-[#121922] border-b border-[#2d4054] px-6 py-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#66c0f4] uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Steam Community Activity Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
              Community Hubs
            </h1>
            <p className="text-xs md:text-sm text-[#8f98a0] max-w-2xl leading-relaxed">
              Discover, create, and discuss gameplay clips, custom mods, 4K screenshots, strategy guides, and artwork shared by millions of Steam players worldwide.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search community content or games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101822] border border-[#2d4054] text-white text-xs rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#66c0f4] placeholder-[#536577] transition-colors"
              />
              <Search className="w-4 h-4 text-[#536577] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-[#212f3f]">
          {[
            { id: 'ALL', label: 'All Content', icon: Flame },
            { id: 'SCREENSHOTS', label: 'Screenshots', icon: ImageIcon },
            { id: 'ARTWORK', label: 'Artwork', icon: Sparkles },
            { id: 'WORKSHOP', label: 'Workshop', icon: Wrench },
            { id: 'GUIDES', label: 'Guides', icon: BookOpen },
            { id: 'DISCUSSIONS', label: 'Discussions', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1a9fff] text-[#11161f] shadow-lg shadow-[#1a9fff]/20'
                    : 'bg-[#121922] hover:bg-[#1f2b38] text-[#c7d5e0] hover:text-white border border-[#212f3f]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Split: Community Feed (Left) & Popular Hubs / Side Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Post Feed */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#66c0f4]" />
                <span>Trending Community Creations</span>
              </h2>
              <span className="text-xs text-[#8f98a0]">
                Showing {filteredPosts.length} posts
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-[#121922] border border-[#212f3f] rounded-2xl p-8 space-y-3">
                <Search className="w-10 h-10 text-[#3b5168] mx-auto" />
                <h3 className="text-base font-bold text-white">No community posts match your filter</h3>
                <p className="text-xs text-[#8f98a0]">Try searching for different keywords or reset your tab filters.</p>
                <button
                  onClick={() => { setActiveSubTab('ALL'); setSearchQuery(''); }}
                  className="bg-[#1a9fff] text-[#11161f] text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  View All Community Content
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <div 
                    key={post.id} 
                    className="bg-[#121922] border border-[#212f3f] hover:border-[#35495e] rounded-xl overflow-hidden shadow-xl transition-all"
                  >
                    {/* Post Header / Author */}
                    <div className="p-4 flex items-center justify-between border-b border-[#1c2736]">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name} 
                          className="w-10 h-10 rounded-full border border-[#2d4054]"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{post.author.name}</span>
                            <span className="bg-[#1a9fff]/20 text-[#66c0f4] text-[10px] font-black px-1.5 py-0.5 rounded border border-[#1a9fff]/30">
                              Lvl {post.author.level}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#8f98a0] flex items-center space-x-1.5 mt-0.5">
                            <span className="text-[#66c0f4] font-medium">{post.gameTitle}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>

                      <span className="bg-[#1a2533] text-[#8f98a0] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-[#26374a]">
                        {post.type}
                      </span>
                    </div>

                    {/* Post Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="text-base font-bold text-white leading-snug">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs text-[#c7d5e0] leading-relaxed">
                          {post.description}
                        </p>
                      )}

                      {/* Post Media / Screenshot */}
                      {post.mediaUrl && (
                        <div className="rounded-lg overflow-hidden border border-[#212f3f] aspect-video bg-black/60 group relative cursor-pointer">
                          <img 
                            src={post.mediaUrl} 
                            alt={post.title} 
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80');
                            }}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </div>

                    {/* Post Footer / Actions */}
                    <div className="p-4 bg-[#0e141c] border-t border-[#1c2736] flex items-center justify-between text-xs text-[#8f98a0]">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            post.isLiked 
                              ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30' 
                              : 'hover:bg-[#1a2533] hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likes.toLocaleString()}</span>
                        </button>

                        <button className="flex items-center space-x-1.5 hover:text-white transition-colors cursor-pointer">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments} Comments</span>
                        </button>

                        <div className="hidden sm:flex items-center space-x-1 text-amber-400">
                          <Award className="w-3.5 h-3.5" />
                          <span>{post.awardsCount} Steam Awards</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 hover:bg-[#1a2533] hover:text-white rounded-md transition-colors cursor-pointer">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Game Hub Shortcuts & Community Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Popular Game Hubs Box */}
            <div className="bg-[#121922] border border-[#212f3f] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#212f3f] pb-2 flex items-center justify-between">
                <span>Popular Game Hubs</span>
                <Sparkles className="w-4 h-4 text-[#66c0f4]" />
              </h3>

              <div className="space-y-2.5">
                {popularGameHubs.map(hub => (
                  <div 
                    key={hub.title} 
                    className="p-2.5 bg-[#0e141c] hover:bg-[#192330] border border-[#1e2a38] hover:border-[#35495e] rounded-lg flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="text-lg">{hub.icon}</span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{hub.title}</div>
                        <div className="text-[10px] text-[#8f98a0]">{hub.members} Active Members</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#536577]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Steam Workshop Spotlight */}
            <div className="bg-gradient-to-br from-[#131e2b] to-[#0e141c] border border-[#24374a] rounded-xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center space-x-2 text-[#a4d007]">
                <Wrench className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Steam Workshop</span>
              </div>
              <h4 className="text-sm font-bold text-white">Create & Share Custom Mods</h4>
              <p className="text-xs text-[#8f98a0] leading-relaxed">
                Over 2.5 million user-generated items, maps, and total conversion mods available for one-click subscription.
              </p>
              <button className="w-full bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#11161f] text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer">
                Browse Steam Workshop
              </button>
            </div>

            {/* Community Rules Box */}
            <div className="bg-[#121922] border border-[#212f3f] rounded-xl p-5 space-y-2 text-xs text-[#8f98a0]">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Community Rules & Guidelines</h4>
              <p className="leading-relaxed">
                Be civil, report spam or toxic content, and help keep Steam hubs welcoming for all players.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
