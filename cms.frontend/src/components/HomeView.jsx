import React, { useState } from 'react';
import CategoryProductList from './CategoryProductList';
import ProductList from './ProductList';
import PostList from './PostList';

const HomeView = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            {/* Khối Banner Xu hướng chào mừng phía trên */}
            <div className="text-center py-5 mb-5 text-white rounded shadow" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
                <h2 className="font-weight-bold text-uppercase" style={{ letterSpacing: '2px' }}>Xu Hướng Thu Đông 2026</h2>
                <p className="lead small text-light mb-0">Khám phá các thiết kế thời trang đỉnh cao cùng ThinhCMS.Fashion</p>
            </div>

            {/* ==================== KHU VỰC KHÁM PHÁ SẢN PHẨM & BỘ LỌC DANH MỤC ==================== */}
            {/* Thêm id để phục vụ tính năng cuộn trang khi click từ thanh điều hướng Navbar */}
            <div id="danh-sach-san-pham" className="bg-white p-4 rounded shadow-sm border mb-5">

                {/* Tiêu đề phân khu */}
                <div className="border-bottom pb-3 mb-4">
                    <h4 className="text-uppercase font-weight-bold text-dark m-0" style={{ letterSpacing: '0.5px' }}>
                        <i className="fa-solid fa-bag-shopping text-primary mr-2"></i> Khám Phá Sản Phẩm
                    </h4>
                    <p className="text-muted small m-0 mt-1">Lọc sản phẩm linh hoạt theo danh mục hệ thống lưu trữ SQL Server</p>
                </div>

                {/* KHU VỰC CHỖ ĐỂ HIỆN RA LIST LỌC DANH MỤC SẢN PHẨM */}
                <div className="mb-4 bg-light p-3 rounded border border-light">
                    <span className="d-block font-weight-bold text-secondary small text-uppercase mb-2">
                        <i className="fa-solid fa-filter mr-1"></i> Bộ lọc danh mục sản phẩm:
                    </span>
                    {/* Thanh Tab Danh mục sản phẩm (Bấm danh mục nào truyền ID danh mục đó ra ngoài) */}
                    <CategoryProductList onSelectCategory={(id) => setSelectedCategory(id)} />
                </div>

                {/* Thanh Tiêu đề kết hợp Ô tìm kiếm sản phẩm theo tên */}
                <div className="row align-items-center mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <h5 className="text-uppercase font-weight-bold m-0 text-secondary">
                            Danh sách mẫu trưng bày
                        </h5>
                    </div>
                    {/* THANH TÌM KIẾM SẢN PHẨM THEO TÊN */}
                    <div className="col-md-6">
                        <div className="input-group shadow-sm rounded">
                            <div className="input-group-prepend">
                                <span className="input-group-text bg-white border-right-0 text-muted">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                            </div>
                            <input
                                type="text"
                                className="form-control border-left-0"
                                placeholder="Tìm kiếm sản phẩm theo tên..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ height: '42px', fontSize: '0.95rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Lưới sản phẩm nhận cả bộ lọc Danh mục và từ khóa Tìm kiếm */}
                <ProductList selectedCategoryId={selectedCategory} searchTerm={searchTerm} />
            </div>

            {/* Khối danh sách bài viết thời trang dưới chân trang */}
            <PostList />
        </div>
    );
};

export default HomeView;