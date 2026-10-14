import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Game } from '../types';

interface RecommendedSectionProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({ games, onSelectGame }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const recommendedGames = games.filter(
    g => g.recommendationReason?.includes('Recommended Based on the Games You Play') || g.isTopSeller || g.isTrendingFree
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(recommendedGames.length / itemsPerPage);
  const visibleGames = recommendedGames.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className="max-w-7xl mx-auto px-4 my-10">
      {/* Header with Title and Customize Button matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Recommended Based on the Games You Play
        </h2>
        <button className="bg-[#212b36] hover:bg-[#2a475e] text-xs text-[#c7d5e0] hover:text-white px-3 py-1.5 rounded border border-[#2d3844] transition-colors cursor-pointer self-start sm:self-auto">
          Customize, Explore by Tag, & More
        </button>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Arrows */}
        {totalPages > 1 && (
          <>
            <button
              onClick={() => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 p-2 text-gray-300 hover:text-white bg-black/80 hover:bg-black rounded cursor-pointer transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 p-2 text-gray-300 hover:text-white bg-black/80 hover:bg-black rounded cursor-pointer transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 5 Cards Row matching Image 2 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {visibleGames.map((game) => {
            const priceText = game.isFreeToPlay
              ? game.tags.includes('Free to Play') ? 'Free To Play' : 'Free'
              : `₹ ${game.originalPrice.toLocaleString('en-IN')}`;

            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="bg-[#101822] border border-[#212b36] hover:border-[#66c0f4] rounded overflow-hidden cursor-pointer group transition-all duration-200 shadow-md flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={game.bannerImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Price Tag pill overlayed bottom right matching Image 2 */}
                  <div className="absolute bottom-1 right-1 bg-[#000000]/85 text-[#c7d5e0] text-xs font-bold px-2 py-0.5 rounded shadow">
                    {priceText}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0e141b] border-t border-[#1f2933]">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-[#66c0f4]">
                    {game.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination dots matching Image 2 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-1.5 mt-3">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentPage === idx ? 'w-6 bg-[#66c0f4]' : 'w-2 bg-[#212b36]'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
