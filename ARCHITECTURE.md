# 🏛️ ARCHITECTURAL DESIGN DOCUMENT (ADD)
## 3D Interactive Exhibition Booth Mockup — T&T VINA × MURRPLASTIK (VEC 2026)

---

## 1. System Overview & Core Objectives

Hệ thống **3D Interactive Exhibition Booth Mockup** là giải pháp mô phỏng không gian gian hàng triển lãm 3 chiều thời gian thực (Real-time 3D WebGL), phục vụ việc thiết kế, thẩm định kỹ thuật và tối ưu hóa bố cục gian hàng tiêu chuẩn $3.0\text{m} \times 3.0\text{m} \times 2.5\text{m}$ (Ô H1-15, Sảnh 2 - VITW 2026).

### 🎯 Mục tiêu kiến trúc cốt lõi:
1. **100% Offline & File:// Ready:** Không phụ thuộc vào kết nối Internet, không gọi bất kỳ API/CDN từ xa nào (`Zero Remote URLs`). Chạy trực tiếp từ ổ cứng (`file:///`) hoặc GitHub Pages.
2. **Zero-Build Architecture:** Không cần cài đặt Node.js, Webpack, Vite hay NPM build step. Trình duyệt thực thi trực tiếp mã Vanilla JavaScript nguyên bản.
3. **Clean Modular Separation:** Tách biệt tuyệt đối giữa UI HUD / CSS, Three.js Engine Lifecycle, Procedural CAD Geometry, và Layout State Management.
4. **Interactive Direct Manipulation (Gizmo & Sliders):** Cho phép người dùng kéo thả, xoay và nhập tọa độ cơ khí chính xác cho thiết bị trên mặt sàn.
5. **Persistence & Serialization:** Lưu trữ và nạp bố cục dạng cấu trúc dữ liệu JSON độc lập (`booth_layout_official.json`).

---

## 2. Architectural Layers & Data Flow

```mermaid
graph TD
    subgraph UI_Layer["1. Presentation & UI Layer (DOM / CSS)"]
        HUD["HUD Dual Panels (app.css)"]
        CamBar["Camera QuickBar"]
        Sliders["Real-time Coordinate Sliders"]
        Modal["Concept Import/Export Dialog"]
    end

    subgraph State_Layer["2. State & Layout Management"]
        LayoutMgr["layout_manager.js"]
        Gizmo["TransformControls (X/Z Floor Lock)"]
        EquipRegistry["EQUIPMENT Registry & Offsets"]
        JSONStore["JSON Serializer / Deserializer"]
    end

    subgraph Core_3D_Layer["3. 3D Scene Graph & Physics"]
        SceneCore["scene_core.js (Engine Lifecycle)"]
        Raycast["Raycaster Dimension Inspector"]
        CamCtrl["OrbitControls (Damped Orbit)"]
        Lighting["Lighting System (Studio / Hall)"]
    end

    subgraph Geometry_Layer["4. Procedural CAD & Asset Models"]
        Structures["booth_structures.js (T-Slot 50x50mm, Walls)"]
        Models["equipment_models.js (TV 65\", Demo 1, Demo 2, Rack, Chairs)"]
        Textures["textures_data.js (Base64 Offline Payloads)"]
    end

    UI_Layer <-->|Events / 2-Way Binding| State_Layer
    State_Layer <-->|Transform Matrix| Core_3D_Layer
    Geometry_Layer -->|Mesh Instantiation| Core_3D_Layer
```

---

## 3. Module Breakdown & Responsibility Matrix

```
mockup/
├── index.html                  # Khung DOM & Điều phối thứ tự nạp Scripts (~180 dòng)
├── css/
│   └── app.css                 # Toàn bộ CSS Design System, HUD, Drawer Mobile, Modals (~450 dòng)
├── js/
│   ├── config.js               # Hằng số kích thước, Biến toàn cục, Fallback Textures (~60 dòng)
│   ├── booth_structures.js     # CAD Nhôm định hình T-Slot 50x50mm, Vách Octanorm, Biển trán (~180 dòng)
│   ├── equipment_models.js     # Dựng 3D Giá TV 65", Bàn Laser, Robot R-Tec, Kệ ống, Ghế tựa (~430 dòng)
│   ├── layout_manager.js       # Gizmo 3D TransformControls, Sliders, Lưu/Nhập concept (~260 dòng)
│   └── scene_core.js           # Khởi tạo Three.js, Camera, Ánh sáng, Raycaster Click (~340 dòng)
├── libs/                       # Standalone Engine Libraries
│   ├── three.min.js            # Three.js Core Engine (r128)
│   ├── OrbitControls.js        # Camera Navigation
│   └── TransformControls.js    # Interactive 3D Translation/Rotation Gizmo
└── textures_data.js            # Base64 Decal Vách (Offline Data Payload)
```

---

## 4. Engineering & Coordinate System Specifications

### 📐 Tọa độ chuẩn không gian (World Space):
- **Đơn vị:** Mét ($1.0\text{ unit} = 1.0\text{ meter}$).
- **Gốc tọa độ $(0, 0, 0)$:** Tâm mặt sàn gian hàng.
- **Mặt phẳng sàn:** $Y = 0.0$ (Tất cả thiết bị đều bị khóa cứng tại $Y = 0$).
- **Trục X (Ngang):** Từ $-1.5\text{m}$ (Vách bên trái) đến $+1.5\text{m}$ (Sảnh chính bên phải).
- **Trục Z (Sâu):** Từ $-1.5\text{m}$ (Vách hậu) đến $+1.5\text{m}$ (Mặt tiền chính).
- **Trục Y (Cao):** Từ $0.0\text{m}$ (Mặt sàn thảm) đến $+2.5\text{m}$ (Đỉnh cột nhôm định hình).

### 🔩 Thuật toán CAD Extrusion Nhôm Định Hình 50×50mm (`booth_structures.js`):
Khung gian hàng được dựng bằng thuật toán quét biên dạng 2D `THREE.Shape()` chính xác:
- **Biên dạng ngoài:** Hình vuông $50 \times 50\text{mm}$ đối xứng qua tâm.
- **04 Rãnh T-Slot tiêu chuẩn:** Rộng miệng $9\text{mm}$, rộng rãnh trong $18\text{mm}$, độ sâu $9.5\text{mm}$.
- **Lỗ ren trung tâm:** Đường kính $\varnothing 11\text{mm}$ xuyên suốt.
- **04 Lỗ định vị góc:** Đường kính $\varnothing 6\text{mm}$ giảm tải trọng cơ học.

---

## 5. Official Concept Layout Registry

Dữ liệu cấu hình bố cục không gian chính thức (Official Concept) được quản lý trong `js/layout_manager.js` và đồng bộ qua `booth_layout_official.json`:

```json
{
  "booth_size": { "width": 3.0, "depth": 3.0, "height": 2.5 },
  "unit": "meter",
  "equipment_layout": {
    "tvStand": {
      "name": "Giá TV di động E2050 + TV 65\"",
      "position": { "x": -1.16, "y": 0.0, "z": -0.17 },
      "rotation_deg_y": 90
    },
    "demo1": {
      "name": "Bàn Demo 1 (Laser + Laptop)",
      "position": { "x": 0.99, "y": 0.0, "z": -0.56 },
      "rotation_deg_y": 180
    },
    "demo2": {
      "name": "Bàn Demo 2 (Robot R-Tec Box)",
      "position": { "x": 0.95, "y": 0.0, "z": 1.27 },
      "rotation_deg_y": 180
    },
    "pipeRack": {
      "name": "Kệ khung ống modular 3x3 + 3 Thùng",
      "position": { "x": -0.81, "y": 0.0, "z": 1.26 },
      "rotation_deg_y": 0
    },
    "roundTable": {
      "name": "Bàn tròn tiếp khách & hoa quả (4 ghế)",
      "position": { "x": -0.08, "y": 0.0, "z": -0.49 },
      "rotation_deg_y": 0
    }
  }
}
```

---

## 6. Rendering Pipeline & Optimization

1. **Tone Mapping:** `THREE.ACESFilmicToneMapping` với `exposure = 1.15` (tái tạo dải sáng chân thực như rạp chiếu phim).
2. **Shadows:** `THREE.PCFSoftShadowMap` với shadow map resolution $2048 \times 2048$ và shadow bias $-0.0004$ loại bỏ hoàn toàn hiện tượng sọc nhiễu bóng đổ.
3. **Anisotropy:** Kích hoạt mức tối đa phần cứng (`getMaxAnisotropy()`) giúp hiển thị decal chữ siêu sắc nét khi quan sát ở góc nghiêng.
4. **Memory Management:** Thao tác chuyển phiên bản (V1/V2/V3) tái sử dụng Texture instances, không tạo thêm Mesh rác trong bộ nhớ GPU.

---

## 7. Lịch Sử Cập Nhật & Quyết Định Kỹ Thuật (Append-Only Revision History)

| Phiên bản | Thời gian | Người thực hiện | Nội dung thay đổi kiến trúc |
| :---: | :---: | :---: | :--- |
| **v1.0.0** | 2026-08-24 | AI Assistant & Team | Khởi tạo mô phỏng 3D đơn khối Monolith trong `index.html`. Hỗ trợ 3 phiên bản texture v1/v2/v3. |
| **v1.1.0** | 2026-08-24 | AI Assistant & Team | Bổ sung tương tác Gizmo 3D TransformControls, xuất/nạp bố cục JSON. |
| **v2.0.0** | 2026-08-24 | CTO & Senior FE | **Tái cấu trúc Modular Architecture:** Tách `index.html` thành 5 module độc lập (`config.js`, `booth_structures.js`, `equipment_models.js`, `layout_manager.js`, `scene_core.js`, `app.css`). Thiết lập bản đồ chỉ mục tra cứu code nhanh `PROJECT_MAP.md`. |
| **v2.1.0** | 2026-08-24 | CTO & Senior FE | Ban hành bộ tài liệu chuẩn hóa `ARCHITECTURE.md`, `AGENTS.md`, `README.md` và thiết lập quy chuẩn **Append-Only / Non-Destructive** vĩnh viễn cho tài liệu. |
| **v2.2.0** | 2026-08-25 | CTO & Senior FE | Tích hợp hệ thống **Thước đo Lối đi & Vòng an toàn (Walkway Clearance)** và **Bộ quản lý 3 Slot Concept nhanh (A/B/C)** lưu trữ LocalStorage. Thay thế toàn bộ Emojis bằng bộ Vector SVG đơn sắc Lucide chuẩn Industrial CAD. |
| **v2.3.0** | 2026-08-25 | CTO & Senior FE | Tích hợp **Hệ thống Lịch sử Hoàn tác (History Stack Undo/Redo)** hỗ trợ phím tắt `Ctrl + Z`, `Ctrl + Y` và nút bấm trực quan trên thanh Gizmo & Dock hành động. |
| **v2.4.0** | 2026-08-25 | CTO & Senior FE | Tối ưu hóa toàn diện giao diện Responsive Mobile (iOS/Android) và triệt tiêu hoàn toàn hiệu ứng văng panel khi kích hoạt chế độ Zen Mode (Ẩn thanh panels). |
| **v2.5.0** | 2026-08-25 | CTO & Strategy Team | Khóa cứng ràng buộc: Mặt bằng thuê tiêu chuẩn từ Ban Tổ Chức (Shell Scheme H1-15, Sảnh 2 - VEC 2026), cố định tuyệt đối kích thước $3.0\text{m} \times 3.0\text{m} \times 2.5\text{m}$ (Cao) không thể thay đổi kích thước phủ bì. Đồng bộ chiến lược 5 hệ sinh thái (Demo AUR không robot) vào hệ thống tài liệu. |
| **v2.6.0** | 2026-08-25 | CTO & Senior FE | Tích hợp **Preset Concept 4: Zero-G Lab (5 Hệ sinh thái Murrplastik)** và dựng chi tiết **3 mẫu phôi nhãn quà tặng Laser mp-LM 1M** (Thẻ nhôm Anodized, Thẻ nhựa 2 lớp, Móc khóa kỹ thuật). Bổ sung thiết kế ghế đôn Bar Stool kiểu dáng mảnh tối ưu lối đi. |

