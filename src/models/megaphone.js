// Das Megafon in Mini Adams Hand (BrunnenTV): dasselbe Modell wie auf dem Beifahrersitz im Cockpit (cockpit/props.js
// megaphone: weißer Trichter mit rotem Rand, Gitter, Pistolengriff mit rotem Auslöser), hier als ein Mesh mit
// Vertexfarben für die gebogene Welt. main.js baut es erst bei der ersten Folge.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { W } from '../curve.js';
import { megaphone } from '../cockpit/props.js';

/**
 * Megafon im Rahmen von props.js (Achse +y zur Öffnung, Griff nach −x, Mundstück bei y ≈ −0,02, Länge 0,18 m).
 * curved: Material für die gebogene Welt (Mini Adam im Auto), sonst gerade (die Figur in der Facecam).
 */
export function buildHandMegaphone({ curved = true } = {}) {
  const S = { gloss: [], perf: [] };
  megaphone(S, new THREE.Matrix4());
  const list = [...S.gloss, ...S.perf];
  const params = { vertexColors: true, roughness: 0.38, metalness: 0.05 };
  const mesh = new THREE.Mesh(mergeGeometries(list), curved ? W.std(params) : new THREE.MeshStandardMaterial(params));
  for (const g of list) g.dispose();
  mesh.name = 'Megafon';
  mesh.castShadow = true;
  return mesh;
}
