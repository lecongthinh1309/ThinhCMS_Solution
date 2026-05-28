/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao: 14-05-2026
 * Version: 1.1 - Đã cập nhật phân quyền chi tiết cho từng Action
 * */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập tài khoản bất kỳ mới được vào trang này
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ===================================================
        // 1. CHỨC NĂNG: TRANG DANH SÁCH BÀI VIẾT (INDEX) - Ai đăng nhập cũng được xem
        // ===================================================
        public IActionResult Index(int? id)
        {
            List<Post> data;

            if (id == null)
            {
                data = _context.Posts
                               .Include(p => p.Category)
                               .OrderByDescending(p => p.Id)
                               .ToList();
                ViewBag.CurrentCategoryName = "Tất cả bài viết";
            }
            else
            {
                data = _context.Posts
                               .Where(p => p.CategoryId == id)
                               .Include(p => p.Category)
                               .OrderByDescending(p => p.CreatedDate)
                               .ToList();

                var cat = _context.Categories.Find(id);
                ViewBag.CurrentCategoryName = cat != null ? "Danh mục: " + cat.Name : "Danh mục không tồn tại";
            }

            return View(data);
        }

        // ===================================================
        // 1.3. CHỨC NĂNG: XEM CHI TIẾT BÀI VIẾT (DETAILS) - Ai đăng nhập cũng được xem
        // ===================================================
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // ===================================================
        // 2. CHỨC NĂNG: THÊM MỚI BÀI VIẾT (CREATE) - Ai đăng nhập cũng được thêm bài
        // ===================================================
        public IActionResult Create()
        {
            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post post, IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                var filePath = Path.Combine(uploadFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(fileStream);
                }

                post.ImageUrl = "/uploads/" + uniqueFileName;
            }

            post.CreatedDate = DateTime.Now;
            _context.Posts.Add(post);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ===================================================
        // 3. CHỨC NĂNG: CHỈNH SỬA BÀI VIẾT (EDIT)
        // 🌟 CHỈ CHO PHÉP ADMIN HOẶC EDITOR VÀO SỬA (AUTHOR SẼ BỊ CHẶN)
        // ===================================================
        [Authorize(Roles = "Administrator,Editor")]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        [Authorize(Roles = "Administrator,Editor")]
        [HttpPost]
        public IActionResult Edit(Post post, IFormFile? imageFile)
        {
            try
            {
                var existingPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == post.Id);
                if (existingPost == null) return NotFound();

                if (imageFile != null && imageFile.Length > 0)
                {
                    var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(imageFile.FileName);
                    var filePath = Path.Combine(uploadFolder, uniqueFileName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        imageFile.CopyTo(fileStream);
                    }

                    post.ImageUrl = "/uploads/" + uniqueFileName;

                    if (!string.IsNullOrEmpty(existingPost.ImageUrl))
                    {
                        var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingPost.ImageUrl.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                }
                else
                {
                    post.ImageUrl = existingPost.ImageUrl;
                }

                post.CreatedDate = existingPost.CreatedDate;

                _context.Update(post);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            catch (Exception)
            {
                ViewBag.Categories = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
                return View(post);
            }
        }

        // ===================================================
        // 4. CHỨC NĂNG: XÓA BÀI VIẾT (DELETE)
        // 🌟 CHỈ DUY NHẤT ADMIN MỚI CÓ QUYỀN XÓA (EDITOR VÀ AUTHOR SẼ BỊ ĐÁ VĂNG)
        // ===================================================
        [Authorize(Roles = "Administrator")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                if (!string.IsNullOrEmpty(post.ImageUrl))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", post.ImageUrl.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Posts.Remove(post);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}