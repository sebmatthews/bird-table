// Details of the selected unit: type, role, grid reference and movement.
import { gridRef } from './grid';
import { movementAt, positionAt, type Unit } from './scenario';

const TYPES: Record<string, string> = {
  '110000': 'Headquarters', '121100': 'Infantry', '121102': 'Mechanised infantry', '120500': 'Armour',
  '121300': 'Reconnaissance', '130300': 'Field artillery', '140700': 'Engineers', '160000': 'Logistics',
};
const ECHELONS: Record<string, string> = { '14': 'platoon or troop', '15': 'company or squadron', '16': 'battalion', '18': 'brigade' };
const BEARINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export class UnitDetails {
  private last = '';
  constructor(private element: HTMLElement) {}

  update(unit: Unit | null, mins: number): void {
    if (!unit) return;
    const [e, n] = positionAt(unit, mins);
    const { kmh, heading } = movementAt(unit, mins);
    const type = TYPES[unit.sidc.slice(10, 16)] ?? 'Unit';
    const echelon = ECHELONS[unit.sidc.slice(8, 10)] ?? '';
    const headquarters = unit.sidc[7] === '2' ? ', headquarters' : '';
    const status = kmh > 0.5 ? `Moving ${BEARINGS[Math.round(heading / 45) % 8]} at ${Math.round(kmh)} km/h` : 'Stationary';
    const html = `<div class="name">${unit.name}</div>
      <div><span class="k">SIDE</span>${unit.side === 'blue' ? 'Blue' : 'OPFOR'}</div>
      <div><span class="k">TYPE</span>${type}, ${echelon}${headquarters}</div>
      <div><span class="k">ROLE</span>${unit.role}</div>
      <div><span class="k">GRID</span>${gridRef(e, n)}</div>
      <div><span class="k">STATUS</span>${status}</div>`;
    if (html !== this.last) { this.last = html; this.element.innerHTML = html; }
  }
}
