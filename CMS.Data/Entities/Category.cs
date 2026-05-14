/*
 * Sinh vien: Le Cong Thinh
 * MSSV: 2123110063
 * Ngay tao:14-05-2026
 * Version: 1.0
 * 
 */




using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    //thuc the danh muc bai viet
    public class Category
    {
        public int Id { get; set; } //ma danh muc bai viet, khoa chinh
        public string Name { get; set; }  //ten danh muc bai viet
        public string Description { get; set; } //mo ta danh muc bai viet
        //Quan he: Mot danh muc co nhieu bai viet
        public virtual ICollection<Post> Posts { get; set; }
    }
}
