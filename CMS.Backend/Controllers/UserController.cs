/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao: 14-05-2026
 * Version: 2.0 - Bổ sung logic đổi mật khẩu khi chỉnh sửa
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. TRANG DANH SÁCH THÀNH VIÊN
        public IActionResult Index()
        {
            var users = _context.Users.OrderByDescending(u => u.Id).ToList();
            return View(users);
        }

        // 2. FORM THÊM MỚI THÀNH VIÊN (GET)
        public IActionResult Create()
        {
            return View();
        }

        // 2.1 XỬ LÝ LƯU THÀNH VIÊN (POST)
        [HttpPost]
        public IActionResult Create(User user)
        {
            if (user != null)
            {
                var isExist = _context.Users.Any(u => u.Username == user.Username);
                if (isExist)
                {
                    ModelState.AddModelError("", "Tên đăng nhập này đã tồn tại!");
                    return View(user);
                }

                _context.Users.Add(user);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(user);
        }

        // 3. FORM SỬA THÀNH VIÊN (GET)
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // 3.1 XỬ LÝ CẬP NHẬT THÀNH VIÊN & KIỂM TRA TRÙNG MẬT KHẨU CŨ (POST)
        [HttpPost]
        public IActionResult Edit(User user, string? NewPassword)
        {
            if (user != null)
            {
                // Lấy thông tin người dùng gốc trong DB ra để so sánh mật khẩu cũ
                var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == user.Id);
                if (existingUser == null) return NotFound();

                // Kiểm tra xem Thịnh có nhập mật khẩu mới vào ô không
                if (!string.IsNullOrEmpty(NewPassword))
                {
                    // CHẶN TRÙNG: Nếu mật khẩu mới nhập vào TRÙNG Y HỆT mật khẩu cũ trong DB
                    if (NewPassword.Trim() == existingUser.PasswordHash.Trim())
                    {
                        // Bắn lỗi trực tiếp vào ModelState để giao diện hiển thị
                        ModelState.AddModelError("NewPassword", "Mật khẩu mới không được trùng với mật khẩu cũ đang sử dụng!");

                        // Trả về lại View Edit kèm dữ liệu đang nhập để người dùng sửa lại
                        return View(user);
                    }

                    // Nếu không trùng -> Gán mật khẩu mới cho tài khoản
                    user.PasswordHash = NewPassword;
                }
                else
                {
                    // Nếu để trống -> Giữ lại mật khẩu cũ từ database
                    user.PasswordHash = existingUser.PasswordHash;
                }

                _context.Users.Update(user);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(user);
        }

        // 4. XỬ LÝ XÓA THÀNH VIÊN
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}