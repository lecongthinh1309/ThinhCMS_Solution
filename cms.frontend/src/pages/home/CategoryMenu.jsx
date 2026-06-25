import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu({ activeCategoryId, onCategoryClick }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    const handleCategoryClick = (id) => {
        if (onCategoryClick) {
            onCategoryClick(id);
        }
    };

    if (loading) {
        return (
            <div className="container my-3 text-center">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp menu phân loại...</span>
            </div>
        );
    }

    return (
        <section id="category-menu-section" className="category-menu-wrapper my-4">
            <div className="container">
                {/* THAY ĐỔI: Thêm bóng đổ mềm mịn (soft-shadow) và nền cực sạch */}
                <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                    <div className="card-body p-2 bg-white">
                        <ul className="nav nav-pills nav-fill flex-column flex-sm-row">
                            {/* Nút: Tất cả sản phẩm */}
                            <li className="nav-item m-1">
                                <button
                                    className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === null ? 'active' : 'text-secondary bg-transparent'}`}
                                    style={{
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        letterSpacing: '1px',
                                        backgroundColor: activeCategoryId === null ? '#0f172a' : 'transparent', // Màu xanh đen Dark Slate sang trọng
                                        color: activeCategoryId === null ? '#fff' : '#64748b',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    onClick={() => handleCategoryClick(null)}
                                >
                                    <i className="fas fa-th-large mr-2"></i> Tất cả
                                </button>
                            </li>

                            {/* VÒNG LẶP ĐỘNG */}
                            {categories.map((cat) => (
                                <li className="nav-item m-1" key={cat.id}>
                                    <button
                                        className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === cat.id ? 'active' : 'text-secondary bg-transparent'}`}
                                        style={{
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            letterSpacing: '1px',
                                            backgroundColor: activeCategoryId === cat.id ? '#0f172a' : 'transparent', // Đồng bộ màu thương hiệu mới
                                            color: activeCategoryId === cat.id ? '#fff' : '#64748b',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                        onClick={() => handleCategoryClick(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;