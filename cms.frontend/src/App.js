import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomeView from './components/HomeView';
import ProductDetail from './components/ProductDetail';
import PostDetail from './components/PostDetail';
import './App.css';

function App() {
    return (
        <div>
            {/* ==================== THANH NAVIGATION CHUẨN ĐÚNG THEO MẪU CSS CỦA EM ==================== */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3 shadow-sm">
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Brand Logo */}
                    <Link to="/" className="navbar-brand font-weight-bold text-primary text-uppercase" style={{ fontSize: '1.4rem', letterSpacing: '0.5px' }}>
                        ThinhCMS<span style={{ color: '#b45309' }}>.Fashion</span>
                    </Link>

                    {/* Menu điều hướng - Tích hợp Anchor Link và React Router Link */}
                    <div className="navbar-nav d-flex flex-row align-items-center" style={{ gap: '25px' }}>
                        <Link to="/" className="nav-link font-weight-bold text-dark text-uppercase small m-0" style={{ letterSpacing: '0.5px' }}>Trang Chủ</Link>

                        {/* Mục Sản phẩm: Khi bấm nhảy đến vùng lưới lọc sản phẩm ở Trang chủ */}
                        <a href="/#danh-sach-san-pham" className="nav-link font-weight-bold text-muted text-uppercase small m-0" style={{ letterSpacing: '0.5px' }}>
                            Sản Phẩm
                        </a>

                        <Link to="/" className="nav-link font-weight-bold text-muted text-uppercase small m-0" style={{ letterSpacing: '0.5px' }}>Cửa Hàng</Link>
                        <Link to="/" className="nav-link font-weight-bold text-muted text-uppercase small m-0" style={{ letterSpacing: '0.5px' }}>Tin Tức / Blog</Link>
                        <Link to="/" className="nav-link font-weight-bold text-muted text-uppercase small m-0" style={{ letterSpacing: '0.5px' }}>Về Chúng Tôi</Link>
                    </div>

                    {/* Tiện ích đăng nhập & giỏ hàng */}
                    <div className="d-flex align-items-center text-secondary small" style={{ gap: '15px' }}>
                        <span className="cursor-pointer"><i className="fa-solid fa-user mr-1"></i> Đăng nhập</span>
                        <div className="position-relative ml-2 cursor-pointer">
                            <i className="fa-solid fa-basket-shopping text-dark" style={{ fontSize: '1.25rem' }}></i>
                            <span className="badge badge-danger position-absolute" style={{ top: '-8px', right: '-10px', fontSize: '0.65rem', borderRadius: '50%' }}>0</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ==================== KHU VỰC PHÂN LUỒNG HIỂN THỊ CÁC TRANG CHỨC NĂNG ==================== */}
            <div className="container my-4">
                <Routes>
                    <Route path="/" element={<HomeView />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/blog/:id" element={<PostDetail />} />
                </Routes>
            </div>

            {/* ==================== FOOTER CAO CẤP CHUẨN RETAIL 2026 (Đã sửa hết lỗi lồng thẻ) ==================== */}
            <footer className="bg-dark text-light pt-5 pb-3 mt-5 border-top border-secondary" style={{ backgroundColor: '#111827', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
                <div className="container">
                    <div className="row">

                        {/* Cột 1: Giới thiệu Brand */}
                        <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 pr-lg-5 text-left">
                            <h5 className="font-weight-bold text-uppercase mb-3" style={{ letterSpacing: '1px', color: '#fff' }}>
                                ThinhCMS<span style={{ color: '#f59e0b' }}>.Fashion</span>
                            </h5>
                            <p className="text-muted small" style={{ lineHeight: '1.7', color: '#9ca3af' }}>
                                Hệ thống chuỗi bán lẻ thời trang phân tầng cao cấp. Chúng tôi kiến tạo phong cách hiện đại, mang lại trải nghiệm mua sắm độc bản và tinh tế trên từng sợi vải cho khách hàng.
                            </p>
                            {/* Mạng xã hội */}
                            <div className="d-flex gap-3 mt-3">
                                <a href="#facebook" className="text-muted pr-3" style={{ fontSize: '1.2rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#3b82f6'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                                    <i className="fa-brands fa-facebook"></i>
                                </a>
                                <a href="#instagram" className="text-muted pr-3" style={{ fontSize: '1.2rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ec4899'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                                <a href="#tiktok" className="text-muted pr-3" style={{ fontSize: '1.2rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ffffff'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                                    <i className="fa-brands fa-tiktok"></i>
                                </a>
                                <a href="#youtube" className="text-muted" style={{ fontSize: '1.2rem', transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = '#ef4444'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                                    <i className="fa-brands fa-youtube"></i>
                                </a>
                            </div>
                        </div>

                        {/* Cột 2: Danh mục mua sắm nhanh */}
                        <div className="col-lg-2 col-md-6 mb-4 mb-lg-0 text-left">
                            <h6 className="text-uppercase font-weight-bold text-white mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                                Mua Sắm
                            </h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><a href="/" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Vest & Âu Phục Nam</a></li>
                                <li className="mb-2"><a href="/" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Thời Trang Công Sở Nữ</a></li>
                                <li className="mb-2"><a href="/" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Đầm Dạ Hội Quý Phái</a></li>
                                <li className="mb-2"><a href="/" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Bộ Sưu Tập Mới 2026</a></li>
                            </ul>
                        </div>

                        {/* Cột 3: Chính sách khách hàng */}
                        <div className="col-lg-2 col-md-6 mb-4 mb-md-0 text-left">
                            <h6 className="text-uppercase font-weight-bold text-white mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                                Chính Sách
                            </h6>
                            <ul className="list-unstyled small">
                                <li className="mb-2"><a href="#policy" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Chính sách giao hàng</a></li>
                                <li className="mb-2"><a href="#policy" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Chính sách đổi trả 1-1</a></li>
                                <li className="mb-2"><a href="#policy" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Bảo mật thông tin</a></li>
                                <li className="mb-2"><a href="#policy" className="text-muted" style={{ textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.color = '#fff'; e.target.style.paddingLeft = '5px'; }} onMouseOut={(e) => { e.target.style.color = '#9ca3af'; e.target.style.paddingLeft = '0px'; }}>Hệ thống cửa hàng</a></li>
                            </ul>
                        </div>

                        {/* Cột 4: Thông tin liên hệ trực tiếp */}
                        <div className="col-lg-4 col-md-6 text-left">
                            <h6 className="text-uppercase font-weight-bold text-white mb-3" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
                                Thông Tin Liên Hệ
                            </h6>
                            <p className="text-muted small mb-2" style={{ color: '#9ca3af' }}>
                                <i className="fa-solid fa-location-dot text-warning mr-2"></i> Khu công nghệ cao, Võ Chí Công, Quận 9, TP. Hồ Chí Minh.
                            </p>
                            <p className="text-muted small mb-2" style={{ color: '#9ca3af' }}>
                                <i className="fa-solid fa-phone text-warning mr-2"></i> Hotline: <strong className="text-white">090x.xxx.xxx</strong> (8:00 - 22:00)
                            </p>
                            <p className="text-muted small mb-3" style={{ color: '#9ca3af' }}>
                                <i className="fa-solid fa-envelope text-warning mr-2"></i> Email: support@thinhcms.retail
                            </p>
                            {/* Đăng ký nhận tin */}
                            <div className="input-group input-group-sm shadow-sm">
                                <input type="email" className="form-control bg-dark border-secondary text-white small" placeholder="Nhận mã giảm giá 10%..." style={{ borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }} />
                                <div className="input-group-append">
                                    <button className="btn btn-warning font-weight-bold text-dark px-3 text-uppercase" type="button" style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px', fontSize: '0.75rem' }}>Gửi</button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bản quyền & Dòng gạch chân đáy */}
                    <hr className="my-4 border-secondary" style={{ opacity: '0.1' }} />
                    <div className="row align-items-center">
                        <div className="col-md-12 text-center text-muted small" style={{ color: '#6b7280' }}>
                            <p className="m-0">© 2026 <span className="text-white font-weight-bold">ThinhCMS Retail</span>. All Rights Reserved. Thiết kế phân tầng bởi hsgThịnh.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;