// The exercise clock. Plays the exercise day in RUN_SECONDS of real time, then starts again.
import { RUN_SECONDS } from './config';
import { minutes } from './scenario';

export class ExerciseClock {
  readonly start: number;
  readonly end: number;
  now: number;
  playing = true;

  constructor(start: string, end: string) {
    this.start = minutes(start);
    this.end = minutes(end);
    this.now = this.start;
  }

  /** Advance by a number of real seconds. */
  tick(seconds: number): void {
    if (!this.playing) return;
    this.now += seconds * (this.end - this.start) / RUN_SECONDS;
    if (this.now > this.end) this.restart();
  }

  restart(): void { this.now = this.start; }
  jumpTo(time: string): void { this.seek(minutes(time)); }
  /** Move to any exercise time within the day. */
  seek(mins: number): void { this.now = Math.min(this.end, Math.max(this.start, mins)); }
  toggle(): void { this.playing = !this.playing; }
}
