'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSolarStore } from '@/store/useSolarStore';
import { spaceAudio } from '@/utils/audio';
import { Sparkles, Compass } from 'lucide-react';

export function LoadingScreen() {
  const hasEntered = useSolarStore((s) => s.hasEnteredExperience);
  const enterExperience = useSolarStore((s) => s.enterExperience);
  const toggleAudio = useSolarStore((s) => s.toggleAudio);

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing spatial matrix...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 5;
        if (next > 30 && next < 60) setStatusText('Loading planetary assets & shaders...');
        if (next >= 60 && next < 90) setStatusText('Synchronizing orbital mechanics...');
        if (next >= 90) setStatusText('System ready for entry.');
        return next > 100 ? 100 : next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    toggleAudio();
    spaceAudio.setMuted(false);
    spaceAudio.playClickSound();
    enterExperience();
  };

  if (hasEntered) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      >
        {/* Background Grid Particles Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center space-x-3 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-lg shadow-cyan-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>METAVERSE SOLAR OS v2.5</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2 font-mono">
            SOLAR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">SYSTEM</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-mono tracking-wider mb-10">
            CINEMATIC SPATIAL EXPLORATION EXPERIENCE
          </p>

          {progress < 100 ? (
            /* Progress Bar */
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50 mb-3">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between w-full text-xs font-mono text-slate-500">
                <span>{statusText}</span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
            </div>
          ) : (
            /* Enter Gateway Button */
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEnter}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-mono text-sm tracking-widest uppercase font-bold shadow-xl shadow-cyan-500/25 border border-cyan-300/40 hover:border-cyan-200 transition-all flex items-center space-x-3 cursor-pointer"
            >
              <Compass className="w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: '6s' }} />
              <span>ENTER THE SOLAR SYSTEM</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
