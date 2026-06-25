import React from 'react';
// Import các thành phần lõi của thư viện điều hướng đường dẫn
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. IMPORT CÁC COMPONENT TOÀN CỤC (LAYOUT CHUNG)
// eslint-disable-next-line no-unused-vars
import Header from './components/Header';
// eslint-disable-next-line no-unused-vars
import Footer from './components/Footer';

// 2. IMPORT CÁC TRANG CHỨC NĂNG (GIAO DIỆN CHÍNH)
import Home from './pages/home/index';
import Shop from './pages/shop/index';
import ProductDetail from './pages/product-detail';
import Blog from './pages/blog/index';
import BlogDetail from './pages/blog-detail/index';
import Cart from './pages/cart/index';
import Checkout from './pages/checkout/index';
import LoginPage from './pages/login/index';
import RegisterPage from './pages/register/index';
import ForgotPasswordPage from './pages/forgot-password/index';
import ProfilePage from './pages/profile/index';
import { CartProvider } from './context/CartContext';
import { CustomerProvider } from './context/CustomerContext';

function App() {
    return (
        <CustomerProvider>
        <CartProvider>
        <Router>
            <div className="d-flex flex-column min-vh-100 bg-light">
                {/* KHU VỰC NỘI DUNG ĐỘNG (Thay đổi ruột tùy theo URL trên thanh địa chỉ) */}
                <main className="flex-grow-1">
                    <Routes>
                        {/* Trang chủ */}
                        <Route path="/" element={<Home />} />

                        {/* Cửa hàng */}
                        <Route path="/shop" element={<Shop />} />

                        {/* Chi tiết sản phẩm */}
                        <Route path="/product/:id" element={<ProductDetail />} />

                        {/* Blog */}
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogDetail />} />

                        {/* Giỏ hàng & Thanh toán */}
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />

                        {/* Tài khoản khách hàng */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/profile" element={<ProfilePage />} />

                        {/* 404 */}
                        <Route path="*" element={
                            <div className="container text-center py-5 my-5">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/580/580185.png"
                                    alt="404"
                                    className="mb-4"
                                    style={{ width: '100px', opacity: 0.6 }}
                                />
                                <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
                                <p className="text-muted">Đường dẫn bạn truy cập không tồn tại trên hệ thống ThinhCMS.</p>
                                <a href="/" className="btn btn-dark btn-sm mt-2">Quay lại Trang Chủ</a>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
        </CartProvider>
        </CustomerProvider>
    );
}

export default App;
