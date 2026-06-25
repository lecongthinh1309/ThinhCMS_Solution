import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';
import productService from '../../services/productService';

const PAGE_SIZE = 8;

function Shop() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // States bộ lọc
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000000);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('default');

    // Đọc search param từ URL (từ Header search)
    useEffect(() => {
        const kw = searchParams.get('search');
        if (kw) setSearchTerm(kw);
    }, [searchParams]);

    // Gọi API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = activeCategoryId
                    ? await productService.getProductsByCategory(activeCategoryId)
                    : await productService.getAllProducts();
                setProducts(data);
                setCurrentPage(1);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategoryId]);

    // Reset page when filters change
    useEffect(() => { setCurrentPage(1); }, [searchTerm, minPrice, maxPrice, sortBy]);

    // Lọc client-side
    const filteredProducts = products
        .filter((prod) => {
            const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = prod.price >= minPrice && prod.price <= maxPrice;
            return matchesSearch && matchesPrice;
        })
        .sort((a, b) => {
            if (sortBy === 'priceAsc') return a.price - b.price;
            if (sortBy === 'priceDesc') return b.price - a.price;
            if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
            return b.id - a.id;
        });

    // Phân trang
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleClearFilters = () => {
        setActiveCategoryId(null);
        setMinPrice(0);
        setMaxPrice(1000000000);
        setSearchTerm('');
        setSortBy('default');
        setCurrentPage(1);
    };

    const handlePriceChange = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    // Render pagination
    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return (
            <div style={paginationStyles.wrapper}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ ...paginationStyles.btn, ...(currentPage === 1 ? paginationStyles.btnDisabled : {}) }}
                >
                    <i className="fas fa-chevron-left" style={{ fontSize: 12 }} />
                </button>
                {pages.map(p => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        style={{
                            ...paginationStyles.btn,
                            ...(p === currentPage ? paginationStyles.btnActive : {}),
                        }}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ ...paginationStyles.btn, ...(currentPage === totalPages ? paginationStyles.btnDisabled : {}) }}
                >
                    <i className="fas fa-chevron-right" style={{ fontSize: 12 }} />
                </button>
                <span style={paginationStyles.info}>
                    Trang {currentPage} / {totalPages} — {filteredProducts.length} sản phẩm
                </span>
            </div>
        );
    };

    return (
        <div className="shop-page-wrapper">
            <Header />

            {/* Banner */}
            <div className="shop-banner bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Cửa Hàng</li>
                        </ol>
                    </nav>
                    <h2 className="font-weight-bold mt-2" style={{ color: '#005088' }}>DANH MỤC CỬA HÀNG</h2>
                </div>
            </div>

            {/* Main content */}
            <div className="container py-3">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3 col-md-4">
                        <ShopSidebar
                            activeCategoryId={activeCategoryId}
                            onCategoryClick={setActiveCategoryId}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onPriceChange={handlePriceChange}
                        />
                    </div>

                    {/* Product grid */}
                    <div className="col-lg-9 col-md-8">
                        <ShopHeader
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            productCount={filteredProducts.length}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />

                        <LoadingOrEmpty
                            loading={loading}
                            isEmpty={filteredProducts.length === 0}
                            onClearFilters={handleClearFilters}
                        />

                        {!loading && pagedProducts.length > 0 && (
                            <ProductList products={pagedProducts} />
                        )}

                        {/* PHÂN TRANG */}
                        {!loading && renderPagination()}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

const paginationStyles = {
    wrapper: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '6px', marginTop: '36px', marginBottom: '24px', flexWrap: 'wrap',
    },
    btn: {
        minWidth: '38px', height: '38px', padding: '0 10px',
        border: '2px solid #e2e8f0', borderRadius: '10px',
        background: '#fff', color: '#334155',
        cursor: 'pointer', fontWeight: 600, fontSize: '14px',
        transition: 'all 0.2s',
    },
    btnActive: {
        background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
        color: '#fff', border: '2px solid transparent',
        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
    },
    btnDisabled: { opacity: 0.4, cursor: 'not-allowed' },
    info: { marginLeft: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 },
};

export default Shop;

