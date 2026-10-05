// The event log: exercise events up to the current time, newest first.
import { hhmm, minutes, type ExerciseEvent } from './scenario';

export class EventLog {
  private shown = -1;

  constructor(private element: HTMLElement, private events: ExerciseEvent[]) {}

  update(mins: number): void {
    const due = this.events.filter((e) => minutes(e.t) <= mins);
    if (due.length === this.shown) return;   // only redraw when an event is added or the clock restarts
    this.shown = due.length;
    this.element.innerHTML = due.slice().reverse().map((e) =>
      `<div class="entry"><div class="meta">${hhmm(minutes(e.t))} · ${e.from} → ${e.to}</div><div class="text">${e.text}</div></div>`).join('');
  }
}
