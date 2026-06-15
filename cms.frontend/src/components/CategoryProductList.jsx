import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const CategoryProductList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [activeId, setActiveId] = useState(null); // null nghĩa là đang chọn "TẤT CẢ SẢN PHẨM"

    useEffect(() => {
        const fetchCategories = () => {
            // Gọi endpoint lấy danh mục từ SQL Server của em
            axiosClient.get('/Categories')
                .then(data => setCategories(data))
                .catch(err => console.error("Lỗi lấy danh mục:", err));
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (id) => {
        setActiveId(id);
        onSelectCategory(id); // Truyền ID danh mục ngược lên HomeView để lọc ProductList
    };

    return (
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
            {/* Nút mặc định để hiển thị toàn bộ sản phẩm */}
            <button
                className={`btn btn-sm text-uppercase px-3 font-weight-bold ${activeId === null ? 'btn-primary shadow' : 'btn-outline-secondary'}`}
                onClick={() => handleCategoryClick(null)}
                style={{ borderRadius: '6px', fontSize: '0.8rem', letterSpacing: '0.5px' }}
            >
                <i className="fa-solid fa-list mr-1"></i> Tất cả sản phẩm
            </button>

            {/* Vòng lặp danh mục lấy từ Database */}
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className={`btn btn-sm text-uppercase px-3 font-weight-bold ${activeId === cat.id ? 'btn-primary shadow' : 'btn-outline-secondary'}`}
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{ borderRadius: '6px', fontSize: '0.8rem', letterSpacing: '0.5px' }}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryProductList;