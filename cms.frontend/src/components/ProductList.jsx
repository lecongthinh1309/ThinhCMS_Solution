import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductList = ({ selectedCategoryId, searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const BASE_URL = 'https://localhost:7208';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                let data = [];
                // Nếu selectedCategoryId bằng null (chọn nút Tất cả), gọi lấy toàn bộ
                if (selectedCategoryId === null) {
                    data = await productService.getAllProducts();
                } else {
                    data = await productService.getProductsByCategory(selectedCategoryId);
                }
                setProducts(data);
            } catch (error) {
                console.error("Lỗi kết nối API lấy dữ liệu sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategoryId]);

    // Xử lý bộ lọc tìm kiếm chuỗi ký tự theo tên sản phẩm
    const filteredProducts = products.filter(prod =>
        prod.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    if (loading) return <div className="text-center my-5 text-muted small">Đang kết nối SQL Server lấy dữ liệu...</div>;

    return (
        <div className="row">
            {filteredProducts.length === 0 ? (
                <div className="col-12 text-center text-muted my-5">Không tìm thấy sản phẩm nào phù hợp.</div>
            ) : (
                filteredProducts.map((prod) => (
                    <div className="col-md-4 col-sm-6 mb-4" key={prod.id}>
                        <div className="card product-premium-card h-100">
                            <div className="product-image-wrapper">
                                <img src={prod.imageUrl ? `${BASE_URL}${prod.imageUrl}` : 'https://via.placeholder.com/300x400'} alt={prod.name} />
                            </div>
                            <div className="card-body d-flex flex-column justify-content-between p-3">
                                <div>
                                    <h6 className="font-weight-bold text-dark text-truncate mb-1">{prod.name}</h6>
                                    <p className="text-danger font-weight-bold small mb-3">
                                        {prod.price ? prod.price.toLocaleString('vi-VN') : 0} ₫
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                    {/* CHUYỂN TRANG: Điều hướng sang trang chi tiết kèm ID thật */}
                                    <button className="btn btn-action-view flex-grow-1" onClick={() => navigate(`/product/${prod.id}`)}>
                                        <i className="fa-regular fa-eye mr-1"></i> Chi tiết
                                    </button>
                                    <button className="btn btn-action-buy flex-grow-1">
                                        <i className="fa-solid fa-basket-shopping mr-1"></i> Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductList;