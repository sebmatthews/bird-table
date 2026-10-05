// Settled look and behaviour of the picture, as agreed in the map and scenario proofs.
// Distances are kilometres in UTM zone 35; zoom levels are Leaflet zoom levels on the flat grid map.

export const STYLE = {
  sea: '#03060a',
  land: '#0a141d',
  coast: { colour: '#1f6f96', weight: 1 },
  border: { colour: '#d0453b', weight: 2, dash: '8 4' },
  forest: { colour: '#0f2a22', opacity: 0.55 },
  water: { colour: '#0b2f45', opacity: 0.9 },
  wetland: { colour: '#123a3a', opacity: 0.5 },
  builtUp: { colour: '#2a3a46', opacity: 0.6 },
  river: { colour: '#1c5d82', weight: 0.8, opacity: 0.8 },
  roadMain: { colour: '#8fb3c6', weight: 1.6, opacity: 0.75 },
  roadSecondary: { colour: '#58788a', weight: 0.8, opacity: 0.6 },
  roadMinor: { colour: '#46606f', weight: 0.7, opacity: 0.7 },
  track: { colour: '#3d5563', weight: 0.6, opacity: 0.6, dash: '3 3' },
  rail: { colour: '#9a8bb0', weight: 1, opacity: 0.6, dash: '4 3' },
  military: { colour: '#c0643f', opacity: 0.18, weight: 1, dash: '5 3', labelsFromZoom: 3 },
  towns: { colour: '#cfe8f5', fromZoom: 1, villagesFromZoom: 3.5 },
  grid: { colour: '#3fb4e6', opacity: 0.4, weight100: 1.2, weight10: 0.6, tenKmFromZoom: 2.5 },
  areaBox: { colour: '#e6c34a', weight: 1.5, dash: '10 6' },
  danger: {
    cold: { colour: '#7f8f99', weight: 1.2, dash: '6 4', fill: 0.05 },
    live: { colour: '#ff8a3d', weight: 2, fill: 0.4, pulsesPerSecond: 1 },
  },
  units: { size: 14, refZoom: 2, scale: 0.5, min: 10, max: 44, labelsFromZoom: 4.75 },
  selected: { colour: '#7fd6ff' },
  alert: { colour: '#ff3b3b' },
};

/** Zoom level from which the exercise area is drawn at full detail. */
export const DETAIL_ZOOM = 3;

/** The exercise area: eastings 400 to 470 km, northings 6540 to 6590 km, all inside grid square 35V MF. */
export const EXERCISE_AREA = { e0: 400, e1: 470, n0: 6540, n1: 6590 };

/** The area the picture opens on, fitted to whatever screen the demo runs on. */
export const OPENING_VIEW = { e0: 365.3, e1: 502.8, n0: 6513.3, n1: 6616.9 };

/** Real seconds for the whole exercise day (06:00 to 12:00) to play. */
export const RUN_SECONDS = 120;

/** Exercise time the presenter can jump to with the J key, just before the counter-attack. */
export const JUMP_TO = '08:25';
