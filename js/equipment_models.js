/**
 * equipment_models.js - Procedural 3D Equipment & Furniture Models
 * Contains TV cart, Demo tables, Laser machine, Robot R-Tec box, Pipe rack & Guest chairs.
 */

// --- REUSABLE MODERN OFFICE / GUEST CHAIR ---
let demo1Chairs = [];
let demo2Chairs = [];
let roundTableChairs = [];

function setConceptChairsVisibility(showAllChairs) {
  demo1Chairs.forEach(c => { if (c) c.visible = showAllChairs; });
  demo2Chairs.forEach(c => { if (c) c.visible = showAllChairs; });
  roundTableChairs.forEach(c => { if (c) c.visible = showAllChairs; });
}

function createModernChair(seatColor = 0x22262e) {
  const chair = new THREE.Group();
  const chairMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.6 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.95, roughness: 0.1 });

  // Seat Cushion
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.38), chairMat);
  seat.position.y = 0.44;
  seat.castShadow = true;
  chair.add(seat);

  // Backrest
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.03), chairMat);
  back.position.set(0, 0.62, -0.17);
  back.castShadow = true;
  chair.add(back);

  // 4 Chrome Legs
  const chLegGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.43);
  [[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(chLegGeo, chromeMat);
    leg.position.set(lx, 0.215, lz);
    leg.castShadow = true;
    chair.add(leg);
  });

  return chair;
}

// --- REUSABLE SLIM MINIMALIST BAR STOOL (GHẾ ĐÔN CAO DÁNG MẢNH) ---
function createBarStool(seatColor = 0x1e293b) {
  const stool = new THREE.Group();
  const seatMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.5 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.95, roughness: 0.1 });

  // Circular Seat Cushion (Diameter 32cm, Height 5cm, at height 0.72m)
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24), seatMat);
  seat.position.y = 0.72;
  seat.castShadow = true;
  stool.add(seat);

  // Minimal low lumbar backrest
  const lowBack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.08, 24, 1, true, -Math.PI / 3, (2 * Math.PI) / 3),
    seatMat
  );
  lowBack.position.set(0, 0.78, 0);
  stool.add(lowBack);

  // Central Chrome Pole & Disc Base
  const centerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.68, 16), chromeMat);
  centerPole.position.y = 0.35;
  centerPole.castShadow = true;
  stool.add(centerPole);

  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.20, 0.02, 32), chromeMat);
  baseDisc.position.y = 0.01;
  baseDisc.castShadow = true;
  stool.add(baseDisc);

  // Footrest Ring
  const footRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 12, 24), chromeMat);
  footRing.rotation.x = Math.PI / 2;
  footRing.position.y = 0.28;
  stool.add(footRing);

  return stool;
}

// --- 1. GIÁ TREO TV DI ĐỘNG I-BRACKET E2050 + SMART TV 65 INCH ---
function buildTVStandAnd65TV() {
  tvStandGroup = new THREE.Group();
  
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x181a1f, metalness: 0.85, roughness: 0.25 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.95, roughness: 0.1 });
  const plasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
  
  // Mobile Cart Base (I-Bracket E2050 - 70cm x 50cm)
  const baseFrame = new THREE.Group();
  const baseBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.04, 0.06), steelMat);
  baseBar1.position.set(0, 0.05, 0.22);
  baseFrame.add(baseBar1);
  
  const baseBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.04, 0.06), steelMat);
  baseBar2.position.set(0, 0.05, -0.22);
  baseFrame.add(baseBar2);
  
  const centerConnect = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.50), steelMat);
  centerConnect.position.set(0, 0.05, 0);
  baseFrame.add(centerConnect);
  
  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16);
  [[-0.32, 0.22], [0.32, 0.22], [-0.32, -0.22], [0.32, -0.22]].forEach(([wx, wz]) => {
    const wh = new THREE.Mesh(wheelGeo, plasticMat);
    wh.rotation.z = Math.PI / 2;
    wh.position.set(wx, 0.025, wz);
    baseFrame.add(wh);
  });
  tvStandGroup.add(baseFrame);
  
  // Dual Vertical Telescopic Poles (Height ~1.85m)
  const poleGeo = new THREE.CylinderGeometry(0.022, 0.022, 1.75, 20);
  [-0.14, 0.14].forEach((px) => {
    const pole = new THREE.Mesh(poleGeo, steelMat);
    pole.position.set(px, 0.92, 0);
    pole.castShadow = true;
    tvStandGroup.add(pole);
  });
  
  // AV Component Shelf (45cm x 30cm at height 0.85m)
  const avShelf = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 0.30), steelMat);
  avShelf.position.set(0, 0.85, 0.10);
  avShelf.castShadow = true;
  tvStandGroup.add(avShelf);
  
  // Top Camera/Codec Shelf (at height 1.82m)
  const topShelf = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.015, 0.16), steelMat);
  topShelf.position.set(0, 1.82, 0.05);
  tvStandGroup.add(topShelf);
  
  // TV Mounting Crossbar & VESA Brackets
  const mountBar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.03), chromeMat);
  mountBar.position.set(0, 1.40, 0.02);
  tvStandGroup.add(mountBar);
  
  // Smart TV Xiaomi 65 Inch (145cm x 84cm, depth 5cm, mounted center at 1.40m)
  const tvBody = new THREE.Group();
  tvBody.position.set(0, 1.40, 0.04);
  
  const backChassis = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.84, 0.035), plasticMat);
  backChassis.castShadow = true;
  tvBody.add(backChassis);
  
  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.452, 0.842, 0.005),
    new THREE.MeshStandardMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1 })
  );
  bezel.position.z = 0.019;
  tvBody.add(bezel);
  
  // TV Display Screen (Clean Minimal White with Black "TV" Text)
  const tvCanvas = document.createElement('canvas');
  tvCanvas.width = 1024;
  tvCanvas.height = 576;
  const ctx = tvCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 576);
  
  ctx.fillStyle = '#0a0a0a';
  ctx.font = '900 170px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TV', 512, 288);
  
  const screenTex = new THREE.CanvasTexture(tvCanvas);
  screenTex.encoding = THREE.sRGBEncoding;
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.43, 0.82), screenMat);
  screenMesh.position.set(0, 0, 0.022);
  tvBody.add(screenMesh);
  
  tvStandGroup.add(tvBody);
  
  // Official Concept Position: X = -1.16, Z = -0.17, RotY = 90 deg
  tvStandGroup.position.set(-1.16, 0, -0.17);
  tvStandGroup.rotation.y = Math.PI / 2;
  boothGroup.add(tvStandGroup);
}

// --- 2. BÀN DEMO 1 (MÁY LASER MP-LM 1M + LAPTOP + 2 CATALOGS + 2 GHẾ) ---
function buildDemoTable1Laser() {
  demoTable1Group = new THREE.Group();
  
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.4, metalness: 0.8 });
  
  const topMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.55), tableMat);
  topMesh.position.set(0, 0.73, 0);
  topMesh.castShadow = true;
  demoTable1Group.add(topMesh);
  
  const legGeo = new THREE.BoxGeometry(0.04, 0.71, 0.04);
  [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(lx, 0.355, lz);
    leg.castShadow = true;
    demoTable1Group.add(leg);
  });
  
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.35, 0.02), tableMat);
  panel.position.set(0, 0.50, -0.22);
  demoTable1Group.add(panel);
  
  // Máy In Laser mp-LM 1M (Red & White Body)
  const laserGroup = new THREE.Group();
  const laserBodyMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.3 });
  const laserRedMat = new THREE.MeshStandardMaterial({ color: 0xE2001A, roughness: 0.3 });
  const laserDarkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });
  
  const laserChassis = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.52, 0.38), laserBodyMat);
  laserChassis.position.y = 0.26;
  laserChassis.castShadow = true;
  laserGroup.add(laserChassis);
  
  const laserFront = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.50, 0.02), laserRedMat);
  laserFront.position.set(0, 0.26, 0.191);
  laserGroup.add(laserFront);
  
  const laserScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.18), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  laserScreen.position.set(0, 0.34, 0.202);
  laserGroup.add(laserScreen);
  
  const laserTray = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.12), laserDarkMat);
  laserTray.position.set(0, 0.08, 0.22);
  laserGroup.add(laserTray);
  
  laserGroup.position.set(-0.25, 0.75, 0.02);
  demoTable1Group.add(laserGroup);
  
  // Laptop
  const laptop = new THREE.Group();
  const laptopMat = new THREE.MeshStandardMaterial({ color: 0xc8ccd2, metalness: 0.8, roughness: 0.2 });
  const baseLap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.012, 0.22), laptopMat);
  laptop.add(baseLap);
  
  const screenLap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.01), laptopMat);
  screenLap.position.set(0, 0.10, -0.10);
  screenLap.rotation.x = -Math.PI / 10;
  laptop.add(screenLap);
  
  const lapDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.19), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
  lapDisplay.position.set(0, 0.10, -0.094);
  lapDisplay.rotation.x = -Math.PI / 10;
  laptop.add(lapDisplay);
  
  laptop.position.set(0.22, 0.756, 0.05);
  demoTable1Group.add(laptop);
  
  // 2 Catalogs
  const catMat = new THREE.MeshStandardMaterial({ color: 0xE2001A, roughness: 0.5 });
  const cat1 = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.015, 0.297), catMat);
  cat1.position.set(0.18, 0.758, -0.12);
  cat1.rotation.y = 0.15;
  demoTable1Group.add(cat1);
  
  const cat2 = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.015, 0.297), new THREE.MeshStandardMaterial({ color: 0x0284C7 }));
  cat2.position.set(0.20, 0.773, -0.12);
  cat2.rotation.y = 0.05;
  demoTable1Group.add(cat2);

  // --- KHAY 3 LOẠI PHÔI QUÀ TẶNG KHẮC LASER MP-LM 1M ---
  const specimenTrayGroup = new THREE.Group();
  
  // Khay mica acrylic đen mờ chứa phôi (0.28m x 0.16m x 0.015m)
  const trayBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.012, 0.16),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.5 })
  );
  trayBase.position.y = 0.006;
  trayBase.castShadow = true;
  specimenTrayGroup.add(trayBase);

  // 1. Phôi Thẻ Nhôm Anodized Kim Loại (Silver Anodized Aluminum Tags)
  const aluMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
  const aluTag1 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.004, 0.04), aluMat);
  aluTag1.position.set(-0.085, 0.014, -0.04);
  aluTag1.castShadow = true;
  specimenTrayGroup.add(aluTag1);

  const aluTag2 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.004, 0.04), aluMat);
  aluTag2.position.set(-0.085, 0.018, 0.03);
  aluTag2.castShadow = true;
  specimenTrayGroup.add(aluTag2);

  // 2. Phôi Thẻ Nhựa Kỹ Thuật 2 Lớp (Dual-Layer Engineering Plastic: Đỏ/Trắng)
  const plasticBaseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const plasticRedMat = new THREE.MeshStandardMaterial({ color: 0xe2001a, roughness: 0.3 });
  
  const pTag1 = new THREE.Group();
  const pBase1 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.003, 0.04), plasticBaseMat);
  const pTop1 = new THREE.Mesh(new THREE.BoxGeometry(0.063, 0.002, 0.038), plasticRedMat);
  pTop1.position.y = 0.002;
  pTag1.add(pBase1);
  pTag1.add(pTop1);
  pTag1.position.set(0.00, 0.014, -0.04);
  pTag1.castShadow = true;
  specimenTrayGroup.add(pTag1);

  const pTag2 = new THREE.Group();
  const pBase2 = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.003, 0.04), plasticBaseMat);
  const pTop2 = new THREE.Mesh(new THREE.BoxGeometry(0.063, 0.002, 0.038), plasticRedMat);
  pTop2.position.y = 0.002;
  pTag2.add(pBase2);
  pTag2.add(pTop2);
  pTag2.position.set(0.00, 0.014, 0.03);
  pTag2.castShadow = true;
  specimenTrayGroup.add(pTag2);

  // 3. Móc Khóa Kỹ Thuật Gắn Nhãn Murrplastik (Technical Keychain)
  const chromeRingMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.95, roughness: 0.1 });
  const keyTagMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
  
  const keychainGroup = new THREE.Group();
  const keyRing = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.002, 8, 16), chromeRingMat);
  keyRing.rotation.x = Math.PI / 2;
  keyRing.position.set(-0.025, 0.004, 0);
  keychainGroup.add(keyRing);

  const keyBody = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.005, 0.03), keyTagMat);
  keyBody.position.set(0.015, 0.004, 0);
  keyBody.castShadow = true;
  keychainGroup.add(keyBody);

  keychainGroup.position.set(0.085, 0.012, -0.005);
  keychainGroup.rotation.y = 0.1;
  specimenTrayGroup.add(keychainGroup);

  // Đặt khay phôi lên mặt bàn gần trạm Laser
  specimenTrayGroup.position.set(-0.02, 0.752, -0.15);
  demoTable1Group.add(specimenTrayGroup);

  // 2 Ghế cho Bàn Demo 1 (Ghế kỹ thuật viên & Ghế khách)
  const chairD1_1 = createModernChair(0x1e293b);
  chairD1_1.position.set(0.22, 0, 0.38);
  chairD1_1.rotation.y = Math.PI;
  demoTable1Group.add(chairD1_1);

  const chairD1_2 = createModernChair(0x1e293b);
  chairD1_2.position.set(-0.25, 0, 0.38);
  chairD1_2.rotation.y = Math.PI;
  demoTable1Group.add(chairD1_2);

  demo1Chairs = [chairD1_1, chairD1_2];
  
  // Official Concept Position: X = 0.99, Z = -0.56, RotY = 180 deg
  demoTable1Group.position.set(0.99, 0, -0.56);
  demoTable1Group.rotation.y = Math.PI;
  boothGroup.add(demoTable1Group);
}

// --- 3. BÀN DEMO 2 (ROBOT R-TEC BOX + 2 CATALOGS + 2 GHẾ) ---
function buildDemoTable2RTec() {
  demoTable2Group = new THREE.Group();
  
  const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.1 });
  const legMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.4, metalness: 0.8 });
  
  const topMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.55), tableMat);
  topMesh.position.set(0, 0.73, 0);
  topMesh.castShadow = true;
  demoTable2Group.add(topMesh);
  
  const legGeo = new THREE.BoxGeometry(0.04, 0.71, 0.04);
  [[-0.45, -0.22], [0.45, -0.22], [-0.45, 0.22], [0.45, 0.22]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(lx, 0.355, lz);
    leg.castShadow = true;
    demoTable2Group.add(leg);
  });
  
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.35, 0.02), tableMat);
  panel.position.set(0, 0.50, -0.22);
  demoTable2Group.add(panel);
  
  // R-Tec Box Robot Cable Retraction System
  const rtecGroup = new THREE.Group();
  const rtecHousingMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4, metalness: 0.6 });
  const rtecRedMat = new THREE.MeshStandardMaterial({ color: 0xE2001A, roughness: 0.3 });
  
  const housing = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.16, 0.24), rtecHousingMat);
  housing.position.y = 0.08;
  housing.castShadow = true;
  rtecGroup.add(housing);
  
  const slider = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.08), rtecRedMat);
  slider.position.set(0, 0.16, 0.06);
  rtecGroup.add(slider);
  
  const tubeRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 16, 24), rtecHousingMat);
  tubeRing.position.set(0.24, 0.08, 0);
  tubeRing.rotation.y = Math.PI / 2;
  rtecGroup.add(tubeRing);
  
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.24, 0.08, 0),
    new THREE.Vector3(0.40, 0.22, 0.10),
    new THREE.Vector3(0.48, 0.35, 0.05)
  );
  const hoseGeo = new THREE.TubeGeometry(curve, 20, 0.035, 12, false);
  const hoseMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
  const hose = new THREE.Mesh(hoseGeo, hoseMat);
  rtecGroup.add(hose);
  
  rtecGroup.position.set(-0.15, 0.75, 0);
  demoTable2Group.add(rtecGroup);
  
  const catMat = new THREE.MeshStandardMaterial({ color: 0xE2001A, roughness: 0.5 });
  const cat1 = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.015, 0.297), catMat);
  cat1.position.set(0.28, 0.758, 0);
  cat1.rotation.y = -0.10;
  demoTable2Group.add(cat1);

  // 2 Ghế cho Bàn Demo 2
  const chairD2_1 = createModernChair(0x1e293b);
  chairD2_1.position.set(0.25, 0, 0.38);
  chairD2_1.rotation.y = Math.PI;
  demoTable2Group.add(chairD2_1);

  const chairD2_2 = createModernChair(0x1e293b);
  chairD2_2.position.set(-0.25, 0, 0.38);
  chairD2_2.rotation.y = Math.PI;
  demoTable2Group.add(chairD2_2);

  demo2Chairs = [chairD2_1, chairD2_2];
  
  // Official Concept Position: X = 0.95, Z = 1.27, RotY = 180 deg
  demoTable2Group.position.set(0.95, 0, 1.27);
  demoTable2Group.rotation.y = Math.PI;
  boothGroup.add(demoTable2Group);
}

// --- 4. KỆ KHUNG ỐNG MODULAR 3x3 (1.6M) + 3 THÙNG CARTON MURRPLASTIK ---
function buildModularPipeRack() {
  pipeRackGroup = new THREE.Group();
  
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xf5f0d8, roughness: 0.35, metalness: 0.1 });
  const jointMat = new THREE.MeshStandardMaterial({ color: 0xc4c8ce, metalness: 0.9, roughness: 0.15 });
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x272b33, roughness: 0.6 });
  
  const W = 1.15;
  const D = 0.42;
  const H = 1.60;
  
  const postGeo = new THREE.CylinderGeometry(0.014, 0.014, H, 16);
  const postOffsets = [
    [-W/2, -D/2], [W/2, -D/2], [-W/2, D/2], [W/2, D/2],
    [-W/6, -D/2], [W/6, -D/2], [-W/6, D/2], [W/6, D/2]
  ];
  
  postOffsets.forEach(([px, pz]) => {
    const post = new THREE.Mesh(postGeo, pipeMat);
    post.position.set(px, H/2, pz);
    post.castShadow = true;
    pipeRackGroup.add(post);
  });
  
  const tierHeights = [0.15, 0.85, 1.55];
  tierHeights.forEach((th) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(W + 0.02, 0.015, D + 0.02), shelfMat);
    shelf.position.set(0, th, 0);
    shelf.castShadow = true;
    pipeRackGroup.add(shelf);
    
    postOffsets.forEach(([px, pz]) => {
      const joint = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.038, 0.038), jointMat);
      joint.position.set(px, th, pz);
      pipeRackGroup.add(joint);
    });
  });
  
  // 3 Thùng Carton Murrplastik ở tầng đáy (0.15m)
  const boxCanvas = document.createElement('canvas');
  boxCanvas.width = 512;
  boxCanvas.height = 384;
  const bctx = boxCanvas.getContext('2d');
  bctx.fillStyle = '#c89d66';
  bctx.fillRect(0, 0, 512, 384);
  
  bctx.fillStyle = '#E2001A';
  bctx.fillRect(40, 60, 432, 80);
  bctx.fillStyle = '#ffffff';
  bctx.font = 'bold 36px Arial';
  bctx.fillText('murrplastik', 60, 116);
  
  bctx.fillStyle = '#1e293b';
  bctx.font = 'bold 20px Arial';
  bctx.fillText('MADE IN GERMANY • T&T VINA', 60, 200);
  bctx.font = '18px Arial';
  bctx.fillText('CABLE MANAGEMENT SYSTEMS', 60, 235);
  
  const boxTex = new THREE.CanvasTexture(boxCanvas);
  boxTex.encoding = THREE.sRGBEncoding;
  const boxMat = new THREE.MeshStandardMaterial({ map: boxTex, roughness: 0.8 });
  const boxMatPlain = new THREE.MeshStandardMaterial({ color: 0xc89d66, roughness: 0.85 });
  
  const boxGeo = new THREE.BoxGeometry(0.36, 0.42, 0.38);
  const boxMaterials = [boxMatPlain, boxMatPlain, boxMatPlain, boxMatPlain, boxMat, boxMatPlain];
  
  [-0.36, 0.0, 0.36].forEach((bx) => {
    const box = new THREE.Mesh(boxGeo, boxMaterials);
    box.position.set(bx, 0.15 + 0.21, 0);
    box.castShadow = true;
    pipeRackGroup.add(box);
  });
  
  // Tầng 2 (0.85m): Ống ruột gà cuộn & Máng xích demo
  const conduitCoil = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.04, 16, 24),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })
  );
  conduitCoil.position.set(-0.35, 0.85 + 0.05, 0);
  conduitCoil.rotation.x = Math.PI / 2;
  pipeRackGroup.add(conduitCoil);
  
  const chainDemo = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.08, 0.14),
    new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 })
  );
  chainDemo.position.set(0.15, 0.85 + 0.05, 0);
  pipeRackGroup.add(chainDemo);
  
  // Tầng 3 (1.55m): Kệ mẫu đĩa & tài liệu Catalogue
  const catStack = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.04, 0.32),
    new THREE.MeshStandardMaterial({ color: 0xE2001A, roughness: 0.4 })
  );
  catStack.position.set(-0.25, 1.55 + 0.025, 0);
  pipeRackGroup.add(catStack);
  
  // Official Concept Position: X = -0.81, Z = 1.26, RotY = 0 deg
  pipeRackGroup.position.set(-0.81, 0, 1.26);
  pipeRackGroup.rotation.y = 0;
  boothGroup.add(pipeRackGroup);
}

// --- 5. BÀN TRÒN TIẾP KHÁCH & ĐĨA HOA QUẢ TRUNG TÂM (4 GHẾ) ---
function buildRoundTableCenter() {
  roundTableGroup = new THREE.Group();
  
  const marbleMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.15, metalness: 0.1 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.95, roughness: 0.1 });
  
  const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.325, 0.325, 0.03, 32), marbleMat);
  topMesh.position.y = 0.735;
  topMesh.castShadow = true;
  roundTableGroup.add(topMesh);
  
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.71, 16), chromeMat);
  pole.position.y = 0.365;
  roundTableGroup.add(pole);
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32), chromeMat);
  base.position.y = 0.01;
  base.castShadow = true;
  roundTableGroup.add(base);
  
  // Đĩa hoa quả
  const bowlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 });
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.06, 24), bowlMat);
  bowl.position.set(0, 0.78, 0);
  roundTableGroup.add(bowl);
  
  const appleMat = new THREE.MeshStandardMaterial({ color: 0xd91e18, roughness: 0.3 });
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, roughness: 0.4 });
  
  const fruit1 = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), appleMat);
  fruit1.position.set(-0.03, 0.81, 0.02);
  roundTableGroup.add(fruit1);
  
  const fruit2 = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), orangeMat);
  fruit2.position.set(0.03, 0.81, -0.02);
  roundTableGroup.add(fruit2);
  
  const fruit3 = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), appleMat);
  fruit3.position.set(0.01, 0.83, 0.02);
  roundTableGroup.add(fruit3);
  
  // 4 Ghế tiếp khách xung quanh bàn tròn (quay mặt hướng vào trung tâm bàn)
  roundTableChairs = [];
  const chairAngles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
  const chairRadius = 0.50;
  chairAngles.forEach((angle) => {
    const chair = createModernChair(0x1f242d);
    chair.position.set(
      Math.sin(angle) * chairRadius,
      0,
      Math.cos(angle) * chairRadius
    );
    chair.rotation.y = angle + Math.PI; // Face directly inward toward table center
    roundTableGroup.add(chair);
    roundTableChairs.push(chair);
  });
  
  // Official Concept Position: X = -0.08, Z = -0.49, RotY = 0 deg
  roundTableGroup.position.set(-0.08, 0, -0.49);
  roundTableGroup.rotation.y = 0;
  boothGroup.add(roundTableGroup);
}
