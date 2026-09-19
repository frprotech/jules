export interface MoonData {
  id: string;
  name: string;
  radius: number; // visual scale relative to planet
  distance: number; // visual orbit radius from parent planet
  orbitSpeed: number; // visual rotation speed
  color: string;
  details?: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf';
  tagline: string;
  description: string;
  radius: number; // visual scale
  realRadiusKm: number;
  orbitRadius: number; // visual x/z position from Sun
  orbitSpeed: number; // visual rotation speed around Sun
  rotationSpeed: number; // axial rotation speed
  axialTilt: number; // degrees
  color: string;
  atmosphereColor?: string;
  hasRings?: boolean;
  textureType: 'sun' | 'rocky' | 'earth' | 'gas' | 'ice';
  distanceFromSunAU: number;
  diameterKm: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceTempC: number | { min: number; max: number };
  moonsCount: number;
  moonsList: MoonData[];
  funFacts: string[];
}

export interface SpaceMission {
  id: string;
  name: string;
  agency: string;
  targetBodyId: string;
  launchYear: number;
  status: 'active' | 'completed' | 'planned';
  description: string;
  keyAchievements: string[];
  imageUrl?: string;
}

export interface TimelineMilestone {
  id: string;
  year: number;
  title: string;
  subtitle: string;
  description: string;
  targetBodyId?: string;
  category: 'satellite' | 'crewed' | 'probe' | 'telescope' | 'rover';
}

export type QualityPreset = 'ultra' | 'high' | 'medium' | 'low';
export type NavTab = 'explore' | 'solar_system' | 'planets' | 'missions' | 'timeline';
