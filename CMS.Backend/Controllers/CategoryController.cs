/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao: 14-05-2026
 * Version: 1.2
 * */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    // Tiêu chí 21: Toàn bộ Controller Quản trị đều gắn [Authorize]
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 🌟 PHẦN 1: ĐƯỜNG DẪN API CHO BUỔI 6 (MỚI THÊM VÀO ĐỂ HIỆN SWAGGER)
        // =================================================================
        [HttpGet("api/Categories")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllApi()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Id) // ✨ ĐỔI SANG SẮP XẾP THEO ID ĐỂ KHÔNG BỊ BÁO LỖI NỮA
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                    // Đã bỏ DisplayOrder và IsActive vì Entity Category của em không có các trường này
                })
                .ToListAsync();

            return Ok(categories);
        }

        // =================================================================
        // 📦 PHẦN 2: GIỮ NGUYÊN 100% TOÀN BỘ CODE GIAO DIỆN CŨ CỦA BUỔI 5
        // =================================================================

        // Xem danh sách danh mục (Cả hai quyền đều vào được)
        public async Task<IActionResult> Index()
        {
            var data = await _context.Categories.ToListAsync();
            return View(data);
        }

        // Giao diện Thêm mới (Cả hai quyền đều vào được)
        public IActionResult Create()
        {
            return View();
        }

        // Xử lý Thêm mới (Cả hai quyền đều thêm được)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Category category)
        {
            ModelState.Remove("Posts");

            if (ModelState.IsValid)
            {
                _context.Add(category);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // ==========================================
        // CHỈ ADMINISTRATOR MỚI ĐƯỢC SỬA VÀ XÓA
        // ==========================================

        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.Categories.FindAsync(id);
            if (category == null) return NotFound();

            return View(category);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Edit(int id, Category category)
        {
            if (id != category.Id) return NotFound();

            ModelState.Remove("Posts");

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(category);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Categories.Any(e => e.Id == category.Id)) return NotFound();
                    else throw;
                }
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null) return NotFound();

            var category = await _context.Categories
                .FirstOrDefaultAsync(m => m.Id == id);

            if (category == null) return NotFound();

            return View(category);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}