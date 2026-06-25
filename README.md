# Hướng dẫn chạy dự án ThinhCMS

Dự án này bao gồm hai phần: Backend (ASP.NET Core 8) và Frontend (ReactJS). Vui lòng làm theo hướng dẫn dưới đây để chạy dự án.

## 1. Khởi chạy Backend (C# ASP.NET Core)
1. Mở file `ThinhCMS_Solution.sln` bằng Visual Studio 2022.
2. Đặt project `CMS.Backend` làm Startup Project (Chuột phải vào `CMS.Backend` -> chọn **Set as Startup Project**).
3. Đảm bảo chuỗi kết nối (Connection String) trong `CMS.Backend/appsettings.json` đã trỏ đúng vào SQL Server của bạn.
4. Mở Package Manager Console, chọn Default project là `CMS.Data` và chạy lệnh `Update-Database` để tạo các bảng.
5. Nhấn phím **F5** hoặc nút **Start (https)** trên thanh công cụ để chạy Backend. 
6. Giao diện Swagger sẽ tự động bật lên ở địa chỉ `https://localhost:7208/swagger`.

## 2. Khởi chạy Frontend (ReactJS)
1. Cài đặt Node.js phiên bản mới nhất.
2. Mở Terminal (Command Prompt hoặc PowerShell) và di chuyển vào thư mục `cms.frontend`:
   ```bash
   cd cms.frontend
   ```
3. Cài đặt các thư viện cần thiết (chỉ chạy lần đầu):
   ```bash
   npm install
   ```
4. Khởi chạy server phát triển:
   ```bash
   npm start
   ```
5. Trình duyệt sẽ tự động mở trang web ở địa chỉ `http://localhost:3000`.

## Lưu ý
- Nếu Frontend gặp lỗi kết nối API, hãy kiểm tra xem Backend đã được bật chưa và port của Backend trong file `cms.frontend/.env` có khớp với port khi nhấn F5 không.
