# Bird Table Handoff Guide

Status: draft, 5 October 2026. For a Cosine user setting up their own, fully independent copy of the Bird Table demo and running it.

## Licence

Copyright © 2026 the copyright holder. All rights reserved, except as granted below.

The copyright holder grants Cosine, and its employees, contractors and agents, a perpetual, irrevocable, worldwide, royalty-free, non-exclusive licence to use, run, copy, modify, adapt, distribute, sublicense and otherwise exploit this demo and everything in it, including for commercial purposes, without restriction and without any obligation to the copyright holder. The demo is provided as is, without warranty of any kind.

The map data in `map/data` is not covered by this grant, because it is not the copyright holder's to grant. It is derived from OpenStreetMap and is available under the Open Database Licence (ODbL): it must keep the credit '© OpenStreetMap contributors' and say that the data is available under the ODbL, and versions of it that you change and share must be shared under the same licence. The national borders come from Natural Earth, which is in the public domain. `map/data/SOURCES.md` sets this out.

The same statement is in the repository's README.

## What the Demo Is

Bird Table is a six-minute live demo of an AI coding agent, Cosine, adding a feature to a working military system. The system is a land common operating picture (COP: the shared map showing where every unit is) for Exercise GREY HERON, a fictional exercise on real ground in north-central Estonia. Its units, names, story and events are invented; the ground and the military areas are real, from OpenStreetMap.

The picture shows a range danger area as live from 0800 to 1000, and during the morning four units drive into it. The picture says nothing. On stage, the presenter points Cosine at a written work item, and Cosine adds a range safety alert to the real code. When the same morning is replayed, every breach is caught: an alert in the event log, a red ring on the unit, and the area turning red. Two units that cross after the area goes cold raise no alert.

Future expansion: the work item asks for the core of the alert only, so there is room to grow. Part 10 sets out what could follow.

## How the Pieces Fit

- Your GitHub repository holds the code, the scenario, the map data, the work item and the demo command. Branch `main` is the before: the picture with no alert. Branch `backup/range-safety` is the after: a finished version of the work item, kept as the fallback if a live run fails.
- Each presenter's Mac runs the picture itself, with Node, in the browser. Nothing is hosted and nothing is built on GitHub.
- The demo command, `./demo.sh`, is all a presenter types, apart from one line typed into Cosine.

## What You Need

- A GitHub account, or an organisation you can create repositories in.
- A Mac with an Apple silicon chip (M1 or later) running macOS 15 (Sequoia) or later. Part 1 sets it up.
- Cosine CLI, with an account to sign in with, and the model you intend to present with.
- The zip file of the demo you were given, called ZIP_FILE in this guide. It contains a folder called `bird-table`, which is the whole repository with no history, and a file called `bird-table-fallback.patch`, which holds the fallback.
- About an hour.

Throughout, replace words in capitals, such as YOUR_ACCOUNT, with your own values. Commands are typed or pasted into the Terminal app exactly as shown.

## Part 1: Set Up Your Mac

Every presenter's Mac needs this too (Part 5). Do it on your own Mac now, because Part 2 commits and pushes from it.

1. Git. In Terminal, type `git --version`. If macOS offers to install the command line developer tools, accept and wait for it to finish.
2. Git's name and email, which Git records on every change. Use the private 'noreply' address shown in GitHub under Settings, then Emails; it looks like `12345678+yourname@users.noreply.github.com`. If you use your own email instead, and GitHub is set to keep it private and to block command line pushes that expose it, GitHub refuses your pushes.

        git config --global user.name "YOUR NAME"
        git config --global user.email "YOUR_NOREPLY_ADDRESS"

3. Homebrew, which installs the rest. Paste this into Terminal, press Return when it pauses, and type your Mac's password when asked (nothing appears as you type). If it ends by printing 'Next steps' with commands to run, run them, then close Terminal and open it again.

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

4. Node, which runs the picture, and GitHub's command line tool, `gh`, which Part 2 uses to create your repository:

        brew install node gh

   Then sign in to GitHub with `gh auth login`: choose GitHub.com, then HTTPS, then yes to 'Authenticate Git with your GitHub credentials?', then 'Login with a web browser'. Copy the one-time code it shows, press Return, and paste the code into the page that opens.
5. Cosine. Install it with `brew install CosineAI/tap/cos`, check it with `cos --version`, and sign in with `cos login`; when the browser page shows you are signed in, switch back to Terminal. Set Cosine to the model you will present with. Every presenter should use the same Cosine version and model as were used in rehearsal, or rehearsal results tell you little.

Check: `git --version`, `node --version`, `gh auth status` and `cos --version` each answer without an error. Node must be 22.12 or later on the 22 line, or 24, or 26 or later; Homebrew's current Node is fine.

## Part 2: Make Your Own Copy

This makes a new repository whose history starts with a single fresh commit of the zip's contents, and puts the fallback on its own branch.

1. In Terminal, unzip the demo into your home folder. For PATH_TO_ZIP_FILE, you can type `unzip ` with a space and then drag ZIP_FILE from Finder into the Terminal window. Unzip it in Terminal as shown rather than by double-clicking, so hidden files come out reliably.

        cd ~
        unzip PATH_TO_ZIP_FILE
        cd bird-table

2. Make the first commit, the before:

        chmod +x demo.sh
        git init -b main
        git add -A
        git commit -m "Bird Table demo"

3. Make the fallback branch from the patch:

        git switch -c backup/range-safety
        git apply ../bird-table-fallback.patch
        git add -A
        git commit -m "Range safety alert: the finished version, kept as the fallback"
        git switch main

4. Create your repository on GitHub and send both branches to it. Choose `--private` or `--public` (see the note below):

        gh repo create YOUR_ACCOUNT/bird-table --private --source . --remote origin --push
        git push -u origin backup/range-safety

Private or public: either works, because nothing is built on GitHub. In a public repository anyone can read the code and presenters need no GitHub access to download it. In a private one, presenters need read access (Part 4).

Check: your repository on GitHub shows the files on `main`, and the branch list shows `backup/range-safety`.

## Part 3: Prove It Works

In the bird-table folder:

    npm install
    npm test
    ./demo.sh check

`npm test` should pass. `./demo.sh check` checks Node, the installed packages, Git, the fallback branch, Cosine and the tests, and ends 'Ready for a demo.'

Then walk the demo without Cosine:

1. `./demo.sh start`. The picture opens in the browser. Press J to jump to 0825 and let it play: four units drive into the orange danger area and nothing reacts.
2. `./demo.sh backup`, then reload the page. Press J again: now alerts appear in red in the event log at about 0832, 0834, 0844 and, after 0900, 0922, with red rings on the units and the area turning red.
3. `./demo.sh finish`.

Check: the before shows no alerts and the after shows four.

## Part 4: Add Presenters

Public repository: nothing to do; anyone can download it.

Private repository: each presenter needs a GitHub account and access to the repository, so they can download it. In the repository, open Settings, then, under Access, Collaborators for a repository owned by a personal account, or 'Collaborators & teams' for one owned by an organisation, and select Add people. In an organisation, choose the Read role under 'Choose a role'. A repository owned by a personal account has no read-only option: every collaborator can also change it, so if read-only access matters, create the repository in an organisation. Presenters must accept the invitation, which expires after seven days.

Whichever you choose, presenters never send anything back to GitHub. In a personal account this is a working rule rather than something GitHub enforces.

## Part 5: Set Up Each Presenter's Mac

Each presenter does Part 1, steps 1 to 3 and 5, and installs Node with `brew install node`. They do not need `gh`. The same steps, with more detail, are in `docs/install-guide.md`. Then:

    git clone https://github.com/YOUR_ACCOUNT/bird-table.git
    cd bird-table
    npm install
    ./demo.sh check

Check: `./demo.sh check` ends 'Ready for a demo.' Anything else names what to fix.

## Part 6: The Demo Command

Run from Terminal in the bird-table folder.

| Command | When | What it does |
| --- | --- | --- |
| `./demo.sh check` | Once, after setting up the Mac | Checks Node, the packages, Git, the fallback branch, Cosine and the tests. Changes none of the demo's code. |
| `./demo.sh start` | Before each demo or rehearsal | Keeps any work left from the last run on that run's branch, puts the code back to `main`, starts a fresh branch named `demo/live-...`, and opens the picture. A few seconds. |
| `./demo.sh backup` | If the live run fails | Keeps Cosine's work on the run's branch, puts the finished version from `backup/range-safety` live on a `demo/backup-...` branch, and asks you to reload the page. |
| `./demo.sh finish` | After each demo or rehearsal | Keeps Cosine's work on the run's branch and stops the picture. |

The `demo/...` branches stay on the Mac and are never sent to GitHub. They are the record of each run.

Live reloading is off, so the page changes only when you reload it, not every time Cosine saves a file.

## Part 7: Rehearse, and Save a Better Backup

1. `./demo.sh start`. Start Cosine in the same folder, in a second Terminal window, and type exactly:

        Carry out the brief in prompts/range-safety.md

2. When Cosine has finished, check that `npm test` passes, reload the page, press J, and check the after as in Part 3.
3. `./demo.sh finish`, and record the result, with the branch name `start` printed.

Rehearse until the change succeeds reliably inside its time slot. A useful bar is nine successes in ten. If your Cosine set-up keeps memories between sessions, clear them before each rehearsal and each demo, so every run starts the same.

The fallback you were given is a version of the work item built by hand. If you would rather show one of your own passing runs as the fallback, `docs/admin-guide.md` explains how to save it, with a check that stops before anything is overwritten.

## Part 8: Run the Demo

The full script, with what to show and say in each part, is `docs/demo-guide.md`. The running order:

| Time | Part |
| --- | --- |
| 0:00 to 1:30 | The picture, and the gap |
| 1:30 to 4:30 | The change, live: Cosine at work |
| 4:30 to 6:00 | The same morning, replayed |

The presenter's steps:

1. A few minutes before: `./demo.sh start`, and start Cosine in a second Terminal window.
2. At the change: type `Carry out the brief in prompts/range-safety.md` into Cosine.
3. When Cosine has finished: reload the page and replay the morning.
4. If the run fails or runs out of time: `./demo.sh backup`, reload, and say 'let me show you the one we ran earlier'. Never debug live.
5. Afterwards: `./demo.sh finish`.

The work item Cosine reads is `prompts/range-safety.md`.

## Part 9: Keep It Running

- Any change to `main` must reach the fallback too, or the two drift apart. `docs/admin-guide.md` gives the steps, which rebase the fallback onto `main`. Rehearse again after any change: what is shown should be what was rehearsed.
- The pace: the whole exercise day plays in two minutes. To slow it, change `RUN_SECONDS` in `src/config.ts` on `main`, bring the fallback up to date, and rehearse again.
- The `demo/...` branches build up on each Mac. `docs/admin-guide.md` shows how to tidy them.
- The scenario's expected alert times appear in four places: the scenario itself (`checkedCrossings` in `scenario/grey-heron.json`), `scenario/README.md`, the work item, and the fallback's tests. Change the scenario only with all four.

## Part 10: Future Expansion

The work item deliberately asks for the core of the alert. Each of these would make a further work item, rehearsed in the same way:

1. Alerts pinned at the top of the event log until a watchkeeper acknowledges them.
2. Alert ticks on the timeline, in red, alongside the event ticks.
3. A warning in the selected unit's details while it is inside a live danger area.
4. More firing serials: further danger areas, or the same area live more than once, in the scenario.
5. Other checks on the same picture: contact reports when blue and OPFOR units come within a set distance, threat range rings around OPFOR units, or trails showing where each unit has been.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| `zsh: permission denied: ./demo.sh` | Run `chmod +x demo.sh`, then commit and push the change so others get it. |
| `git apply` in Part 2 says the patch does not apply | Make sure you ran it from the bird-table folder, on the new `backup/range-safety` branch, straight after the first commit, with nothing changed. |
| `./demo.sh check` says Node is not supported | Install a supported version: `brew install node`. |
| `./demo.sh start` says something else is using the port | A picture started with `npm run dev` is still running. Stop it with Ctrl+C in its Terminal window, and start again. |
| The page does not show Cosine's change | Reload the page; live reloading is off on purpose. |
| `npm test` fails after Cosine's run | Cosine's change did not meet the work item. This is a real result, not a fault in the demo: use the fallback, and count it as a failed rehearsal. |
| GitHub refuses a push in Part 2, mentioning a private email | Both commits carry the blocked address, and the fallback is built on the first. Set your GitHub noreply address (Part 1, step 2), delete the bird-table folder, and do Part 2 again from step 1. |

## What Is in the Repository

- `src`: the picture, in TypeScript with Vite: the map, the grid, the scenario playback, units, danger areas, the event log, unit details and the timeline.
- `tests`: the tests.
- `scenario`: the scenario for Exercise GREY HERON, and notes recording which units cross the danger area and when.
- `map`: the map data, its sources and licence, and the script that rebuilds it.
- `prompts/range-safety.md`: the work item Cosine is pointed at.
- `demo.sh`: the demo command.
- `docs`: the demo guide (the script), the install guide for presenters, the admin guide, and this guide.
- `AGENTS.md`: standing notes that Cosine reads in this repository, including what it must not change.

Everything about the exercise is fictional: the units, their names, the story and the events. Keep it that way, and keep the exercise framing, so the demo can never be mistaken for a depiction of a real operation.
