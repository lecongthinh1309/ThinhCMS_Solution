/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao:14-05-2026
 * Version: 1.0
 * 
 */



using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
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
