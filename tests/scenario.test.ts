import { describe, it, expect } from 'vitest';
import data from '../scenario/grey-heron.json';
import { minutes, hhmm, positionAt, isLive, pointInPolygon, type Scenario } from '../src/scenario';

const scenario = data as unknown as Scenario;
const unit = (name: string) => scenario.units.find((u) => u.name === name)!;
const area = scenario.dangerAreas[0];

describe('exercise time', () => {
  it('converts between HH:MM and minutes', () => {
    expect(minutes('08:25')).toBe(505);
    expect(hhmm(505)).toBe('0825');
  });
});

describe('unit movement', () => {
  it('holds a unit at its first waypoint before it moves', () => {
    const u = unit('A SQN 3 ARMD BN');
    expect(positionAt(u, minutes('06:00'))).toEqual([u.route[0].e, u.route[0].n]);
  });
  it('moves a unit in a straight line between waypoints', () => {
    const u = unit('2 INF BN HQ');   // 441,6573 at 08:10 to 438.5,6574 at 08:40
    const [e, n] = positionAt(u, minutes('08:25'));
    expect(e).toBeCloseTo(439.75, 5);
    expect(n).toBeCloseTo(6573.5, 5);
  });
  it('holds a unit at its last waypoint afterwards', () => {
    const u = unit('1 INF BN HQ');
    const last = u.route[u.route.length - 1];
    expect(positionAt(u, minutes('12:00'))).toEqual([last.e, last.n]);
  });
});

describe('danger area timing', () => {
  it('is cold before 0800, live from 0800, and cold again from 1000', () => {
    expect(isLive(area, minutes('07:59'))).toBe(false);
    expect(isLive(area, minutes('08:00'))).toBe(true);
    expect(isLive(area, minutes('09:59'))).toBe(true);
    expect(isLive(area, minutes('10:00'))).toBe(false);
  });
});

describe('danger area shape', () => {
  it('contains the middle of target areas 1 and 2', () => {
    expect(pointInPolygon(433.2, 6581.7, area.polygon)).toBe(true);
  });
  it('does not contain Tapa', () => {
    expect(pointInPolygon(440.9, 6569.7, area.polygon)).toBe(false);
  });
  it('has A Squadron inside at 0840, while the area is live', () => {
    const [e, n] = positionAt(unit('A SQN 3 ARMD BN'), minutes('08:40'));
    expect(pointInPolygon(e, n, area.polygon)).toBe(true);
    expect(isLive(area, minutes('08:40'))).toBe(true);
  });
});
