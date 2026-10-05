import { describe, it, expect } from 'vitest';
import { ExerciseClock } from '../src/clock';
import { minutes } from '../src/scenario';

describe('exercise clock', () => {
  it('plays the six-hour day in two minutes of real time', () => {
    const clock = new ExerciseClock('06:00', '12:00');
    clock.tick(60);
    expect(clock.now).toBe(minutes('09:00'));
  });
  it('starts again from 0600 when the day ends', () => {
    const clock = new ExerciseClock('06:00', '12:00');
    clock.tick(121);
    expect(clock.now).toBe(minutes('06:00'));
  });
  it('does not move while paused', () => {
    const clock = new ExerciseClock('06:00', '12:00');
    clock.toggle(); clock.tick(30);
    expect(clock.now).toBe(minutes('06:00'));
  });
  it('keeps a seek within the exercise day', () => {
    const clock = new ExerciseClock('06:00', '12:00');
    clock.seek(minutes('05:00')); expect(clock.now).toBe(minutes('06:00'));
    clock.seek(minutes('13:00')); expect(clock.now).toBe(minutes('12:00'));
    clock.jumpTo('08:25'); expect(clock.now).toBe(minutes('08:25'));
  });
});
