import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7208';

function HotProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHot = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                // Sort by lowest stock (most sold) then by id desc, take top 3
                const hotProducts = [...data]
                    .sort((a, b) => a.stockQuantity - b.stockQuantity || b.id - a.id)
                    .slice(0, 3);
                setProducts(hotProducts);
            } catch (err) {
                console.error('Lỗi tải sản phẩm hot:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHot();
    }, []);

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (loading) return null;
    if (!products.length) return null;

    return (
        <section style={styles.section}>
            <div className="container">
                {/* Section Header */}
                <div style={styles.sectionHeader}>
                    <div style={styles.labelRow}>
                        <span style={styles.hotBadge}>🔥 HOT</span>
                        <span style={styles.sectionLabel}>Bán Chạy Nhất</span>
                    </div>
                    <h2 style={styles.sectionTitle}>Sản Phẩm Bán Chạy</h2>
                    <p style={styles.sectionSub}>Những thiết kế được yêu thích nhất tuần qua</p>
                </div>

                {/* Products Row */}
                <div style={styles.productsRow}>
                    {products.map((product, idx) => {
                        const imageUrl = product.imageUrl
                            ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`)
                            : `https://via.placeholder.com/400x500/1e293b/ffffff?text=${encodeURIComponent(product.name || 'Sản phẩm')}`;

                        const rankColors = [
                            { bg: 'linear-gradient(135deg,#ef4444,#b91c1c)', label: '#1' },
                            { bg: 'linear-gradient(135deg,#f97316,#c2410c)', label: '#2' },
                            { bg: 'linear-gradient(135deg,#eab308,#a16207)', label: '#3' },
                        ];
                        const rank = rankColors[idx] || rankColors[2];

                        return (
                            <Link to={`/product/${product.id}`} key={product.id} style={styles.cardLink}>
                                <div style={styles.card} className="hot-product-card">
                                    {/* Rank badge */}
                                    <div style={{ ...styles.rankBadge, background: rank.bg }}>
                                        {rank.label}
                                    </div>
                                    {/* Hot badge */}
                                    <div style={styles.hotTag}>🔥 BÁN CHẠY</div>

                                    {/* Image */}
                                    <div style={styles.imageWrapper}>
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            style={styles.image}
                                            onError={(e) => { e.target.src = `https://via.placeholder.com/400x500/1e293b/ffffff?text=No+Image`; }}
                                        />
                                        <div style={styles.imageOverlay}>
                                            <span style={styles.viewBtn}>Xem ngay →</span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div style={styles.cardBody}>
                                        <p style={styles.category}>{product.categoryProduct?.name || 'Thời trang'}</p>
                                        <h4 style={styles.productName}>{product.name}</h4>
                                        <div style={styles.priceRow}>
                                            <span style={styles.price}>{formatPrice(product.price)}</span>
                                            <span style={styles.stock}>
                                                {product.stockQuantity > 0
                                                    ? `Còn ${product.stockQuantity}`
                                                    : <span style={{ color: '#ef4444' }}>Hết hàng</span>
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View all button */}
                <div style={{ textAlign: 'center', marginTop: '36px' }}>
                    <Link to="/shop" style={styles.viewAllBtn}>
                        Xem tất cả sản phẩm →
                    </Link>
                </div>
            </div>

            <style>{`
                .hot-product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
                .hot-product-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
                .hot-product-card:hover img { transform: scale(1.06); }
                .hot-product-card:hover .img-overlay { opacity: 1 !important; }
            `}</style>
        </section>
    );
}

const styles = {
    section: {
        padding: '60px 0',
        background: 'linear-gradient(180deg, #fff 0%, #fafafa 100%)',
    },
    sectionHeader: { textAlign: 'center', marginBottom: '44px' },
    labelRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' },
    hotBadge: {
        background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
        color: '#fff', padding: '4px 12px', borderRadius: '20px',
        fontSize: '13px', fontWeight: 700, letterSpacing: '1px',
    },
    sectionLabel: {
        fontSize: '12px', fontWeight: 700, letterSpacing: '3px',
        textTransform: 'uppercase', color: '#94a3b8',
    },
    sectionTitle: {
        fontSize: '2rem', fontWeight: 800, color: '#0f172a',
        margin: '0 0 8px',
    },
    sectionSub: { color: '#64748b', fontSize: '15px' },
    productsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '28px',
    },
    cardLink: { textDecoration: 'none', display: 'block' },
    card: {
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        position: 'relative',
    },
    rankBadge: {
        position: 'absolute', top: '14px', left: '14px', zIndex: 10,
        color: '#fff', fontWeight: 800, fontSize: '14px',
        padding: '4px 12px', borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    hotTag: {
        position: 'absolute', top: '14px', right: '14px', zIndex: 10,
        background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(8px)',
        color: '#fff', padding: '4px 10px', borderRadius: '20px',
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
    },
    imageWrapper: { position: 'relative', paddingTop: '115%', overflow: 'hidden', background: '#f8fafc' },
    image: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        objectFit: 'cover', transition: 'transform 0.4s ease',
    },
    imageOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(15,23,42,0.85))',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '20px', opacity: 0, transition: 'opacity 0.3s',
        className: 'img-overlay',
    },
    viewBtn: {
        color: '#fff', fontWeight: 700, fontSize: '14px',
        borderBottom: '2px solid rgba(255,255,255,0.5)', paddingBottom: '2px',
    },
    cardBody: { padding: '18px 20px 22px' },
    category: { fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 6px' },
    productName: { fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.3 },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: '17px', fontWeight: 800, color: '#2563eb' },
    stock: { fontSize: '12px', color: '#22c55e', fontWeight: 600 },
    viewAllBtn: {
        display: 'inline-block',
        padding: '13px 36px',
        background: 'linear-gradient(135deg,#0f172a,#1e293b)',
        color: '#fff', borderRadius: '50px',
        fontWeight: 700, fontSize: '14px',
        textDecoration: 'none', letterSpacing: '0.5px',
        transition: 'all 0.3s',
    },
};

export default HotProducts;
