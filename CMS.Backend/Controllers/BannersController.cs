/*
 * Họ tên: Le Cong Thinh
 * MSSV: 2123110063
 * Version: 1.0 (File API Banners Controller phục vụ riêng cho React)
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities; // BẮT BUỘC phải có dòng này để C# nhận diện được thực thể 'Banner'
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Banners
        [HttpGet]
        public async Task<IActionResult> GetActiveBanners()
        {
            // Đã đồng bộ gọi từ bảng _context.Banners sau khi em chạy Migration thành công
            var banners = await _context.Banners
                .Where(b => b.IsActive)
                .OrderBy(b => b.Order)
                .ToListAsync();

            return Ok(banners);
        }
    }
}