import React from 'react';
import { Game, UserHabitProfile } from '../types';
import { Play, Star, Trash2, ShieldCheck, Cpu, HardDrive, Clock, CheckCircle2 } from 'lucide-react';
import { ShortDiscoveryCard } from './ShortDiscoveryCard';

interface WishlistViewProps {
  wishlist: Game[];
  onExploreGame: (game: Game) => void;
  onToggleWishlist: (game: Game) => void;
  onReturnToStore: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  onExploreGame,
  onToggleWishlist,
  onReturnToStore,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 select-none">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#212f3f]">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>My Wishlist ({wishlist.length})</span>
          </h1>
          <p className="text-xs text-[#8f98a0]">
            Games you've marked for future weekend sessions.
          </p>
        </div>
        <button
          onClick={onReturnToStore}
          className="bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-xs font-bold text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Discover More Games
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-[#121922] border border-[#212f3f] rounded-2xl">
          <Star className="w-12 h-12 text-[#3b5168] mx-auto mb-3" />
          <p className="text-white font-bold">Your wishlist is empty</p>
          <p className="text-xs text-[#8f98a0] mt-1 mb-4">
            Explore Weekend Discovery Mode to find games tailored to your free time.
          </p>
          <button
            onClick={onReturnToStore}
            className="bg-[#1a9fff] hover:bg-[#66c0f4] text-[#11161f] font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer"
          >
            Open Weekend Discovery
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(game => (
            <ShortDiscoveryCard
              key={`wish-${game.id}`}
              game={game}
              onExploreGame={onExploreGame}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface LibraryViewProps {
  userProfile: UserHabitProfile;
  purchasedGames: Game[];
  onExploreGame: (game: Game) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  userProfile,
  purchasedGames,
  onExploreGame,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 select-none space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#212f3f]">
        <div>
          <h1 className="text-2xl font-black text-white">Steam Library</h1>
          <p className="text-xs text-[#8f98a0]">
            Installed staples & newly discovered weekend games.
          </p>
        </div>
        <div className="text-xs text-[#8f98a0]">
          Total Games: <strong className="text-white">{userProfile.recentlyPlayed.length + purchasedGames.length}</strong>
        </div>
      </div>

      {/* Routine Staples */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8f98a0]">
          Regular Habits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userProfile.recentlyPlayed.map(item => (
            <div key={item.gameId} className="bg-[#121922] border border-[#212f3f] rounded-xl p-4 flex items-center justify-between gap-4">
              <img src={item.bannerImage} alt={item.title} className="w-20 h-12 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                <p className="text-[11px] text-[#8f98a0]">{item.totalHours} hrs on record</p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg cursor-pointer">
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newly Discovered & Purchased Games */}
      {purchasedGames.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              Discovered via Weekend Discovery ({purchasedGames.length})
            </h2>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/30">
              New Additions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedGames.map(game => (
              <div key={`purchased-${game.id}`} className="bg-[#0e1724] border border-[#1e334a] rounded-xl p-4 flex items-center justify-between gap-4">
                <img src={game.bannerImage} alt={game.title} className="w-20 h-12 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">{game.title}</h3>
                  <p className="text-[11px] text-[#a4d007] font-semibold">{game.approxPlaytime}</p>
                </div>
                <button className="bg-[#1a9fff] hover:bg-[#66c0f4] text-[#11161f] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const FriendsView: React.FC = () => {
  const friends = [
    { name: 'Alex_Viper', status: 'In-Game', game: 'Counter-Strike 2', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
    { name: 'Krono', status: 'Online', game: 'Browsing Store', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80' },
    { name: 'Mira_Gamer', status: 'In-Game', game: 'Chants of Sennaar', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
    { name: 'ShadowStriker', status: 'Away', game: 'Snoozing', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&q=80' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 select-none">
      <h1 className="text-2xl font-black text-white mb-4">Friends List</h1>
      <div className="bg-[#121922] border border-[#212f3f] rounded-xl divide-y divide-[#212f3f]">
        {friends.map((f) => (
          <div key={f.name} className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={f.avatar} alt={f.name} className="w-10 h-10 rounded-full border border-[#3b5168]" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#121922] ${
                  f.status === 'In-Game' ? 'bg-emerald-400' : f.status === 'Online' ? 'bg-blue-400' : 'bg-amber-400'
                }`} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{f.name}</div>
                <div className={`text-xs ${f.status === 'In-Game' ? 'text-emerald-400 font-medium' : 'text-[#8f98a0]'}`}>
                  {f.status === 'In-Game' ? `Playing ${f.game}` : f.status}
                </div>
              </div>
            </div>
            <button className="text-xs bg-[#212b36] hover:bg-[#2a475e] text-[#c7d5e0] px-3 py-1.5 rounded cursor-pointer">
              Message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
