import React, { useState } from 'react';
import { 
  X, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle, 
  Lightbulb, 
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';

interface PMCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToDiscovery: () => void;
}

export const PMCaseStudyModal: React.FC<PMCaseStudyModalProps> = ({
  isOpen,
  onClose,
  onJumpToDiscovery,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'principles'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#17202c] border-2 border-[#1a9fff]/50 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#121a24] border-b border-[#212f3f] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#1a9fff]/20 border border-[#1a9fff]/50 flex items-center justify-center text-[#1a9fff]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">
                Product Management Case Study Prototype
              </h2>
              <p className="text-xs text-[#8f98a0]">
                Steam Redesign • Target Persona: "Weekend Discovery Seeker"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1e2a38] text-[#8f98a0] hover:text-white hover:bg-[#2a3c50] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#212f3f] bg-[#141e2b] px-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#1a9fff] text-[#1a9fff]'
                : 'border-transparent text-[#8f98a0] hover:text-white'
            }`}
          >
            1. Persona & Core Problem (P0)
          </button>
          <button
            onClick={() => setActiveTab('principles')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'principles'
                ? 'border-[#1a9fff] text-[#1a9fff]'
                : 'border-transparent text-[#8f98a0] hover:text-white'
            }`}
          >
            2. Solution Architecture
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'metrics'
                ? 'border-[#1a9fff] text-[#1a9fff]'
                : 'border-transparent text-[#8f98a0] hover:text-white'
            }`}
          >
            3. Success Metrics & Guardrails
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#c7d5e0]">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Persona Breakdown Card */}
              <div className="bg-[#0f1722] border border-[#212f3f] rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <Target className="w-4 h-4" />
                  <span>Target User: "Weekend Discovery Seeker"</span>
                </div>
                <p className="text-xs text-[#9bb3c7] leading-relaxed">
                  Casual/weekend gamers who play when free time allows. They use gaming as a mental break, own a few familiar staples (e.g. EA SPORTS FC, CS2), but actively desire to discover fresh titles outside their usual habits.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-[#16212e] p-2 rounded border border-[#213144]">
                    <strong className="text-white">Behavior:</strong> Sees interesting games on YouTube/Shorts, searches on Steam, but gets lost in hundreds of banners.
                  </div>
                  <div className="bg-[#16212e] p-2 rounded border border-[#213144]">
                    <strong className="text-white">Friction:</strong> Overwhelmed by massive sales grids & complex tags; default fallback is returning to repetitive games.
                  </div>
                </div>
              </div>

              {/* Core P0 Problem */}
              <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Core Problem (P0)</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  Weekend Discovery Seekers struggle to discover interesting games outside their usual choices because Steam presents a vast amount of information with no intent-matching or controlled novelty.
                </p>
                <div className="bg-black/30 p-2.5 rounded border border-amber-500/20 text-[11px]">
                  <strong>Desired Outcome:</strong> Not simply <em>"Users see more recommendations"</em>, but <strong>"Users discover and play games they would not normally have chosen."</strong>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'principles' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Weekend Discovery */}
                <div className="bg-[#0f1722] border border-[#212f3f] rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#66c0f4] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>1. Weekend Discovery Mode</span>
                  </div>
                  <p className="text-[11px] text-[#8f98a0]">
                    Small curated set of <strong>5–7 games</strong> matching simple intents (Relax, Competitive, Story-driven, Something Different).
                  </p>
                </div>

                {/* 2. Different From Usual */}
                <div className="bg-[#0f1722] border border-[#212f3f] rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Lightbulb className="w-4 h-4" />
                    <span>2. Controlled Novelty</span>
                  </div>
                  <p className="text-[11px] text-[#8f98a0]">
                    Takes player's habitual FPS/Sports background and introduces fresh genres (deduction, cosmic mysteries) with shared underlying mechanics.
                  </p>
                </div>

                {/* 3. Short Discovery Cards */}
                <div className="bg-[#0f1722] border border-[#212f3f] rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <Layers className="w-4 h-4" />
                    <span>3. Short Discovery Cards</span>
                  </div>
                  <p className="text-[11px] text-[#8f98a0]">
                    Scannable in seconds: Artwork, Title, Genre, Rating, Price, Playtime (~X hours), and PC compatibility verified.
                  </p>
                </div>

                {/* 4. Why This Game */}
                <div className="bg-[#0f1722] border border-[#212f3f] rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>4. "Why This Game?"</span>
                  </div>
                  <p className="text-[11px] text-[#8f98a0]">
                    Transparent rationale connecting user's time commitment and playstyle to boost recommendation trust.
                  </p>
                </div>

              </div>

              {/* Design Principle: Reduce Noise */}
              <div className="bg-[#121a24] border border-[#223344] rounded-xl p-4">
                <h4 className="text-white font-bold text-xs mb-1">Design Formula:</h4>
                <div className="text-sm font-mono text-cyan-300 bg-black/40 p-2.5 rounded border border-[#223344] text-center">
                  Less Information + Better Curation + Controlled Novelty = Better Discovery
                </div>
              </div>

            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              
              {/* Primary Metric */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>PRIMARY SUCCESS METRIC</span>
                </div>
                <div className="text-sm font-black text-white">
                  New Game Discovery Rate
                </div>
                <p className="text-xs text-emerald-200/80">
                  <strong>Definition:</strong> % of Weekend Discovery Mode users who launch/play at least one previously unplayed game discovered through the feature during that weekend.
                </p>
              </div>

              {/* Secondary Metrics */}
              <div className="bg-[#0f1722] border border-[#212f3f] rounded-xl p-4 space-y-3">
                <h4 className="text-white font-bold text-xs">Secondary Engagement Metrics:</h4>
                <ul className="space-y-2 text-[11px] text-[#9bb3c7]">
                  <li className="flex items-start space-x-2">
                    <span className="text-[#66c0f4] font-bold">•</span>
                    <span><strong>Discovery Mode Adoption Rate:</strong> % of active weekend Steam sessions that open Weekend Discovery.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#66c0f4] font-bold">•</span>
                    <span><strong>Games Explored Per Session:</strong> Average number of Short Discovery Cards expanded or explored.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-[#66c0f4] font-bold">•</span>
                    <span><strong>Return-to-Discovery Rate:</strong> % of users re-engaging with Weekend Discovery on consecutive weekends.</span>
                  </li>
                </ul>
              </div>

              {/* Guardrails */}
              <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>GUARDRAIL METRICS</span>
                </div>
                <ul className="space-y-1 text-[11px] text-rose-200/80">
                  <li>• <strong>Recommendation Dismissal Rate:</strong> Monitor if recommendations feel irrelevant or forced.</li>
                  <li>• <strong>Existing Game Engagement:</strong> Ensure discovery does not cannibalize organic engagement with regular social titles.</li>
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#121a24] border-t border-[#212f3f] px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-[#8f98a0]">
            Prepared for Steam Product Leadership
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1e2a38] hover:bg-[#2a3c50] text-[#c7d5e0] rounded-lg text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onJumpToDiscovery();
              }}
              className="px-5 py-2 bg-[#1a9fff] hover:bg-[#66c0f4] text-[#11161f] rounded-lg text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow"
            >
              <span>Test Weekend Discovery Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
