import React, { useContext, useState } from 'react';
// Import thành phần Link để chuyển trang mượt mà không bị tải lại trang (Hard-Reload)
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';

function Header() {
    // Dùng hook useLocation của react-router-dom để bắt đường dẫn URL hiện tại
    const location = useLocation();
    const navigate = useNavigate();
    const { totalItems } = useContext(CartContext);
    const { customer, isLoggedIn, logout } = useCustomer();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Hàm xử lý tìm kiếm — điều hướng sang trang Shop với từ khóa
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const kw = searchKeyword.trim();
        if (kw) {
            navigate(`/shop?search=${encodeURIComponent(kw)}`);
        } else {
            navigate('/shop');
        }
    };

    // Hàm hỗ trợ kiểm tra trang hiện tại để gán hiệu ứng làm sáng (Active) menu chuẩn v4
    const isActive = (path) => {
        // Nếu trùng khớp URL, trả về class 'active font-weight-bold text-primary', ngược lại trả về 'text-dark'
        return location.pathname === path ? 'active font-weight-bold text-primary' : 'text-dark';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">

            {/* ──────────────────────────────────────────────────────── */}
            {/* TẦNG TIỆN ÍCH 1: THANH TOP BAR (Cú pháp chuẩn Bootstrap 4) */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="top-bar bg-dark py-2 text-white" style={{ fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Bên trái: Hotline & Email (Sử dụng mr-3 chuẩn v4) */}
                    <div className="top-bar-left">
                        <span className="mr-3">
                            <i className="fas fa-phone-alt mr-1"></i> Hotline: 090x.xxx.xxx
                        </span>
                        <span>
                            <i className="fas fa-envelope mr-1"></i> Email: support@Thinhcms.retail
                        </span>
                    </div>
                    {/* Bên phải: Hiển thị theo trạng thái đăng nhập */}
                    <div className="top-bar-right d-flex align-items-center">
                        {isLoggedIn ? (
                            // — Đã đăng nhập: hiển thị tên + dropdown menu
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowUserMenu(v => !v)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#11CAA0', fontWeight: 600, padding: '2px 8px', borderRadius: 6, fontSize: 13 }}
                                >
                                    <i className="fas fa-user-circle mr-1"></i>
                                    Xin chào, <strong>{customer?.fullName || customer?.FullName || 'Khách hàng'}</strong>
                                    <i className={`fas fa-chevron-${showUserMenu ? 'up' : 'down'} ml-1`} style={{ fontSize: 10 }}></i>
                                </button>

                                {/* Dropdown */}
                                {showUserMenu && (
                                    <div
                                        style={{
                                            position: 'absolute', top: '110%', right: 0, zIndex: 9999,
                                            background: '#fff', borderRadius: 12, minWidth: 200,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                            overflow: 'hidden', border: '1px solid #e2e8f0',
                                        }}
                                    >
                                        {/* Header dropdown */}
                                        <div style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', padding: '14px 16px' }}>
                                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>
                                                {customer?.fullName || customer?.FullName}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                                                {customer?.email || customer?.Email}
                                            </div>
                                        </div>
                                        {/* Menu items */}
                                        <div style={{ padding: '6px 0' }}>
                                            <button
                                                onClick={() => { setShowUserMenu(false); navigate('/profile', { state: { tab: 'info' } }); }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#334155', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <i className="fas fa-user-edit" style={{ color: '#2563eb', width: 16 }}></i>
                                                Thông tin tài khoản
                                            </button>
                                            <button
                                                onClick={() => { setShowUserMenu(false); navigate('/profile', { state: { tab: 'orders' } }); }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#334155', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <i className="fas fa-receipt" style={{ color: '#10b981', width: 16 }}></i>
                                                Lịch sử đơn hàng
                                            </button>
                                            <hr style={{ margin: '4px 16px', borderColor: '#e2e8f0' }} />
                                            <button
                                                onClick={() => { setShowUserMenu(false); logout(); navigate('/'); }}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', color: '#ef4444', textDecoration: 'none', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <i className="fas fa-sign-out-alt" style={{ color: '#ef4444', width: 16 }}></i>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // — Chưa đăng nhập: hiển thị link Đăng nhập / Đăng ký
                            <>
                                <Link to="/login" className="text-white mr-3 text-decoration-none transition-link">
                                    <i className="fas fa-user mr-1"></i> Đăng nhập
                                </Link>
                                <Link to="/register" className="text-white text-decoration-none transition-link">
                                    <i className="fas fa-user-plus mr-1"></i> Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* TẦNG TIỆN ÍCH 2: KHU VỰC CHÍNH (Logo, Search Bar & Giỏ hàng) */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="main-header py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">

                        {/* 1. Cột Logo Thương Hiệu */}
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                                    ThinhCMS<span style={{ color: '#11CAA0' }}>.Kitchen</span>
                                </h3>
                            </Link>
                        </div>

                        {/* 2. Cột Ô Tìm Kiếm Sản Phẩm (Sử dụng border-right-0 chuẩn v4) */}
                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm kiếm nồi chiên không dầu, bếp điện từ, chảo chống dính..."
                                    style={{ borderRadius: '20px 0 0 20px', fontSize: '14px' }}
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary border-left-0 px-4"
                                        type="submit"
                                        style={{
                                            borderRadius: '0 20px 20px 0',
                                            backgroundColor: '#005088',
                                            borderColor: '#005088'
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 3. Cột Giỏ Hàng Nhanh (Sử dụng text-right chuẩn v4) */}
                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2" style={{ color: '#005088', fontSize: '22px' }}>
                                <i className="fas fa-shopping-bag"></i>
                                {/* Vòng tròn badge đỏ số lượng giỏ hàng sống */}
                                <span
                                    className="badge badge-pill position-absolute"
                                    style={{
                                        top: '0',
                                        right: '0',
                                        backgroundColor: '#11CAA0',
                                        color: '#fff',
                                        fontSize: '11px',
                                        padding: '4px 6px'
                                    }}
                                >
                                    {totalItems}
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* TẦNG TIỆN ÍCH 3: THANH MENU ĐIỀU HƯỚNG CHÍNH (BOOTSTRAP 4.6.2) */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="main-navigation bg-white py-2">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        {/* Ứng dụng hệ lớp nav của Bootstrap 4 để quản lý danh sách menu dọc/ngang */}
                        <ul className="navbar-nav w-100">

                            {/* Menu 1: Trang Chủ (Sử dụng mr-4 để thay thế thuộc tính gap-2 của v5) */}
                            <li className="nav-item mr-4">
                                <Link to="/" className={`nav-link p-0 text-decoration-none ${isActive('/')}`} style={{ transition: 'all 0.2s' }}>
                                    Trang Chủ
                                </Link>
                            </li>

                            {/* Menu 2: Cửa Hàng */}
                            <li className="nav-item mr-4">
                                <Link to="/shop" className={`nav-link p-0 text-decoration-none ${isActive('/shop')}`} style={{ transition: 'all 0.2s' }}>
                                    Cửa Hàng
                                </Link>
                            </li>

                            {/* Menu 3: Tin Tức / Blog */}
                            <li className="nav-item mr-4">
                                <Link to="/blog" className={`nav-link p-0 text-decoration-none ${isActive('/blog')}`} style={{ transition: 'all 0.2s' }}>
                                    Tin Tức / Blog
                                </Link>
                            </li>


                        </ul>
                    </nav>
                </div>
            </div>

        </header>
    );
}
export default Header;
