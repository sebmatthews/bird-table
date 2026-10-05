// Range danger areas: drawn cold (grey, dashed) or live (orange, pulsing), with their firing times.
import L from 'leaflet';
import { STYLE } from './config';
import { isLive, type DangerArea } from './scenario';

interface Drawn { area: DangerArea; shape: L.Polygon; label: L.Marker; times: string }

export class DangerAreaLayer {
  private drawn: Drawn[];

  constructor(map: L.Map, areas: DangerArea[]) {
    const renderer = L.svg({ padding: 0.2 });   // its own layer, so it can change every frame cheaply
    this.drawn = areas.map((area) => {
      const shape = L.polygon(area.polygon.map(([e, n]) => [n, e] as L.LatLngTuple), { renderer, interactive: false }).addTo(map);
      const b = shape.getBounds();
      const label = L.marker([b.getSouth(), (b.getWest() + b.getEast()) / 2], { opacity: 0, interactive: false })
        .bindTooltip('', { permanent: true, direction: 'bottom', offset: [0, 4], className: 'danger-name' }).addTo(map);
      const times = area.live.map(([a, b2]) => `${a.replace(':', '')} TO ${b2.replace(':', '')}`).join(', ');
      return { area, shape, label, times };
    });
  }

  /** Show each area live or cold for the given exercise time. */
  update(mins: number): void {
    const pulse = 0.5 + 0.5 * Math.sin((performance.now() / 1000) * Math.PI * 2 * STYLE.danger.live.pulsesPerSecond);
    for (const d of this.drawn) {
      const live = isLive(d.area, mins);
      const s = live ? STYLE.danger.live : STYLE.danger.cold;
      d.shape.setStyle(live
        ? { color: s.colour, weight: s.weight, dashArray: undefined, fillColor: s.colour, fillOpacity: STYLE.danger.live.fill * (0.6 + 0.4 * pulse) }
        : { color: s.colour, weight: s.weight, dashArray: STYLE.danger.cold.dash, fillColor: s.colour, fillOpacity: STYLE.danger.cold.fill });
      const text = `${d.area.label} ${live ? 'LIVE' : 'COLD'} · ${d.times}`;
      const tip = d.label.getTooltip()!;
      if (tip.getContent() !== text) d.label.setTooltipContent(text);
      const el = tip.getElement(); if (el) el.style.color = s.colour;
    }
  }
}
