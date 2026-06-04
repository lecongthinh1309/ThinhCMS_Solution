using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

public class CustomerController : Controller
{
    private readonly ApplicationDbContext _context;

    public CustomerController(ApplicationDbContext context) => _context = context;

    // Xem danh sách
    public async Task<IActionResult> Index() => View(await _context.Customers.ToListAsync());

    // Sửa: Lấy dữ liệu hiển thị
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null) return NotFound();
        var customer = await _context.Customers.FindAsync(id);
        return customer == null ? NotFound() : View(customer);
    }

    // Sửa: Lưu dữ liệu
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Customer customer)
    {
        if (id != customer.Id) return NotFound();

        // Lấy dữ liệu hiện tại từ database
        var existingCustomer = await _context.Customers.FindAsync(id);
        if (existingCustomer == null) return NotFound();

        // Cập nhật thông tin từ form
        existingCustomer.FullName = customer.FullName;
        existingCustomer.Email = customer.Email;
        existingCustomer.Phone = customer.Phone;
        existingCustomer.Address = customer.Address;

        // Chỉ update mật khẩu nếu có nhập vào ô Mật khẩu mới
        if (!string.IsNullOrEmpty(customer.Password))
        {
            existingCustomer.Password = customer.Password;
        }

        // Bỏ qua kiểm tra ModelState cho thuộc tính Password nếu không sửa
        ModelState.Remove("Password");

        if (ModelState.IsValid)
        {
            _context.Update(existingCustomer);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        return View(customer);
    }

    // Xóa
    public async Task<IActionResult> Delete(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer != null)
        {
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Index));
    }
}