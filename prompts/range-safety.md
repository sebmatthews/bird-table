# User Story: Range Safety Alert

As a brigade watchkeeper, I want Bird Table to warn me the moment any unit enters a range danger area while it is live, so that I can halt the unit and tell range control before anyone is hurt.

## Background

Bird Table is the brigade's common operating picture for Exercise GREY HERON. It already shows each range danger area as live or cold, with its firing times, and it plays the exercise day with an event log and a timeline.

It does not check where units are against the danger areas. Today a watchkeeper has to spot a unit entering a live area by eye. In Exercise GREY HERON, units entered Danger Area 1 while it was live and the picture gave no warning.

The code is in `src/`. `src/scenario.ts` already has `positionAt`, `isLive` and `pointInPolygon`. `src/main.ts` runs the picture frame by frame.

## Acceptance Criteria

1. The check. A new module, `src/rangeSafety.ts`, works out which units are inside a danger area while it is live, at any exercise time, using the existing functions in `src/scenario.ts`. A unit inside an area while it is cold is not a breach.

2. One alert per entry. An alert is raised at the exercise time a unit enters a danger area while it is live: once per entry, not once per frame. A unit that leaves and enters again raises a new alert. Alerts are worked out from exercise time, not from the real clock, so restarting, pausing, jumping with J or dragging the timeline back and forth always shows the same alerts at the same times.

3. The alert in the event log. Each alert appears in the event log at its exercise time, among the other events, newest first, and is shown or hidden as the timeline moves, like any other event. It reads:

   `HHMM · RANGE SAFETY CHECK → ALL`
   `RANGE SAFETY ALERT. <unit name> has entered <danger area label> while it is live (<firing times>) at <grid reference>. Halt the unit and inform range control.`

   For example: `0834 · RANGE SAFETY CHECK → ALL` and `RANGE SAFETY ALERT. A SQN 3 ARMD BN has entered DANGER AREA 1 while it is live (0800 TO 1000) at 35V MF 3478 8491. Halt the unit and inform range control.` The firing times are written as the danger area's label on the map already writes them, and the grid reference with `gridRef` from `src/grid.ts`. Alert entries are shown in red, `#ff3b3b`, so they stand out from ordinary events.

4. The picture reacts. While a unit is inside a danger area that is live, it has a red ring, `#ff3b3b`, around its symbol. While any unit is inside a live danger area, that area is drawn in red, `#ff3b3b`, in place of its usual live orange. Both go back to normal when the unit leaves or the area goes cold.

5. Tests. A new test file, `tests/rangeSafety.test.ts`, shows that across the whole exercise day there are exactly four alerts: 1 TP ENGR at about 0832, A SQN 3 ARMD BN at about 0834, B SQN 3 ARMD BN at about 0844 and C COY 2 INF BN at about 0922, each within one minute; and that 2 TP ENGR and B COY 2 INF BN, which cross Danger Area 1 after it goes cold at 1000, raise no alert.

## Constraints

Change only what this story needs. Do not change anything in `scenario/`, `map/`, `prompts/` or the existing tests, or `demo.sh`, `AGENTS.md`, `package.json` or `package-lock.json`. Add no packages.

## Done Means

`npm test` and `npm run typecheck` pass. When the page is reloaded and the exercise plays, four range safety alerts appear in the event log between 0832 and 0922, each unit gets a red ring while it is inside Danger Area 1, and Danger Area 1 turns red while any of them is inside it.
