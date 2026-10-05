#!/usr/bin/env bash
# Bird Table demo command. Run from the repository folder.
#   ./demo.sh check    once, after setting up a Mac: checks everything the demo needs
#   ./demo.sh start    before each demo: resets the code to the saved before, starts a fresh run branch, opens the picture
#   ./demo.sh backup   if the coding agent's run fails: keeps its work, puts the finished version live; then reload the page
#   ./demo.sh finish   after the demo: stops the picture
set -euo pipefail
cd "$(dirname "$0")"

BACKUP_BRANCH="backup/range-safety"
PORT=5173
STATE=".demo"
mkdir -p "$STATE"

say()  { printf '%s\n' "$*"; }
fail() { printf 'PROBLEM: %s\n' "$*" >&2; exit 1; }
stamp() { date +%d%m-%H%M%S; }

server_running() { [ -f "$STATE/vite.pid" ] && kill -0 "$(cat "$STATE/vite.pid")" 2>/dev/null; }

start_server() {
  if server_running; then say "The picture is already running at http://localhost:$PORT"; return; fi
  if curl -s -o /dev/null "http://localhost:$PORT/"; then
    fail "something else is already using port $PORT, probably a picture started with npm run dev. Stop it (Ctrl+C in its Terminal window), then run this again"
  fi
  nohup node node_modules/vite/bin/vite.js --port "$PORT" --strictPort > "$STATE/vite.log" 2>&1 &
  echo $! > "$STATE/vite.pid"
  for _ in $(seq 1 30); do
    server_running || fail "the picture did not start. See $STATE/vite.log"
    if curl -s -o /dev/null "http://localhost:$PORT/"; then say "The picture is running at http://localhost:$PORT"; return; fi
    sleep 1
  done
  fail "the picture did not start. See $STATE/vite.log"
}

stop_server() {
  if server_running; then kill "$(cat "$STATE/vite.pid")" && say "The picture has stopped."; else say "The picture was not running."; fi
  rm -f "$STATE/vite.pid"
}

case "${1:-}" in
  check)
    ok=1
    if command -v node >/dev/null; then
      v=$(node -p 'process.versions.node')
      if node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=12)?0:1)'; then say "Node $v: fine"; else say "Node $v: too old, 22.12 or later is needed"; ok=0; fi
    else say "Node: not installed"; ok=0; fi
    if [ -d node_modules/vite ] && [ -d node_modules/leaflet ]; then say "Packages: installed"; else say "Packages: not installed. Run: npm install"; ok=0; fi
    if command -v git >/dev/null; then say "Git: fine"; else say "Git: not installed"; ok=0; fi
    if git rev-parse --verify --quiet "$BACKUP_BRANCH" >/dev/null || git rev-parse --verify --quiet "origin/$BACKUP_BRANCH" >/dev/null; then say "Backup: $BACKUP_BRANCH is here"; else say "Backup: $BACKUP_BRANCH is missing"; ok=0; fi
    if command -v cos >/dev/null || command -v cos2 >/dev/null; then say "Cosine: installed"; else say "Cosine: not found (cos or cos2)"; ok=0; fi
    if npm test --silent >/dev/null 2>&1; then say "Tests: pass"; else say "Tests: failing. Run: npm test"; ok=0; fi
    [ "$ok" = 1 ] && say "Ready for a demo." || fail "fix the items above, then run ./demo.sh check again"
    ;;
  start)
    git switch --quiet --discard-changes main
    git clean -fdq -- src tests
    branch="demo/live-$(stamp)"
    git switch --quiet -c "$branch"
    say "Code reset to the saved before, on a fresh branch: $branch"
    start_server
    say "Ready. Show the before, then give the coding agent its line."
    ;;
  backup)
    current=$(git branch --show-current)
    if [ -n "$(git status --porcelain)" ]; then
      git add -A
      git -c user.name="Bird Table demo" -c user.email="demo@localhost" commit --quiet --no-verify -m "Coding agent's run, kept when the backup was put live"
      say "The coding agent's work is kept on $current"
    fi
    git switch --quiet -c "demo/backup-$(stamp)" "$BACKUP_BRANCH" 2>/dev/null || git switch --quiet -c "demo/backup-$(stamp)" "origin/$BACKUP_BRANCH"
    start_server
    say "The finished version is live. Reload the page in the browser."
    ;;
  finish)
    stop_server
    ;;
  *)
    sed -n '2,6p' "$0"
    ;;
esac
