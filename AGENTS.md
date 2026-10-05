# Bird Table: Notes For Coding Agents

This repository holds Bird Table, a land common operating picture for Exercise GREY HERON. The exercise is fictional: its units, names and events are invented. The ground and the military areas on the map are real, from OpenStreetMap.

## Layout

`src/` is the app, in TypeScript with Vite: `main.ts` runs the picture frame by frame; `scenario.ts` holds the scenario types, unit positions over time, danger area timing and the point-in-shape test; `grid.ts` converts to UTM zone 35 and writes grid references; `map.ts`, `units.ts`, `dangerAreas.ts`, `eventLog.ts`, `details.ts` and `timeline.ts` draw the picture; `config.ts` holds its look.

Positions are kilometres of easting and northing in UTM zone 35. Exercise times are 'HH:MM' strings in the scenario and minutes after midnight in the code.

`scenario/grey-heron.json` is the scenario. `map/data/` is the map data. `tests/` holds the tests.

`prompts/` holds the work items.

## Always

Keep changes to what the work item asks for.

Keep the picture's existing look, wording and behaviour unless the work item says to change them.

Run `npm test` and `npm run typecheck` before finishing; both must pass.

## Never Change

Anything in `scenario/`, `map/` or `prompts/`, or `demo.sh`, this file, `package.json` or `package-lock.json`, unless the work item explicitly says so. Add no packages.
