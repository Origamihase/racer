// Woher die Daten der Karte kommen und was ihre Lizenzen verlangen – für „Über das Spiel“ (src/ui/menus.js).
// Quellen und Wege stehen in tools/map/README.md („Quellen und Lizenzen“). Drei der vier Quellen bitten um einen
// Nachweis dort, wo die Daten benutzt werden: GeoNames und ESA WorldCover (CC BY 4.0: Quelle und Lizenz nennen und
// sagen, dass die Daten angepasst wurden) und die Quellen der Höhenkacheln mit ihren Hinweisen im Wortlaut.

/**
 * Die Quellen der Karte: was (what), von wem (name, url), unter welcher Lizenz (license, optional mit licenseUrl) und
 * was das Spiel daran geändert hat (changed).
 */
export const MAP_SOURCES = [
  { what: 'Straßenverläufe, Küsten und Grenzen', name: 'Natural Earth', url: 'https://www.naturalearthdata.com/', license: 'gemeinfrei' },
  {
    what: 'Orte (Lage und Einwohnerzahlen)', name: 'GeoNames', url: 'https://www.geonames.org/',
    license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.de', changed: 'Auswahl und Namen fürs Spiel angepasst',
  },
  { what: 'Höhen', name: 'Terrain Tiles', by: 'Mapzen, AWS Open Data' },
  {
    what: 'Wald, Siedlungen und Äcker', name: 'ESA WorldCover 2021', url: 'https://esa-worldcover.org/',
    by: '© ESA WorldCover project 2021 / Contains modified Copernicus Sentinel data (2021) processed by ESA WorldCover consortium',
    license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.de', changed: 'vergröbert und zu Wald, Siedlung, Acker und Fels zusammengefasst',
  },
];

/**
 * Die Hinweise der Höhenquellen im Wortlaut (Seite „Attribution“ der Terrain Tiles, tilezen/joerd, gelesen am
 * 19.11.2026) – nie übersetzen, nie kürzen. Gezeigt wird der Hinweis jeder Quelle, deren Gebiet die Karte berührt;
 * where sagt, woran das hängt (cc: ein Land der Karte, north: Straßen nördlich dieser Breite), ohne where gilt der
 * Hinweis überall. tools/save-test.mjs prüft die Liste gegen die Karte: Kommt ein Land dazu oder fällt eins weg,
 * meldet sich der Test.
 */
export const TERRAIN_NOTICES = [
  { text: 'ArcticDEM terrain data DEM(s) were created from DigitalGlobe, Inc., imagery and funded under National Science Foundation awards 1043681, 1559691, and 1542736;', where: { north: 60 } },
  { text: 'Austria terrain data © offene Daten Österreichs – Digitales Geländemodell (DGM) Österreich;', where: { cc: 'AT' } },
  { text: 'Canada terrain data contains information licensed under the Open Government Licence – Canada;', where: { cc: 'CA' } },
  { text: 'Europe terrain data produced using Copernicus data and information funded by the European Union - EU-DEM layers;' },
  { text: 'Global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration' },
  { text: 'Mexico terrain data source: INEGI, Continental relief, 2016;', where: { cc: 'MX' } },
  { text: 'Norway terrain data © Kartverket;', where: { cc: 'NO' } },
  { text: 'United Kingdom terrain data © Environment Agency copyright and/or database right 2015. All rights reserved;', where: { cc: 'GB' } },
  { text: 'United States 3DEP (formerly NED) and global GMTED2010 and SRTM terrain data courtesy of the U.S. Geological Survey.' },
];
