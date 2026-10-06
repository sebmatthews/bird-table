# Admin Guide

Status: version 1.0, 6 October 2026. For the demo's owner: the one-off and occasional steps behind the demo, which presenters never do. Presenters follow the install guide and the demo guide only.

## How the Pieces Fit

`main` holds the before: the picture with no range safety alert, the work item at `prompts/range-safety.md`, `AGENTS.md` (standing notes the coding agent reads), and the demo command.

`backup/range-safety` holds the after: a finished version of the work item, kept for when a live run fails. It is `main` plus one commit.

The demo command, `demo.sh`, sits at the top of the repository and must stay executable, which Git records. `start` makes a branch named `demo/live-...` from `main` for each run. Whatever the agent leaves is committed to that branch, as one commit, by `finish`, by `backup`, or by the next `start`, so no run is lost. `backup` then makes a `demo/backup-...` branch from `backup/range-safety`. These branches stay on the presenter's Mac and are never pushed.

## Change the Before

Any change to `main` (the picture, the scenario, the work item, `AGENTS.md`) must reach the backup too, or the two drift apart. Make the change on `main`, commit it, then bring the backup up to date and push both:

    git switch backup/range-safety
    git rebase main
    npm test
    git switch main
    git push origin main
    git push --force-with-lease origin backup/range-safety

If the rebase stops on a conflict, the change touched the same lines as the range safety commit; resolve it, or ask for help, before pushing. Then rehearse again: what is shown must be what was rehearsed.

## Save a Better Backup

The backup is a build of the work item made by hand. If a rehearsal produces an agent run you would rather show, save it as the backup instead. Each rehearsal leaves its branch on the Mac it ran on, with the agent's work committed to it; replace BRANCH with its name. First make sure you are not on a demo branch with work still to keep, by running `./demo.sh finish`. Then:

    git switch -c new-backup main
    git merge --squash BRANCH
    git commit -m "Range safety alert: the finished version, kept as the fallback"
    git log --oneline main..new-backup

The last command must show exactly one commit. If it shows none, the branch held no work: stop, and delete the branch with `git switch main` and `git branch -D new-backup`. If it shows one, carry on:

    npm test
    git branch -f backup/range-safety new-backup
    git switch main
    git branch -D new-backup
    git push --force-with-lease origin backup/range-safety

Then check the picture on the new backup by hand before relying on it: `./demo.sh start`, `./demo.sh backup`, reload, and replay the morning.

## Tidy Up Old Demo Branches

Every run leaves `demo/live-...` and often `demo/backup-...` branches on the presenter's Mac. They do no harm, and they are the record of each rehearsal, so keep them until the results are written up. To list them, and then remove them:

    git switch main
    git branch --list 'demo/*'
    git for-each-ref --format='%(refname:short)' 'refs/heads/demo/' | xargs git branch -D

## Change the Scenario or the Map

The scenario is `scenario/grey-heron.json`. Its notes, `scenario/README.md`, record which units cross the danger area and when. Any change to the scenario must be checked against those crossings, and the expected alert times in the work item and in `tests/rangeSafety.test.ts` on the backup branch updated to match.

The map data in `map/data` is built from OpenStreetMap and Natural Earth by `map/build-map.sh`. Its sources and licence are in `map/data/SOURCES.md`. Rebuilding it is rarely needed; if it is, the script lists what to download first.

## Open Questions

Where Cosine keeps its saved memories, and how to clear them before each run. Joint Keepers found they are not in the repository; until this is settled, presenters clear them by hand if their set-up keeps them.

Which Cosine build and model presenters use. Every rehearsal must use exactly that.
