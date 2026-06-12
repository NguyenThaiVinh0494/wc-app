# 🏆 FIFA World Cup 2026 - Lịch Thi Đấu, Bảng Xếp Hạng & Vòng Loại Trực Tiếp

Ứng dụng web hiện đại giúp theo dõi lịch thi đấu, trực quan hóa bảng xếp hạng và mô phỏng sơ đồ vòng loại trực tiếp (Knockout) của giải bóng đá lớn nhất hành tinh **FIFA World Cup 2026** (diễn ra tại Mỹ, Canada và Mexico).

Dự án được xây dựng tích hợp cả Front-end (React + Vite + TypeScript) và Back-end (Express.js + JSON Database) giúp tự động lưu trữ dữ liệu bền vững khi tải lại trang (F5).

---

## 🚀 Các Tính Năng Nổi Bật

- **12 Bảng Đấu (A - L) & 72 Trận Đấu**: Cập nhật dữ liệu chuẩn xác theo infographic chính thức của FIFA World Cup 2026.
- **Tự động Tính điểm**: Nhập kết quả tỉ số, hệ thống sẽ tự động tính toán điểm số (Thắng/Hòa/Thua, Bàn thắng, Bàn thua, Hiệu số) và cập nhật phong độ 3 trận đấu gần nhất.
- **Tự động Điền hạt giống**: Tính toán 2 đội nhất, nhì bảng và 8 đội hạng 3 có thành tích tốt nhất để tự động điền vào Vòng loại trực tiếp (Round of 32).
- **Lưu trữ dữ liệu bền vững**: Lưu giữ tỉ số trận đấu, tên đội tuyển tùy chỉnh và trạng thái bracket Knockout thông qua Back-end API.
- **Tối ưu hóa hiệu năng**: Việc lưu trữ tên đội tuyển sử dụng sự kiện `onBlur` (khi click ra ngoài ô nhập liệu) giúp tránh gửi request liên tục làm chậm ứng dụng.
- **Khôi phục mặc định**: Nút khôi phục ban đầu (Reset) nhanh chóng đưa giải đấu về trạng thái gốc.

---

## 🛠️ Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

- **Node.js** (phiên bản 18.x trở lên được khuyến nghị)
- **npm** (đi kèm khi cài đặt Node.js)

---

## 📂 Cấu Trúc Dự Án

```text
wc-app/
├── package.json         # Cấu hình dự án gốc & scripts khởi chạy đồng thời
├── vite.config.ts       # Cấu hình Vite & API Proxy kết nối lên Back-end
├── src/                 # Mã nguồn Front-end (React + TypeScript)
│   ├── App.tsx          # Component giao diện chính và logic ứng dụng
│   ├── main.tsx         # Điểm khởi chạy React client
│   └── styles.css       # Cấu hình Tailwind CSS & Custom scrollbars
└── server/              # Mã nguồn Back-end (Express + TypeScript)
    ├── package.json     # Quản lý thư viện của Back-end
    ├── tsconfig.json    # Cấu hình TypeScript cho server
    ├── data/
    │   └── db.json      # Cơ sở dữ liệu dạng tệp JSON (Tự động tạo)
    └── src/
        ├── server.ts    # API endpoints (CRUD tỉ số, tên đội, knockout)
        ├── db.ts        # Tiện ích đọc/ghi dữ liệu JSON
        └── initialData.ts # Tập dữ liệu mẫu ban đầu để seeding
```

---

## 💾 Hướng Dẫn Cài Đặt (Setup)

Sau khi clone dự án về máy, hãy mở terminal tại thư mục gốc `wc-app` và chạy các lệnh sau:

1. **Cài đặt thư viện Front-end (Thư mục gốc)**:

   ```bash
   npm install
   ```
2. **Cài đặt thư viện Back-end (Thư mục server)**:

   ```bash
   npm --prefix server install
   ```

---

## 🏃‍♂️ Hướng Dẫn Khởi Chạy (Run)

Bạn không cần mở 2 cửa sổ terminal riêng biệt. Ở thư mục gốc `wc-app`, hãy chạy lệnh duy nhất dưới đây để khởi động đồng thời cả Front-end và Back-end thông qua công cụ `concurrently`:

```bash
npm run dev
```

Sau khi chạy lệnh:

- **Front-end (Vite)** sẽ hoạt động tại địa chỉ: **[http://localhost:5174/](http://localhost:5173/)**
- **Back-end (Express API)** sẽ chạy tại địa chỉ: **`http://localhost:3000`**
- Cơ sở dữ liệu sẽ tự động tạo thư mục và tệp tin dữ liệu mẫu tại `server/data/db.json` nếu khởi chạy lần đầu.

---

## 🛑 Hướng Dẫn Dừng Chạy (Stop)

Để dừng hoạt động của các server phát triển, tại cửa sổ Terminal đang chạy lệnh `npm run dev`:

- Nhấn tổ hợp phím **`Ctrl + C`**.
- Khi xuất hiện câu hỏi xác nhận `Terminate batch job? (Y/N)`, gõ **`y`** và nhấn **Enter**.

---

## 🏗️ Hướng Dẫn Biên Dịch (Build)

Khi bạn muốn đóng gói ứng dụng để đưa lên môi trường sản xuất (Production):

1. **Biên dịch Front-end**:

   ```bash
   npm run build
   ```
   Kết quả biên dịch tĩnh (HTML, JS, CSS đã được tối ưu hóa) sẽ nằm ở thư mục **`dist/`**.
2. **Biên dịch Back-end**:

   ```bash
   npm --prefix server run build
   ```
   Các file JavaScript đã biên dịch từ TypeScript sẽ nằm ở thư mục **`server/dist/`**.
