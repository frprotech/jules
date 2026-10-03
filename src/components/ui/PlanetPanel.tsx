'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { spaceAudio } from '@/utils/audio';
import { X, Globe2, Thermometer, Orbit, Clock, Sparkles } from 'lucide-react';

export function PlanetPanel() {
  const getSelectedBodyData = useSolarStore((s) => s.getSelectedBodyData);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);

  const body = getSelectedBodyData();

  if (isImmersiveMode || !body) return null;

  const tempDisplay =
    typeof body.surfaceTempC === 'number'
      ? `${body.surfaceTempC}°C`
      : `${body.surfaceTempC.min}°C to ${body.surfaceTempC.max}°C`;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-20 right-3 sm:right-6 left-3 sm:left-auto bottom-24 z-30 w-auto sm:w-80 md:w-96 p-6 rounded-3xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-xl shadow-2xl shadow-cyan-950/30 overflow-y-auto text-white select-none scrollbar-thin"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            selectBody(null);
            spaceAudio.playClickSound();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Name */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{body.type.replace('_', ' ')}</span>
          </div>
          <h2 className="text-3xl font-extrabold font-mono tracking-tight text-white mb-1">
            {body.name}
          </h2>
          <p className="text-cyan-400 text-xs font-mono italic">{body.tagline}</p>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-xs leading-relaxed mb-6 font-sans">
          {body.description}
        </p>

        {/* Key Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 font-mono">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase mb-1">
              <Orbit className="w-3 h-3 text-cyan-400" />
              <span>Distance</span>
            </div>
            <div className="text-sm font-bold text-white">{body.distanceFromSunAU} AU</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase mb-1">
              <Thermometer className="w-3 h-3 text-amber-400" />
              <span>Surface Temp</span>
            </div>
            <div className="text-sm font-bold text-white">{tempDisplay}</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase mb-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Orbital Period</span>
            </div>
            <div className="text-sm font-bold text-white">{body.orbitalPeriodDays} Days</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase mb-1">
              <Globe2 className="w-3 h-3 text-emerald-400" />
              <span>Moons</span>
            </div>
            <div className="text-sm font-bold text-white">{body.moonsCount}</div>
          </div>
        </div>

        {/* Moons List if available */}
        {body.moonsList.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-2">
              <span>Major Satellites</span>
            </h3>
            <div className="space-y-2">
              {body.moonsList.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="text-xs font-mono font-bold text-cyan-300">{m.name}</div>
                  {m.details && <div className="text-[11px] text-slate-400 mt-0.5">{m.details}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Cosmic Archives</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {body.funFacts.map((fact, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 leading-relaxed">
                • {fact}
              </li>
            ))}
          </ul>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
