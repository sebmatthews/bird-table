// The event log: exercise events and range safety alerts up to the current time, newest first.
import { hhmm, minutes, type ExerciseEvent } from './scenario';
import type { RangeSafetyAlert } from './rangeSafety';

interface Entry { mins: number; meta: string; text: string; alert: boolean }

export class EventLog {
  private shown = -1;

  private entries: Entry[];

  constructor(private element: HTMLElement, events: ExerciseEvent[], alerts: RangeSafetyAlert[] = []) {
    this.entries = [
      ...events.map((e) => ({ mins: minutes(e.t), meta: `${hhmm(minutes(e.t))} · ${e.from} → ${e.to}`, text: e.text, alert: false })),
      ...alerts.map((a) => ({ mins: a.mins, meta: `${hhmm(a.mins)} · RANGE SAFETY CHECK → ALL`, text: a.text, alert: true })),
    ].sort((a, b) => a.mins - b.mins);
  }

  update(mins: number): void {
    const due = this.entries.filter((e) => e.mins <= mins);
    if (due.length === this.shown) return;   // only redraw when an entry is added or the clock goes back
    this.shown = due.length;
    this.element.innerHTML = due.slice().reverse().map((e) =>
      `<div class="entry${e.alert ? ' alert' : ''}"><div class="meta">${e.meta}</div><div class="text">${e.text}</div></div>`).join('');
  }
}
