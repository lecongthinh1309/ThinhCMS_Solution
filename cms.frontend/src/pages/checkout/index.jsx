import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useCustomer } from '../../context/CustomerContext';
import axiosClient from '../../api/axiosClient';

function Checkout() {
    const { cartItems, totalPrice, clearCart } = useContext(CartContext);
    const { customer, isLoggedIn } = useCustomer();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        customerName: customer?.fullName || customer?.FullName || '',
        customerEmail: customer?.email || customer?.Email || '',
        customerPhone: customer?.phone || customer?.Phone || '',
        customerAddress: customer?.address || customer?.Address || '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    // Validate Form (Tiêu chí 29)
    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = "Họ tên không được để trống";
        if (!formData.customerEmail.trim()) {
            newErrors.customerEmail = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
            newErrors.customerEmail = "Email không hợp lệ";
        }
        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = "Số điện thoại không được để trống";
        } else if (formData.customerPhone.length < 10) {
            newErrors.customerPhone = "Số điện thoại không hợp lệ";
        }
        if (!formData.customerAddress.trim()) newErrors.customerAddress = "Địa chỉ nhận hàng không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const payload = {
            ...formData,
            orderDetails: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price
            }))
        };

        try {
            // Tiêu chí 30: POST yêu cầu thanh toán
            const response = await axiosClient.post('/Orders/checkout', payload);
            alert("Đặt hàng thành công! Mã đơn hàng của bạn là: " + response.orderId + "\n\nEmail xác nhận đã được gửi.");
            clearCart();
            navigate('/');
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            alert("Đã xảy ra lỗi khi đặt hàng. " + (error.response?.data?.message || ""));
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h3 className="text-secondary">Giỏ hàng trống</h3>
                <p>Bạn cần có sản phẩm trong giỏ hàng để tiến hành thanh toán.</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/shop')}>Quay lại Cửa hàng</button>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />
            
            <div className="container" style={{ position: 'relative', zIndex: 1, py: '40px' }}>
                <div style={styles.headerTitleBox}>
                    <h2 style={styles.pageTitle}>Thanh Toán</h2>
                    <p style={styles.pageSub}>Hoàn tất đơn hàng của bạn chỉ với vài bước đơn giản.</p>
                </div>

                <div className="row">
                    {/* Left Form */}
                    <div className="col-lg-7 mb-4">
                        <div style={styles.card}>
                            <h4 style={styles.sectionTitle}>Thông tin giao hàng</h4>
                            <p style={styles.sectionSub}>Vui lòng điền đầy đủ và chính xác thông tin để chúng tôi giao hàng sớm nhất.</p>
                            
                            <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Họ và tên <span className="text-danger">*</span></label>
                                    <div style={styles.inputWrapper}>
                                        <i className="fas fa-user" style={styles.inputIcon} />
                                        <input type="text" name="customerName" 
                                            style={{ ...styles.input, ...(errors.customerName ? styles.inputError : {}) }} 
                                            placeholder="Nguyễn Văn A" 
                                            value={formData.customerName} onChange={handleChange} 
                                        />
                                    </div>
                                    {errors.customerName && <span style={styles.errorMsg}>{errors.customerName}</span>}
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Email <span className="text-danger">*</span></label>
                                            <div style={styles.inputWrapper}>
                                                <i className="fas fa-envelope" style={styles.inputIcon} />
                                                <input type="email" name="customerEmail" 
                                                    style={{ ...styles.input, ...(errors.customerEmail ? styles.inputError : {}) }} 
                                                    placeholder="email@example.com" 
                                                    value={formData.customerEmail} onChange={handleChange} 
                                                />
                                            </div>
                                            {errors.customerEmail && <span style={styles.errorMsg}>{errors.customerEmail}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Số điện thoại <span className="text-danger">*</span></label>
                                            <div style={styles.inputWrapper}>
                                                <i className="fas fa-phone-alt" style={styles.inputIcon} />
                                                <input type="tel" name="customerPhone" 
                                                    style={{ ...styles.input, ...(errors.customerPhone ? styles.inputError : {}) }} 
                                                    placeholder="0912 345 678" 
                                                    value={formData.customerPhone} onChange={handleChange} 
                                                />
                                            </div>
                                            {errors.customerPhone && <span style={styles.errorMsg}>{errors.customerPhone}</span>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                                    <div style={styles.inputWrapper}>
                                        <i className="fas fa-map-marker-alt" style={styles.inputIcon} />
                                        <input type="text" name="customerAddress" 
                                            style={{ ...styles.input, ...(errors.customerAddress ? styles.inputError : {}) }} 
                                            placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố" 
                                            value={formData.customerAddress} onChange={handleChange} 
                                        />
                                    </div>
                                    {errors.customerAddress && <span style={styles.errorMsg}>{errors.customerAddress}</span>}
                                </div>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Ghi chú đơn hàng (Tùy chọn)</label>
                                    <div style={styles.inputWrapper}>
                                        <i className="fas fa-sticky-note" style={{ ...styles.inputIcon, top: '20px', transform: 'none' }} />
                                        <textarea name="notes" 
                                            style={{ ...styles.input, minHeight: '100px', paddingTop: '16px' }} 
                                            placeholder="Ghi chú thêm về đơn hàng hoặc thời gian giao hàng mong muốn..." 
                                            value={formData.notes} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                
                                <button type="submit" style={styles.submitBtn} disabled={loading}>
                                    {loading ? (
                                        <span><i className="fas fa-spinner fa-spin mr-2" /> Đang xử lý...</span>
                                    ) : (
                                        <span>Hoàn tất Đặt Hàng <i className="fas fa-arrow-right ml-2" /></span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    {/* Right Cart Summary */}
                    <div className="col-lg-5">
                        <div style={{ ...styles.card, background: 'linear-gradient(145deg, #1e293b, #0f172a)', color: '#fff' }}>
                            <h4 style={{ ...styles.sectionTitle, color: '#fff' }}>Tóm tắt đơn hàng</h4>
                            <p style={{ ...styles.sectionSub, color: '#94a3b8' }}>{cartItems.length} sản phẩm trong giỏ hàng</p>
                            
                            <div style={styles.orderItemsList}>
                                {cartItems.map(item => (
                                    <div key={item.id} style={styles.orderItem}>
                                        <img 
                                            src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7208'}${item.imageUrl}`) : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'} 
                                            alt={item.name} 
                                            style={styles.itemImg} 
                                        />
                                        <div style={styles.itemInfo}>
                                            <div style={styles.itemName}>{item.name}</div>
                                            <div style={styles.itemMeta}>SL: {item.quantity}</div>
                                        </div>
                                        <div style={styles.itemPrice}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Tạm tính</span>
                                <span style={styles.summaryValue}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                            <div style={styles.summaryRow}>
                                <span style={styles.summaryLabel}>Phí vận chuyển</span>
                                <span style={{ ...styles.summaryValue, color: '#34d399' }}>Miễn phí</span>
                            </div>
                            
                            <div style={styles.totalRow}>
                                <span style={styles.totalLabel}>Tổng cộng</span>
                                <span style={styles.totalValue}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        background: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        padding: '60px 0',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    blob1: {
        position: 'absolute', top: '-150px', right: '-50px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    headerTitleBox: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    pageTitle: {
        fontSize: '36px', fontWeight: 800, color: '#0f172a', margin: 0,
    },
    pageSub: {
        fontSize: '16px', color: '#64748b', marginTop: '8px',
    },
    card: {
        background: '#fff',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        border: '1px solid rgba(255,255,255,0.5)',
    },
    sectionTitle: {
        fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: 0,
    },
    sectionSub: {
        fontSize: '14px', color: '#64748b', marginTop: '6px',
    },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' },
    inputWrapper: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' },
    input: {
        width: '100%', padding: '14px 16px 14px 44px', border: '2px solid #e2e8f0',
        borderRadius: '12px', fontSize: '15px', color: '#0f172a',
        transition: 'all 0.2s', outline: 'none', background: '#f8fafc',
    },
    inputError: { borderColor: '#ef4444', background: '#fef2f2' },
    errorMsg: { color: '#ef4444', fontSize: '12px', marginTop: '6px', display: 'block', fontWeight: 500 },
    submitBtn: {
        width: '100%', padding: '16px',
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        color: '#fff', border: 'none', borderRadius: '12px',
        fontSize: '16px', fontWeight: 700, cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        marginTop: '10px',
    },
    orderItemsList: {
        maxHeight: '380px', overflowY: 'auto', margin: '30px 0', paddingRight: '10px',
    },
    orderItem: {
        display: 'flex', alignItems: 'center', marginBottom: '20px',
        paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    itemImg: {
        width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover',
        backgroundColor: '#fff', padding: '4px', border: '1px solid rgba(255,255,255,0.2)',
    },
    itemInfo: { flex: 1, padding: '0 16px' },
    itemName: { fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px', lineHeight: 1.4 },
    itemMeta: { fontSize: '13px', color: '#94a3b8' },
    itemPrice: { fontSize: '15px', fontWeight: 700, color: '#38bdf8' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' },
    summaryLabel: { color: '#94a3b8' },
    summaryValue: { fontWeight: 600, color: '#f8fafc' },
    totalRow: { 
        display: 'flex', justifyContent: 'space-between', marginTop: '20px', 
        paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.2)' 
    },
    totalLabel: { fontSize: '18px', fontWeight: 700, color: '#fff' },
    totalValue: { fontSize: '24px', fontWeight: 800, color: '#38bdf8' },
};

export default Checkout;
