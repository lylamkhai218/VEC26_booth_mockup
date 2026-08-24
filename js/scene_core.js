/**
 * scene_core.js - Three.js Engine Lifecycle, Lighting, Camera, Textures & Clearance Visualization
 */

window.addEventListener('DOMContentLoaded', init);

let clearanceGroup;
let clearanceCircles = {};
let clearanceLine;

function init() {
  const container = document.getElementById('canvas-container');

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121316);
  scene.fog = new THREE.FogExp2(0x121316, 0.028);

  // 2. Camera
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
  setCameraView('corner');

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // 4. Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2 - 0.015;
  controls.minDistance = 1.2;
  controls.maxDistance = 18;
  const target = getAdaptiveTarget();
  controls.target.copy(target);

  // 5. Scene Groups
  boothGroup = new THREE.Group();
  frameGroup = new THREE.Group();
  scene.add(boothGroup);
  boothGroup.add(frameGroup);

  // 6. Build Models
  setupLighting();
  buildEnvironment();
  buildBoothWalls();
  buildAluminumFrame();
  buildTVStandAnd65TV();
  buildDemoTable1Laser();
  buildDemoTable2RTec();
  buildModularPipeRack();
  buildRoundTableCenter();

  // 7. Clearance & Walkway Visual System
  buildClearanceSystem();

  // 8. Load Textures
  loadBoothTextures(currentVersion);

  // 9. Setup Interactive Dimension Inspection on Click
  setupInteractiveDimensions();

  // 10. Setup TransformControls (Gizmo) for Equipment Placement
  initTransformControls();

  // 11. Event Listeners
  window.addEventListener('resize', onWindowResize);

  // 12. Animation Loop
  animate();

  // Fade out loading screen
  setTimeout(() => {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 400);
    }
  }, 450);
}

// --- LIGHTING ---
function setupLighting() {
  lightsGroup = new THREE.Group();
  scene.add(lightsGroup);

  ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  lightsGroup.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfffaed, 0.9);
  dirLight.position.set(5, 9, 6);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.bias = -0.0004;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 25;
  dirLight.shadow.camera.left = -4;
  dirLight.shadow.camera.right = 4;
  dirLight.shadow.camera.top = 4;
  dirLight.shadow.camera.bottom = -4;
  lightsGroup.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xd9e8ff, 0.45);
  fillLight.position.set(-6, 5, -4);
  lightsGroup.add(fillLight);

  // 3 Spotlights mounted on Top Beams
  spotLight1 = createSpotlight(0, BOOTH_H + 0.15, -1.0, 0, 1.2, -1.5, 0.95);
  spotLight2 = createSpotlight(-1.0, BOOTH_H + 0.15, 0, -1.5, 1.2, 0, 0.95);
  spotLight3 = createSpotlight(0.8, BOOTH_H + 0.15, 0.8, 0, 0.8, 0, 0.75);
}

function createSpotlight(x, y, z, tx, ty, tz, intensity) {
  const spot = new THREE.SpotLight(0xfff8ee, intensity);
  spot.position.set(x, y, z);
  spot.target.position.set(tx, ty, tz);
  spot.angle = Math.PI / 4.2;
  spot.penumbra = 0.55;
  spot.decay = 1.6;
  spot.distance = 7;
  spot.castShadow = true;
  spot.shadow.mapSize.width = 1024;
  spot.shadow.mapSize.height = 1024;
  lightsGroup.add(spot);
  scene.add(spot.target);

  const fixMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.85, roughness: 0.2 });
  const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.09, 16), fixMat);
  fixture.position.set(x, y, z);
  fixture.rotation.x = Math.PI / 2;
  boothGroup.add(fixture);

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.15), fixMat);
  arm.position.set(x, y - 0.06, z);
  boothGroup.add(arm);

  return spot;
}

function setLighting(env) {
  const btnHall = document.getElementById('env-hall');
  const btnStudio = document.getElementById('env-studio');
  if (btnHall) btnHall.classList.toggle('active', env === 'hall');
  if (btnStudio) btnStudio.classList.toggle('active', env === 'studio');

  if (env === 'studio') {
    ambientLight.intensity = 1.15;
    dirLight.intensity = 1.1;
    renderer.toneMappingExposure = 1.25;
  } else {
    ambientLight.intensity = 0.75;
    dirLight.intensity = 0.9;
    renderer.toneMappingExposure = 1.15;
  }
}

// --- ENVIRONMENT ---
function buildEnvironment() {
  const floorGeo = new THREE.PlaneGeometry(30, 30);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x1f2229, roughness: 0.65, metalness: 0.1 });
  const hallFloor = new THREE.Mesh(floorGeo, floorMat);
  hallFloor.rotation.x = -Math.PI / 2;
  hallFloor.receiveShadow = true;
  scene.add(hallFloor);

  const grid = new THREE.GridHelper(30, 30, 0x333945, 0x272b35);
  grid.position.y = 0.001;
  scene.add(grid);

  // Booth Carpet (3m x 3m)
  const carpetGeo = new THREE.BoxGeometry(BOOTH_W, 0.015, BOOTH_D);
  const carpetMat = new THREE.MeshStandardMaterial({ color: 0x2b303c, roughness: 0.95, metalness: 0.0 });
  const carpet = new THREE.Mesh(carpetGeo, carpetMat);
  carpet.position.set(0, 0.0075, 0);
  carpet.receiveShadow = true;
  boothGroup.add(carpet);

  // Trims
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xa0a5ab, metalness: 0.9, roughness: 0.2 });
  const trimFront = new THREE.Mesh(new THREE.BoxGeometry(BOOTH_W, 0.016, 0.02), trimMat);
  trimFront.position.set(0, 0.008, BOOTH_D/2);
  boothGroup.add(trimFront);

  const trimSide = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.016, BOOTH_D), trimMat);
  trimSide.position.set(BOOTH_W/2, 0.008, 0);
  boothGroup.add(trimSide);
}

// --- WALKWAY CLEARANCE & DISTANCE MEASUREMENT VISUALIZER ---
function buildClearanceSystem() {
  clearanceGroup = new THREE.Group();
  clearanceGroup.visible = true; // Enabled by default
  boothGroup.add(clearanceGroup);

  const ringGeo = new THREE.RingGeometry(0.96, 1.0, 48);
  ringGeo.rotateX(-Math.PI / 2);

  Object.entries(EQUIPMENT).forEach(([key, eq]) => {
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.scale.set(eq.radius, 1, eq.radius);
    ring.position.y = 0.012;
    clearanceGroup.add(ring);
    clearanceCircles[key] = ring;
  });

  // Dynamic distance line
  const lineGeo = new THREE.BufferGeometry();
  const positions = new Float32Array([0, 0.015, 0, 0, 0.015, 0]);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
  clearanceLine = new THREE.Line(lineGeo, lineMat);
  clearanceGroup.add(clearanceLine);
}

function updateClearanceVisuals() {
  if (!clearanceGroup) return;

  // Update ring positions
  Object.entries(EQUIPMENT).forEach(([key, eq]) => {
    const grp = eq.getGroup();
    const ring = clearanceCircles[key];
    if (grp && ring) {
      ring.position.x = grp.position.x;
      ring.position.z = grp.position.z;
      ring.visible = grp.visible;
    }
  });

  // Calculate metrics
  if (typeof calculateMinClearance === 'function') {
    const metrics = calculateMinClearance();
    const dist = metrics.distance;
    
    // Update ring colors based on clearance
    let colorHex = 0x06b6d4; // Cyan (safe >= 0.75m)
    let statusText = `${dist.toFixed(2)}m (Rộng rãi)`;
    let badgeClass = 'safe';

    if (dist < 0.55) {
      colorHex = 0xef4444; // Red warning
      statusText = `${dist.toFixed(2)}m (Hẹp / Kẹt lối)`;
      badgeClass = 'danger';
    } else if (dist < 0.75) {
      colorHex = 0xf59e0b; // Amber caution
      statusText = `${dist.toFixed(2)}m (Vừa vặn)`;
      badgeClass = 'warning';
    }

    Object.values(clearanceCircles).forEach(ring => {
      ring.material.color.setHex(colorHex);
    });

    // Update HUD chip
    const hudChip = document.getElementById('clearance-val');
    const hudBadge = document.getElementById('clearance-chip');
    if (hudChip) hudChip.innerText = statusText;
    if (hudBadge) {
      hudBadge.className = `dim-pill-badge ${badgeClass}`;
    }
  }
}

// --- CAMERA PRESETS ---
function getAdaptiveTarget() {
  return new THREE.Vector3(0, 1.20, 0);
}

function setCameraView(view) {
  document.querySelectorAll('.cam-chip').forEach(el => el.classList.remove('active'));
  const chip = document.getElementById('chip-' + view);
  if (chip) chip.classList.add('active');

  const sideBtn = document.getElementById('side-cam-' + view);
  if (sideBtn) {
    document.querySelectorAll('[id^="side-cam-"]').forEach(b => b.classList.remove('active'));
    sideBtn.classList.add('active');
  }

  const isMobile = window.innerWidth <= 1024;
  const target = getAdaptiveTarget();

  if (view === 'corner') {
    const dist = isMobile ? 6.8 : 5.8;
    camera.position.set(dist * 0.72, 2.6, dist * 0.72);
  } else if (view === 'front') {
    const dist = isMobile ? 6.2 : 5.2;
    camera.position.set(0, 1.35, dist);
  } else if (view === 'side') {
    const dist = isMobile ? 6.2 : 5.2;
    camera.position.set(dist, 1.35, 0);
  } else if (view === 'eye') {
    camera.position.set(2.4, 1.60, 2.4);
  } else if (view === 'top') {
    const dist = isMobile ? 6.5 : 5.5;
    camera.position.set(0.001, dist, 0);
  }

  if (controls) {
    controls.target.copy(target);
    controls.update();
  }
}

function resetCamera() {
  setCameraView('corner');
}

// --- ZEN MODE TOGGLE ---
function toggleZenMode() {
  document.body.classList.toggle('zen-mode');
  const btn = document.getElementById('btn-toggle-ui');
  if (btn) {
    const isZen = document.body.classList.contains('zen-mode');
    btn.innerHTML = isZen
      ? `<svg class="svg-icon sm" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg><span>Hiện Panels</span>`
      : `<svg class="svg-icon sm" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg><span>Ẩn Panels</span>`;
  }
}

// --- TEXTURE LOADER & VERSION SWITCH ---
function loadTexture(srcUrlOrB64, callback) {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    srcUrlOrB64,
    (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
      if (callback) callback(texture);
    },
    undefined,
    (err) => {
      console.warn("Could not load texture, using fallback color:", err);
    }
  );
}

function loadBoothTextures(versionKey) {
  const v = VERSIONS[versionKey];
  if (!v) return;

  loadTexture(v.backwall(), (tex) => {
    if (backwallMesh) {
      backwallMesh.material.map = tex;
      backwallMesh.material.color.setHex(0xffffff);
      backwallMesh.material.needsUpdate = true;
    }
  });

  loadTexture(v.sidewall(), (tex) => {
    if (sidewallMesh) {
      sidewallMesh.material.map = tex;
      sidewallMesh.material.color.setHex(0xffffff);
      sidewallMesh.material.needsUpdate = true;
    }
  });

  loadTexture(v.valanceFront(), (tex) => {
    if (valanceFrontMesh) {
      valanceFrontMesh.material.map = tex;
      valanceFrontMesh.material.color.setHex(0xffffff);
      valanceFrontMesh.material.needsUpdate = true;
    }
  });

  loadTexture(v.valanceSide(), (tex) => {
    if (valanceSideMesh) {
      valanceSideMesh.material.map = tex;
      valanceSideMesh.material.color.setHex(0xffffff);
      valanceSideMesh.material.needsUpdate = true;
    }
  });
}

function switchVersion(verKey) {
  currentVersion = verKey;
  ['v1', 'v2', 'v3'].forEach(k => {
    const b = document.getElementById('btn-ver-' + k);
    if (b) b.classList.toggle('active', k === verKey);
  });
  loadBoothTextures(verKey);
}

// --- INTERACTIVE DIMENSION INSPECTOR ON CLICK ---
function setupInteractiveDimensions() {
  raycaster = new THREE.Raycaster();
  clickMouse = new THREE.Vector2();

  if (valanceFrontMesh) {
    valanceFrontMesh.userData = {
      title: 'BIỂN TRÁN MẶT TIỀN CHÍNH (FRONT VALANCE)',
      dim: '2.950 × 400 mm',
      panels: '01 Tấm liền mạch (2.950 × 400 mm)',
      mat: 'Formex 5mm in UV decal Kỹ Thuật Số',
      loc: 'Mặt tiền chính diện phía trước (Z = +1.5m, H = 2.1m - 2.5m)',
      desc: 'Logo T&T VINA, Murrplastik & Thông tin nhận diện gian hàng A Ô H1-15.'
    };
  }

  if (valanceSideMesh) {
    valanceSideMesh.userData = {
      title: 'BIỂN TRÁN MẶT TIỀN HÔNG (SIDE VALANCE)',
      dim: '2.950 × 400 mm',
      panels: '01 Tấm liền mạch (2.950 × 400 mm)',
      mat: 'Formex 5mm in UV decal Kỹ Thuật Số',
      loc: 'Mặt tiền hành lang bên phải (X = +1.5m, H = 2.1m - 2.5m)',
      desc: 'Biển nhận diện thương hiệu mở rộng hướng đón luồng khách hành lang.'
    };
  }

  if (backwallMesh) {
    backwallMesh.userData = {
      title: 'VÁCH HẬU CHÍNH (BACKWALL)',
      dim: '3.000 × 2.500 mm',
      panels: '03 Panel ghép (1.000 × 2.500 mm / panel)',
      mat: 'Decal PP cán mờ bồi tấm vách Octanorm tiêu chuẩn',
      loc: 'Vách chính diện phía sau (Z = -1.5m)',
      desc: 'Trưng bày 5 nhóm sản phẩm chính (AUR, ACS, EFK, SUV, KHD) & 50cm chân an toàn.'
    };
  }

  if (sidewallMesh) {
    sidewallMesh.userData = {
      title: 'VÁCH BÊN TRÁI (SIDEWALL)',
      dim: '3.000 × 2.500 mm',
      panels: '03 Panel ghép (1.000 × 2.500 mm / panel)',
      mat: 'Decal PP cán bóng bồi tấm vách Octanorm tiêu chuẩn',
      loc: 'Vách bên trái gian hàng (X = -1.5m)',
      desc: 'Trưng bày 5 Bàn Demo, 3 Key Visual ngành, Trụ cột uy tín & QR Code tài liệu.'
    };
  }

  const dom = renderer.domElement;
  dom.addEventListener('pointerdown', (e) => {
    touchStartTime = Date.now();
    touchStartPos = { x: e.clientX, y: e.clientY };
  });

  dom.addEventListener('pointerup', (e) => {
    const elapsed = Date.now() - touchStartTime;
    const dist = Math.hypot(e.clientX - touchStartPos.x, e.clientY - touchStartPos.y);
    if (elapsed < 350 && dist < 6) {
      handleMeshClick(e);
    }
  });
}

function handleMeshClick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  clickMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  clickMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(clickMouse, camera);

  // 1. Check if user clicked any 3D Equipment item directly
  const equipmentItems = [
    { key: 'tvStand', grp: tvStandGroup },
    { key: 'demo1', grp: demoTable1Group },
    { key: 'demo2', grp: demoTable2Group },
    { key: 'pipeRack', grp: pipeRackGroup },
    { key: 'roundTable', grp: roundTableGroup }
  ];

  for (const eq of equipmentItems) {
    if (eq.grp && eq.grp.visible) {
      const hits = raycaster.intersectObjects(eq.grp.children, true);
      if (hits.length > 0) {
        selectEquipment(eq.key);
        if (window.innerWidth <= 1024) toggleInspectorDrawer(true);
        return;
      }
    }
  }

  // 2. Check if user clicked any Wall or Valance
  const interactiveTargets = [
    valanceFrontMesh,
    valanceSideMesh,
    backwallMesh,
    sidewallMesh
  ].filter(Boolean);

  const intersects = raycaster.intersectObjects(interactiveTargets, false);

  if (intersects.length > 0) {
    const hitObj = intersects[0].object;
    if (hitObj.userData && hitObj.userData.title) {
      showDimensionCard(hitObj.userData);
      triggerGlowHighlight(hitObj);
    }
  }
}

function triggerGlowHighlight(mesh) {
  if (!mesh || !mesh.material) return;
  
  if (activeHighlightMesh && activeHighlightOrigColor) {
    activeHighlightMesh.material.color.copy(activeHighlightOrigColor);
  }
  
  activeHighlightMesh = mesh;
  activeHighlightOrigColor = mesh.material.color.clone();
  mesh.material.color.setHex(0xffea00);

  clearTimeout(activeHighlightTimeout);
  activeHighlightTimeout = setTimeout(() => {
    if (activeHighlightMesh && activeHighlightOrigColor) {
      activeHighlightMesh.material.color.copy(activeHighlightOrigColor);
      activeHighlightMesh = null;
      activeHighlightOrigColor = null;
    }
  }, 350);
}

function showDimensionCard(data) {
  const titleEl = document.getElementById('dim-title');
  const badgeEl = document.getElementById('dim-badge');
  const panelsEl = document.getElementById('dim-panels');
  const matEl = document.getElementById('dim-mat');
  const locEl = document.getElementById('dim-loc');
  const descEl = document.getElementById('dim-desc');

  if (titleEl) titleEl.innerText = data.title;
  if (badgeEl) badgeEl.innerHTML = `<svg class="svg-icon sm" viewBox="0 0 24 24"><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.4L13.9 1.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4Z"></path></svg><span>${data.dim}</span>`;
  if (panelsEl) panelsEl.innerText = data.panels;
  if (matEl) matEl.innerText = data.mat;
  if (locEl) locEl.innerText = data.loc;
  if (descEl) descEl.innerText = data.desc;

  if (data.title.includes('MẶT TIỀN CHÍNH')) {
    updateInspectorChipActive('valanceFront');
  } else if (data.title.includes('MẶT TIỀN HÔNG')) {
    updateInspectorChipActive('valanceSide');
  } else if (data.title.includes('VÁCH HẬU')) {
    updateInspectorChipActive('backwall');
  } else if (data.title.includes('VÁCH BÊN')) {
    updateInspectorChipActive('sidewall');
  }

  if (window.innerWidth <= 1024) {
    toggleInspectorDrawer(true);
  }
}

function selectInspectorComponent(name) {
  let targetMesh = null;
  if (name === 'valanceFront') targetMesh = valanceFrontMesh;
  else if (name === 'valanceSide') targetMesh = valanceSideMesh;
  else if (name === 'backwall') targetMesh = backwallMesh;
  else if (name === 'sidewall') targetMesh = sidewallMesh;

  if (targetMesh && targetMesh.userData) {
    showDimensionCard(targetMesh.userData);
    triggerGlowHighlight(targetMesh);
    updateInspectorChipActive(name);
  }
}

function updateInspectorChipActive(activeName) {
  const mapping = {
    'valanceFront': 'chip-inspect-valance-front',
    'valanceSide': 'chip-inspect-valance-side',
    'backwall': 'chip-inspect-backwall',
    'sidewall': 'chip-inspect-sidewall'
  };

  Object.values(mapping).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.remove('active');
  });

  const activeId = mapping[activeName];
  if (activeId) {
    const activeBtn = document.getElementById(activeId);
    if (activeBtn) activeBtn.classList.add('active');
  }
}

// --- MOBILE DRAWERS ---
function toggleMobileDrawer(open) {
  const drawer = document.getElementById('controls-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (open) {
    drawer.classList.add('open');
    backdrop.classList.add('active');
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  }
}

function toggleInspectorDrawer(open) {
  const drawer = document.getElementById('inspector-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (open) {
    drawer.classList.add('open');
    backdrop.classList.add('active');
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  }
}

function takeScreenshot() {
  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = `Mockup_3D_Booth_VEC2026_${currentVersion}_${Date.now()}.png`;
  link.href = dataUrl;
  link.click();

  showToast("Đã xuất ảnh mockup HD thành công!");
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  const currentActiveChip = document.querySelector('.cam-chip.active');
  const view = currentActiveChip ? currentActiveChip.id.replace('chip-', '') : 'corner';
  setCameraView(view);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// --- DISPLAY TOGGLES ---
function toggleFrame(visible) {
  if (frameGroup) frameGroup.visible = visible;
}
function toggleTVStand(visible) {
  if (tvStandGroup) tvStandGroup.visible = visible;
  updateClearanceVisuals();
}
function toggleDemo1(visible) {
  if (demoTable1Group) demoTable1Group.visible = visible;
  updateClearanceVisuals();
}
function toggleDemo2(visible) {
  if (demoTable2Group) demoTable2Group.visible = visible;
  updateClearanceVisuals();
}
function togglePipeRack(visible) {
  if (pipeRackGroup) pipeRackGroup.visible = visible;
  updateClearanceVisuals();
}
function toggleRoundTable(visible) {
  if (roundTableGroup) roundTableGroup.visible = visible;
  updateClearanceVisuals();
}
function toggleClearance(visible) {
  if (clearanceGroup) clearanceGroup.visible = visible;
}
function toggleSpotlights(visible) {
  [spotLight1, spotLight2, spotLight3].forEach(s => {
    if (s) s.visible = visible;
  });
}
function toggleAutoRotate(enable) {
  if (controls) controls.autoRotate = enable;
}
