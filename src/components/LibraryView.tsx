import React, { useState } from 'react';
import { Play, Download, Search, Clock, Trophy, Settings, Users, Star, ShieldCheck } from 'lucide-react';
import { Game } from '../types';

interface LibraryViewProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ games, onSelectGame }) => {
  const libraryGames = games.filter(g => g.installed || g.playtimeHours !== undefined || g.id === 'football-manager-2024' || g.id === 'black-myth-wukong' || g.id === 'cyberpunk-2077');
  const [selectedGameId, setSelectedGameId] = useState<string>(libraryGames[0]?.id || games[0].id);
  const [searchFilter, setSearchFilter] = useState('');

  const selectedGame = games.find(g => g.id === selectedGameId) || games[0];

  const filteredLibrary = libraryGames.filter(g =>
    g.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-[#171a21] min-h-screen text-[#c7d5e0] flex flex-col md:flex-row select-none">
      {/* Left Sidebar - Library Game Tree */}
      <aside className="w-full md:w-72 bg-[#10141d] border-r border-[#212b36] p-3 flex flex-col space-y-3 flex-shrink-0">
        <div className="flex items-center space-x-2 bg-[#1b222e] border border-[#2d3844] rounded px-2.5 py-1.5 text-xs">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search by name"
            className="bg-transparent w-full text-xs text-white placeholder-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <div className="text-[11px] font-bold text-[#556778] uppercase px-2 py-1 tracking-wider">
            INSTALLED ({filteredLibrary.length})
          </div>

          {filteredLibrary.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGameId(game.id)}
              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${
                selectedGameId === game.id
                  ? 'bg-[#2a475e] text-white font-bold'
                  : 'hover:bg-[#1b2838] text-[#c7d5e0]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="truncate flex-1 text-left">{game.title}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Library Game Overview Frame */}
      <main className="flex-1 bg-[#1b2838] overflow-y-auto">
        {selectedGame && (
          <div>
            {/* Top Game Hero Header */}
            <div className="relative h-72 bg-black overflow-hidden">
              <img
                src={selectedGame.heroImage}
                alt={selectedGame.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b2838] via-[#1b2838]/40 to-transparent" />

              <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-md mb-2">
                    {selectedGame.title}
                  </h1>
                  <p className="text-xs text-[#8f98a0]">
                    Developer: {selectedGame.developer} • Publisher: {selectedGame.publisher}
                  </p>
                </div>

                {/* Big Green PLAY Button */}
                <button
                  onClick={() => onSelectGame(selectedGame)}
                  className="bg-gradient-to-r from-[#a4d007] to-[#88b300] hover:from-[#bce31b] hover:to-[#a4d007] text-[#171a21] font-black text-lg px-8 py-3 rounded-md shadow-2xl flex items-center space-x-3 cursor-pointer transition-transform hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-[#171a21]" />
                  <span>PLAY</span>
                </button>
              </div>
            </div>

            {/* Game Stats Ribbon Bar */}
            <div className="bg-[#10141d] border-y border-[#212b36] px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-[#556778] font-semibold mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#66c0f4]" />
                  <span>TIME PLAYED</span>
                </p>
                <p className="text-white font-bold text-base">
                  {selectedGame.playtimeHours || 12.4} hours
                </p>
              </div>

              <div>
                <p className="text-[#556778] font-semibold mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#66c0f4]" />
                  <span>LAST PLAYED</span>
                </p>
                <p className="text-white font-bold text-base">
                  {selectedGame.lastPlayed || 'Yesterday'}
                </p>
              </div>

              <div>
                <p className="text-[#556778] font-semibold mb-1 flex items-center space-x-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>ACHIEVEMENTS</span>
                </p>
                <p className="text-white font-bold text-base">
                  {selectedGame.achievementsUnlocked || 15} / {selectedGame.totalAchievements || 45}
                </p>
              </div>

              <div>
                <p className="text-[#556778] font-semibold mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CLOUD STATUS</span>
                </p>
                <p className="text-emerald-400 font-bold text-base">
                  Up to date
                </p>
              </div>
            </div>

            {/* News & Activity Feed */}
            <div className="p-8 max-w-5xl space-y-6">
              <div className="bg-[#0e141b] border border-[#212b36] rounded p-6 shadow">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Recent Activity & Updates
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-[#1f2933] pb-3">
                    <span className="text-[10px] text-[#66c0f4] font-bold uppercase">MAJOR UPDATE</span>
                    <h4 className="text-sm font-bold text-white mt-1">Patch v1.4.2 Released — Performance Optimizations</h4>
                    <p className="text-xs text-[#8f98a0] mt-1">Improved frame pacing on high refresh rate displays and updated matchmaking stability.</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">COMMUNITY NEWS</span>
                    <h4 className="text-sm font-bold text-white mt-1">Global Community Tournament Announced</h4>
                    <p className="text-xs text-[#8f98a0] mt-1">Join players worldwide for competitive leaderboard prizes this weekend.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
