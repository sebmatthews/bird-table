// The scenario: units, their timed routes, danger areas and their firing times, and the exercise events.
// Positions are kilometres in UTM zone 35. Times are exercise time, 'HH:MM'.

export interface Waypoint { t: string; e: number; n: number }
export interface Unit { id: string; side: 'blue' | 'red'; name: string; sidc: string; role: string; route: Waypoint[] }
export interface DangerArea { id: string; label: string; polygon: [number, number][]; live: [string, string][] }
export interface ExerciseEvent { t: string; from: string; to: string; text: string }
export interface Scenario {
  name: string; start: string; end: string;
  units: Unit[]; dangerAreas: DangerArea[]; events: ExerciseEvent[];
}

export async function loadScenario(url = '/scenario/grey-heron.json'): Promise<Scenario> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load the scenario from ${url}`);
  return response.json();
}

/** 'HH:MM' to minutes after midnight. */
export function minutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Minutes after midnight to 'HHMM', the way times are shown on the picture. */
export function hhmm(mins: number): string {
  const m = Math.floor(mins);
  return String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0');
}

/**
 * Where a unit is at a given exercise time. Between waypoints it moves in a straight line at a steady
 * speed; before its first waypoint and after its last it stays still.
 */
export function positionAt(unit: Unit, mins: number): [number, number] {
  const route = unit.route;
  if (mins <= minutes(route[0].t)) return [route[0].e, route[0].n];
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1], b = route[i];
    const ta = minutes(a.t), tb = minutes(b.t);
    if (mins <= tb) {
      const k = tb === ta ? 1 : (mins - ta) / (tb - ta);
      return [a.e + (b.e - a.e) * k, a.n + (b.n - a.n) * k];
    }
  }
  const last = route[route.length - 1];
  return [last.e, last.n];
}

/** Speed in km/h and heading in degrees (0 is north) at a given exercise time. */
export function movementAt(unit: Unit, mins: number): { kmh: number; heading: number } {
  const [e1, n1] = positionAt(unit, mins);
  const [e2, n2] = positionAt(unit, mins + 1);
  const kmh = Math.hypot(e2 - e1, n2 - n1) * 60;
  const heading = (Math.atan2(e2 - e1, n2 - n1) * 180 / Math.PI + 360) % 360;
  return { kmh, heading };
}

/** Whether a danger area is live at a given exercise time. Live from the start time, cold again at the end time. */
export function isLive(area: DangerArea, mins: number): boolean {
  return area.live.some(([from, to]) => mins >= minutes(from) && mins < minutes(to));
}

/** Whether a point (kilometres) lies inside a polygon (kilometres), by ray casting. */
export function pointInPolygon(e: number, n: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ei, ni] = polygon[i], [ej, nj] = polygon[j];
    if ((ni > n) !== (nj > n) && e < ((ej - ei) * (n - ni)) / (nj - ni) + ei) inside = !inside;
  }
  return inside;
}
