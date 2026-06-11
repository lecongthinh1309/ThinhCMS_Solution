import React, { useState } from 'react';

const ProductList = ({ selectedCategoryId }) => {
    // Dữ liệu mẫu cấu trúc chuẩn khớp hoàn toàn ảnh mẫu thực hành của em
    const [products] = useState([
        { id: 1, name: "Áo sơ mi dài tay Oxford Premium", price: 999000, imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500", categoryId: 4 },
        { id: 2, name: "Áo Sơ Mi Nam Business Knit", price: 399000, imageUrl: "https://images.unsplash.com/photo-1620012253295-c05ce3e85673?w=500", categoryId: 2 },
        { id: 3, name: "Áo hai dây nữ màu nâu thượng lưu", price: 999000, imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500", categoryId: 1 },
        { id: 4, name: "Bộ Suit Nam Classic Navy Sang Trọng", price: 2400000, imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", categoryId: 2 },
        { id: 5, name: "Đầm Dạ Hội Đuôi Cá Kim Sa", price: 1850000, imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500", categoryId: 3 },
        { id: 6, name: "Quần Tây Baggy Khóa Lệch Công Sở", price: 520000, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", categoryId: 4 }
    ]);

    const filteredProducts = selectedCategoryId
        ? products.filter(p => p.categoryId === selectedCategoryId)
        : products;

    return (
        <div className="row">
            {filteredProducts.map((prod) => (
                <div className="col-md-4 col-sm-6 mb-4" key={prod.id}>
                    <div className="card product-premium-card h-100">
                        <div className="product-image-wrapper">
                            <img src={prod.imageUrl} alt={prod.name} />
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between p-3">
                            <div>
                                <h6 className="font-weight-bold text-dark text-truncate mb-1">{prod.name}</h6>
                                <p className="text-danger font-weight-bold small mb-3">
                                    {prod.price.toLocaleString('vi-VN')} ₫
                                </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center gap-2">
                                <button className="btn btn-action-view flex-grow-1">
                                    <i className="fa-regular fa-eye mr-1"></i> Chi tiết
                                </button>
                                <button className="btn btn-action-buy flex-grow-1">
                                    <i className="fa-solid fa-basket-shopping mr-1"></i> Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;