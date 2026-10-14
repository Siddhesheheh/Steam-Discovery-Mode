import React from 'react';
import { Game } from '../types';

interface DiscountsAndEventsProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const DiscountsAndEvents: React.FC<DiscountsAndEventsProps> = ({ games, onSelectGame }) => {
  const discountGames = games.filter(g => g.discountPercent > 0 || g.isSpecial).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 my-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white tracking-wide">Discounts & Events</h2>
        <button className="bg-[#212b36] hover:bg-[#2a475e] text-xs text-[#c7d5e0] hover:text-white px-3 py-1 rounded border border-[#2d3844] transition-colors cursor-pointer">
          See More
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {discountGames.map((game, idx) => {
          const promoLabels = ['WEEKEND DEAL', 'FRANCHISE SALE', "TODAY'S DEAL", 'SPECIAL PROMOTION'];
          const label = promoLabels[idx % promoLabels.length];
          const finalPrice = game.isFreeToPlay
            ? 'Free To Play'
            : `₹ ${(game.originalPrice * (1 - game.discountPercent / 100)).toLocaleString('en-IN')}`;

          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-[#1b2838] border border-[#212b36] hover:border-[#66c0f4] rounded overflow-hidden cursor-pointer group transition-all duration-200 shadow-lg flex flex-col justify-between"
            >
              <div className="relative">
                <span className="absolute top-2 left-2 z-10 bg-[#171a21]/90 text-[#66c0f4] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#66c0f4]/30">
                  {label}
                </span>
                <img
                  src={game.bannerImage}
                  alt={game.title}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3 bg-[#0e141b] flex flex-col justify-between flex-1 border-t border-[#1f2933]">
                <h3 className="text-sm font-bold text-white mb-2 truncate group-hover:text-[#66c0f4]">
                  {game.title}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <div className="text-[10px] text-[#8f98a0]">Offer ends in 48h</div>
                  <div className="flex items-center space-x-1">
                    {game.discountPercent > 0 && (
                      <span className="bg-[#a4d007] text-[#171a21] text-xs font-black px-1.5 py-0.5 rounded-s">
                        -{game.discountPercent}%
                      </span>
                    )}
                    <div className="bg-[#000000]/60 px-2 py-0.5 rounded-e text-right">
                      {game.discountPercent > 0 && (
                        <div className="text-[9px] text-[#7193a6] line-through">
                          ₹ {game.originalPrice.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div className="text-xs font-bold text-[#bcee6d]">
                        {finalPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
