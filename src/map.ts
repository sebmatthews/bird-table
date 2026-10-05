// The map: a flat map in UTM zone 35 kilometres, with the military grid, the country map,
// and the exercise area at full detail when zoomed in.
import L from 'leaflet';
import { STYLE, DETAIL_ZOOM, EXERCISE_AREA, OPENING_VIEW } from './config';
import { toGrid, square100, ZONE } from './grid';

type Geo = GeoJSON.FeatureCollection;

/** Leaflet positions on this map are [northing, easting] in kilometres. */
export const at = (e: number, n: number) => L.latLng(n, e);

async function load(path: string): Promise<Geo> {
  const response = await fetch(`/map/data/${path}.geojson`);
  if (!response.ok) throw new Error(`Could not load map data ${path}`);
  const data: Geo = await response.json();
  data.features = data.features.filter((f) => f.geometry);
  return data;
}

/** Project every coordinate from longitude and latitude to grid kilometres, in place. */
function project(data: Geo): Geo {
  const walk = (c: any): any => (typeof c[0] === 'number' ? toGrid(c[0], c[1]) : c.map(walk));
  for (const f of data.features) (f.geometry as any).coordinates = walk((f.geometry as any).coordinates);
  return data;
}

export async function createMap(element: HTMLElement): Promise<L.Map> {
  const map = L.map(element, { crs: L.CRS.Simple, zoomSnap: 0.25, zoomDelta: 0.5, attributionControl: false, minZoom: 0, maxZoom: 7 });
  const view = OPENING_VIEW;
  map.options.zoomSnap = 0;   // fit the opening view exactly, whatever the screen
  map.fitBounds([[view.n0, view.e0], [view.n1, view.e1]], { animate: false });
  map.options.zoomSnap = 0.25;
  element.style.background = STYLE.sea;

  const renderer = L.canvas({ padding: 0.5 });
  const paths = ['land', 'borders',
    ...['forest', 'water', 'military', 'rivers', 'roads-secondary', 'roads-main', 'railways', 'towns'].flatMap((n) => [`inner/${n}`, `outer/${n}`]),
    ...['forest', 'wetland', 'water', 'built-up', 'military', 'rivers', 'tracks', 'roads-minor', 'roads-secondary', 'roads-main', 'railways', 'places'].map((n) => `area/${n}`)];
  const data: Record<string, Geo> = {};
  await Promise.all(paths.map(async (p) => { data[p] = project(await load(p)); }));

  const layer = (path: string, style: L.PathOptions) =>
    // Leaflet hands these options to each shape it creates, so the renderer applies, though its types do not list it.
    L.geoJSON(data[path], { renderer, interactive: false, style: () => style, coordsToLatLng: (c) => L.latLng(c[1], c[0]) } as L.GeoJSONOptions);
  const fill = (s: { colour: string; opacity: number }): L.PathOptions => ({ stroke: false, fill: true, fillColor: s.colour, fillOpacity: s.opacity });
  const line = (s: { colour: string; weight: number; opacity?: number; dash?: string }): L.PathOptions =>
    ({ color: s.colour, weight: s.weight, opacity: s.opacity ?? 1, dashArray: s.dash, fill: false });
  const military: L.PathOptions = { color: STYLE.military.colour, weight: STYLE.military.weight, dashArray: STYLE.military.dash, fillColor: STYLE.military.colour, fillOpacity: STYLE.military.opacity };

  // Country layers, in two parts: outside the exercise area (always shown) and inside it (shown when zoomed out).
  const country = (part: 'inner' | 'outer') => [
    layer(`${part}/forest`, fill(STYLE.forest)), layer(`${part}/water`, fill(STYLE.water)), layer(`${part}/military`, military),
    layer(`${part}/rivers`, line(STYLE.river)), layer(`${part}/roads-secondary`, line(STYLE.roadSecondary)),
    layer(`${part}/roads-main`, line(STYLE.roadMain)), layer(`${part}/railways`, line(STYLE.rail)),
  ];
  const land = layer('land', { color: STYLE.coast.colour, weight: STYLE.coast.weight, fillColor: STYLE.land, fillOpacity: 1 });
  const outer = L.layerGroup(country('outer'));
  const inner = L.layerGroup(country('inner'));
  const detail = L.layerGroup([
    layer('area/forest', fill(STYLE.forest)), layer('area/wetland', fill(STYLE.wetland)), layer('area/water', fill(STYLE.water)),
    layer('area/built-up', fill(STYLE.builtUp)), layer('area/military', military), layer('area/rivers', line(STYLE.river)),
    layer('area/tracks', line(STYLE.track)), layer('area/roads-minor', line(STYLE.roadMinor)), layer('area/roads-secondary', line(STYLE.roadSecondary)),
    layer('area/roads-main', line(STYLE.roadMain)), layer('area/railways', line(STYLE.rail)),
  ]);
  const borders = layer('borders', line(STYLE.border));
  land.addTo(map); outer.addTo(map);

  // Place names and military area names.
  const label = (ll: L.LatLng, text: string, className: string, direction: L.Direction = 'right', dot = true) => {
    const m = dot ? L.circleMarker(ll, { renderer, radius: 2, stroke: false, fillColor: STYLE.towns.colour, fillOpacity: 1, interactive: false })
                  : L.marker(ll, { opacity: 0, interactive: false });
    return m.bindTooltip(text, { permanent: true, direction, offset: dot ? [4, 0] : [0, 0], className });
  };
  const places = (path: string, filter: (p: any) => boolean, upper: boolean, className: string) => L.layerGroup(
    data[path].features.filter((f) => filter(f.properties)).map((f) => {
      const [e, n] = (f.geometry as GeoJSON.Point).coordinates;
      return label(at(e, n), upper ? f.properties!.name.toUpperCase() : f.properties!.name, className);
    }));
  const isTown = (p: any) => ['town', 'city', 'national_capital'].includes(p.fclass);
  const outerTowns = places('outer/towns', () => true, true, 'town');
  const innerTowns = places('inner/towns', () => true, true, 'town');
  const detailTowns = places('area/places', isTown, true, 'town');
  const villages = places('area/places', (p) => p.fclass === 'village', false, 'village');
  const militaryNames = (path: string) => L.layerGroup(data[path].features.filter((f) => f.properties?.name).map((f) => {
    const bounds = L.geoJSON(f, { coordsToLatLng: (c) => L.latLng(c[1], c[0]) }).getBounds();
    return label(bounds.getCenter(), f.properties!.name, 'military-name', 'center', false);
  }));
  const outerMilitaryNames = militaryNames('outer/military'), innerMilitaryNames = militaryNames('inner/military'), detailMilitaryNames = militaryNames('area/military');

  // The military grid: 100 km squares with their letters, and 10 km lines when zoomed in.
  const gridLines = (step: number) => {
    const lines: L.LatLngExpression[][] = [];
    for (let e = 100; e <= 700; e += step) lines.push([[6300, e], [6700, e]]);
    for (let n = 6300; n <= 6700; n += step) lines.push([[n, 100], [n, 700]]);
    return lines;
  };
  const grid100 = L.polyline(gridLines(100), { renderer, interactive: false, color: STYLE.grid.colour, opacity: STYLE.grid.opacity, weight: STYLE.grid.weight100 });
  const grid10 = L.polyline(gridLines(10), { renderer, interactive: false, color: STYLE.grid.colour, opacity: STYLE.grid.opacity, weight: STYLE.grid.weight10 });
  const squareNames = L.layerGroup();
  for (let e = 100; e < 700; e += 100) for (let n = 6300; n < 6700; n += 100)
    squareNames.addLayer(label(at(e + 50, n + 50), `${ZONE}V ${square100(ZONE, e * 1000 + 1, n * 1000 + 1)}`, 'square-name', 'center', false));
  grid100.addTo(map); squareNames.addTo(map);

  const box = L.rectangle([[EXERCISE_AREA.n0, EXERCISE_AREA.e0], [EXERCISE_AREA.n1, EXERCISE_AREA.e1]],
    { renderer, fill: false, interactive: false, color: STYLE.areaBox.colour, weight: STYLE.areaBox.weight, dashArray: STYLE.areaBox.dash });
  box.addTo(map); borders.addTo(map); outerTowns.addTo(map);

  // What shows at which zoom.
  const show = (l: L.Layer, on: boolean) => { if (on && !map.hasLayer(l)) l.addTo(map); if (!on && map.hasLayer(l)) map.removeLayer(l); };
  const update = () => {
    const z = map.getZoom(), full = z >= DETAIL_ZOOM;
    show(inner, !full); show(detail, full);
    show(innerTowns, !full && z >= STYLE.towns.fromZoom); show(detailTowns, full); show(villages, full && z >= STYLE.towns.villagesFromZoom);
    show(outerTowns, z >= STYLE.towns.fromZoom);
    const names = z >= STYLE.military.labelsFromZoom;
    show(outerMilitaryNames, names); show(innerMilitaryNames, names && !full); show(detailMilitaryNames, names && full);
    show(grid10, z >= STYLE.grid.tenKmFromZoom);
    // Keep the drawing order: land, country map and detail, then lines on top.
    land.bringToBack(); grid10.bringToFront(); grid100.bringToFront(); borders.bringToFront(); box.bringToFront();
  };
  map.on('zoomend', update);
  update();
  return map;
}
