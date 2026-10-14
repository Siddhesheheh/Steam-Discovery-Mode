import React, { useState } from 'react';
import { Game } from '../types';

interface PopularTabsSectionProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const PopularTabsSection: React.FC<PopularTabsSectionProps> = ({ games, onSelectGame }) => {
  const [activeTab, setActiveTab] = useState<
    'Popular New Releases' | 'Top Sellers' | 'Popular Upcoming' | 'Specials' | 'Trending Free'
  >('Popular New Releases');

  const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);

  // Filter games based on selected tab
  const getFilteredGames = () => {
    switch (activeTab) {
      case 'Popular New Releases':
        return games.filter(g => g.isPopularNewRelease || g.releaseDate.includes('2026'));
      case 'Top Sellers':
        return games.filter(g => g.isTopSeller || g.reviewCount > 20000);
      case 'Popular Upcoming':
        return games.filter(g => g.isPopularUpcoming || g.releaseDate.includes('Sep') || g.releaseDate.includes('Nov'));
      case 'Specials':
        return games.filter(g => g.discountPercent > 0 || g.isSpecial);
      case 'Trending Free':
        return games.filter(g => g.isFreeToPlay || g.isTrendingFree);
      default:
        return games;
    }
  };

  const currentList = getFilteredGames().slice(0, 8);
  const activeHoveredGame = games.find(g => g.id === hoveredGameId) || currentList[0] || games[0];

  return (
    <section className="max-w-7xl mx-auto px-4 my-10">
      {/* Tabs Header matching Image 3 */}
      <div className="flex items-center space-x-6 border-b border-[#2a475e]/40 pb-2 mb-4 overflow-x-auto text-sm font-bold">
        {(['Popular New Releases', 'Top Sellers', 'Popular Upcoming', 'Specials', 'Trending Free'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setHoveredGameId(null);
            }}
            className={`pb-1 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'text-white border-b-2 border-[#1a9fff]'
                : 'text-[#8f98a0] hover:text-[#c7d5e0]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Left List (2 cols or 7 cols) + Right Sticky Screenshot Detail Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column List (7 cols) matching Image 3 */}
        <div className="lg:col-span-7 space-y-1.5">
          {currentList.map((game) => {
            const isHovered = (hoveredGameId === null && game.id === currentList[0]?.id) || hoveredGameId === game.id;
            const finalPrice = game.isFreeToPlay
              ? 'Free To Play'
              : game.discountPercent > 0
              ? `₹${(game.originalPrice * (1 - game.discountPercent / 100)).toLocaleString('en-IN')}`
              : `₹${game.originalPrice.toLocaleString('en-IN')}`;

            return (
              <div
                key={game.id}
                onMouseEnter={() => setHoveredGameId(game.id)}
                onClick={() => onSelectGame(game)}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-150 border ${
                  isHovered
                    ? 'bg-[#212b36] border-[#66c0f4] shadow-md ring-1 ring-[#66c0f4]/40'
                    : 'bg-[#1b2838]/80 border-[#212b36] hover:bg-[#2a475e]/60'
                }`}
              >
                {/* Left Thumbnail + Game Info */}
                <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                  <img
                    src={game.bannerImage}
                    alt={game.title}
                    className="w-28 h-12 object-cover rounded flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-[#66c0f4]">
                      {game.title}
                    </h3>
                    <p className="text-[11px] text-[#8f98a0] truncate">
                      {game.tags.slice(0, 4).join(', ')}
                    </p>
                    <p className="text-[10px] text-[#61686d]">
                      Released: {game.releaseDate}
                    </p>
                  </div>
                </div>

                {/* Right Price & Discount Box matching Image 3 */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {game.discountPercent > 0 && (
                    <span className="bg-[#a4d007] text-[#171a21] text-xs font-black px-2 py-0.5 rounded">
                      -{game.discountPercent}%
                    </span>
                  )}
                  <div className="text-right">
                    {game.discountPercent > 0 && (
                      <div className="text-[10px] text-[#7193a6] line-through">
                        ₹{game.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                    <div className="text-xs font-bold text-white">
                      {finalPrice}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sticky Preview Card (5 cols) matching Image 3 right */}
        {activeHoveredGame && (
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-28 bg-[#0e141b] border border-[#212b36] rounded p-4 shadow-2xl space-y-3">
              <h3 className="text-lg font-bold text-white tracking-wide">
                {activeHoveredGame.title}
              </h3>

              <div className="text-xs text-[#8f98a0] space-y-1">
                <div>
                  Overall User Reviews:{' '}
                  <span className="text-[#66c0f4] font-semibold">{activeHoveredGame.reviewSummary}</span>
                </div>
                <div>{activeHoveredGame.reviewCount.toLocaleString('en-IN')} user reviews</div>
              </div>

              {/* Tags Pills */}
              <div className="flex flex-wrap gap-1">
                {activeHoveredGame.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="bg-[#212b36] text-[#c7d5e0] text-[10px] px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Screenshots Stack Preview matching Image 3 */}
              <div className="space-y-2 pt-2">
                {activeHoveredGame.screenshots.slice(0, 3).map((shot) => (
                  <div key={shot.id} className="rounded overflow-hidden aspect-video border border-[#212b36]">
                    <img src={shot.url} alt={shot.caption || activeHoveredGame.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
