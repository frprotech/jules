'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';
import { spaceAudio } from '@/utils/audio';
import { Globe2, Navigation, X } from 'lucide-react';

export function PlanetDrawer() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);
  const selectedBodyId = useSolarStore((s) => s.selectedBodyId);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  if (isImmersiveMode || activeTab !== 'planets') return null;

  const allBodies = [SUN_DATA, ...PLANETS_DATA];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        className="fixed inset-x-4 bottom-24 z-30 max-w-6xl mx-auto p-5 rounded-3xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl text-white select-none"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold tracking-wider uppercase">
              CELESTIAL DIRECTORY & FLY-TO
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('solar_system');
              spaceAudio.playClickSound();
            }}
            className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Planet Cards Carousel */}
        <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {allBodies.map((body) => {
            const isSelected = selectedBodyId === body.id;
            const isSun = body.id === 'sun';

            return (
              <div
                key={body.id}
                onClick={() => {
                  selectBody(body.id);
                  spaceAudio.playSelectSound();
                }}
                className={`flex-none w-44 p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105'
                    : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow-inner"
                      style={{ backgroundColor: body.color }}
                    />
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300">
                      {isSun ? 'Star' : body.type.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-mono font-bold text-white mb-0.5">{body.name}</h3>
                  <div className="text-[10px] text-cyan-400 font-mono mb-2">
                    {isSun ? 'Center' : `${body.distanceFromSunAU} AU`}
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400 font-semibold group-hover:text-cyan-300">
                  <Navigation className="w-3 h-3 text-cyan-400" />
                  <span>Target Object</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
