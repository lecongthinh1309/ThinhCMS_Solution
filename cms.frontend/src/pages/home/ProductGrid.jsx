import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 8; // Số sản phẩm mỗi trang

function ProductGrid({ selectedCategoryId }) {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const data = selectedCategoryId
                    ? await productService.getProductsByCategory(selectedCategoryId)
                    : await productService.getAllProducts();

                // Sắp xếp theo ID giảm dần (mới nhất trước)
                const sorted = data.sort((a, b) => b.id - a.id);
                setAllProducts(sorted);
                setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, [selectedCategoryId]);

    // Tính phân trang
    const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);
    const pagedProducts = allProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Cuộn lên đầu section khi đổi trang
        window.scrollTo({ top: document.getElementById('product-grid-section')?.offsetTop - 100 || 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Đang tải danh sách sản phẩm...</p>
            </div>
        );
    }

    return (
        <section id="product-grid-section" className="product-grid-wrapper py-4">
            <div className="container">
                {/* Tiêu đề section */}
                <div className="section-heading mb-5 d-flex justify-content-between align-items-end pb-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <h3 className="font-weight-bold m-0" style={{ color: '#0f172a', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
                        <span style={{ fontWeight: '300' }}>Sản phẩm</span> Nổi bật
                    </h3>
                    <span className="text-muted" style={{ fontSize: '13px', letterSpacing: '0.5px', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', fontWeight: '500' }}>
                        {allProducts.length} Sản phẩm
                    </span>
                </div>

                {allProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Chưa có sản phẩm nào trong danh mục này.</p>
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {pagedProducts.map((product) => (
                                <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-5" key={product.id}>
                                    <ProductCard item={product} />
                                </div>
                            ))}
                        </div>

                        {/* Phân trang */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={allProducts.length}
                            itemLabel="sản phẩm"
                        />
                    </>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;