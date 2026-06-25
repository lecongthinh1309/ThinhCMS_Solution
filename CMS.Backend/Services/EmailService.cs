using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace CMS.Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            try
            {
                var email = new MimeMessage();
                // Dùng cấu hình từ appsettings.json, nếu không có thì fallback tạm để không bị lỗi lúc new MailboxAddress
                var senderName = _config["Smtp:SenderName"] ?? "ThinhCMS System";
                var senderEmail = _config["Smtp:SenderEmail"] ?? "no-reply@thinhcms.com";
                
                email.From.Add(new MailboxAddress(senderName, senderEmail));
                email.To.Add(new MailboxAddress("", toEmail));
                email.Subject = subject;
                email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };

                using var smtp = new SmtpClient();
                
                var host = _config["Smtp:Server"] ?? "smtp.gmail.com";
                var port = int.TryParse(_config["Smtp:Port"], out int p) ? p : 587;
                var username = _config["Smtp:Username"];
                var password = _config["Smtp:Password"];

                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                
                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    await smtp.AuthenticateAsync(username, password);
                }

                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                
                _logger.LogInformation($"[EmailService] Đã gửi email thành công tới {toEmail}");
            }
            catch (Exception ex)
            {
                // Silently fail, log out the error so app doesn't crash if SMTP is wrong
                _logger.LogError($"[EmailService] Lỗi gửi email tới {toEmail}: {ex.Message}");
            }
        }
    }
}
