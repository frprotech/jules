import { SpaceMission } from '@/types/solar';

export const MISSIONS_DATA: SpaceMission[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    agency: 'NASA',
    targetBodyId: 'earth',
    launchYear: 1969,
    status: 'completed',
    description: 'The historic spaceflight that landed the first two humans on the Moon, Neil Armstrong and Buzz Aldrin.',
    keyAchievements: [
      'First human footsteps on an extraterrestrial surface.',
      'Returned 21.5 kg of lunar soil and rock samples.',
      'Demonstrated interplanetary crewed transit.'
    ]
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    agency: 'NASA',
    targetBodyId: 'jupiter',
    launchYear: 1977,
    status: 'active',
    description: 'A robotic space probe launched to study the outer Solar System and interstellar space beyond the Sun’s heliosphere.',
    keyAchievements: [
      'First close-up imaging of Jupiter and Saturn systems.',
      'Discovered volcanic active moons like Io.',
      'First human-made object to enter interstellar space (2012).'
    ]
  },
  {
    id: 'cassini',
    name: 'Cassini-Huygens',
    agency: 'NASA / ESA / ASI',
    targetBodyId: 'saturn',
    launchYear: 1997,
    status: 'completed',
    description: 'Flagship mission that spent 13 years orbiting Saturn, discovering active geysers on Enceladus and methane lakes on Titan.',
    keyAchievements: [
      'Landed the Huygens probe on Titan\'s surface.',
      'Discovered subsurface ocean geysers on Enceladus.',
      'Completed dramatic "Grand Finale" dives inside Saturn\'s rings.'
    ]
  },
  {
    id: 'juno',
    name: 'Juno',
    agency: 'NASA',
    targetBodyId: 'jupiter',
    launchYear: 2011,
    status: 'active',
    description: 'Polar orbit spacecraft probing Jupiter\'s atmosphere, magnetosphere, and internal structure.',
    keyAchievements: [
      'Mapped Jupiter\'s complex magnetic and gravitational fields.',
      'Revealed intense polar cyclone systems.',
      'Probed depth of the Great Red Spot storm.'
    ]
  },
  {
    id: 'perseverance',
    name: 'Mars 2020 Perseverance',
    agency: 'NASA',
    targetBodyId: 'mars',
    launchYear: 2020,
    status: 'active',
    description: 'Advanced rover exploring Jezero Crater on Mars to search for signs of ancient biosignatures and collect rock cores.',
    keyAchievements: [
      'Deployed Ingenuity, the first powered aircraft on another planet.',
      'Converted Martian carbon dioxide into breathable oxygen.',
      'Collected sealed rock samples for future Earth return.'
    ]
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    agency: 'NASA / ESA / CSA',
    targetBodyId: 'sun',
    launchYear: 2021,
    status: 'active',
    description: 'Premier space observatory operating at the Sun-Earth L2 Lagrange point, observing the universe in deep infrared.',
    keyAchievements: [
      'Imaged the earliest galaxies formed after the Big Bang.',
      'Analyzed chemical atmospheres of exoplanets.',
      'Captured unprecedented detail of stellar nurseries and nebula clouds.'
    ]
  },
  {
    id: 'artemis',
    name: 'Artemis Program',
    agency: 'NASA / International Partners',
    targetBodyId: 'earth',
    launchYear: 2022,
    status: 'active',
    description: 'Human spaceflight campaign aiming to establish sustainable human presence on and around the Moon.',
    keyAchievements: [
      'Successful uncrewed Artemis I lunar orbit test flight.',
      'Developing Gateway orbital lunar station.',
      'Preparing first female and person of color crewed lunar landing.'
    ]
  }
];
