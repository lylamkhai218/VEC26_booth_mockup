/**
 * config.js - Global Constants & State Configuration
 * 100% Offline / Zero Node.js Dependency
 */

// --- BOOTH PHYSICAL DIMENSIONS (Meters) ---
const BOOTH_W = 3.0; // Width: 3.000 mm
const BOOTH_D = 3.0; // Depth: 3.000 mm
const BOOTH_H = 2.5; // Height: 2.500 mm
const VALANCE_H = 0.4; // Valance board: 400 mm
const POST_RADIUS = 0.025; // 50x50 mm profile half-size

// --- GLOBAL ENGINE STATE ---
let scene, camera, renderer, controls;
let boothGroup, frameGroup, lightsGroup;
let tvStandGroup, demoTable1Group, demoTable2Group, pipeRackGroup, roundTableGroup;
let backwallMesh, sidewallMesh, valanceFrontMesh, valanceSideMesh;
let spotLight1, spotLight2, spotLight3, ambientLight, dirLight;
let currentVersion = 'v3';
let transformControls = null;
let activeEquipmentKey = 'tvStand';

// --- INTERACTIVE RAYCASTER STATE ---
let raycaster, clickMouse;
let activeHighlightMesh = null;
let activeHighlightOrigColor = null;
let activeHighlightTimeout = null;
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

// --- TEXTURE SOURCES (Base64 First, Relative Path Fallback) ---
function getTextureSource(key) {
  if (window.TEXTURE_DATA && window.TEXTURE_DATA[key]) {
    return window.TEXTURE_DATA[key];
  }
  return 'textures/' + key + '.png';
}

// --- VERSION DEFINITIONS ---
const VERSIONS = {
  v3: {
    backwall: () => getTextureSource('v3_backwall'),
    sidewall: () => getTextureSource('v3_sidewall'),
    valanceFront: () => getTextureSource('v3_valance_front'),
    valanceSide: () => getTextureSource('v3_valance_side')
  },
  v2: {
    backwall: () => getTextureSource('v2_backwall'),
    sidewall: () => getTextureSource('v2_sidewall'),
    valanceFront: () => getTextureSource('v2_valance_front'),
    valanceSide: () => getTextureSource('v2_valance_side')
  },
  v1: {
    backwall: () => getTextureSource('v1_backwall'),
    sidewall: () => getTextureSource('v1_sidewall'),
    valanceFront: () => getTextureSource('v1_valance_front'),
    valanceSide: () => getTextureSource('v1_valance_side')
  }
};
