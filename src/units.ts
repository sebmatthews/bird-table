// Units on the map, drawn as NATO symbols (APP-6) by milsymbol. Symbols grow and shrink with the zoom.
import L from 'leaflet';
import ms from 'milsymbol';
import { STYLE } from './config';
import { at } from './map';
import { positionAt, type Unit } from './scenario';

export class UnitLayer {
  private markers = new Map<string, L.Marker>();
  private ring = L.circleMarker([0, 0], { interactive: false, fill: false, weight: 2, dashArray: '3 3', color: STYLE.selected.colour });
  selected: Unit | null = null;

  constructor(private map: L.Map, private units: Unit[], onSelect: (unit: Unit) => void) {
    for (const unit of units) {
      const marker = L.marker([0, 0], { keyboard: false, zIndexOffset: unit.side === 'blue' ? 100 : 0 });
      marker.on('click', () => { this.selected = unit; onSelect(unit); });
      marker.addTo(map);
      this.markers.set(unit.id, marker);
    }
    map.on('zoomend', () => this.drawSymbols());
    this.drawSymbols();
  }

  /** Symbol size in pixels for the current zoom. */
  size(): number {
    const u = STYLE.units;
    const s = u.size * Math.pow(2, (this.map.getZoom() - u.refZoom) * u.scale);
    return Math.round(Math.max(u.min, Math.min(u.max, s)));
  }

  private drawSymbols(): void {
    const size = this.size(), labels = this.map.getZoom() >= STYLE.units.labelsFromZoom;
    for (const unit of this.units) {
      const symbol = new ms.Symbol(unit.sidc, { size, colorMode: 'Light', fill: true });
      const anchor = symbol.getAnchor(), box = symbol.getSize();
      const marker = this.markers.get(unit.id)!;
      marker.setIcon(L.divIcon({ className: 'unit-icon', html: symbol.asSVG(), iconSize: [box.width, box.height], iconAnchor: [anchor.x, anchor.y] }));
      marker.unbindTooltip();
      if (labels) marker.bindTooltip(unit.name, { permanent: true, direction: 'bottom', offset: [0, box.height - anchor.y], className: 'unit-name' });
    }
  }

  /** Move every unit to where it is at the given exercise time. */
  update(mins: number): void {
    for (const unit of this.units) {
      const [e, n] = positionAt(unit, mins);
      this.markers.get(unit.id)!.setLatLng(at(e, n));
    }
    if (this.selected) {
      const [e, n] = positionAt(this.selected, mins);
      this.ring.setLatLng(at(e, n)).setRadius(this.size() * 0.95);
      if (!this.map.hasLayer(this.ring)) this.ring.addTo(this.map);
    }
  }
}
