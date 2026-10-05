#!/usr/bin/env bash
# Rebuilds the map data in map/data from source downloads.
# Not run during the demo. Run it when the map needs rebuilding.
#
# Sources (download into a working folder outside the repository first):
#   estonia-latest-free.shp.zip  https://download.geofabrik.de/europe/estonia-latest-free.shp.zip  (unzip into est/)
#   simplified-land-polygons-complete-3857.zip  https://osmdata.openstreetmap.de/download/simplified-land-polygons-complete-3857.zip  (unzip into land/)
#   ne_10m_admin_0_boundary_lines_land.geojson  https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_boundary_lines_land.geojson  (save as borders.geojson)
# Tool: mapshaper 0.7.76 (npm install mapshaper@0.7.76)
set -e
M=./node_modules/.bin/mapshaper
B="21.0,57.2,29.0,60.0"
O=${OUT:-out}; mkdir -p $O
P="precision=0.0001 format=geojson geojson-type=FeatureCollection"
$M land/simplified-land-polygons-complete-3857/simplified_land_polygons.shp -proj wgs84 -clip bbox=$B -simplify 40% keep-shapes -o $O/land.geojson $P
$M borders.geojson -clip bbox=$B -filter-fields ADM0_A3_L,ADM0_A3_R -o $O/borders.geojson $P
$M est/gis_osm_roads_free_1.shp -filter "['motorway','trunk','primary'].indexOf(fclass)>-1" -filter-fields fclass,ref -dissolve fclass,ref -simplify 8% -o $O/roads-main.geojson $P
$M est/gis_osm_roads_free_1.shp -filter "fclass=='secondary'" -filter-fields ref -dissolve ref -simplify 8% -o $O/roads-secondary.geojson $P
$M est/gis_osm_railways_free_1.shp -filter "fclass=='rail'" -dissolve -simplify 8% -o $O/railways.geojson $P
$M est/gis_osm_waterways_free_1.shp -filter "fclass=='river'" -filter-fields fields=name -dissolve fields=name -simplify 8% -o $O/rivers.geojson $P
$M est/gis_osm_water_a_free_1.shp -filter "['water','reservoir','riverbank'].indexOf(fclass)>-1 && this.area>500000" -filter-fields fclass -simplify 10% keep-shapes -o $O/water.geojson $P
$M est/gis_osm_landuse_a_free_1.shp -filter "fclass=='forest' && this.area>1000000" -dissolve2 -simplify 5% -filter-slivers min-area=1km2 -o $O/forest.geojson $P
$M est/gis_osm_landuse_a_free_1.shp -filter "fclass=='military'" -filter-fields fields=name -simplify 20% keep-shapes -o $O/military.geojson $P
$M est/gis_osm_places_free_1.shp -filter "['city','town','national_capital'].indexOf(fclass)>-1" -filter-fields name,fclass,population -o $O/towns.geojson $P
ls -la $O

# ---- Exercise area at full detail (written to $OUT_AREA, default area/) ----
U="+proj=utm +zone=35 +datum=WGS84 +units=m +no_defs"
BOX="397000,6537000,473000,6593000"   # exercise area E400-470 N6540-6590 km in UTM zone 35, plus 3 km margin
O=${OUT_AREA:-area}; mkdir -p $O
P="precision=0.00001 format=geojson geojson-type=FeatureCollection"
cut(){ $M "$1" -filter "$2" -filter-fields fields=$3 -proj "$U" -clip bbox=$BOX "${@:5}" -proj wgs84 -o $O/$4.geojson $P; }
cut est/gis_osm_roads_free_1.shp "['motorway','trunk','primary','motorway_link','trunk_link','primary_link'].indexOf(fclass)>-1" ref roads-main -simplify interval=10
cut est/gis_osm_roads_free_1.shp "['secondary','secondary_link'].indexOf(fclass)>-1" ref roads-secondary -simplify interval=10
cut est/gis_osm_roads_free_1.shp "['tertiary','tertiary_link','unclassified'].indexOf(fclass)>-1" ref roads-minor -simplify interval=10
cut est/gis_osm_roads_free_1.shp "fclass=='track'" fclass tracks -simplify interval=10
cut est/gis_osm_railways_free_1.shp "fclass=='rail'" fclass railways -simplify interval=10
cut est/gis_osm_waterways_free_1.shp "['river','stream','canal'].indexOf(fclass)>-1" fclass,name rivers -simplify interval=10
cut est/gis_osm_water_a_free_1.shp "['water','reservoir','riverbank'].indexOf(fclass)>-1" fclass water -filter "this.area>5000" -simplify interval=10
cut est/gis_osm_water_a_free_1.shp "fclass.indexOf('wetland')==0" fclass wetland -filter "this.area>20000" -simplify interval=15
cut est/gis_osm_landuse_a_free_1.shp "fclass=='forest'" fclass forest -dissolve2 -filter "this.area>20000" -simplify interval=15
cut est/gis_osm_landuse_a_free_1.shp "fclass=='residential'" fclass built-up -filter "this.area>20000" -simplify interval=10
cut est/gis_osm_landuse_a_free_1.shp "fclass=='military'" name military -simplify interval=10
cut est/gis_osm_places_free_1.shp "['city','town','village','hamlet','national_capital'].indexOf(fclass)>-1" name,fclass,population places

# ---- Country layers with the exercise area cut out (written to $OUT_OUTER, default outer/) ----
# Shown alongside the full-detail area when zoomed in, so the map carries on beyond the box.
# exercise-area.geojson is the box E400-470 N6540-6590 km in UTM zone 35, as latitude and longitude, 1 km steps along each side.
OO=${OUT_OUTER:-outer}; mkdir -p $OO
for f in forest water rivers roads-main roads-secondary railways military towns; do
  $M ${OUT:-out}/$f.geojson -erase exercise-area.geojson -o $OO/$f.geojson precision=0.0001 format=geojson geojson-type=FeatureCollection
done

# ---- Country layers inside the exercise area only (written to $OUT_INNER, default inner/) ----
# With outer/, these make up the whole country map; inner/ is swapped for area/ (full detail) when zoomed in.
OI=${OUT_INNER:-inner}; mkdir -p $OI
for f in forest water rivers roads-main roads-secondary railways military towns; do
  $M ${OUT:-out}/$f.geojson -clip exercise-area.geojson -o $OI/$f.geojson precision=0.0001 format=geojson geojson-type=FeatureCollection
done
