import { create } from 'zustand';
import { QualityPreset, NavTab, CelestialBody } from '@/types/solar';
import { PLANETS_DATA, SUN_DATA } from '@/data/planets';

interface SolarStoreState {
  // Navigation & Active Screen
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Selected Object / Focus
  selectedBodyId: string | null; // e.g. 'earth', 'sun', 'saturn'
  hoveredBodyId: string | null;
  selectBody: (id: string | null) => void;
  setHoveredBody: (id: string | null) => void;

  // Camera Focus Target signal (forces camera update)
  cameraFocusSignal: number;
  triggerCameraFocus: (id: string) => void;

  // Simulation Controls
  isPlaying: boolean;
  simulationSpeed: number; // 0.1 to 5.0
  showOrbits: boolean;
  showLabels: boolean;
  togglePlay: () => void;
  setSimulationSpeed: (speed: number) => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;

  // Modals & UI Toggles
  isSearchOpen: boolean;
  isAudioMuted: boolean;
  isImmersiveMode: boolean;
  hasEnteredExperience: boolean;
  setSearchOpen: (open: boolean) => void;
  toggleAudio: () => void;
  toggleImmersiveMode: () => void;
  enterExperience: () => void;

  // Quality & Graphics Settings
  qualityPreset: QualityPreset;
  setQualityPreset: (preset: QualityPreset) => void;

  // Helpers
  getSelectedBodyData: () => CelestialBody | null;
}

export const useSolarStore = create<SolarStoreState>((set, get) => ({
  activeTab: 'solar_system',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedBodyId: null,
  hoveredBodyId: null,
  selectBody: (id) => {
    set({
      selectedBodyId: id,
      cameraFocusSignal: Date.now()
    });
  },
  setHoveredBody: (id) => set({ hoveredBodyId: id }),

  cameraFocusSignal: 0,
  triggerCameraFocus: (id) => set({ selectedBodyId: id, cameraFocusSignal: Date.now() }),

  isPlaying: true,
  simulationSpeed: 1.0,
  showOrbits: true,
  showLabels: true,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),

  isSearchOpen: false,
  isAudioMuted: true,
  isImmersiveMode: false,
  hasEnteredExperience: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  toggleImmersiveMode: () => set((state) => ({ isImmersiveMode: !state.isImmersiveMode })),
  enterExperience: () => set({ hasEnteredExperience: true }),

  qualityPreset: 'high',
  setQualityPreset: (preset) => set({ qualityPreset: preset }),

  getSelectedBodyData: () => {
    const id = get().selectedBodyId;
    if (!id) return null;
    if (id === 'sun') return SUN_DATA;
    return PLANETS_DATA.find((p) => p.id === id) || null;
  }
}));
