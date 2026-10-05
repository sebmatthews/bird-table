// Bird Table: a fictional land common operating picture for Exercise GREY HERON.
// Leaflet's own styles first, so the picture's styles below take precedence.
import 'leaflet/dist/leaflet.css';
import './style.css';
import { createMap } from './map';
import { gridRef } from './grid';
import { loadScenario, hhmm, type Unit } from './scenario';
import { ExerciseClock } from './clock';
import { UnitLayer } from './units';
import { DangerAreaLayer } from './dangerAreas';
import { EventLog } from './eventLog';
import { UnitDetails } from './details';
import { Timeline } from './timeline';
import { alertsForDay, breachesAt } from './rangeSafety';
import { JUMP_TO } from './config';

const $ = (id: string) => document.getElementById(id)!;

async function start(): Promise<void> {
  const [map, scenario] = await Promise.all([createMap($('map')), loadScenario()]);
  const clock = new ExerciseClock(scenario.start, scenario.end);
  const dangerAreas = new DangerAreaLayer(map, scenario.dangerAreas);
  const log = new EventLog($('log'), scenario.events, alertsForDay(scenario, clock.start, clock.end));
  const details = new UnitDetails($('details'));
  const units = new UnitLayer(map, scenario.units, (unit: Unit) => details.update(unit, clock.now));

  const timeline = new Timeline($('timeline'), clock, scenario);

  // Presenter keys: space to pause or play, R to restart from 0600, J to jump to just before the counter-attack.
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { e.preventDefault(); clock.toggle(); }
    if (e.key === 'r' || e.key === 'R') clock.restart();
    if (e.key === 'j' || e.key === 'J') clock.jumpTo(JUMP_TO);
  });

  map.on('mousemove', (e) => { $('grid').textContent = 'GRID ' + gridRef(e.latlng.lng, e.latlng.lat); });
  const showZoom = () => { $('zoom').textContent = 'ZOOM ' + map.getZoom().toFixed(2); };
  map.on('zoomend', showZoom); showZoom();

  let last = performance.now();
  const frame = (time: number) => {
    clock.tick((time - last) / 1000);
    last = time;
    const breaches = breachesAt(scenario, clock.now);
    units.setAlerts(new Set(breaches.map((b) => b.unit.id)));
    units.update(clock.now);
    dangerAreas.update(clock.now, new Set(breaches.map((b) => b.area.id)));
    log.update(clock.now);
    details.update(units.selected, clock.now);
    timeline.update();
    $('exclock').textContent = `EX GREY HERON · ${hhmm(clock.now)}`;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

start().catch((error) => {
  document.body.insertAdjacentHTML('beforeend', `<div class="failure">Bird Table could not start: ${error.message}</div>`);
  throw error;
});
