/**
 * layout_manager.js - Interactive Gizmo, Multi-Slot Concept Manager & Walkway Clearance
 * Manages TransformControls, Concept Slots (A/B/C), and Real-Time Safety Clearance.
 */

// --- EQUIPMENT REGISTRY WITH OFFICIAL POSITIONS ---
const EQUIPMENT = {
  tvStand: {
    name: 'Giá TV di động E2050 + TV 65"',
    getGroup: () => tvStandGroup,
    defaultPos: [-1.16, 0, -0.17],
    defaultRotY: Math.PI / 2,
    radius: 0.35
  },
  demo1: {
    name: 'Bàn Demo 1 (Laser + Laptop)',
    getGroup: () => demoTable1Group,
    defaultPos: [0.99, 0, -0.56],
    defaultRotY: Math.PI,
    radius: 0.45
  },
  demo2: {
    name: 'Bàn Demo 2 (Robot R-Tec Box)',
    getGroup: () => demoTable2Group,
    defaultPos: [0.95, 0, 1.27],
    defaultRotY: Math.PI,
    radius: 0.45
  },
  pipeRack: {
    name: 'Kệ khung ống modular 3x3 + 3 Thùng',
    getGroup: () => pipeRackGroup,
    defaultPos: [-0.81, 0, 1.26],
    defaultRotY: 0,
    radius: 0.42
  },
  roundTable: {
    name: 'Bàn tròn tiếp khách & hoa quả (4 ghế)',
    getGroup: () => roundTableGroup,
    defaultPos: [-0.08, 0, -0.49],
    defaultRotY: 0,
    radius: 0.52
  }
};

// --- 3 PRESET CONCEPT SLOTS ---
const CONCEPT_PRESETS = [
  {
    id: 1,
    name: 'Concept 1: Đón Khách (Tiêu chuẩn)',
    desc: 'Bố cục mở, tối ưu lối đi thông thoáng & tiếp khách',
    layout: {
      tvStand: { pos: [-1.16, 0, -0.17], rotDeg: 90 },
      demo1: { pos: [0.99, 0, -0.56], rotDeg: 180 },
      demo2: { pos: [0.95, 0, 1.27], rotDeg: 180 },
      pipeRack: { pos: [-0.81, 0, 1.26], rotDeg: 0 },
      roundTable: { pos: [-0.08, 0, -0.49], rotDeg: 0 }
    }
  },
  {
    id: 2,
    name: 'Concept 2: Trình Diễn (Demo-First)',
    desc: 'Tập trung hướng máy Laser & Robot ra mặt tiền sảnh',
    layout: {
      tvStand: { pos: [0.95, 0, -0.15], rotDeg: 270 },
      demo1: { pos: [-0.85, 0, -0.60], rotDeg: 0 },
      demo2: { pos: [-0.85, 0, 0.65], rotDeg: 0 },
      pipeRack: { pos: [0.92, 0, 1.25], rotDeg: 180 },
      roundTable: { pos: [0.00, 0, 0.25], rotDeg: 0 }
    }
  },
  {
    id: 3,
    name: 'Concept 3: VIP Lounge (Tiếp khách)',
    desc: 'Bàn tròn đặt góc yên tĩnh, TV chuyển mặt tiền đón khách',
    layout: {
      tvStand: { pos: [-1.16, 0, 0.55], rotDeg: 90 },
      demo1: { pos: [0.95, 0, -0.85], rotDeg: 180 },
      demo2: { pos: [0.95, 0, 0.30], rotDeg: 180 },
      pipeRack: { pos: [0.95, 0, 1.25], rotDeg: 180 },
      roundTable: { pos: [-0.35, 0, -0.55], rotDeg: 0 }
    }
  }
];

let currentSlotIndex = 0;
let userCustomSlots = null;

// --- INITIALIZE TRANSFORM CONTROLS GIZMO ---
function initTransformControls() {
  if (typeof THREE.TransformControls === 'undefined') {
    console.warn('TransformControls library not found');
    return;
  }

  transformControls = new THREE.TransformControls(camera, renderer.domElement);
  transformControls.size = 0.75;
  transformControls.setTranslationSnap(0.01); // 1cm precision
  transformControls.setRotationSnap(THREE.MathUtils.degToRad(5)); // 5 degree precision
  transformControls.showY = false; // Lock translation on floor plane
  transformControls.setMode('translate');

  transformControls.addEventListener('change', () => {
    if (activeEquipmentKey && EQUIPMENT[activeEquipmentKey]) {
      const grp = EQUIPMENT[activeEquipmentKey].getGroup();
      if (grp) {
        grp.position.y = 0; // enforce floor grounding
        updateInspectorInputsFromObject(grp);
        if (typeof updateClearanceVisuals === 'function') {
          updateClearanceVisuals();
        }
      }
    }
  });

  transformControls.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
  });

  scene.add(transformControls);

  // Load saved slots from LocalStorage
  loadSavedConceptSlots();

  // Select default item
  setTimeout(() => {
    selectEquipment('tvStand');
    if (typeof updateClearanceVisuals === 'function') {
      updateClearanceVisuals();
    }
  }, 500);
}

// --- CONCEPT SLOT MANAGEMENT (1-CLICK INSTANT SWITCH) ---
function loadSavedConceptSlots() {
  try {
    const saved = localStorage.getItem('vec2026_concept_slots');
    if (saved) {
      userCustomSlots = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('LocalStorage unavailable, using preset defaults');
  }
}

function selectConceptSlot(slotIdx) {
  currentSlotIndex = slotIdx;
  
  // Update slot buttons UI
  document.querySelectorAll('.slot-btn').forEach((b, i) => {
    b.classList.toggle('active', i === slotIdx);
  });

  const slots = userCustomSlots || CONCEPT_PRESETS;
  const targetSlot = slots[slotIdx] || CONCEPT_PRESETS[slotIdx];
  if (!targetSlot || !targetSlot.layout) return;

  Object.entries(targetSlot.layout).forEach(([key, data]) => {
    if (EQUIPMENT[key]) {
      const grp = EQUIPMENT[key].getGroup();
      if (grp && data.pos) {
        grp.position.set(data.pos[0], data.pos[1], data.pos[2]);
        if (data.rotDeg !== undefined) {
          grp.rotation.y = THREE.MathUtils.degToRad(data.rotDeg);
        } else if (data.rotY !== undefined) {
          grp.rotation.y = data.rotY;
        }
      }
    }
  });

  if (activeEquipmentKey && EQUIPMENT[activeEquipmentKey]) {
    updateInspectorInputsFromObject(EQUIPMENT[activeEquipmentKey].getGroup());
  }
  if (transformControls) transformControls.updateMatrixWorld();
  if (typeof updateClearanceVisuals === 'function') updateClearanceVisuals();

  showToast(`Đã chuyển sang ${targetSlot.name}`);
}

function saveToCurrentSlot() {
  if (!userCustomSlots) {
    userCustomSlots = JSON.parse(JSON.stringify(CONCEPT_PRESETS));
  }

  const currentLayout = {};
  Object.entries(EQUIPMENT).forEach(([key, eq]) => {
    const grp = eq.getGroup();
    if (grp) {
      let deg = Math.round(THREE.MathUtils.radToDeg(grp.rotation.y)) % 360;
      if (deg < 0) deg += 360;
      currentLayout[key] = {
        pos: [parseFloat(grp.position.x.toFixed(3)), 0, parseFloat(grp.position.z.toFixed(3))],
        rotDeg: deg
      };
    }
  });

  userCustomSlots[currentSlotIndex].layout = currentLayout;

  try {
    localStorage.setItem('vec2026_concept_slots', JSON.stringify(userCustomSlots));
    showToast(`Đã lưu bố cục hiện tại vào ${userCustomSlots[currentSlotIndex].name}!`);
  } catch (e) {
    showToast("Đã lưu vào bộ nhớ tạm phiên làm việc!");
  }
}

// --- EQUIPMENT SELECTION & GIZMO CONTROL ---
function selectEquipment(key) {
  activeEquipmentKey = key;
  document.querySelectorAll('[id^="chip-eq-"]').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('chip-eq-' + key);
  if (activeBtn) activeBtn.classList.add('active');

  const eq = EQUIPMENT[key];
  if (eq && transformControls) {
    const grp = eq.getGroup();
    if (grp) {
      transformControls.attach(grp);
      updateInspectorInputsFromObject(grp);
    }
  }
}

function detachGizmo() {
  activeEquipmentKey = null;
  if (transformControls) transformControls.detach();
  document.querySelectorAll('[id^="chip-eq-"]').forEach(btn => btn.classList.remove('active'));
}

function setTransformMode(mode) {
  if (transformControls) {
    transformControls.setMode(mode);
    if (mode === 'rotate') {
      transformControls.showX = false;
      transformControls.showZ = false;
      transformControls.showY = true;
    } else {
      transformControls.showX = true;
      transformControls.showZ = true;
      transformControls.showY = false;
    }
    const btnTrans = document.getElementById('btn-mode-translate');
    const btnRot = document.getElementById('btn-mode-rotate');
    if (btnTrans) btnTrans.classList.toggle('active', mode === 'translate');
    if (btnRot) btnRot.classList.toggle('active', mode === 'rotate');
  }
}

function updateInspectorInputsFromObject(obj) {
  if (!obj) return;
  const x = obj.position.x;
  const z = obj.position.z;
  let deg = Math.round(THREE.MathUtils.radToDeg(obj.rotation.y)) % 360;
  if (deg < 0) deg += 360;

  const sx = document.getElementById('slider-x');
  const ix = document.getElementById('input-x');
  const sz = document.getElementById('slider-z');
  const iz = document.getElementById('input-z');
  const srot = document.getElementById('slider-rot');
  const irot = document.getElementById('input-rot');

  if (sx) sx.value = x.toFixed(2);
  if (ix) ix.value = x.toFixed(2);
  if (sz) sz.value = z.toFixed(2);
  if (iz) iz.value = z.toFixed(2);
  if (srot) srot.value = deg;
  if (irot) irot.value = deg;
}

function onCoordSliderChange() {
  if (!activeEquipmentKey || !EQUIPMENT[activeEquipmentKey]) return;
  const grp = EQUIPMENT[activeEquipmentKey].getGroup();
  if (!grp) return;

  const x = parseFloat(document.getElementById('slider-x').value);
  const z = parseFloat(document.getElementById('slider-z').value);
  const deg = parseFloat(document.getElementById('slider-rot').value);

  document.getElementById('input-x').value = x.toFixed(2);
  document.getElementById('input-z').value = z.toFixed(2);
  document.getElementById('input-rot').value = deg;

  grp.position.x = x;
  grp.position.z = z;
  grp.rotation.y = THREE.MathUtils.degToRad(deg);
  if (transformControls) transformControls.updateMatrixWorld();
  if (typeof updateClearanceVisuals === 'function') updateClearanceVisuals();
}

function onCoordInputChange() {
  if (!activeEquipmentKey || !EQUIPMENT[activeEquipmentKey]) return;
  const grp = EQUIPMENT[activeEquipmentKey].getGroup();
  if (!grp) return;

  const x = parseFloat(document.getElementById('input-x').value) || 0;
  const z = parseFloat(document.getElementById('input-z').value) || 0;
  let deg = parseFloat(document.getElementById('input-rot').value) || 0;
  if (deg < 0) deg = 0;
  if (deg > 360) deg = 360;

  document.getElementById('slider-x').value = x;
  document.getElementById('slider-z').value = z;
  document.getElementById('slider-rot').value = deg;

  grp.position.x = x;
  grp.position.z = z;
  grp.rotation.y = THREE.MathUtils.degToRad(deg);
  if (transformControls) transformControls.updateMatrixWorld();
  if (typeof updateClearanceVisuals === 'function') updateClearanceVisuals();
}

function setEquipmentRotationDeg(deg) {
  const srot = document.getElementById('slider-rot');
  const irot = document.getElementById('input-rot');
  if (srot) srot.value = deg;
  if (irot) irot.value = deg;
  onCoordSliderChange();
}

// --- CLEARANCE SAFETY METRICS CALCULATION ---
function calculateMinClearance() {
  const keys = Object.keys(EQUIPMENT);
  let minDistance = 999;
  let closestPair = null;

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const g1 = EQUIPMENT[keys[i]].getGroup();
      const g2 = EQUIPMENT[keys[j]].getGroup();
      if (g1 && g2 && g1.visible && g2.visible) {
        const centerDist = Math.hypot(g1.position.x - g2.position.x, g1.position.z - g2.position.z);
        const edgeDist = centerDist - (EQUIPMENT[keys[i]].radius + EQUIPMENT[keys[j]].radius);
        if (edgeDist < minDistance) {
          minDistance = edgeDist;
          closestPair = [EQUIPMENT[keys[i]].name, EQUIPMENT[keys[j]].name];
        }
      }
    }
  }

  return {
    distance: Math.max(0, minDistance),
    closestPair: closestPair,
    isSafe: minDistance >= 0.55 // 55cm minimum clearance for passage
  };
}

// --- CONCEPT SERIALIZATION & MODALS ---
function getBoothLayoutObject() {
  const layout = {
    booth_size: { width: 3.0, depth: 3.0, height: 2.5 },
    unit: 'meter',
    timestamp: new Date().toISOString(),
    equipment_layout: {}
  };

  Object.entries(EQUIPMENT).forEach(([key, eq]) => {
    const grp = eq.getGroup();
    if (grp) {
      let deg = Math.round(THREE.MathUtils.radToDeg(grp.rotation.y)) % 360;
      if (deg < 0) deg += 360;
      layout.equipment_layout[key] = {
        name: eq.name,
        position: {
          x: parseFloat(grp.position.x.toFixed(3)),
          y: parseFloat(grp.position.y.toFixed(3)),
          z: parseFloat(grp.position.z.toFixed(3))
        },
        rotation_deg_y: deg
      };
    }
  });
  return layout;
}

function exportLayoutJSON() {
  const layoutObj = getBoothLayoutObject();
  const jsonStr = JSON.stringify(layoutObj, null, 2);

  // 1. Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(jsonStr).then(() => {
      showToast("Đã sao chép concept vào Clipboard & Tải file!");
    }).catch(() => {
      showToast("Đã tải file concept bố cục!");
    });
  } else {
    showToast("Đã tải file concept bố cục!");
  }

  // 2. Download JSON file
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `concept_booth_vec2026_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function openJsonModal() {
  const layoutObj = getBoothLayoutObject();
  document.getElementById('json-textarea').value = JSON.stringify(layoutObj, null, 2);
  document.getElementById('json-modal').style.display = 'flex';
}

function closeJsonModal() {
  document.getElementById('json-modal').style.display = 'none';
}

function copyJsonFromTextarea() {
  const text = document.getElementById('json-textarea').value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Đã sao chép mã concept vào Clipboard!");
    });
  }
}

function applyJsonLayout() {
  try {
    const text = document.getElementById('json-textarea').value;
    const parsed = JSON.parse(text);
    const eqData = parsed.equipment_layout || parsed;

    Object.entries(eqData).forEach(([key, item]) => {
      if (EQUIPMENT[key]) {
        const grp = EQUIPMENT[key].getGroup();
        if (grp && item.position) {
          if (item.position.x !== undefined) grp.position.x = parseFloat(item.position.x);
          if (item.position.z !== undefined) grp.position.z = parseFloat(item.position.z);
          if (item.rotation_deg_y !== undefined) {
            grp.rotation.y = THREE.MathUtils.degToRad(parseFloat(item.rotation_deg_y));
          } else if (item.rotation_y !== undefined) {
            grp.rotation.y = parseFloat(item.rotation_y);
          }
        }
      }
    });

    if (activeEquipmentKey && EQUIPMENT[activeEquipmentKey]) {
      updateInspectorInputsFromObject(EQUIPMENT[activeEquipmentKey].getGroup());
    }
    if (transformControls) transformControls.updateMatrixWorld();
    if (typeof updateClearanceVisuals === 'function') updateClearanceVisuals();

    closeJsonModal();
    showToast("Đã áp dụng concept thành công!");
  } catch (err) {
    alert("Lỗi định dạng concept: " + err.message);
  }
}

function resetDefaultLayout() {
  selectConceptSlot(0);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (toast) {
    if (toastText) {
      toastText.innerText = msg;
    } else {
      toast.innerText = msg;
    }
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  }
}
