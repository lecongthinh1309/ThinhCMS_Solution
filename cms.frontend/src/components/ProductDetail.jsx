import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'https://localhost:7208';

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductDetail(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm thật từ DB:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="text-center my-5 py-5 text-muted">Đang tải thông tin sản phẩm từ CSDL...</div>;
    if (!product) return <div className="text-center my-5 py-5 text-danger">Không tìm thấy sản phẩm này trong hệ thống!</div>;

    return (
        <div className="container my-5">
            <button className="btn btn-outline-dark mb-4 btn-sm" onClick={() => navigate('/')}>
                <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại cửa hàng
            </button>
            <div className="row bg-white p-4 rounded shadow-sm border">
                <div className="col-md-5 mb-4 mb-md-0">
                    <img
                        src={product.imageUrl ? `${BASE_URL}${product.imageUrl}` : 'https://via.placeholder.com/500x600'}
                        alt={product.name}
                        className="w-100 rounded object-fit-cover"
                        style={{ maxHeight: '480px' }}
                    />
                </div>
                <div className="col-md-7 d-flex flex-column justify-content-between pl-md-4">
                    <div>
                        <h2 className="font-weight-bold text-dark mb-3">{product.name}</h2>
                        <h3 className="text-danger font-weight-bold mb-4">
                            {product.price ? product.price.toLocaleString('vi-VN') : 0} ₫
                        </h3>
                        <hr />
                        <p className="text-secondary mt-3">
                            <strong>Mô tả chi tiết:</strong> {product.description || 'Sản phẩm cao cấp chính hãng từ hệ thống phân phối ThaiCMS.'}
                        </p>
                        <p className="text-muted small mt-2">
                            <i className="fa-solid fa-boxes-stacked mr-1"></i> Số lượng tồn kho: <strong>{product.stockQuantity ?? 0}</strong> sản phẩm.
                        </p>
                    </div>
                    <div className="mt-4">
                        <button className="btn btn-dark btn-lg px-5 py-3 font-weight-bold w-100 w-md-auto" style={{ borderRadius: '8px' }}>
                            <i className="fa-solid fa-cart-plus mr-2"></i> THÊM VÀO GIỎ HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;