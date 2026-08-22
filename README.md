# 🏛️ VEC 2026 — 3D Booth Mockup Simulator
> **T&T VINA INDUSTRIAL CO., LTD. × MURRPLASTIK SYSTEMTECHNIK GMBH**  
> Tuần lễ Công nghiệp & Công nghệ Việt Nam 2026 (VITW 2026) — Trung tâm Triển lãm Việt Nam (VEC, Đông Anh, Hà Nội).

[![Live 3D Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://lylamkhai218.github.io/VEC26_booth_mockup/)

---

## 📌 Tổng Quan Không Gian Gian Hàng
* **Vị trí:** Ô **H1-15**, Sảnh 2 (Hall 2 — VEC Hà Nội)
* **Quy cách:** **Gian góc (Corner Booth — Mở 2 mặt tiền)**
* **Kích thước bao khối:** `3.000 mm × 3.000 mm × 2.500 mm`
* **Vách in & Biển hiệu:**
  - 01 Vách Hậu chính (`3.000 × 2.500 mm`) — Murrplastik Automation & Robotics
  - 01 Vách Bên (`3.000 × 2.500 mm`) — Railway, Solar & Cable Management Solutions
  - 02 Biển trán Valance (`2.950 × 400 mm`) — Mặt tiền & Mặt hông
  - 01 Bàn lễ tân vuông góc chuẩn triển lãm (`1.100 × 500 × 1.000 mm`) & 02 ghế gập/bar stool
  - 01 Sọt rác tiêu chuẩn tại góc trong giữa 2 vách

---

## 🚀 Tính Năng Nổi Bật Của Trình Duyệt 3D
1. **100% Tương thích Mọi Môi Trường (Zero CORS):** Nhúng Base64 texture trực tiếp trong `textures_data.js`, mở trực tiếp bằng click đúp `index.html` (file://) hoặc web server đều chạy mượt 60 FPS.
2. **Xoay 360° & Zoom:** Trải nghiệm không gian thực tế từ mọi góc độ.
3. **Preset 3 Phiên Bản Thiết Kế:**
   - ✨ `Bản V2 (Visual-First)`: Bản nâng cấp mới nhất tối ưu hình ảnh thực tế ứng dụng.
   - 📄 `Bản V1 (Production)`: Chuẩn kỹ thuật chia 3 panel in ấn.
   - 🏷️ `Bản Backdrop 295×210cm`: Phiên bản cơ sở ban đầu.
4. **5 Góc Camera Chuẩn Duyệt:** Phối cảnh 45°, Trực diện vách hậu, Trực diện vách bên, Tầm mắt khách 1.6m, Mặt bằng Top-down.
5. **Tùy biến hiển thị:** Bật/tắt khung nhôm Octanorm, Bàn lễ tân, Sọt rác, Đèn rọi LED Spotlight, Tự động xoay 360°.
6. **📸 Nút "Xuất Ảnh Mockup HD":** Xuất ảnh chụp PNG độ phân giải cao gửi Zalo/Email cho Sếp duyệt nhanh.

---

## 🛠️ Cài Đặt & Chạy Cục Bộ
```bash
# 1. Clone repository
git clone https://github.com/lylamkhai218/VEC26_booth_mockup.git

# 2. Mở trực tiếp (Windows)
Click đúp file run_mockup.bat (hoặc mở trực tiếp index.html)
```

---

## 📂 Cấu Trúc Thư Mục
```text
├── index.html               # Ứng dụng mô phỏng 3D WebGL (Three.js)
├── textures_data.js         # Dữ liệu texture Base64 nạp nhanh không bị lỗi CORS
├── run_mockup.bat           # File chạy 1-click tự động mở trình duyệt
├── build_mockup_assets.py   # Script render SVG và đóng gói Base64 tự động
├── render_textures.py       # Script headless Edge render vector sang PNG
├── textures/                # Thư mục chứa 10 texture PNG (2048px)
└── README.md
```
