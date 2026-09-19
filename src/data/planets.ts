import { CelestialBody } from '@/types/solar';

export const SUN_DATA: CelestialBody = {
  id: 'sun',
  name: 'The Sun',
  type: 'star',
  tagline: 'Heart of the Solar System',
  description: 'The Sun is a yellow dwarf star, a hot ball of glowing gases at the heart of our solar system. Its gravity holds the solar system together, keeping everything from the biggest planets to the smallest particles of debris in its orbit.',
  radius: 6.5,
  realRadiusKm: 696340,
  orbitRadius: 0,
  orbitSpeed: 0,
  rotationSpeed: 0.002,
  axialTilt: 7.25,
  color: '#ffaa11',
  atmosphereColor: '#ff6600',
  textureType: 'sun',
  distanceFromSunAU: 0,
  diameterKm: 1392700,
  orbitalPeriodDays: 0,
  rotationPeriodHours: 600, // ~25-35 Earth days
  surfaceTempC: 5500,
  moonsCount: 0,
  moonsList: [],
  funFacts: [
    'The Sun contains 99.86% of all mass in the Solar System.',
    'Light from the Sun takes approximately 8 minutes and 20 seconds to reach Earth.',
    'Core temperature reaches over 15 million degrees Celsius.'
  ]
};

export const PLANETS_DATA: CelestialBody[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'terrestrial',
    tagline: 'The Swift Iron World',
    description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun. Its surface is heavily cratered and similar in appearance to Earth\'s Moon.',
    radius: 0.9,
    realRadiusKm: 2439.7,
    orbitRadius: 14,
    orbitSpeed: 0.03,
    rotationSpeed: 0.004,
    axialTilt: 0.034,
    color: '#8c8c8c',
    atmosphereColor: '#a6a6a6',
    textureType: 'rocky',
    distanceFromSunAU: 0.39,
    diameterKm: 4879,
    orbitalPeriodDays: 88,
    rotationPeriodHours: 1407.6,
    surfaceTempC: { min: -180, max: 430 },
    moonsCount: 0,
    moonsList: [],
    funFacts: [
      'Despite being closest to the Sun, Mercury is not the hottest planet in our solar system.',
      'Mercury has no atmosphere, meaning it experiences no weather or season changes.',
      'A year on Mercury takes only 88 Earth days.'
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'terrestrial',
    tagline: 'The Veiled Furnace',
    description: 'Venus spins in the opposite direction from most other planets. It has a thick, toxic atmosphere filled with carbon dioxide and clouds of sulfuric acid.',
    radius: 1.4,
    realRadiusKm: 6051.8,
    orbitRadius: 21,
    orbitSpeed: 0.022,
    rotationSpeed: -0.002, // Retrograde
    axialTilt: 177.3,
    color: '#e3bb76',
    atmosphereColor: '#ffcb85',
    textureType: 'rocky',
    distanceFromSunAU: 0.72,
    diameterKm: 12104,
    orbitalPeriodDays: 224.7,
    rotationPeriodHours: 5832.5,
    surfaceTempC: 464,
    moonsCount: 0,
    moonsList: [],
    funFacts: [
      'Venus is the hottest planet in our solar system due to an extreme runaway greenhouse effect.',
      'A day on Venus is longer than a year on Venus.',
      'Venus rotates backwards compared to most other planets.'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'terrestrial',
    tagline: 'Oasis of Life',
    description: 'Our home planet is the third planet from the Sun, and the only place we know of so far that’s inhabited by living things.',
    radius: 1.6,
    realRadiusKm: 6371,
    orbitRadius: 30,
    orbitSpeed: 0.016,
    rotationSpeed: 0.01,
    axialTilt: 23.44,
    color: '#2b82c5',
    atmosphereColor: '#4da6ff',
    textureType: 'earth',
    distanceFromSunAU: 1.0,
    diameterKm: 12742,
    orbitalPeriodDays: 365.25,
    rotationPeriodHours: 23.93,
    surfaceTempC: { min: -89, max: 58 },
    moonsCount: 1,
    moonsList: [
      { id: 'luna', name: 'Moon', radius: 0.35, distance: 3.2, orbitSpeed: 0.04, color: '#d0d0d0', details: 'Earth\'s natural satellite' }
    ],
    funFacts: [
      'Earth is the only known planet with active liquid water oceans on its surface.',
      'Earth\'s atmosphere protects us from meteoroids and radiation while keeping the planet warm.',
      'Earth is not a perfect sphere; it bulges slightly at the equator due to rotation.'
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'terrestrial',
    tagline: 'The Red Frontier',
    description: 'Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was much warmer and wetter billions of years ago.',
    radius: 1.1,
    realRadiusKm: 3389.5,
    orbitRadius: 40,
    orbitSpeed: 0.012,
    rotationSpeed: 0.009,
    axialTilt: 25.19,
    color: '#c1440e',
    atmosphereColor: '#e06f3b',
    textureType: 'rocky',
    distanceFromSunAU: 1.52,
    diameterKm: 6779,
    orbitalPeriodDays: 687,
    rotationPeriodHours: 24.62,
    surfaceTempC: { min: -140, max: 20 },
    moonsCount: 2,
    moonsList: [
      { id: 'phobos', name: 'Phobos', radius: 0.15, distance: 2.0, orbitSpeed: 0.08, color: '#887766' },
      { id: 'deimos', name: 'Deimos', radius: 0.1, distance: 2.8, orbitSpeed: 0.05, color: '#776655' }
    ],
    funFacts: [
      'Mars is home to Olympus Mons, the largest volcano in the solar system (3x taller than Mt Everest).',
      'Mars gets its red color from iron oxide (rust) in its soil.',
      'Sunsets on Mars appear blue due to atmospheric dust scattering light.'
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'gas_giant',
    tagline: 'Monarch of Planets',
    description: 'Jupiter is more than twice as massive as all the other planets combined. The giant planet\'s Great Red Spot is a centuries-old storm larger than Earth.',
    radius: 3.4,
    realRadiusKm: 69911,
    orbitRadius: 55,
    orbitSpeed: 0.007,
    rotationSpeed: 0.02,
    axialTilt: 3.13,
    color: '#b07f35',
    atmosphereColor: '#d6a053',
    textureType: 'gas',
    distanceFromSunAU: 5.20,
    diameterKm: 139820,
    orbitalPeriodDays: 4333,
    rotationPeriodHours: 9.93,
    surfaceTempC: -110,
    moonsCount: 95,
    moonsList: [
      { id: 'io', name: 'Io', radius: 0.22, distance: 4.8, orbitSpeed: 0.06, color: '#e6c843', details: 'Most volcanically active body in solar system' },
      { id: 'europa', name: 'Europa', radius: 0.2, distance: 5.8, orbitSpeed: 0.045, color: '#c2c8d0', details: 'Subsurface liquid ocean beneath ice shell' },
      { id: 'ganymede', name: 'Ganymede', radius: 0.3, distance: 7.0, orbitSpeed: 0.03, color: '#908a82', details: 'Largest moon in the solar system' },
      { id: 'callisto', name: 'Callisto', radius: 0.28, distance: 8.2, orbitSpeed: 0.02, color: '#686058', details: 'Heavily cratered ancient ice surface' }
    ],
    funFacts: [
      'Jupiter has the shortest day in the solar system, rotating once every ~10 hours.',
      'Its magnetic field is 20,000 times stronger than Earth\'s.',
      'Jupiter\'s Great Red Spot is a storm that has raged for over 300 years.'
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'gas_giant',
    tagline: 'Jewel of the Cosmos',
    description: 'Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. It is a massive gas giant composed mainly of hydrogen and helium.',
    radius: 2.8,
    realRadiusKm: 58232,
    orbitRadius: 72,
    orbitSpeed: 0.005,
    rotationSpeed: 0.018,
    axialTilt: 26.73,
    color: '#e0c083',
    atmosphereColor: '#f2da9d',
    hasRings: true,
    textureType: 'gas',
    distanceFromSunAU: 9.58,
    diameterKm: 116460,
    orbitalPeriodDays: 10759,
    rotationPeriodHours: 10.7,
    surfaceTempC: -140,
    moonsCount: 146,
    moonsList: [
      { id: 'titan', name: 'Titan', radius: 0.32, distance: 6.5, orbitSpeed: 0.025, color: '#e3a832', details: 'Has thick atmosphere and liquid methane lakes' },
      { id: 'enceladus', name: 'Enceladus', radius: 0.18, distance: 5.0, orbitSpeed: 0.05, color: '#ffffff', details: 'Erupts water ice geysers into space' }
    ],
    funFacts: [
      'Saturn\'s ring system extends up to 282,000 km from the planet but is extremely thin (~10 meters).',
      'Saturn is the only planet in our solar system whose average density is less than water.',
      'Saturn\'s moon Titan is larger than Mercury and has a dense nitrogen atmosphere.'
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'ice_giant',
    tagline: 'The Sideways Ice Giant',
    description: 'Uranus is an ice giant with a pale cyan hue caused by methane gas. It rotates at a nearly 90-degree angle from the plane of its orbit, appearing to roll on its side.',
    radius: 2.1,
    realRadiusKm: 25362,
    orbitRadius: 88,
    orbitSpeed: 0.003,
    rotationSpeed: -0.012,
    axialTilt: 97.77,
    color: '#71cbe8',
    atmosphereColor: '#a1e4f7',
    hasRings: true,
    textureType: 'ice',
    distanceFromSunAU: 19.22,
    diameterKm: 50724,
    orbitalPeriodDays: 30687,
    rotationPeriodHours: 17.2,
    surfaceTempC: -195,
    moonsCount: 28,
    moonsList: [
      { id: 'miranda', name: 'Miranda', radius: 0.15, distance: 4.0, orbitSpeed: 0.04, color: '#a0a8b0' },
      { id: 'titania', name: 'Titania', radius: 0.2, distance: 5.2, orbitSpeed: 0.02, color: '#9098a0' }
    ],
    funFacts: [
      'Uranus hits the coldest temperatures of any planet in the solar system (-224°C).',
      'Its extreme tilt causes 42 years of continuous sunlight followed by 42 years of darkness at the poles.',
      'It was the first planet discovered using a telescope (by William Herschel in 1781).'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'ice_giant',
    tagline: 'Windswept Abyss',
    description: 'Dark, cold, and whipped by supersonic winds, ice giant Neptune is the most distant major planet in our solar system.',
    radius: 2.0,
    realRadiusKm: 24622,
    orbitRadius: 102,
    orbitSpeed: 0.002,
    rotationSpeed: 0.014,
    axialTilt: 28.32,
    color: '#2d62ed',
    atmosphereColor: '#5c87ff',
    hasRings: true,
    textureType: 'ice',
    distanceFromSunAU: 30.05,
    diameterKm: 49244,
    orbitalPeriodDays: 60190,
    rotationPeriodHours: 16.1,
    surfaceTempC: -200,
    moonsCount: 16,
    moonsList: [
      { id: 'triton', name: 'Triton', radius: 0.25, distance: 4.5, orbitSpeed: -0.03, color: '#bdc4cf', details: 'Orbits Neptune in retrograde direction with nitrogen geysers' }
    ],
    funFacts: [
      'Neptune features the fastest winds in the solar system, reaching speeds over 2,000 km/h.',
      'Neptune was mathematically predicted before it was directly observed in a telescope.',
      'Triton, Neptune\'s largest moon, is gradually spiraling inward and will eventually be torn apart into rings.'
    ]
  }
];
