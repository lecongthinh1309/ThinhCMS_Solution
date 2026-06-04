using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thay bằng namespace DataContext của em
using CMS.Data.Entities;

public class OrderController : Controller
{
    private readonly ApplicationDbContext _context; // Đảm bảo trùng tên với DbContext của em

    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: Order
    public async Task<IActionResult> Index()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails)
            .ThenInclude(od => od.Product)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();
        return View(orders);
    }

    // GET: Order/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null) return NotFound();

        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (order == null) return NotFound();

        return View(order);
    }

    // GET: Order/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null) return NotFound();
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();
        return View(order);
    }

    // POST: Order/Edit/5
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Order order)
    {
        if (id != order.Id) return NotFound();

        if (ModelState.IsValid)
        {
            try
            {
                var existingOrder = await _context.Orders.FindAsync(id);
                existingOrder.Status = order.Status;
                existingOrder.Notes = order.Notes;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Orders.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return RedirectToAction(nameof(Index));
        }
        return View(order);
    }
}