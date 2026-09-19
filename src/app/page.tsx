'use client';

import { SceneCanvas } from '@/components/3d/SceneCanvas';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { TopNav } from '@/components/ui/TopNav';
import { ControlBar } from '@/components/ui/ControlBar';
import { PlanetPanel } from '@/components/ui/PlanetPanel';
import { SearchModal } from '@/components/ui/SearchModal';
import { TimelineView } from '@/components/ui/TimelineView';
import { MissionPanel } from '@/components/ui/MissionPanel';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* 3D WebGL Metaverse Canvas Engine */}
      <SceneCanvas />

      {/* Futuristic HUD UI Overlays */}
      <TopNav />
      <ControlBar />
      <PlanetPanel />
      <SearchModal />
      <TimelineView />
      <MissionPanel />

      {/* Metaverse Entry & Preloader */}
      <LoadingScreen />
    </main>
  );
}
