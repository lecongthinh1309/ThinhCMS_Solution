using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public OrdersController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Orders/customer/{customerId} — Lấy đơn hàng theo khách hàng (cho trang Profile)
        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    ShippingAddress = o.Notes, // Notes lưu ghi chú/địa chỉ giao hàng
                    TotalAmount = o.OrderDetails != null
                        ? o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice)
                        : 0
                })
                .ToList();

            return Ok(orders);
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutRequestDTO input)
        {
            if (input == null || input.OrderDetails == null || !input.OrderDetails.Any())
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Xử lý khách hàng (Tìm theo email hoặc tạo mới)
                var customer = _context.Customers.FirstOrDefault(c => c.Email == input.CustomerEmail);
                if (customer == null)
                {
                    customer = new Customer
                    {
                        FullName = input.CustomerName,
                        Email = input.CustomerEmail,
                        Phone = input.CustomerPhone,
                        Address = input.CustomerAddress,
                        Password = "GuestPassword123!", // Mật khẩu mặc định cho khách mua nhanh
                        PasswordHash = CMS.Backend.Helpers.PasswordHelper.HashPassword("GuestPassword123!")
                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    // Cập nhật thông tin mới nhất
                    customer.FullName = input.CustomerName;
                    customer.Phone = input.CustomerPhone;
                    customer.Address = input.CustomerAddress;
                    _context.Customers.Update(customer);
                    await _context.SaveChangesAsync();
                }

                // 2. Tạo Order
                var newOrder = new Order
                {
                    CustomerId = customer.Id,
                    OrderDate = DateTime.Now,
                    Status = 0, // 0: Chờ duyệt
                    Notes = input.Notes
                };
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Lưu để lấy OrderId

                // 3. Tạo OrderDetails và trừ Stock
                decimal total = 0;
                string itemRows = "";
                foreach (var item in input.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product != null)
                    {
                        // Trừ stock
                        if (product.StockQuantity >= item.Quantity)
                        {
                            product.StockQuantity -= item.Quantity;
                        }
                        else
                        {
                            product.StockQuantity = 0; // Hoặc báo lỗi hết hàng
                        }
                        _context.Products.Update(product);

                        // Thêm chi tiết
                        _context.OrderDetails.Add(new OrderDetail
                        {
                            OrderId = newOrder.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            UnitPrice = item.UnitPrice
                        });
                        total += (item.Quantity * item.UnitPrice);

                        // Build HTML row
                        itemRows += $"<tr><td style='padding:10px;border-bottom:1px solid #e2e8f0;color:#334155'>{product.Name}</td><td style='padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;color:#334155'>{item.Quantity}</td><td style='padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;color:#334155'>{(item.Quantity * item.UnitPrice):N0} ₫</td></tr>";
                    }
                }
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                // 4. Send Confirmation Email (Async, don't await blocking response heavily if not needed, but we do it anyway here)
                try
                {
                    string emailBody = $@"
                    <div style='font-family:""Segoe UI"",Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background-color:#f8fafc;padding:20px'>
                        <div style='background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)'>
                            <h2 style='color:#0f172a;margin-top:0;font-size:24px'>Xác nhận đơn hàng</h2>
                            <p style='color:#64748b'>Cảm ơn bạn đã đặt hàng tại <strong>ThinhCMS</strong>. Đơn hàng của bạn đã được xác nhận thành công!</p>
                            <div style='background:#f1f5f9;padding:15px;border-radius:8px;margin:20px 0'>
                                <p style='margin:0;color:#475569'>Mã đơn hàng: <strong style='color:#0f172a'>#{newOrder.Id}</strong></p>
                            </div>
                            <table style='width:100%;border-collapse:collapse;margin:20px 0'>
                                <thead><tr style='background:#1e293b'><th style='padding:10px;color:#fff;text-align:left'>Sản phẩm</th><th style='padding:10px;color:#fff;text-align:center'>SL</th><th style='padding:10px;color:#fff;text-align:right'>Giá</th></tr></thead>
                                <tbody>{itemRows}</tbody>
                                <tfoot><tr style='background:#f8fafc'><td colspan='2' style='padding:12px;font-weight:bold;color:#1e293b'>Tổng cộng</td><td style='padding:12px;font-weight:bold;color:#2563eb;text-align:right'>{total:N0} ₫</td></tr></tfoot>
                            </table>
                            <p style='color:#64748b;font-size:14px'>Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận giao hàng.</p>
                            <div style='text-align:center;margin-top:20px'>
                                <a href='http://localhost:3000' style='background:#2563eb;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold'>Tiếp tục mua sắm</a>
                            </div>
                        </div>
                    </div>
                    ";

                    await _emailService.SendEmailAsync(customer.Email, $"Xác nhận đơn hàng #{newOrder.Id} từ ThinhCMS", emailBody);
                }
                catch { /* Silently fail email so order still succeeds */ }

                return Ok(new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi khi xử lý đơn hàng: " + ex.Message });
            }
        }
    }

    public class CheckoutRequestDTO
    {
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }
        public string Notes { get; set; }
        public List<OrderItemDTO> OrderDetails { get; set; }
    }

    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}