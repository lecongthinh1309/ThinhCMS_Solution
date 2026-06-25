/*
 * Họ tên: Le Cong Thinh
 * MSSV: 2123110063
 * Version: 1.1 (Đã tích hợp API cho React Frontend)
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }


        // ===================================================
        // CÁC ROUTE ĐIỀU HƯỚNG GIAO DIỆN ADMIN (MVC)
        // ===================================================
        [Authorize(Roles = "Administrator,Editor")]
        public IActionResult Index()
        {
            var data = _context.Banners.OrderBy(b => b.Order).ToList();
            return View(data);
        }

        [Authorize(Roles = "Administrator,Editor")]
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [Authorize(Roles = "Administrator,Editor")]
        [HttpPost]
        public IActionResult Create(Banner model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                model.ImageUrl = "/uploads/banner-placeholder.jpg";
            }

            _context.Banners.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        [Authorize(Roles = "Administrator,Editor")]
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner == null) return NotFound();
            return View(banner);
        }

        [Authorize(Roles = "Administrator,Editor")]
        [HttpPost]
        public IActionResult Edit(Banner model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                var oldBanner = _context.Banners.AsNoTracking().FirstOrDefault(b => b.Id == model.Id);
                if (oldBanner != null)
                {
                    model.ImageUrl = oldBanner.ImageUrl;
                }
            }

            _context.Banners.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        [Authorize(Roles = "Administrator,Editor")]
        public IActionResult Delete(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner != null)
            {
                _context.Banners.Remove(banner);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
        [Authorize(Roles = "Administrator,Editor")]
        [HttpPost]
        public IActionResult ToggleActive(int id)
        {
            var banner = _context.Banners.Find(id);
            if (banner != null)
            {
                banner.IsActive = !banner.IsActive;
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}