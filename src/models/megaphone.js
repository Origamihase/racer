// Das Megafon in Mini Adams Hand (BrunnenTV): dasselbe Modell wie auf dem Beifahrersitz im Cockpit (cockpit/props.js
// megaphone: weißer Trichter mit rotem Rand, Gitter, Pistolengriff mit rotem Auslöser), hier als ein Mesh mit
// Vertexfarben für die gebogene Welt. main.js baut es erst bei der ersten Folge.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { megaphone } from '../cockpit/props.js';

/** Megafon im Rahmen von props.js (Achse +y zur Öffnung, Griff nach −x, Mundstück bei y ≈ −0,02, Länge 0,18 m). */
export function buildHandMegaphone() {
  const S = { gloss: [], perf: [] };
  megaphone(S, new THREE.Matrix4());
  const list = [...S.gloss, ...S.perf];
  const mesh = new THREE.Mesh(mergeGeometries(list), W.std({ vertexColors: true, roughness: 0.38, metalness: 0.05 }));
  for (const g of list) g.dispose();
  mesh.name = 'Megafon';
  mesh.castShadow = true;
  return mesh;
}
