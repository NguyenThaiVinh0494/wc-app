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

---

## 🐳 Hướng Dẫn Với Docker & Đóng Gói (Containerization)

Ứng dụng hỗ trợ đóng gói toàn bộ dưới dạng 1 Docker container duy nhất, tự động biên dịch và chạy Front-end tĩnh phục vụ trực tiếp qua Back-end Express.

### 1. Khởi động Docker Desktop

Đảm bảo phần mềm **Docker Desktop** đã được khởi chạy trên máy tính của bạn và biểu tượng chú cá voi Docker ở góc màn hình hiển thị màu xanh lá cây (Running).

### 2. Build Docker Image

Mở terminal (PowerShell hoặc Command Prompt) tại thư mục gốc dự án (`D:\wc-app`) và chạy lệnh build:

```bash
docker build -t wc-app:latest .
```

Sau khi tiến trình hoàn tất, bạn có thể kiểm tra danh sách image bằng cách vào ứng dụng **Docker Desktop**, chọn tab **Images** và bạn sẽ thấy `wc-app` xuất hiện tại đây.

### 3. Khởi chạy Container bằng Command Line (Khuyên dùng)

Để dữ liệu giải đấu (file `db.json`) được lưu giữ bền vững và không bị mất khi container dừng hoặc bị xóa, hãy chạy lệnh sau để mount thư mục lưu trữ ngoài máy chủ và cấu hình biến môi trường:

```bash
# Trên PowerShell Windows:
docker run -d -p 3000:3000 -v ${PWD}/data:/data -e DATABASE_DIR=/data --name wc-tournament wc-app:latest
```

- Lệnh trên sẽ tự động tạo một thư mục tên `data` chứa file `db.json` ngay tại thư mục hiện hành trên máy tính của bạn.
- Ứng dụng chạy tại địa chỉ: **`http://localhost:3000`**

### 4. Khởi chạy bằng Giao diện Docker Desktop UI (Không cần dòng lệnh)

Nếu bạn không muốn sử dụng dòng lệnh, bạn có thể khởi chạy trực tiếp trên Docker Desktop:

1. Mở ứng dụng **Docker Desktop** và chọn tab **Images**.
2. Tìm image `wc-app:latest` trong danh sách và nhấp nút **Run** ở cột Action.
3. Trong cửa sổ cấu hình hiện ra, click vào **Optional settings** (Cài đặt nâng cao):
   - **Container name**: Điền `wc-tournament`.
   - **Host port**: Điền `3000`.
   - **Volumes (Mount ổ đĩa)**:
     - *Host path*: Chọn một thư mục trống trên máy tính của bạn (Ví dụ: `D:\wc-app\data`).
     - *Container path*: Điền `/data`.
   - **Environment variables (Biến môi trường)**:
     - *Key*: Điền `DATABASE_DIR`
     - *Value*: Điền `/data`
4. Nhấn nút **Run** màu xanh lá cây. Hệ thống sẽ tự động chuyển sang tab **Containers** và khởi chạy ứng dụng.

---

## ☁️ Hướng Dẫn Deploy Lên Đám Mây (Render / Koyeb)

Cả **Render** và **Koyeb** đều hỗ trợ deploy tự động từ repository trên GitHub thông qua Dockerfile có sẵn trong dự án. Dưới đây là hướng dẫn chi tiết từng bước để triển khai.

### 1. Hướng dẫn chi tiết Deploy bằng Render

Để deploy ứng dụng của bạn lên Render, hãy thực hiện theo các bước sau:

#### Bước 1: Đẩy mã nguồn lên GitHub

- Push toàn bộ mã nguồn dự án `wc-app` của bạn lên một repository trên **GitHub** (có thể chọn chế độ Public hoặc Private).

#### Bước 2: Tạo dịch vụ mới trên Render

1. Truy cập vào trang quản trị **[Render Dashboard](https://dashboard.render.com/)** và đăng nhập bằng tài khoản GitHub của bạn.
2. Nhấp chọn nút **New +** ở góc trên cùng bên phải và chọn **Web Service**.
3. Chọn tùy chọn **Build and deploy from a Git repository**, sau đó tìm và nhấp chọn nút **Connect** bên cạnh repository chứa code của bạn.

#### Bước 3: Cấu hình thông tin Web Service cơ bản

**Name**: Nhập tên dự án hiển thị (ví dụ: `wc-app-2026`).

**Region**: Chọn khu vực gần nhất (ví dụ: `Singapore` để có tốc độ truy cập tốt nhất).

**Branch**: Chọn nhánh chứa code chính (thường là `main` hoặc `master`).

**Runtime**: Chọn **Docker** (Render sẽ tự động phát hiện `Dockerfile` ở thư mục gốc và build đa tầng tối ưu).

**Instance Type**: Chọn gói **Free** để thử nghiệm miễn phí.

#### Bước 4: Thiết lập Đĩa Lưu Trữ Ngoài (Persistent Volume)

*Vì cơ sở dữ liệu là tệp tin JSON, Render sẽ xóa dữ liệu cũ mỗi khi deploy code mới nếu không dùng đĩa ngoài. Hãy gắn đĩa để bảo vệ dữ liệu:*

1. Cuộn xuống phần cài đặt nâng cao hoặc truy cập tab **Disks** sau khi tạo dịch vụ.
2. Nhấp chọn **Add Disk**:
   - **Name**: Nhập tên đĩa (ví dụ: `wc-database-disk`).
   - **Mount Path**: Điền chính xác là `/data`.
   - **Size**: Chọn dung lượng nhỏ nhất (ví dụ: `1 GiB` là quá thừa cho file JSON).

#### Bước 5: Cấu hình biến môi trường (Environment Variables)

Tại mục **Environment Variables** (hoặc tab **Env**), nhấp **Add Environment Variable**:

- **Key**: `DATABASE_DIR` | **Value**: `/data` (Chỉ dẫn cho server Express đọc và lưu file database `db.json` trực tiếp trên đĩa lưu trữ ngoài `/data` vừa gắn).
- *(Tùy chọn)* **Key**: `PORT` | **Value**: `3000` (Render sẽ tự động dùng biến này để gán cổng).

#### Bước 6: Khởi chạy và Truy cập

1. Nhấp chọn nút **Create Web Service** ở cuối trang cấu hình.
2. Render sẽ bắt đầu clone dự án, build Docker và deploy. Quá trình này mất từ 2-4 phút.
3. Khi logs hiển thị trạng thái `Live` màu xanh lá cây, bạn có thể truy cập ứng dụng của mình thông qua liên kết URL được cung cấp ở trên cùng bên trái (ví dụ: `https://wc-app-2026.onrender.com`).

---

### 2. Hướng dẫn nhanh Deploy bằng Koyeb

Nếu bạn chọn sử dụng Koyeb làm nền tảng triển khai:

1. Tạo một Service mới trên **Koyeb Console** liên kết với Github repository của bạn.
2. Chọn loại cấu hình chạy bằng **Docker** (Koyeb sẽ tự động đọc `Dockerfile` ở root).
3. Trong mục **Volumes**, tạo một đĩa lưu trữ ngoài có dung lượng `1GB`, Mount Path đặt là `/data`.
4. Trong mục **Environment variables**, thiết lập biến `DATABASE_DIR` với giá trị là `/data`.
5. Đặt cổng kết nối (Port) là `3000` và nhấn **Deploy**.
