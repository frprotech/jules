import { TimelineMilestone } from '@/types/solar';

export const TIMELINE_DATA: TimelineMilestone[] = [
  {
    id: 'sputnik-1',
    year: 1957,
    title: 'Sputnik 1',
    subtitle: 'First Artificial Satellite',
    description: 'The Soviet Union launched Sputnik 1 into Earth orbit, marking the dawn of the Space Age.',
    targetBodyId: 'earth',
    category: 'satellite'
  },
  {
    id: 'gagarin-flight',
    year: 1961,
    title: 'Vostok 1',
    subtitle: 'First Human in Space',
    description: 'Yuri Gagarin completed an orbit around Earth aboard Vostok 1, becoming the first human in outer space.',
    targetBodyId: 'earth',
    category: 'crewed'
  },
  {
    id: 'apollo-11-timeline',
    year: 1969,
    title: 'Apollo 11',
    subtitle: 'First Human Lunar Landing',
    description: 'Neil Armstrong and Buzz Aldrin stepped onto the Moon, fulfilling a decade-long quest.',
    targetBodyId: 'earth',
    category: 'crewed'
  },
  {
    id: 'mariner-9',
    year: 1971,
    title: 'Mariner 9',
    subtitle: 'First Orbiter of Another Planet',
    description: 'Mariner 9 entered orbit around Mars, mapping 85% of the planet and revealing giant volcanoes and canyons.',
    targetBodyId: 'mars',
    category: 'probe'
  },
  {
    id: 'voyager-grand-tour',
    year: 1977,
    title: 'Voyager 1 & 2',
    subtitle: 'Grand Tour of Outer Planets',
    description: 'Twin probes launched to explore Jupiter, Saturn, Uranus, and Neptune.',
    targetBodyId: 'jupiter',
    category: 'probe'
  },
  {
    id: 'hubble-space-telescope',
    year: 1990,
    title: 'Hubble Space Telescope',
    subtitle: 'Window into Deep Space',
    description: 'Deployed into low Earth orbit, Hubble transformed astronomy with crisp optical views of stars and distant galaxies.',
    targetBodyId: 'earth',
    category: 'telescope'
  },
  {
    id: 'curiosity-rover',
    year: 2012,
    title: 'Curiosity Rover',
    subtitle: 'Mars Science Laboratory',
    description: 'Landed in Gale Crater on Mars to determine if Mars ever supported microbial life.',
    targetBodyId: 'mars',
    category: 'rover'
  },
  {
    id: 'new-horizons-pluto',
    year: 2015,
    title: 'New Horizons',
    subtitle: 'First Reconnaissance of Pluto',
    description: 'Sped past Pluto, capturing high-resolution photos of heart-shaped nitrogen ice glaciers.',
    targetBodyId: 'sun',
    category: 'probe'
  },
  {
    id: 'jwst-first-images',
    year: 2022,
    title: 'James Webb Space Telescope',
    subtitle: 'Infrared Cosmos Unveiled',
    description: 'JWST released its first deep-field images, looking back over 13 billion years in cosmic time.',
    targetBodyId: 'sun',
    category: 'telescope'
  }
];
