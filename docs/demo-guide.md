# Demo Guide

Status: draft, 5 October 2026. The script for the Bird Table demo: what to show and say in each part, and what to do if something goes wrong. It runs for about six minutes. The timings are a starting point and will be set in rehearsal. The whole exercise day plays in two minutes, so events come quickly: from 0825 the first alert is about two seconds away. Pause with space whenever you need to talk.

## The Story in One Breath

A brigade is on exercise in Estonia, and its common operating picture shows where every unit is and which live-firing areas are dangerous right now. It does not warn anyone when a unit drives into a live danger area. Today, under pressure, four units do exactly that and nobody notices. We hand the problem to an AI coding agent as a written work item, it adds the warning to the real code, and when we replay the same morning the picture catches all four. The exercise, the units and the story are fictional; the ground and the military areas are real.

## Before You Start

Set up your Mac once with the install guide. Then, about five minutes before each demo, open Terminal, go into the demo folder with `cd bird-table`, and run:

    ./demo.sh start

It puts the code back to the before, starts a fresh branch for this run, and opens the picture in the browser. It takes a few seconds.

Then start Cosine in the same folder, in a second Terminal window, so it is ready to type into. If your Cosine set-up keeps memories between sessions, clear them now, so every run starts the same.

Have the browser, the Cosine window and this guide open.

Useful keys in the picture: space pauses and plays, R restarts from 0600, J jumps to 0825. The timeline under the map can be dragged to any time; hover over a tick to read an event, click it to jump there.

## Running Order

| Time | Part |
| --- | --- |
| 0:00 to 1:30 | The picture, and the gap |
| 1:30 to 4:30 | The change, live |
| 4:30 to 6:00 | The same morning, replayed |

## The Picture, and the Gap (0:00 to 1:30)

Show: the picture as it opens, with the exercise clock running.

Say: 'This is Bird Table, a common operating picture for a brigade on exercise in Estonia: Exercise GREY HERON. Blue is our brigade defending Tapa; red is the opposing force advancing from the east. The symbols are standard NATO symbols, and the grid is the military grid. On the right is the event log, everything reported as the morning goes on.'

Point at Danger Area 1 and its orange band on the timeline: 'This is a range danger area around the target areas in the Central Training Area. From 0800 to 1000 there is live artillery firing into it. Range control has told every unit to keep clear.'

Press J to jump to 0825. The 0810 and 0815 entries are already at the top of the log: read them out. OPFOR tanks have broken through, and brigade has ordered the armoured battalion to counter-attack by the fastest route, which runs straight through the live area. Then let it play.

Say, as the engineers and the armoured squadrons drive into the orange area: 'Watch the picture. Four units are about to drive into a live firing area. The picture shows the danger area is live, and it shows the units inside it, and it says nothing. In real life, that is how people get killed by their own side's fire.'

Press space to pause.

## The Change, Live (1:30 to 4:30)

Say: 'The fix has already been written down as a work item, the way a team would hand over a piece of work, so I just point the agent at it.'

In the Cosine window, type exactly this, the same words every time:

    Carry out the brief in prompts/range-safety.md

While it works, say what it is doing as it does it: reading the work item and the code, finding the functions that already know where every unit is and when an area is live, writing a new range safety module and its tests, and wiring the alert into the event log and the map. Point out that it runs the tests before it finishes.

When it has finished, show the list of files it changed and the tests passing.

## The Same Morning, Replayed (4:30 to 6:00)

Reload the page in the browser. The picture starts again from 0600, with the agent's change in it.

Press J to jump to 0825, and let it play. This time, at 0832, 0834 and 0844, alerts appear in red in the event log, each unit entering the live area gets a red ring, and the area itself turns red. Drag the timeline on to 0922 for the fourth, the reserve company cutting the corner.

Say: 'Same exercise, same units, same mistakes. This time the picture catches every one, with the unit, the time and the grid reference, the moment it happens.'

Then drag the timeline on past 1000, when the area goes cold, and let the two units that cross afterwards go through: 'And no false alarms. After 1000 the area is cold, and two more units cross it safely without a single alert.'

Close: 'One work item, a few minutes of the agent's time, and a real safety gap closed in a real codebase, with tests to prove it.'

## Afterwards

Run `./demo.sh finish`. It keeps whatever the agent did on this run's branch, as a record of the run, and stops the picture. The next `./demo.sh start` puts the code back to the before.

## If Something Goes Wrong

The rule: never debug live. Say 'let me show you the one we ran earlier', and move on.

If the agent's run fails or runs out of time, run `./demo.sh backup` in Terminal. It keeps whatever the agent did on this run's branch, puts the finished version live, and tells you to reload the page. Then carry on with the replay as above.

If the picture will not start, `./demo.sh start` says why. If something else is using its port, usually a picture started with `npm run dev`, stop that with Ctrl+C in its Terminal window and run `./demo.sh start` again. If `start` says the picture is already running, just reload the browser.

## Shallow and Deep Versions

Shallow, for a short slot or a non-technical audience: the picture and the gap, then `./demo.sh backup` and the replay, with no agent on screen.

Deep, for a technical audience: as above, plus opening `src/rangeSafety.ts` and its tests after the change to walk through what the agent wrote, and showing that it built on `isLive` and `pointInPolygon`, which were already in `src/scenario.ts`.
