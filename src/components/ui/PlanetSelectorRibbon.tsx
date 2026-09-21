'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';
import { spaceAudio } from '@/utils/audio';
import { Compass } from 'lucide-react';

export function PlanetSelectorRibbon() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  if (isImmersiveMode || (activeTab !== 'planets' && activeTab !== 'explore')) {
    return null;
  }

  const allCelestial = [SUN_DATA, ...PLANETS_DATA];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-30 max-w-4xl w-[90%] select-none"
      >
        <div className="flex items-center space-x-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-xl shadow-2xl overflow-x-auto scrollbar-thin">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 text-cyan-400 font-mono text-xs shrink-0">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="font-bold hidden sm:inline uppercase tracking-wider">NAVIGATE:</span>
          </div>

          {allCelestial.map((body) => {
            const isSelected = selectedBodyId === body.id;
            return (
              <button
                key={body.id}
                onClick={() => {
                  selectBody(body.id);
                  spaceAudio.playSelectSound();
                }}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs tracking-wide shrink-0 transition-all cursor-pointer flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 shadow-lg shadow-cyan-500/20 font-bold scale-105'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: body.color }}
                />
                <span>{body.name}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
