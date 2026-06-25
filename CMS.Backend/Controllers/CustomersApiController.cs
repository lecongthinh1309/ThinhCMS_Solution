using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Helpers;

namespace CMS.Backend.Controllers
{
    [Route("api/Customers")]
    [ApiController]
    public class CustomersApiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CMS.Backend.Services.IEmailService _emailService;

        public CustomersApiController(ApplicationDbContext context, CMS.Backend.Services.IEmailService emailService) 
        { 
            _context = context; 
            _emailService = emailService;
        }

        // POST: api/Customers/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { success = false, message = "Vui lòng điền đầy đủ thông tin bắt buộc." });

            var emailExists = await _context.Customers.AnyAsync(c => c.Email == request.Email);
            if (emailExists)
                return Conflict(new { success = false, message = "Email này đã được sử dụng. Vui lòng dùng email khác." });

            var customer = new Customer
            {
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone ?? "",
                Address = request.Address ?? "",
                Password = request.Password,
                PasswordHash = PasswordHelper.HashPassword(request.Password)
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đăng ký thành công! Chào mừng bạn đến với ThinhCMS.", customerId = customer.Id });
        }

        // POST: api/Customers/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { success = false, message = "Vui lòng nhập Email và mật khẩu." });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null || !PasswordHelper.VerifyPassword(request.Password, customer.PasswordHash ?? ""))
                return Unauthorized(new { success = false, message = "Email hoặc mật khẩu không chính xác." });

            return Ok(new {
                success = true,
                message = "Đăng nhập thành công!",
                customer = new {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                }
            });
        }

        // PUT: api/Customers/{id} — Cập nhật thông tin cá nhân
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { success = false, message = "Không tìm thấy tài khoản." });

            customer.FullName = request.FullName ?? customer.FullName;
            customer.Phone = request.Phone ?? customer.Phone;
            customer.Address = request.Address ?? customer.Address;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Cập nhật thông tin thành công." });
        }

        // POST: api/Customers/{id}/change-password — Đổi mật khẩu
        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest request)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return NotFound(new { success = false, message = "Không tìm thấy tài khoản." });

            // Kiểm tra mật khẩu hiện tại (hỗ trợ cả plain text và hash)
            bool isValid = (customer.Password == request.CurrentPassword) ||
                           PasswordHelper.VerifyPassword(request.CurrentPassword, customer.PasswordHash ?? "");
            if (!isValid)
                return Unauthorized(new { success = false, message = "Mật khẩu hiện tại không chính xác." });

            customer.Password = request.NewPassword;
            customer.PasswordHash = PasswordHelper.HashPassword(request.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Đổi mật khẩu thành công." });
        }

        // POST: api/Customers/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { success = false, message = "Vui lòng nhập địa chỉ Email." });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
            // Always return success to prevent email enumeration attack
            if (customer != null)
            {
                // Tạo mã OTP 6 số ngẫu nhiên - đây chính là mật khẩu mới
                var otp = new Random().Next(100000, 999999).ToString();
                
                // Cập nhật mật khẩu mới = 6 số OTP
                customer.Password = otp;                          // Lưu plain text (theo cấu trúc hiện tại)
                customer.PasswordHash = PasswordHelper.HashPassword(otp); // Lưu hash để xác thực
                await _context.SaveChangesAsync();

                // Build email HTML giống thiết kế
                string emailBody = $@"
<!DOCTYPE html>
<html lang='vi'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
<body style='margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='padding:30px 0;'>
    <tr>
      <td align='center'>
        <table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
          
          <!-- HEADER -->
          <tr>
            <td style='background-color:#cc0000;padding:28px 40px;text-align:center;'>
              <h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;'>YÊU CẦU ĐẶT LẠI MẬT KHẨU</h1>
            </td>
          </tr>
          
          <!-- BODY -->
          <tr>
            <td style='padding:40px 40px 20px 40px;'>
              <p style='color:#333333;font-size:15px;margin:0 0 16px 0;'>Xin chào,</p>
              
              <p style='color:#333333;font-size:15px;line-height:1.6;margin:0 0 24px 0;'>
                Chúng tôi vừa nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với địa chỉ email này. Để thiết lập lại mật khẩu mới, vui lòng nhập mã bảo mật dưới đây:
              </p>
              
              <!-- OTP BOX -->
              <table width='100%' cellpadding='0' cellspacing='0' style='margin:20px 0 32px 0;'>
                <tr>
                  <td align='center'>
                    <div style='display:inline-block;border:2px dashed #cc0000;border-radius:8px;padding:20px 50px;background-color:#fff5f5;'>
                      <span style='font-size:40px;font-weight:bold;color:#cc0000;letter-spacing:12px;font-family:monospace;'>{otp}</span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- SECURITY WARNING -->
              <table width='100%' cellpadding='0' cellspacing='0' style='margin:0 0 24px 0;'>
                <tr>
                  <td>
                    <p style='color:#cc0000;font-size:14px;font-weight:bold;margin:0 0 8px 0;'>&#9888; CẢNH BÁO BẢO MẬT:</p>
                    <ul style='color:#333333;font-size:14px;line-height:1.8;margin:0;padding-left:20px;'>
                      <li>Mã xác thực này sẽ hết hạn sau <strong>5 phút</strong>.</li>
                      <li><strong>Tuyệt đối không chia sẻ</strong> mã này cho bất kỳ ai (kể cả quản trị viên).</li>
                    </ul>
                  </td>
                </tr>
              </table>
              
              <p style='color:#555555;font-size:14px;line-height:1.6;margin:0;'>
                Nếu bạn không yêu cầu đổi mật khẩu, có thể ai đó đang cố truy cập tài khoản của bạn. Vui lòng phớt lờ email này.
              </p>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style='padding:20px 40px 30px 40px;border-top:1px solid #eeeeee;'>
              <p style='color:#999999;font-size:12px;text-align:center;margin:0;'>
                Email này được gửi tự động từ hệ thống <strong>ThinhCMS Kitchen</strong>. Vui lòng không trả lời email này.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>";

                // Gửi email (fire and forget - không block response nếu SMTP chậm)
                _ = _emailService.SendEmailAsync(customer.Email, "[ThinhCMS] Mã xác thực đặt lại mật khẩu của bạn", emailBody);
            }

            return Ok(new { success = true, message = "Nếu email này tồn tại trong hệ thống, chúng tôi đã gửi mã xác thực về hộp thư của bạn. Vui lòng kiểm tra cả hòm thư Spam/Rác." });
        }
    }

    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
