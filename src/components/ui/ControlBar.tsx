'use client';

import { useSolarStore } from '@/store/useSolarStore';
import { spaceAudio } from '@/utils/audio';
import {
  Play,
  Pause,
  Orbit,
  Tag,
  RotateCcw,
  Eye,
  FastForward
} from 'lucide-react';

export function ControlBar() {
  const isPlaying = useSolarStore((s) => s.isPlaying);
  const togglePlay = useSolarStore((s) => s.togglePlay);
  const simulationSpeed = useSolarStore((s) => s.simulationSpeed);
  const setSimulationSpeed = useSolarStore((s) => s.setSimulationSpeed);
  const showOrbits = useSolarStore((s) => s.showOrbits);
  const toggleOrbits = useSolarStore((s) => s.toggleOrbits);
  const showLabels = useSolarStore((s) => s.showLabels);
  const toggleLabels = useSolarStore((s) => s.toggleLabels);
  const selectBody = useSolarStore((s) => s.selectBody);
  const isImmersiveMode = useSolarStore((s) => s.isImmersiveMode);
  const toggleImmersiveMode = useSolarStore((s) => s.toggleImmersiveMode);

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 select-none max-w-[95vw]">
      <div className="flex items-center space-x-1.5 sm:space-x-2 p-1.5 sm:p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-2xl shadow-cyan-950/20">
        {/* Play/Pause */}
        <button
          type="button"
          aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          onClick={() => {
            togglePlay();
            spaceAudio.playClickSound();
          }}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/50 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
          title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Speed Toggle */}
        <button
          type="button"
          aria-label="Adjust simulation speed"
          onClick={() => {
            const speeds = [0.2, 0.5, 1.0, 2.0, 4.0];
            const nextIdx = (speeds.indexOf(simulationSpeed) + 1) % speeds.length;
            setSimulationSpeed(speeds[nextIdx]);
            spaceAudio.playClickSound();
          }}
          className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/50 text-slate-300 font-mono text-xs flex items-center space-x-1 cursor-pointer"
          title="Adjust Simulation Speed"
        >
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
          <span>{simulationSpeed}x</span>
        </button>

        <div className="w-px h-5 bg-slate-800 my-auto" />

        {/* Orbit Lines Toggle */}
        <button
          type="button"
          aria-label="Toggle Orbit Lines"
          onClick={() => {
            toggleOrbits();
            spaceAudio.playClickSound();
          }}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
            showOrbits
              ? 'bg-cyan-950/90 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Orbit Lines"
        >
          <Orbit className="w-4 h-4" />
        </button>

        {/* Labels Toggle */}
        <button
          type="button"
          aria-label="Toggle Celestial Labels"
          onClick={() => {
            toggleLabels();
            spaceAudio.playClickSound();
          }}
          className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
            showLabels
              ? 'bg-cyan-950/90 border-cyan-500/50 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Celestial Labels"
        >
          <Tag className="w-4 h-4" />
        </button>

        {/* Reset Overview Camera */}
        <button
          type="button"
          aria-label="Reset Camera Overview"
          onClick={() => {
            selectBody(null);
            spaceAudio.playClickSound();
          }}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
          title="Reset Camera Overview"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 my-auto" />

        {/* Immersive Viewport Mode */}
        <button
          type="button"
          aria-label="Toggle Immersive Mode"
          onClick={() => {
            toggleImmersiveMode();
            spaceAudio.playClickSound();
          }}
          className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
            isImmersiveMode
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Immersive Mode (Hide UI)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isImmersiveMode ? 'EXIT IMMERSIVE' : 'IMMERSIVE'}</span>
        </button>
      </div>
    </div>
  );
}
