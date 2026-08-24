# 🗺️ PROJECT MAP & CODE INDEX — VEC 2026 BOOTH MOCKUP

Bản đồ chỉ mục cấu trúc dự án chuẩn **Modular Architecture (100% Offline / Zero Build / No Node.js)**.

---

## 📁 1. Sơ Đồ Cấu Trúc Tệp (File Structure)

```
mockup/
├── index.html                  --> Khung giao diện HTML & Nạp các script module (~180 dòng)
├── css/
│   └── app.css                 --> UI/UX Design System, HUD Dual Panels, Mobile Drawers & Modal (~450 dòng)
├── js/
│   ├── config.js               --> Hằng số kích thước (3x3x2.5m), biến trạng thái toàn cục & Base64 texture lookup
│   ├── booth_structures.js     --> CAD nhôm định hình T-Slot 50x50mm, Vách Octanorm & Biển trán Formex 5mm
│   ├── equipment_models.js     --> Dựng 3D Thiết bị: Giá TV 65", Bàn Laser, Bàn Robot R-Tec, Kệ ống 3x3, Ghế
│   ├── layout_manager.js       --> Gizmo 3D TransformControls, Sliders tọa độ X/Z/RotY, Lưu/Nhập concept
│   └── scene_core.js           --> Khởi tạo Three.js, Camera, Ánh sáng, Raycaster Click kiểm tra kích thước
├── libs/                       --> Thư viện JS độc lập (three.min.js, OrbitControls.js, TransformControls.js)
├── textures_data.js            --> Dữ liệu Base64 Decal vách (Offline payload)
├── booth_layout_official.json  --> File cấu hình tọa độ concept chính thức
└── PROJECT_MAP.md              --> Bản đồ chỉ mục này
```

---

## 🎯 2. Bảng Tra Cứu Nhanh Chức Năng (Quick Lookup Table)

| Khi Cần Chỉnh Sửa | Tệp Mục Tiêu | Các Hàm / Biến Trọng Tâm |
| :--- | :--- | :--- |
| **Giao diện / Màu sắc / Nút bấm / Drawer** | `css/app.css` | `.hud-panel`, `.coord-grid`, `.modal-card`, `.camera-quickbar` |
| **Kích thước gian hàng / Fallback Texture** | `js/config.js` | `BOOTH_W, BOOTH_D, BOOTH_H`, `VERSIONS`, `getTextureSource()` |
| **Khung nhôm T-slot / Vách tường / Biển trán** | `js/booth_structures.js` | `createTSlotGeometry()`, `buildBoothWalls()`, `buildAluminumFrame()` |
| **TV 65", Bàn Demo, Kệ ống, Ghế ngồi** | `js/equipment_models.js` | `createModernChair()`, `buildTVStandAnd65TV()`, `buildDemoTable1Laser()`, `buildDemoTable2RTec()`, `buildModularPipeRack()`, `buildRoundTableCenter()` |
| **Kéo thả Gizmo / Sliders / Lưu/Nhập Concept** | `js/layout_manager.js` | `EQUIPMENT`, `initTransformControls()`, `selectEquipment()`, `exportLayoutJSON()`, `applyJsonLayout()` |
| **Ánh sáng / Camera / Góc nhìn / Raycast click** | `js/scene_core.js` | `init()`, `setupLighting()`, `setCameraView()`, `setupInteractiveDimensions()`, `handleMeshClick()` |
| **Cấu trúc nút bấm HTML / Trình tự load script** | `index.html` | Thẻ `<script>`, các component `<button>`, `#json-modal` |

---

## ⚡ 3. Nguyên Tắc Hoạt Động (Architecture Principles)
1. **100% Offline & File:// Ready:** Không sử dụng bất kỳ remote CDN URL nào (`http://` / `https://`).
2. **Zero-Build Dependency:** Không cần Node.js, Webpack, Vite hay NPM để chạy.
3. **Target Deployment:** GitHub Pages (`https://lylamkhai218.github.io/VEC26_booth_mockup/`).
