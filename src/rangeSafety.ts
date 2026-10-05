// Range safety: which units are inside a danger area while it is live, and the alert raised each time one enters.
// Everything is worked out from exercise time, so replaying, pausing or scrubbing always gives the same alerts.
import { gridRef } from './grid';
import { isLive, pointInPolygon, positionAt, type DangerArea, type Scenario, type Unit } from './scenario';

export interface Breach { unit: Unit; area: DangerArea }
export interface RangeSafetyAlert extends Breach { mins: number; e: number; n: number; text: string }

/** Exercise minutes between checks when working out alerts in advance: 15 seconds of exercise time. */
const STEP = 0.25;

/** Every unit inside a danger area while that area is live, at the given exercise time. */
export function breachesAt(scenario: Scenario, mins: number): Breach[] {
  const breaches: Breach[] = [];
  for (const area of scenario.dangerAreas) {
    if (!isLive(area, mins)) continue;
    for (const unit of scenario.units) {
      const [e, n] = positionAt(unit, mins);
      if (pointInPolygon(e, n, area.polygon)) breaches.push({ unit, area });
    }
  }
  return breaches;
}

/** A danger area's firing times as its label on the map writes them, for example '0800 TO 1000'. */
export function firingTimes(area: DangerArea): string {
  return area.live.map(([from, to]) => `${from.replace(':', '')} TO ${to.replace(':', '')}`).join(', ');
}

/** Every alert across the exercise day: one each time a unit enters a danger area while it is live. */
export function alertsForDay(scenario: Scenario, start: number, end: number): RangeSafetyAlert[] {
  const alerts: RangeSafetyAlert[] = [];
  const inside = new Set<string>();
  for (let mins = start; mins <= end; mins += STEP) {
    const now = new Set<string>();
    for (const { unit, area } of breachesAt(scenario, mins)) {
      const key = `${unit.id}|${area.id}`;
      now.add(key);
      if (!inside.has(key)) {
        const [e, n] = positionAt(unit, mins);
        alerts.push({ unit, area, mins, e, n, text:
          `RANGE SAFETY ALERT. ${unit.name} has entered ${area.label} while it is live (${firingTimes(area)}) at ${gridRef(e, n)}. Halt the unit and inform range control.` });
      }
    }
    inside.clear();
    now.forEach((k) => inside.add(k));
  }
  return alerts;
}
