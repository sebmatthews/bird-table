import { describe, it, expect } from 'vitest';
import data from '../scenario/grey-heron.json';
import { minutes, type Scenario } from '../src/scenario';
import { alertsForDay, breachesAt } from '../src/rangeSafety';

const scenario = data as unknown as Scenario;
const alerts = alertsForDay(scenario, minutes(scenario.start), minutes(scenario.end));

describe('range safety alerts across the exercise day', () => {
  it('raises exactly four alerts', () => {
    expect(alerts).toHaveLength(4);
  });
  it.each([
    ['1 TP ENGR', '08:32'], ['A SQN 3 ARMD BN', '08:34'], ['B SQN 3 ARMD BN', '08:44'], ['C COY 2 INF BN', '09:22'],
  ])('alerts %s at about %s', (name, time) => {
    const alert = alerts.find((a) => a.unit.name === name);
    expect(alert).toBeDefined();
    expect(Math.abs(alert!.mins - minutes(time))).toBeLessThanOrEqual(1);
  });
  it.each(['2 TP ENGR', 'B COY 2 INF BN'])('raises no alert for %s, which crosses after the area goes cold', (name) => {
    expect(alerts.find((a) => a.unit.name === name)).toBeUndefined();
  });
  it('writes the alert in full', () => {
    const a = alerts.find((x) => x.unit.name === 'A SQN 3 ARMD BN')!;
    expect(a.text).toMatch(/^RANGE SAFETY ALERT\. A SQN 3 ARMD BN has entered DANGER AREA 1 while it is live \(0800 TO 1000\) at 35V MF \d{4} \d{4}\. Halt the unit and inform range control\.$/);
  });
});

describe('breaches at a moment', () => {
  it('finds A Squadron inside the live area at 0840', () => {
    expect(breachesAt(scenario, minutes('08:40')).map((b) => b.unit.name)).toContain('A SQN 3 ARMD BN');
  });
  it('finds no breach once the area is cold', () => {
    expect(breachesAt(scenario, minutes('10:30'))).toHaveLength(0);
  });
});
