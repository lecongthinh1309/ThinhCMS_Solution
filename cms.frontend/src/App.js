import React, { useState } from 'react';
import CategoryProductList from './components/CategoryProductList';
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import './App.css';

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <div className="container my-5">
            {/* Header Vùng Tiêu Đề */}
            <header className="premium-header text-center mb-5">
                <h2 className="font-weight-bold text-uppercase m-0" style={{ letterSpacing: '1px' }}>
                    ThaiCMS.Fashion Portal
                </h2>
                <p className="text-white-50 small m-0 mt-2">
                    Hệ Thống Phân Tầng Quản Trị Nội Dung & Thương Mại Cấu Trúc ASP.NET Core + ReactJS
                </p>
            </header>

            {/* Thanh Tab Ngang Lọc Danh Mục Sản Phẩm */}
            <CategoryProductList onSelectCategory={setSelectedCategory} />

            {/* Khối Tiêu Đề Phần Thân */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-uppercase font-weight-bold m-0" style={{ color: '#0f172a' }}>
                    Sản phẩm nổi bật
                </h4>
                <span className="badge badge-pill badge-dark px-3 py-2">Mùa Mốt 2026</span>
            </div>

            {/* Lưới Danh Sách Sản Phẩm */}
            <ProductList selectedCategoryId={selectedCategory} />

            {/* Phân hệ Tin Tức Blog Phía Dưới */}
            <PostList />

            {/* Chân Trang */}
            <footer className="pt-4 mt-5 text-center text-muted border-top small">
                <p>© 2026 ThaiCMS Retail. All Rights Reserved. Biên soạn thiết kế giao diện Cao Cấp Buổi 8.</p>
            </footer>
        </div>
    );
}

export default App;