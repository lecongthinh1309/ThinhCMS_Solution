using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            // Dữ liệu giả định dựa trên yêu cầu từ image_b01d93.png
            var users = new List<User>
            {
                new User {
                    Id = 1,
                    Username = "admin_thai",
                    FullName = "Nguyên Cao Thái",
                    Role = "Administrator",
                    PasswordHash = "hashed_pw_1"
                },
                new User {
                    Id = 2,
                    Username = "editor_01",
                    FullName = "Trần Văn Biên Tập",
                    Role = "Editor",
                    PasswordHash = "hashed_pw_2"
                },
                new User {
                    Id = 3,
                    Username = "author_minh",
                    FullName = "Lê Quang Minh",
                    Role = "Author",
                    PasswordHash = "hashed_pw_3"
                }
            };

            return View(users);
        }
    }
}