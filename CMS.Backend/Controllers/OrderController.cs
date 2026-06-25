using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers;

[Authorize(Roles = "Administrator,Editor")]
public class OrderController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public OrderController(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
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
    public async Task<IActionResult> Edit(int id, Order order, bool sendEmail)
    {
        if (id != order.Id) return NotFound();

        if (ModelState.IsValid)
        {
            try
            {
                var existingOrder = await _context.Orders
                    .Include(o => o.Customer)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (existingOrder == null) return NotFound();

                bool statusChanged = existingOrder.Status != order.Status;
                existingOrder.Status = order.Status;
                existingOrder.Notes = order.Notes;
                
                await _context.SaveChangesAsync();

                // Send email if checkbox is checked
                if (sendEmail && existingOrder.Customer != null)
                {
                    string statusText = order.Status switch
                    {
                        0 => "Chờ duyệt",
                        1 => "Đang xử lý",
                        2 => "Đang giao",
                        3 => "Hoàn thành",
                        4 => "Đã huỷ",
                        _ => "Không xác định"
                    };

                    string emailBody = $@"
                    <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:12px'>
                        <div style='background:linear-gradient(135deg,#1e293b,#334155);padding:30px;border-radius:10px 10px 0 0;text-align:center'>
                            <h1 style='color:#38bdf8;margin:0;font-size:28px'>ThinhCMS</h1>
                        </div>
                        <div style='background:#fff;padding:30px;border-radius:0 0 10px 10px'>
                            <h2 style='color:#1e293b'>Xin chào {existingOrder.Customer.FullName},</h2>
                            <p style='color:#64748b'>Đơn hàng <strong>#{existingOrder.Id}</strong> của bạn vừa được cập nhật trạng thái mới.</p>
                            
                            <div style='background:#eff6ff;padding:15px;border-radius:8px;margin:20px 0;text-align:center;border:1px solid #bfdbfe'>
                                <p style='margin:0;color:#1e40af;font-size:16px'>Trạng thái hiện tại:</p>
                                <strong style='color:#2563eb;font-size:24px;text-transform:uppercase'>{statusText}</strong>
                            </div>

                            <p style='color:#64748b;font-size:14px'>Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>
                            <div style='text-align:center;margin-top:20px'>
                                <a href='http://localhost:3000' style='background:#2563eb;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold'>Đến trang chủ</a>
                            </div>
                        </div>
                    </div>";

                    _ = _emailService.SendEmailAsync(existingOrder.Customer.Email, $"[ThinhCMS] Cập nhật trạng thái đơn hàng #{existingOrder.Id}", emailBody);
                }
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