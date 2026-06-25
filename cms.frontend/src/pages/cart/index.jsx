import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import CartTable from './CartTable';

function Cart() {
    const { cartItems, totalPrice, clearCart } = useContext(CartContext);

    return (
        <div className="container py-5">
            <h2 className="mb-4 font-weight-bold" style={{ color: '#005088' }}>
                <i className="fas fa-shopping-cart mr-2"></i> Giỏ Hàng Của Bạn
            </h2>
            
            <div className="row">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0 rounded-lg p-4">
                        <CartTable />
                        
                        {cartItems.length > 0 && (
                            <div className="mt-4 d-flex justify-content-between">
                                <Link to="/shop" className="btn btn-outline-secondary rounded-pill px-4">
                                    <i className="fas fa-arrow-left mr-2"></i> Tiếp tục mua hàng
                                </Link>
                                <button className="btn btn-outline-danger rounded-pill px-4" onClick={clearCart}>
                                    <i className="fas fa-trash-alt mr-2"></i> Xóa toàn bộ giỏ hàng
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Khu vực tính tổng tiền */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-lg p-4 bg-light">
                        <h4 className="font-weight-bold mb-4 border-bottom pb-2">Tóm tắt đơn hàng</h4>
                        
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-secondary">Tạm tính:</span>
                            <span className="font-weight-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-secondary">Phí vận chuyển:</span>
                            <span className="font-weight-bold">Miễn phí</span>
                        </div>
                        
                        <hr />
                        
                        <div className="d-flex justify-content-between mb-4">
                            <span className="font-weight-bold" style={{ fontSize: '18px' }}>Tổng cộng:</span>
                            <span className="font-weight-bold text-danger" style={{ fontSize: '24px' }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                            </span>
                        </div>
                        
                        <Link 
                            to="/checkout" 
                            className={`btn btn-primary btn-lg btn-block rounded-pill font-weight-bold ${cartItems.length === 0 ? 'disabled' : ''}`}
                            style={{ backgroundColor: '#11CAA0', borderColor: '#11CAA0' }}
                        >
                            Tiến hành thanh toán <i className="fas fa-arrow-right ml-2"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
