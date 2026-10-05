# Bird Table

Bird Table is a land common operating picture (COP: the shared map showing where every unit is) for Exercise GREY HERON, a fictional exercise in north-central Estonia. It is a demonstration system, built to show an AI coding agent adding a feature to a working codebase.

Everything about the exercise is invented: the units, their names, the story and the events. The ground is real, and so are the military areas, which come from OpenStreetMap. Nothing here describes a real operation, a real unit or a real plan.

## Status

Built: the picture, the work item for the coding agent (`prompts/range-safety.md`), the demo command, and a finished version of the work item on the `backup/range-safety` branch for use if a live run fails. Still to do: rehearsals and the presenter guide.

## The Demo

1. `./demo.sh check`, once after setting up a Mac.
2. `./demo.sh start`. The picture opens. Show the before: units moving, Danger Area 1 live from 0800, units entering it with no warning.
3. Point the coding agent at `prompts/range-safety.md` with the fixed line.
4. When it has finished, reload the page. Show the after: the same units, now raising range safety alerts.
5. If the run fails, `./demo.sh backup` and reload the page.
6. `./demo.sh finish`.

Live reloading is off, so the page changes only when it is reloaded.

## Running It

You need Node 22.12 or later.

```
npm install
npm run dev
```

The picture opens in the browser. The exercise day, 06:00 to 12:00, plays in two minutes and then starts again.

| Key or button | Does |
|---|---|
| Space or PAUSE | Pause or play the exercise clock |
| R or RESTART | Start again from 06:00 |
| J | Jump to 08:25, just before the counter-attack |
| Timeline | Drag to any time; hover over a tick to read the event, click it to jump there; the orange band is when the danger area is live |
| Click a unit | Show its details under the event log |

## Tests

```
npm test
npm run typecheck
```

## How It Is Built

TypeScript with Vite, Leaflet for the map, milsymbol for the NATO (North Atlantic Treaty Organization) symbols, to the APP-6 (Allied Procedural Publication 6) standard, and proj4 for the grid.

| Path | Holds |
|---|---|
| `src/main.ts` | Starts the picture and runs the clock, frame by frame |
| `src/config.ts` | The look of the picture, the exercise area and the opening view |
| `src/map.ts` | The map, the military grid, and the exercise area at full detail when zoomed in |
| `src/grid.ts` | Conversion to UTM (Universal Transverse Mercator) zone 35 and grid references |
| `src/scenario.ts` | The scenario's types, unit positions over time, danger area timing, and the point-in-shape test |
| `src/clock.ts` | The exercise clock |
| `src/timeline.ts` | The timeline under the map: play, scrub, event ticks and live windows |
| `src/units.ts` | Units on the map and selection |
| `src/dangerAreas.ts` | Range danger areas, shown live or cold |
| `src/eventLog.ts` | The event log |
| `src/details.ts` | The selected unit's details |
| `scenario/` | The scenario file and its notes |
| `map/` | The map data, its sources, and the script that rebuilds it |
| `tests/` | Tests |
| `prompts/` | Work items for the coding agent |
| `demo.sh` | The demo command |
| `AGENTS.md` | Standing notes for any coding agent |

Positions throughout are kilometres of easting and northing in UTM zone 35, the grid the map is drawn on.

## Known Gaps

The picture shows when a danger area is live, but it does not warn anyone when a unit enters a live danger area.

## Map Data

Map data © OpenStreetMap contributors, available under the Open Database Licence (ODbL). Borders from Natural Earth (public domain). See `map/data/SOURCES.md`.

## Copyright

Copyright 2026 Seb Matthews. All rights reserved. No licence is granted by the publication of this repository.

The map data in `map/data/` is not covered by this notice. It is derived from OpenStreetMap and is available under the Open Database Licence, as `map/data/SOURCES.md` sets out.
