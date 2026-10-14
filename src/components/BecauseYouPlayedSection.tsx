import React from 'react';
import { Game } from '../types';

interface BecauseYouPlayedSectionProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const BecauseYouPlayedSection: React.FC<BecauseYouPlayedSectionProps> = ({
  games,
  onSelectGame,
}) => {
  const sportsGames = games.filter(
    (g) => g.recommendationReason?.includes('EA SPORTS FC') || g.tags.includes('Football (Soccer)')
  ).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 my-10">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Because You Played EA SPORTS FC™ 26
        </h2>
      </div>

      {/* 4 Wide Grid Cards matching Image 2 bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sportsGames.map((game) => {
          const priceText = game.isFreeToPlay
            ? 'Free To Play'
            : `₹ ${game.originalPrice.toLocaleString('en-IN')}`;

          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-[#1b2838] border border-[#212b36] hover:border-[#66c0f4] rounded overflow-hidden cursor-pointer group transition-all duration-200 shadow-xl flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <img
                  src={game.bannerImage}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Tag Pills Container matching Image 2 */}
              <div className="p-3 bg-[#0e141b] flex-1 flex flex-col justify-between border-t border-[#1f2933]">
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.tags.slice(0, 6).map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#212b36] hover:bg-[#2a475e] text-[#c7d5e0] text-[10px] px-2 py-0.5 rounded transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price Box at Bottom Right */}
                <div className="flex justify-end pt-2 border-t border-[#1f2933]/50">
                  <span className="bg-[#000000]/80 text-[#c7d5e0] text-xs font-bold px-2.5 py-1 rounded shadow">
                    {priceText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
