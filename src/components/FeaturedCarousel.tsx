import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { Game } from '../types';

interface FeaturedCarouselProps {
  featuredGames: Game[];
  onSelectGame: (game: Game) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  featuredGames,
  onSelectGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredScreenshotIndex, setHoveredScreenshotIndex] = useState<number | null>(null);

  const currentGame = featuredGames[currentIndex] || featuredGames[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
      setHoveredScreenshotIndex(null);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredGames.length]);

  if (!currentGame) return null;

  const activeMainImage = 
    hoveredScreenshotIndex !== null && currentGame.screenshots[hoveredScreenshotIndex]
      ? currentGame.screenshots[hoveredScreenshotIndex].url
      : currentGame.heroImage;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
    setHoveredScreenshotIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    setHoveredScreenshotIndex(null);
  };

  const finalPrice = currentGame.isFreeToPlay
    ? 'Free To Play'
    : currentGame.discountPercent > 0
    ? `₹ ${(currentGame.originalPrice * (1 - currentGame.discountPercent / 100)).toLocaleString('en-IN')}`
    : `₹ ${currentGame.originalPrice.toLocaleString('en-IN')}`;

  return (
    <section className="relative my-6 max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white tracking-wide">Featured & Recommended</h2>
        
        {/* Send a Gift Card Button matching Image 1 */}
        <button className="flex items-center space-x-2 bg-gradient-to-r from-[#1b2838] to-[#2a475e] hover:from-[#2a475e] hover:to-[#1b2838] text-xs text-[#66c0f4] hover:text-white px-3 py-1.5 rounded border border-[#66c0f4]/30 shadow transition-all cursor-pointer">
          <div className="flex -space-x-1">
            <span className="bg-[#66c0f4] text-[#171a21] text-[9px] font-bold px-1 rounded shadow">₹120</span>
            <span className="bg-[#1a9fff] text-white text-[9px] font-bold px-1 rounded shadow">₹500</span>
          </div>
          <Gift className="w-3.5 h-3.5 text-[#66c0f4]" />
          <span className="font-semibold">Send a Gift Card</span>
        </button>
      </div>

      {/* Hero Carousel Main Container */}
      <div className="relative group">
        {/* Left Nav Arrow */}
        <button
          onClick={handlePrev}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 p-3 text-gray-400 hover:text-white bg-gradient-to-r from-black/80 to-transparent hover:from-black rounded-r-lg cursor-pointer transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Main Card Grid */}
        <div 
          onClick={() => onSelectGame(currentGame)}
          className="bg-[#0f1922] border border-[#212b36] hover:border-[#66c0f4]/50 rounded shadow-2xl overflow-hidden cursor-pointer grid grid-cols-1 lg:grid-cols-12 transition-all duration-300 min-h-[380px]"
        >
          {/* Main Large Banner Display (Left 8 columns) */}
          <div className="lg:col-span-8 relative bg-black flex items-center justify-center overflow-hidden">
            <img
              src={activeMainImage}
              alt={currentGame.title}
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />
            {/* Title / Logo banner overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
              <span className="text-3xl font-black text-white tracking-wider drop-shadow-md uppercase">
                {currentGame.title}
              </span>
            </div>
          </div>

          {/* Right Info Sidebar (Right 4 columns) matching Image 1 */}
          <div className="lg:col-span-4 bg-[#0e141b] p-5 flex flex-col justify-between border-l border-[#1f2933]">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1.5 truncate">{currentGame.title}</h3>
              
              {/* Reviews line */}
              <div className="text-xs mb-4">
                <span className="text-[#8f98a0]">Overall User Reviews: </span>
                <span className="text-[#66c0f4] font-semibold">{currentGame.reviewSummary}</span>
                <span className="text-[#8f98a0]"> ({currentGame.reviewCount.toLocaleString('en-IN')} Reviews)</span>
              </div>

              {/* 4 Screenshots Grid (2x2) */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {currentGame.screenshots.slice(0, 4).map((shot, idx) => (
                  <div
                    key={shot.id}
                    onMouseEnter={() => setHoveredScreenshotIndex(idx)}
                    onMouseLeave={() => setHoveredScreenshotIndex(null)}
                    className={`relative rounded overflow-hidden aspect-video border transition-all ${
                      hoveredScreenshotIndex === idx ? 'border-[#66c0f4] ring-2 ring-[#66c0f4]/50 scale-105 z-10' : 'border-[#212b36] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={shot.url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Reason / Tags section */}
              <div className="bg-[#171a21]/80 rounded p-2.5 border border-[#25303d] text-xs mb-3">
                <p className="text-[#a4d007] font-medium text-[11px] mb-1.5">
                  {currentGame.recommendationReason || 'Recommended because you play similar games'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {currentGame.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="bg-[#212b36] text-[#c7d5e0] px-2 py-0.5 rounded text-[10px] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Price & Discount Badge matching Image 1 */}
            <div className="flex items-center justify-between pt-3 border-t border-[#1f2933]">
              <span className="text-xs text-[#8f98a0]">Now Available</span>
              <div className="flex items-center space-x-1">
                {currentGame.discountPercent > 0 && (
                  <div className="bg-[#a4d007] text-[#171a21] font-extrabold text-sm px-2 py-1 rounded-s">
                    -{currentGame.discountPercent}%
                  </div>
                )}
                <div className="bg-[#000000]/60 px-3 py-1 rounded-e text-right">
                  {currentGame.discountPercent > 0 && (
                    <div className="text-[10px] text-[#7193a6] line-through">
                      ₹ {currentGame.originalPrice.toLocaleString('en-IN')}
                    </div>
                  )}
                  <div className="text-sm font-bold text-[#bcee6d] leading-none">
                    {finalPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Nav Arrow */}
        <button
          onClick={handleNext}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 p-3 text-gray-400 hover:text-white bg-gradient-to-l from-black/80 to-transparent hover:from-black rounded-l-lg cursor-pointer transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Pagination Dots below Hero */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        {featuredGames.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentIndex(idx); setHoveredScreenshotIndex(null); }}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentIndex === idx 
                ? 'w-8 bg-[#66c0f4]' 
                : 'w-2 bg-[#212b36] hover:bg-[#384858]'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
