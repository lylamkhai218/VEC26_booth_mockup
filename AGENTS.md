# 🤖 AI AGENT OPERATING GUIDELINES (AGENTS.md)
## 3D Booth Mockup — T&T VINA × MURRPLASTIK (VEC 2026)

Tài liệu này là **Quy chuẩn bắt buộc** dành cho tất cả các AI Agent (Antigravity, Gemini, Claude, GPT, Cursor, Copilot...) khi thao tác hoặc bảo trì trong codebase này.

---

## 🎯 1. Nguyên Tắc Cốt Lõi Bất Biến (Strict Invariants)

1. **100% Offline & File:// Compatibility:**
   - **TUYỆT ĐỐI KHÔNG** chèn thêm liên kết CDN bên ngoài (`https://cdnjs.cloudflare.com/...`, `https://cdn.jsdelivr.net/...`, `https://fonts.googleapis.com/...`).
   - Mọi thư viện hoặc assets bắt buộc phải nằm trong thư mục nội bộ `mockup/libs/`, `mockup/textures/` hoặc Base64 trong `mockup/textures_data.js`.
2. **Zero-Build Architecture:**
   - Không được thêm `package.json`, Webpack, Vite hay các bước build Node.js phức tạp. Ứng dụng phải mở chạy được ngay bằng cách double-click file `mockup/index.html` hoặc deploy trực tiếp lên GitHub Pages.
3. **Strict Modular Separation (Không gộp ngược lại thành Monolith):**
   - Giữ nguyên kiến trúc module hóa đã thiết lập. Không viết thêm code CSS hay mã JS inline vào `mockup/index.html`.
4. **Append-Only / Non-Destructive Documentation (Bảo toàn dữ liệu lịch sử):**
   - **BẮT BUỘC:** Đối với các file tài liệu kiến trúc, hướng dẫn và cấu hình (`ARCHITECTURE.md`, `AGENTS.md`, `README.md`, `PROJECT_MAP.md`...), khi có nội dung mới **CHỈ ĐƯỢC PHÉP GHI THÊM / NỐI ĐUÔI (APPEND)** hoặc bổ sung mục mới, **TUYỆT ĐỐI CẤM XÓA BỎ DATA CŨ RỒI GHI ĐÈ**. Mọi cập nhật phải duy trì đầy đủ lịch sử và các quyết định kỹ thuật trước đó.

---

## 🗺️ 2. Bảng Điều Hướng Mã Nguồn (Agent Routing Map)

Khi nhận được yêu cầu từ người dùng, hãy mở **trực tiếp file chuyên trách** sau đây mà không cần phải scan toàn bộ dự án:

| Yêu cầu của Người dùng | File cần chỉnh sửa | Phạm vi hàm / Thành phần |
| :--- | :--- | :--- |
| **Đổi màu sắc, giao diện HUD, kích cỡ nút, drawer mobile** | `css/app.css` | `.hud-panel`, `.coord-grid`, `.modal-card`, `.camera-quickbar` |
| **Kích thước gian hàng, Texture Base64, hằng số toàn cục** | `js/config.js` | `BOOTH_W`, `BOOTH_D`, `BOOTH_H`, `VERSIONS`, `getTextureSource()` |
| **Khung nhôm T-slot, vách ngăn Octanorm, biển trán** | `js/booth_structures.js` | `createTSlotGeometry()`, `buildBoothWalls()`, `buildAluminumFrame()` |
| **Giá TV 65", Bàn Laser, Bàn Robot, Kệ ống, Ghế ngồi** | `js/equipment_models.js` | `createModernChair()`, `buildTVStandAnd65TV()`, `buildDemoTable1Laser()`, `buildDemoTable2RTec()`, `buildModularPipeRack()`, `buildRoundTableCenter()` |
| **Kéo thả Gizmo 3D, Sliders X/Z/RotY, Lưu/Nhập concept** | `js/layout_manager.js` | `EQUIPMENT`, `initTransformControls()`, `selectEquipment()`, `exportLayoutJSON()`, `applyJsonLayout()` |
| **Three.js Engine, Ánh sáng, Camera, Raycaster click** | `js/scene_core.js` | `init()`, `setupLighting()`, `setCameraView()`, `setupInteractiveDimensions()`, `handleMeshClick()` |
| **Thêm nút bấm mới, cấu trúc HTML, thứ tự load script** | `index.html` | Cấu trúc DOM thẻ HTML & danh sách thẻ `<script>` |

---

## 🧪 3. Quy Trình Kiểm Thử & Xác Minh (Verification Workflow)

Sau khi chỉnh sửa code, AI Agent **PHẢI** thực hiện quy trình xác minh bằng chứng trước khi thông báo hoàn thành cho người dùng:

1. **Chạy script chụp ảnh tự động (Headless Browser):**
   ```powershell
   python capture_cad_preview.py
   ```
2. **Kiểm tra ảnh chụp xem có lỗi visual hay crash WebGL không:**
   - Đọc ảnh `preview_cad_desktop.png` bằng công cụ `view_file`.
   - Xác nhận tất cả đối tượng 3D render đúng vị trí, ánh sáng chuẩn và UI không bị lệch layout.
3. **Commit & Push lên GitHub Repository:**
   ```bash
   git add index.html css/ js/ *.md
   git commit -m "feat(scope): detailed message"
   git push origin main
   ```
   *Target Repository:* `https://github.com/lylamkhai218/VEC26_booth_mockup`  
   *Production URL:* `https://lylamkhai218.github.io/VEC26_booth_mockup/`

---

## 📐 4. Quy Ước Thiết Kế Đồ Đạc (Furniture Design Standards)

- **Ghế ngồi:** Mặc định sử dụng hàm `createModernChair(seatColor)` để đảm bảo đồng bộ phong cách tối giản, chân mạ chrome thanh thoát.
- **Ghế bàn tròn:** Luôn xoay góc hướng tâm vào mặt bàn: `chair.rotation.y = angle + Math.PI;`.
- **Màn hình TV:** Luôn sử dụng tỉ lệ chuẩn $16:9$ ($1.43\text{m} \times 0.82\text{m}$), chiều cao tâm đặt tại $1.40\text{m}$ so với sàn.
- **Độ cao mặt bàn:** Chuẩn công thái học triển lãm $0.73\text{m} - 0.75\text{m}$.
