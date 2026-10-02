'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { MISSIONS_DATA } from '@/data/missions';
import { spaceAudio } from '@/utils/audio';
import { Rocket, CheckCircle2, Navigation, X } from 'lucide-react';

export function MissionPanel() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  if (isImmersiveMode || activeTab !== 'missions') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="fixed inset-x-3 sm:inset-x-6 top-16 sm:top-20 bottom-20 sm:bottom-24 z-30 max-w-5xl mx-auto p-4 sm:p-6 rounded-3xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl overflow-y-auto text-white select-none scrollbar-thin"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Rocket className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-400 animate-bounce" />
            <div>
              <h2 className="text-base sm:text-xl font-mono font-bold tracking-wider">
                FLAGSHIP DEEP SPACE MISSIONS
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                Explore humanity’s greatest robotic and crewed voyages across the Solar System.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('solar_system');
              spaceAudio.playClickSound();
            }}
            className="p-1.5 sm:p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>

        {/* Grid of Missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {MISSIONS_DATA.map((mission) => (
            <div
              key={mission.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase">
                    {mission.agency}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                      mission.status === 'active'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {mission.status}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-mono font-bold text-white mb-1">{mission.name}</h3>
                <div className="text-xs font-mono text-slate-400 mb-3">Launch Year: {mission.launchYear}</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{mission.description}</p>

                <div className="space-y-1.5 mb-4">
                  {mission.keyAchievements.map((achievement, i) => (
                    <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  selectBody(mission.targetBodyId);
                  setActiveTab('solar_system');
                  spaceAudio.playSelectSound();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Locate Target</span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
