'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { TIMELINE_DATA } from '@/data/timeline';
import { spaceAudio } from '@/utils/audio';
import { Clock, Calendar, X } from 'lucide-react';

export function TimelineView() {
  const activeTab = useSolarStore((s) => s.activeTab);
  const setActiveTab = useSolarStore((s) => s.setActiveTab);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  if (isImmersiveMode || activeTab !== 'timeline') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed inset-x-6 bottom-24 z-30 max-w-5xl mx-auto p-6 rounded-3xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-2xl shadow-2xl text-white select-none"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-mono font-bold tracking-wider">
              SPACE EXPLORATION MILESTONES
            </h2>
          </div>
          <button
            onClick={() => {
              setActiveTab('solar_system');
              spaceAudio.playClickSound();
            }}
            className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Timeline Scroll */}
        <div className="flex space-x-4 overflow-x-auto pb-3 pt-2 scrollbar-thin">
          {TIMELINE_DATA.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.targetBodyId) selectBody(item.targetBodyId);
                spaceAudio.playSelectSound();
              }}
              className="flex-none w-72 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-bold">{item.year}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 uppercase">
                  {item.category}
                </span>
              </div>
              <h3 className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 mb-1">
                {item.title}
              </h3>
              <div className="text-xs text-cyan-400/80 font-mono mb-2">{item.subtitle}</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
