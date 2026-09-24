'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';
import { MISSIONS_DATA } from '@/data/missions';
import { spaceAudio } from '@/utils/audio';
import { Search, Globe2, Rocket, X } from 'lucide-react';

export function SearchModal() {
  const isOpen = useSolarStore((s) => s.isSearchOpen);
  const setSearchOpen = useSolarStore((s) => s.setSearchOpen);
  const selectBody = useSolarStore((s) => s.selectBody);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);

  const [query, setQuery] = useState('');

  // Global Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!useSolarStore.getState().isSearchOpen);
      }
      if (e.key === 'Escape') {
        if (useSolarStore.getState().isSearchOpen) {
          setSearchOpen(false);
        } else {
          selectBody(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen, selectBody]);

  if (!isOpen) return null;

  const allBodies = [SUN_DATA, ...PLANETS_DATA];
  const filteredBodies = allBodies.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.type.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMissions = MISSIONS_DATA.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.agency.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 md:pt-20 p-4 select-none"
        onClick={() => setSearchOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-4 md:p-6 overflow-hidden text-white"
        >
          {/* Search Input Header */}
          <div className="relative mb-4 md:mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search celestial bodies, planets, or space missions... (Cmd+K)"
              autoFocus
              className="w-full pl-12 pr-12 py-3 md:py-3.5 bg-slate-900 rounded-2xl border border-slate-700/80 text-white font-mono text-xs md:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 md:max-h-96 overflow-y-auto space-y-4 scrollbar-thin pr-1">
            {/* Celestial Bodies */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
                Celestial Objects ({filteredBodies.length})
              </h3>
              <div className="space-y-1.5">
                {filteredBodies.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      selectBody(b.id);
                      setSearchOpen(false);
                      spaceAudio.playSelectSound();
                    }}
                    className="p-3 rounded-2xl bg-slate-900/60 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-sm font-mono font-bold text-white">{b.name}</div>
                        <div className="text-xs text-slate-400 hidden sm:block">{b.tagline}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {b.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Space Missions */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">
                Space Missions ({filteredMissions.length})
              </h3>
              <div className="space-y-1.5">
                {filteredMissions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveTab('missions');
                      setSearchOpen(false);
                      spaceAudio.playSelectSound();
                    }}
                    className="p-3 rounded-2xl bg-slate-900/60 hover:bg-cyan-950/80 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <div className="text-sm font-mono font-bold text-white">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.agency} • Launch: {m.launchYear}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 shrink-0">
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
