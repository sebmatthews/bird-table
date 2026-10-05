// The grid: converting latitude and longitude to UTM zone 35 kilometres, and writing grid references.
import proj4 from 'proj4';

export const ZONE = 35;
const UTM = `+proj=utm +zone=${ZONE} +datum=WGS84 +units=m +no_defs`;
const toUtm = proj4('EPSG:4326', UTM);

/** Longitude and latitude to [easting, northing] in kilometres, UTM zone 35. */
export function toGrid(lon: number, lat: number): [number, number] {
  const [e, n] = toUtm.forward([lon, lat]);
  return [e / 1000, n / 1000];
}

/** The two letters of the 100 km square (Military Grid Reference System lettering). */
export function square100(zone: number, eMetres: number, nMetres: number): string {
  const set = zone % 6 || 6;
  const columns = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ'][(set - 1) % 3];
  const rows = 'ABCDEFGHJKLMNPQRSTUV';
  const column = columns[Math.floor(eMetres / 100000) - 1] ?? '?';
  const row = rows[(Math.floor(nMetres / 100000) + (zone % 2 === 0 ? 5 : 0)) % 20];
  return column + row;
}

/** A 10 metre grid reference, for example '35V MF 3478 8491', from kilometres. */
export function gridRef(eKm: number, nKm: number): string {
  const e = eKm * 1000, n = nKm * 1000;
  const digits = (v: number) => String(Math.floor((((v % 100000) + 100000) % 100000) / 10)).padStart(4, '0');
  return `${ZONE}V ${square100(ZONE, e, n)} ${digits(e)} ${digits(n)}`;
}
