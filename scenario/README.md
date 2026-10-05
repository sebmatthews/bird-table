# Scenario Notes

`grey-heron.json` is the scenario for Exercise GREY HERON, the fictional exercise in the Bird Table demo, version 3. Units, names and events are invented. The ground and the military areas are real, from OpenStreetMap.

Positions are kilometres of easting and northing in Universal Transverse Mercator (UTM) zone 35, the same grid the map is drawn on. Each unit has a route of timed waypoints; between waypoints it moves in a straight line at a steady speed, and before its first or after its last waypoint it stays still. Exercise time runs 06:00 to 12:00 and plays in about 120 seconds.

## Story

OPFOR advances west from around Rakvere. At 08:10 its tank battalion breaks through 2 INF BN's forward company north east of Tapa. At 08:15 brigade headquarters orders 3 ARMD BN to counter-attack at once, by the fastest route south through the Central Training Area, which runs through Danger Area 1 while it is live. An engineer troop clears the route ahead. Two armoured squadrons go straight through; the third goes round. At 09:05 a reserve infantry company is sent to block north of Tapa and cuts the corner of the danger area. The counter-attack halts the tanks at about 09:45. The danger area goes cold at 10:00, and two more units cross it safely afterwards.

## Events And Roles

Each event has a time, a sender, an addressee and a full sentence or two of text, with a grid reference where a position matters; the grid references were checked against the units' positions at that time. Each unit has a one-line role, shown in the unit details panel.

## Danger Area

Danger Area 1 is drawn by Bird Table: the real target areas 1 and 2 ('Sihtmärgialad 1 & 2' in OpenStreetMap) grown outwards by 2.2 km, about 37.6 km². It is live 08:00 to 10:00.

## Units

36 units: 20 blue (brigade headquarters; 1 INF BN headquarters and three companies; 2 INF BN headquarters and three companies; 3 ARMD BN headquarters and three squadrons; three reconnaissance troops; an artillery regiment; two engineer troops; a logistics battalion) and 16 OPFOR (headquarters; two mechanised battalions and a tank battalion, each with a headquarters and three companies; two reconnaissance platoons; an artillery battalion).

## Checked Crossings

Checked on 5 October 2026 by stepping through the scenario every 15 seconds of exercise time; times are rounded down to the minute, as the demo shows them. The same list is stored in the file as `checkedCrossings`.

| Unit | Enters | Leaves | State |
|---|---|---|---|
| 1 TP ENGR | 08:32 | 08:46 | Live: alert |
| A SQN 3 ARMD BN | 08:34 | 08:53 | Live: alert |
| B SQN 3 ARMD BN | 08:44 | 09:10 | Live: alert |
| C COY 2 INF BN | 09:22 | 09:38 | Live: alert |
| 2 TP ENGR | 10:18 | 10:40 | Cold: no alert |
| B COY 2 INF BN | 10:25 | 10:43 | Cold: no alert |

No other unit enters the danger area. Every waypoint lies inside the exercise area box.
