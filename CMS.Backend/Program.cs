using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// ==============================================================
// 1. KHU VỰC ĐĂNG KÝ DỊCH VỤ (SERVICES CONTAINER)
// ==============================================================

// 1.1. Kết nối Cơ sở dữ liệu SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 1.2. Đăng ký nhận diện Controller kèm cả View .cshtml
builder.Services.AddControllersWithViews();

// 1.3. Đăng ký dịch vụ lõi Swagger phục vụ kiểm thử giao diện API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1.4. Đăng ký dịch vụ xác thực bằng Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";               // Chưa đăng nhập thì đá về đây
        options.AccessDeniedPath = "/Account/AccessDenied"; // Sai quyền (Role) thì đá về đây
    });

// 1.5. CẤU HÌNH CORS - Mở cổng kết nối bảo mật cho ReactJS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

var app = builder.Build();

// ==============================================================
// 2. KHU VỰC CẤU HÌNH MIDDLEWARE (REQUEST PIPELINE)
// ==============================================================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 🌟 VỊ TRÍ QUAN TRỌNG: Kích hoạt CORS ngay sau UseRouting và TRƯỚC các tầng bảo mật
app.UseCors("AllowReactApp");

// Kích hoạt Middleware bảo mật xác thực danh tính và phân quyền
app.UseAuthentication();
app.UseAuthorization();

// 🌟 Kích hoạt Swagger UI làm môi trường chạy thử nghiệm API
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMS Web API v1");
    c.RoutePrefix = "swagger"; // Đường dẫn truy cập trực tiếp sẽ là /swagger
});

// ===============================================================
// 3. KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG (ROUTING MAP)
// ===============================================================

// Phân luồng A: Ánh xạ các Endpoint API ngầm tuân thủ cấu trúc [Route("api/[controller]")]
app.MapControllers();

// Phân luồng B: Giữ bản đồ đường đi mặc định hiển thị trang giao diện Web MVC cũ
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();