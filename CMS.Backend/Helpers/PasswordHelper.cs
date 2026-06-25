namespace CMS.Backend.Helpers
{
    public static class PasswordHelper
    {
        // Băm mật khẩu thành chuỗi mã hóa trước khi lưu vào SQL Server
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Kiểm tra mật khẩu người dùng nhập với chuỗi đã băm trong DB
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            if (string.IsNullOrEmpty(hashedPassword)) return false;

            // BCrypt hashes thường bắt đầu bằng $2a$, $2b$, $2x$, hoặc $2y$
            if (hashedPassword.StartsWith("$2a$") || hashedPassword.StartsWith("$2b$") || 
                hashedPassword.StartsWith("$2x$") || hashedPassword.StartsWith("$2y$"))
            {
                try
                {
                    return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
                }
                catch (System.Exception)
                {
                    return false;
                }
            }

            // Nếu mật khẩu trong DB là chuỗi văn bản thuần (chưa băm), so sánh trực tiếp
            return password == hashedPassword;
        }
    }
}