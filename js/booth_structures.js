/**
 * booth_structures.js - Procedural CAD Architecture
 * Generates exact 50x50mm T-Slot Aluminum Extrusion profile, Octanorm walls & Valance boards.
 */

// --- 2D PROFILE GENERATOR: 50x50mm T-SLOT ALUMINUM EXTRUSION ---
function createTSlotGeometry(length, size = 0.05) {
  const s = size / 2; // Half size (0.025m = 25mm)
  const shape = new THREE.Shape();
  
  // T-slot dimension specifications
  const d1 = 0.0095; // Slot depth: 9.5mm
  const hw1 = 0.0045; // Half slot opening width: 9mm / 2 = 4.5mm
  const hw2 = 0.0090; // Half inner groove width: 18mm / 2 = 9.0mm
  
  // 1. Outer perimeter profile with 4 symmetrical T-Slots
  // Top Edge (+Y)
  shape.moveTo(-s, s);
  shape.lineTo(-hw1, s);
  shape.lineTo(-hw1, s - d1);
  shape.lineTo(-hw2, s - d1);
  shape.lineTo(hw2, s - d1);
  shape.lineTo(hw1, s - d1);
  shape.lineTo(hw1, s);
  shape.lineTo(s, s);
  
  // Right Edge (+X)
  shape.lineTo(s, hw1);
  shape.lineTo(s - d1, hw1);
  shape.lineTo(s - d1, hw2);
  shape.lineTo(s - d1, -hw2);
  shape.lineTo(s - d1, -hw1);
  shape.lineTo(s, -hw1);
  shape.lineTo(s, -s);
  
  // Bottom Edge (-Y)
  shape.lineTo(hw1, -s);
  shape.lineTo(hw1, -s + d1);
  shape.lineTo(hw2, -s + d1);
  shape.lineTo(-hw2, -s + d1);
  shape.lineTo(-hw1, -s + d1);
  shape.lineTo(-hw1, -s);
  shape.lineTo(-s, -s);
  
  // Left Edge (-X)
  shape.lineTo(-s, -hw1);
  shape.lineTo(-s + d1, -hw1);
  shape.lineTo(-s + d1, -hw2);
  shape.lineTo(-s + d1, hw2);
  shape.lineTo(-s + d1, hw1);
  shape.lineTo(-s, hw1);
  shape.lineTo(-s, s);
  
  // 2. Central Bore Hole (Diameter ~11mm)
  const centerHole = new THREE.Path();
  centerHole.absarc(0, 0, 0.0055, 0, Math.PI * 2, true);
  shape.holes.push(centerHole);
  
  // 3. 4 Corner Weight-Reduction Holes (Diameter ~6mm)
  const chR = 0.003;
  const chOffset = s - 0.0075;
  [
    [chOffset, chOffset],
    [-chOffset, chOffset],
    [-chOffset, -chOffset],
    [chOffset, -chOffset]
  ].forEach(([hx, hy]) => {
    const cornerHole = new THREE.Path();
    cornerHole.absarc(hx, hy, chR, 0, Math.PI * 2, true);
    shape.holes.push(cornerHole);
  });
  
  const extrudeSettings = {
    depth: length,
    bevelEnabled: false,
    steps: 1
  };
  
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center(); // Center geometry along extrusion depth
  return geo;
}

// --- WALLS & 02 VALANCE BOARDS ---
function buildBoothWalls() {
  const wallMatDefault = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  // 1. Back Wall (3m x 2.5m at Z = -1.5m)
  const backGeo = new THREE.PlaneGeometry(BOOTH_W, BOOTH_H);
  backwallMesh = new THREE.Mesh(backGeo, wallMatDefault.clone());
  backwallMesh.position.set(0, BOOTH_H / 2, -BOOTH_D / 2 + 0.01);
  backwallMesh.receiveShadow = true;
  boothGroup.add(backwallMesh);

  // 2. Side Wall (Left 3m x 2.5m at X = -1.5m)
  const sideGeo = new THREE.PlaneGeometry(BOOTH_D, BOOTH_H);
  sidewallMesh = new THREE.Mesh(sideGeo, wallMatDefault.clone());
  sidewallMesh.position.set(-BOOTH_W / 2 + 0.01, BOOTH_H / 2, 0);
  sidewallMesh.rotation.y = Math.PI / 2;
  sidewallMesh.receiveShadow = true;
  boothGroup.add(sidewallMesh);

  // 3. Valance Board Front (3m x 0.4m at Top Front Z = +1.5m)
  const valFrontGeo = new THREE.BoxGeometry(BOOTH_W - 0.05, VALANCE_H, 0.01);
  valanceFrontMesh = new THREE.Mesh(valFrontGeo, wallMatDefault.clone());
  valanceFrontMesh.position.set(0, BOOTH_H - VALANCE_H / 2, BOOTH_D / 2 - 0.005);
  valanceFrontMesh.castShadow = true;
  boothGroup.add(valanceFrontMesh);

  // 4. Valance Board Side (3m x 0.4m at Top Right X = +1.5m)
  const valSideGeo = new THREE.BoxGeometry(0.01, VALANCE_H, BOOTH_D - 0.05);
  valanceSideMesh = new THREE.Mesh(valSideGeo, wallMatDefault.clone());
  valanceSideMesh.position.set(BOOTH_W / 2 - 0.005, BOOTH_H - VALANCE_H / 2, 0);
  valanceSideMesh.castShadow = true;
  boothGroup.add(valanceSideMesh);
}

// --- ALUMINUM T-SLOT EXTRUSION FRAME ---
function buildAluminumFrame() {
  const aluMat = new THREE.MeshStandardMaterial({
    color: 0xd2d6dc,
    metalness: 0.88,
    roughness: 0.22
  });

  // 1. Vertical Posts (Length = 2.5m, Profile 50x50mm T-Slot)
  const postGeo = createTSlotGeometry(BOOTH_H, 0.05);

  const postPositions = [
    [-BOOTH_W/2, BOOTH_H/2, -BOOTH_D/2],
    [ BOOTH_W/2, BOOTH_H/2, -BOOTH_D/2],
    [-BOOTH_W/2, BOOTH_H/2,  BOOTH_D/2],
    [ BOOTH_W/2, BOOTH_H/2,  BOOTH_D/2],
    [-BOOTH_W/2 + 1.0, BOOTH_H/2, -BOOTH_D/2],
    [-BOOTH_W/2 + 2.0, BOOTH_H/2, -BOOTH_D/2],
    [-BOOTH_W/2, BOOTH_H/2, -BOOTH_D/2 + 1.0],
    [-BOOTH_W/2, BOOTH_H/2, -BOOTH_D/2 + 2.0],
  ];

  postPositions.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(postGeo, aluMat);
    post.position.set(px, py, pz);
    post.rotation.x = Math.PI / 2; // Extrude along Y
    post.castShadow = true;
    post.receiveShadow = true;
    frameGroup.add(post);
  });

  // 2. Horizontal Top Beams (Length = 3.0m, Profile 50x50mm T-Slot)
  const beamGeoX = createTSlotGeometry(BOOTH_W, 0.05);
  const beamGeoZ = createTSlotGeometry(BOOTH_D, 0.05);

  // Top Front Beam (along X)
  const topFrontBeam = new THREE.Mesh(beamGeoX, aluMat);
  topFrontBeam.position.set(0, BOOTH_H, BOOTH_D/2);
  topFrontBeam.rotation.y = Math.PI / 2;
  topFrontBeam.castShadow = true;
  frameGroup.add(topFrontBeam);

  // Top Right Beam (along Z)
  const topRightBeam = new THREE.Mesh(beamGeoZ, aluMat);
  topRightBeam.position.set(BOOTH_W/2, BOOTH_H, 0);
  topRightBeam.castShadow = true;
  frameGroup.add(topRightBeam);

  // Top Back Beam (along X)
  const topBackBeam = new THREE.Mesh(beamGeoX, aluMat);
  topBackBeam.position.set(0, BOOTH_H, -BOOTH_D/2);
  topBackBeam.rotation.y = Math.PI / 2;
  topBackBeam.castShadow = true;
  frameGroup.add(topBackBeam);

  // Top Left Beam (along Z)
  const topLeftBeam = new THREE.Mesh(beamGeoZ, aluMat);
  topLeftBeam.position.set(-BOOTH_W/2, BOOTH_H, 0);
  topLeftBeam.castShadow = true;
  frameGroup.add(topLeftBeam);
}
