/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao: 14-05-2026
 * Version: 2.1 - Giữ nguyên logic bảo mật tối cao dành riêng cho Admin
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Administrator")] // Đảm bảo chỉ Admin mới mở được nhóm quản lý User
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var users = _context.Users.OrderByDescending(u => u.Id).ToList();
            return View(users);
        }

        public IActionResult Create()
        {
            return View();
        }

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

        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User user, string? NewPassword)
        {
            if (user != null)
            {
                var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == user.Id);
                if (existingUser == null) return NotFound();

                if (!string.IsNullOrEmpty(NewPassword))
                {
                    if (NewPassword.Trim() == existingUser.PasswordHash.Trim())
                    {
                        ModelState.AddModelError("NewPassword", "Mật khẩu mới không được trùng với mật khẩu cũ đang sử dụng!");
                        return View(user);
                    }
                    user.PasswordHash = NewPassword;
                }
                else
                {
                    user.PasswordHash = existingUser.PasswordHash;
                }

                _context.Users.Update(user);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(user);
        }

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