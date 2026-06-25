import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || "https://localhost:7208";

function CartTable() {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="fas fa-shopping-cart text-muted mb-3" style={{ fontSize: '48px' }}></i>
                <h5 className="text-secondary">Giỏ hàng của bạn đang trống!</h5>
                <p className="text-muted">Hãy quay lại Cửa hàng để chọn sản phẩm nhé.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
                <thead className="thead-light">
                    <tr>
                        <th scope="col" className="text-center" style={{ width: '15%' }}>Hình ảnh</th>
                        <th scope="col" style={{ width: '35%' }}>Tên sản phẩm</th>
                        <th scope="col" className="text-right" style={{ width: '15%' }}>Đơn giá</th>
                        <th scope="col" className="text-center" style={{ width: '15%' }}>Số lượng</th>
                        <th scope="col" className="text-right" style={{ width: '15%' }}>Thành tiền</th>
                        <th scope="col" className="text-center" style={{ width: '5%' }}>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td className="text-center">
                                <img 
                                    src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`) : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'} 
                                    alt={item.name} 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </td>
                            <td className="font-weight-bold">{item.name}</td>
                            <td className="text-right text-danger font-weight-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </td>
                            <td>
                                <div className="input-group input-group-sm justify-content-center">
                                    <div className="input-group-prepend">
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    </div>
                                    <input 
                                        type="text" 
                                        className="form-control text-center bg-white" 
                                        style={{ maxWidth: '50px' }} 
                                        value={item.quantity} 
                                        readOnly 
                                    />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                    </div>
                                </div>
                            </td>
                            <td className="text-right text-danger font-weight-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                            </td>
                            <td className="text-center">
                                <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartTable;
