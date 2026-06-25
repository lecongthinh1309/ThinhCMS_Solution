using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using CMS.Backend.Helpers;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context) => _context = context;

        public IActionResult Index() => View(_context.Users.OrderByDescending(u => u.Id).ToList());

        public IActionResult Create() => View();

        [HttpPost]
        public IActionResult Create(User user)
        {
            if (ModelState.IsValid)
            {
                if (_context.Users.Any(u => u.Username == user.Username))
                {
                    ModelState.AddModelError("", "Tên đăng nhập này đã tồn tại!");
                    return View(user);
                }

                // MÃ HÓA MẬT KHẨU KHI TẠO MỚI
                user.PasswordHash = PasswordHelper.HashPassword(user.PasswordHash);

                _context.Users.Add(user);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User user, string? NewPassword)
        {
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == user.Id);
            if (existingUser == null) return NotFound();

            if (!string.IsNullOrEmpty(NewPassword))
            {
                // MÃ HÓA MẬT KHẨU MỚI
                user.PasswordHash = PasswordHelper.HashPassword(NewPassword);
            }
            else
            {
                user.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(user);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}