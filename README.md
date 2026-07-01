# ThinhCMS Solution 🚀

Đây là kho lưu trữ mã nguồn cho dự án Hệ thống Quản trị Nội dung (CMS). Dự án được phát triển trong quá trình học tập thực hành.

## 👥 Thông tin sinh viên
- **Họ và tên:** Lê Công Thịnh
- **Mã sinh viên:** 2123110063
- **Lớp/Môn học:** CCQ2311B

## 🛠 Công nghệ sử dụng
- **Backend:** .NET / C# (ASP.NET Core Web API)
- **Frontend:**  ReactJS
- **Database:** SQL Server

---

## 📅 Nhật ký thực hành (Từ Buổi 1 đến Buổi 8)

### Buổi 1: Khởi tạo dự án & Cấu trúc thư mục
- Khởi tạo Solution `ThinhCMS_Solution`.
- Tạo các project con: `CMS.Backend` (Web API), `CMS.Data` (Class Library), và `cms.frontend`.
- Đẩy source code lên GitHub và tạo file `.gitignore`.

### Buổi 2: Thiết kế Cơ sở dữ liệu (Database Design)
- Phân tích yêu cầu và thiết kế các bảng dữ liệu cho CMS (Ví dụ: Users, Posts, Categories).
- Cài đặt Entity Framework Core vào project `CMS.Data`.
- Viết các lớp Entity (Models) và cấu hình `DbContext`.

### Buổi 3: Migrations & Repositories
- Chạy Entity Framework Core Migrations để tạo database dưới SQL Server.
- Áp dụng Dependency Injection (DI).

### Buổi 4: Xây dựng API cơ bản (CRUD)
- Viết các Controllers trong `CMS.Backend` (Ví dụ: `PostsController`, `UsersController`).
- Thực hiện các phương thức GET, POST, PUT, DELETE.
- Test API bằng Swagger / Postman.

### Buổi 5: Khởi tạo Frontend & Kết nối API
- Cài đặt và cấu trúc project `cms.frontend`.
- Thiết lập thư viện gọi API (ví dụ: `axios` hoặc `fetch`).
- Cấu hình CORS ở Backend để cho phép Frontend gọi dữ liệu.

### Buổi 6: Xây dựng giao diện (UI/UX)
- Thiết kế layout chính cho CMS (Sidebar, Header, Footer).
- Xây dựng các component hiển thị danh sách bài viết/danh mục.

### Buổi 7: Xử lý chức năng Thêm/Sửa/Xóa trên giao diện
- Viết logic xử lý form Thêm mới bài viết trên Frontend.
- Bắt lỗi (Validation) dữ liệu đầu vào.
- Tích hợp gọi API để lưu dữ liệu xuống Backend và cập nhật lại giao diện.

### Buổi 8: Hoàn thiện & Cải tiến
- Thử nghiệm toàn bộ luồng chức năng (End-to-End flow).
- Sửa lỗi (Fix bugs) phát sinh trong quá trình ghép nối Frontend và Backend.
- Review và tối ưu hóa code.

---

## 🚀 Hướng dẫn chạy dự án (How to run)

### 1. Backend (`CMS.Backend`)
1. Mở file `ThinhCMS_Solution.sln` bằng Visual Studio.
2. Sửa lại chuỗi kết nối cơ sở dữ liệu (Connection String) trong `appsettings.json`.
3. Mở Package Manager Console, chọn Default project là `CMS.Data` và chạy lệnh: `Update-Database`.
4. Run project `CMS.Backend`.

### 2. Frontend (`cms.frontend`)
1. Mở terminal tại thư mục `cms.frontend`.
2. Chạy lệnh cài đặt thư viện: `npm install` (hoặc `yarn install`).
3. Chạy dự án: `npm run start` (hoặc `npm run dev`).
