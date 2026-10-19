export const LEVELS = [
  {
    id: 1,
    title: 'WILDLANDS',
    subtitle: 'THE LOST CRYSTAL',
    chapter: 'CHAPTER I · THE FORGOTTEN ISLE',
    location: 'THE EMERALD WILDS',
    requiredCrystals: 5,
    spawn: [0, 1.3, 10],
    portal: [0, 0, -20],
    crystals: [
      [-7, 1.25, 4],
      [7, 1.25, 1],
      [-10, 1.25, -8],
      [8, 1.25, -11],
      [0, 1.25, -16],
    ],
    sky: { sunPosition: [20, 25, 10], turbidity: 7, rayleigh: 1.5, mieCoefficient: 0.004 },
    fog: ['#b7d9d0', 26, 72],
    background: '#b7d9d0',
    ambient: 0.8,
    light: { position: [-12, 22, 10], intensity: 2.2 },
  },
  {
    id: 2,
    title: 'WILDLANDS',
    subtitle: 'THE FROZEN PEAKS',
    chapter: 'CHAPTER II · THE FROSTPEAK RIDGE',
    location: 'THE GLACIAL WASTES',
    requiredCrystals: 7,
    spawn: [0, 1.3, 14],
    portal: [0, 0, -22],
    crystals: [
      [-9,  1.25,  7],
      [ 9,  1.25,  5],
      [-14, 1.25, -2],
      [ 14, 1.25, -4],
      [-8,  1.25, -12],
      [ 8,  1.25, -14],
      [ 0,  1.25, -18],
    ],
    sky: { sunPosition: [5, 8, -20], turbidity: 14, rayleigh: 0.6, mieCoefficient: 0.001 },
    fog: ['#c8dce8', 22, 65],
    background: '#c8dce8',
    ambient: 0.65,
    light: { position: [10, 20, -8], intensity: 1.8 },
  },
]

// Legacy alias for any code still reading GAME
export const GAME = LEVELS[0]

