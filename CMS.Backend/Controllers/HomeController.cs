/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao:14-05-2026
 * Version: 1.0
 * 
 */



using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;
using CMS.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;

        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var model = new DashboardViewModel();

            // 1. Thống kê số lượng
            model.TotalProducts = await _context.Products.CountAsync();
            model.TotalOrders = await _context.Orders.CountAsync();
            model.TotalCustomers = await _context.Customers.CountAsync();
            model.TotalPosts = await _context.Posts.CountAsync();
            model.TotalCategories = await _context.Categories.CountAsync();
            model.TotalUsers = await _context.Users.CountAsync();

            // 2. Thống kê theo trạng thái đơn hàng (0: Chờ duyệt, 1: Đang xử lý, 2: Đang giao, 3: Hoàn thành, 4: Đã huỷ)
            model.OrdersPending = await _context.Orders.CountAsync(o => o.Status == 0);
            // Đang giao (hiển thị trạng thái Đang giao - Status 2, nhưng ta gộp chung 1, 2 vào nếu muốn. Hoặc lấy đúng Status 2)
            model.OrdersShipping = await _context.Orders.CountAsync(o => o.Status == 2);
            model.OrdersCompleted = await _context.Orders.CountAsync(o => o.Status == 3);

            // 3. Doanh thu (chỉ tính đơn hoàn thành - status 3)
            // Cần join Orders và OrderDetails
            var completedOrders = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.Status == 3)
                .ToListAsync();
            
            model.TotalRevenue = completedOrders.Sum(o => o.OrderDetails?.Sum(od => od.Quantity * od.UnitPrice) ?? 0);

            // 4. Doanh thu 7 ngày gần nhất (tính cả trạng thái Hoàn thành)
            var last7Days = Enumerable.Range(0, 7).Select(offset => DateTime.Today.AddDays(-offset)).ToList();
            
            // Query các đơn hoàn thành trong 7 ngày
            var startDate = DateTime.Today.AddDays(-6); // Bao gồm hôm nay + 6 ngày trước
            var ordersIn7Days = await _context.Orders
                .Include(o => o.OrderDetails)
                .Where(o => o.Status == 3 && o.OrderDate >= startDate)
                .ToListAsync();

            var dailyRevenues = last7Days.Select(date => new DailyRevenueInfo
            {
                Date = date.ToString("dd/MM"),
                Revenue = ordersIn7Days
                    .Where(o => o.OrderDate.Date == date)
                    .Sum(o => o.OrderDetails?.Sum(od => od.Quantity * od.UnitPrice) ?? 0),
                OrderCount = ordersIn7Days.Count(o => o.OrderDate.Date == date)
            }).Reverse().ToList(); // Đảo ngược để ngày cũ -> mới

            model.DailyRevenues = dailyRevenues;

            // 5. Sản phẩm bán chạy (Top 3)
            var topProductsQuery = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .Where(od => od.Order != null && od.Order.Status == 3) // Chỉ tính đơn đã bán thành công
                .GroupBy(od => od.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(od => od.Quantity),
                    TotalRev = g.Sum(od => od.Quantity * od.UnitPrice)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(3)
                .ToListAsync();

            foreach(var tp in topProductsQuery)
            {
                var p = await _context.Products.FindAsync(tp.ProductId);
                if (p != null)
                {
                    model.TopProducts.Add(new TopProductInfo
                    {
                        ProductName = p.Name,
                        ImageUrl = p.ImageUrl,
                        Price = p.Price,
                        TotalSold = tp.TotalSold,
                        TotalRevenue = tp.TotalRev
                    });
                }
            }

            return View(model);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
