# Map Data Sources

Map data © OpenStreetMap contributors, available under the Open Database Licence (ODbL): https://www.openstreetmap.org/copyright

The files in this folder are derived from OpenStreetMap data and are distributed under the same licence. The demo must show the credit '© OpenStreetMap contributors' on the map.

| File | Source | Data as of |
|---|---|---|
| roads-main, roads-secondary, railways, rivers, water, forest, towns, military | Geofabrik Estonia extract (shapefile) | 2 October 2026, 20:21 UTC |
| land | OpenStreetMap simplified land polygons, osmdata.openstreetmap.de | downloaded 5 October 2026 |
| borders | Natural Earth 1:10m land boundary lines (public domain) | downloaded 5 October 2026 |

Built by map/build-map.sh on 5 October 2026. The military file is OpenStreetMap's military land use as mapped: real training areas, ranges, barracks, headquarters and border posts, with their names in Estonian or Russian as given in OpenStreetMap.

## Exercise Area

The files in `area/` cut the exercise area at full detail: Universal Transverse Mercator (UTM) zone 35, eastings 400 to 470 km and northings 6540 to 6590 km, with a 3 km margin, all inside grid square 35V MF. Same source and date as the Geofabrik row above, and the same licence and credit. Layers: main, secondary and minor roads, tracks, railways, rivers and streams, lakes, wetland, forest, built-up areas, military areas and places down to hamlets. Built by the second part of map/build-map.sh on 5 October 2026.

## Outside The Exercise Area

The files in `outer/` are the country layers with the exercise area cut out, so that when the map is zoomed in the simplified country map carries on outside the box while the full-detail files fill it. The files in `inner/` are the same country layers inside the box only; `outer/` plus `inner/` make up the whole country map, and `inner/` is swapped for `area/` when zoomed in. `exercise-area.geojson` is the box itself. Same sources, licence and credit as above. Built by the third and fourth parts of map/build-map.sh on 5 October 2026.
