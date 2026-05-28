using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Sắp xếp theo Id vì thực thể CategoryProduct không có trường DisplayOrder
            var categories = await _context.CategoriesProducts
                .OrderBy(c => c.Id)
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                    // Đã bỏ DisplayOrder và IsActive vì file Entity của em không có
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}