import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCustomer } from '../../context/CustomerContext';

const API_BASE = 'https://localhost:7208';

const STATUS_MAP = {
    0: { label: 'Chờ duyệt',    color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock' },
    1: { label: 'Đang xử lý',  color: '#3b82f6', bg: '#eff6ff', icon: 'fa-cogs' },
    2: { label: 'Đang giao',   color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-truck' },
    3: { label: 'Hoàn thành',  color: '#10b981', bg: '#ecfdf5', icon: 'fa-check-circle' },
    4: { label: 'Đã huỷ',      color: '#ef4444', bg: '#fef2f2', icon: 'fa-times-circle' },
};

function StatusBadge({ status }) {
    const s = STATUS_MAP[status] || STATUS_MAP[0];
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: s.bg, color: s.color,
            border: `1px solid ${s.color}33`,
            borderRadius: 20, padding: '4px 12px',
            fontSize: 12, fontWeight: 700,
        }}>
            <i className={`fas ${s.icon}`} style={{ fontSize: 11 }}></i>
            {s.label}
        </span>
    );
}

export default function ProfilePage() {
    const { customer, login } = useCustomer();
    const navigate = useNavigate();
    const location = useLocation();

    // Đọc tab từ state điều hướng (từ dropdown header)
    const initialTab = location.state?.tab || 'info';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [form, setForm] = useState({ fullName: '', phone: '', address: '', email: '' });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!customer) {
            navigate('/login');
            return;
        }
        setForm({
            fullName: customer.fullName || customer.FullName || '',
            phone:    customer.phone    || customer.Phone    || '',
            address:  customer.address  || customer.Address  || '',
            email:    customer.email    || customer.Email    || '',
        });
    }, [customer, navigate]);

    // Load đơn hàng khi chuyển sang tab orders
    useEffect(() => {
        if (activeTab === 'orders' && customer) {
            setLoadingOrders(true);
            fetch(`${API_BASE}/api/Orders/customer/${customer.id}`)
                .then(r => r.ok ? r.json() : [])
                .then(data => setOrders(Array.isArray(data) ? data : []))
                .catch(() => setOrders([]))
                .finally(() => setLoadingOrders(false));
        }
    }, [activeTab, customer]);

    // Reset state tab khi location.state thay đổi
    useEffect(() => {
        if (location.state?.tab) setActiveTab(location.state.tab);
    }, [location.state]);

    const clearMsg = () => setMsg({ type: '', text: '' });

    // ── Lưu thông tin cá nhân ──
    const handleSaveInfo = async (e) => {
        e.preventDefault();
        setSaving(true); clearMsg();
        try {
            const res = await fetch(`${API_BASE}/api/Customers/${customer.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: form.fullName, phone: form.phone, address: form.address }),
            });
            if (res.ok) {
                login({ ...customer, fullName: form.fullName, phone: form.phone, address: form.address });
                setMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
            } else {
                setMsg({ type: 'danger', text: 'Có lỗi xảy ra, vui lòng thử lại.' });
            }
        } catch {
            setMsg({ type: 'danger', text: 'Không thể kết nối máy chủ.' });
        } finally { setSaving(false); }
    };

    // ── Đổi mật khẩu ──
    const handleChangePassword = async (e) => {
        e.preventDefault(); clearMsg();
        if (passwords.newPass !== passwords.confirm)
            return setMsg({ type: 'danger', text: 'Mật khẩu xác nhận không khớp.' });
        if (passwords.newPass.length < 6)
            return setMsg({ type: 'danger', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/Customers/${customer.id}/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
            });
            const data = await res.json();
            if (res.ok) {
                setMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setPasswords({ current: '', newPass: '', confirm: '' });
            } else {
                setMsg({ type: 'danger', text: data.message || 'Sai mật khẩu hiện tại.' });
            }
        } catch {
            setMsg({ type: 'danger', text: 'Không thể kết nối máy chủ.' });
        } finally { setSaving(false); }
    };

    if (!customer) return null;

    const avatar = (form.fullName || 'K').charAt(0).toUpperCase();

    const tabs = [
        { key: 'info',     icon: 'fa-user-edit',   label: 'Thông tin cá nhân' },
        { key: 'password', icon: 'fa-lock',         label: 'Đổi mật khẩu' },
        { key: 'orders',   icon: 'fa-receipt',      label: `Đơn hàng (${orders.length})` },
    ];

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Header />

            {/* Banner */}
            <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', padding: '40px 0 60px' }}>
                <div className="container" style={{ maxWidth: 900 }}>
                    <div className="d-flex align-items-center" style={{ gap: 20 }}>
                        {/* Avatar */}
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg,#11CAA0,#2563eb)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontSize: 28, fontWeight: 800,
                            border: '3px solid rgba(255,255,255,0.4)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                        }}>
                            {avatar}
                        </div>
                        <div>
                            <h4 style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: 22 }}>{form.fullName}</h4>
                            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: 14 }}>
                                <i className="fas fa-envelope mr-2"></i>{form.email}
                            </p>
                            {form.phone && (
                                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '2px 0 0', fontSize: 14 }}>
                                    <i className="fas fa-phone-alt mr-2"></i>{form.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Card chính — kéo lên đè banner */}
            <div className="container pb-5" style={{ maxWidth: 900, marginTop: -30 }}>
                <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', overflow: 'hidden' }}>

                    {/* Tab bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => { setActiveTab(tab.key); clearMsg(); }}
                                style={{
                                    flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                                    padding: '18px 12px', fontSize: 14, fontWeight: 600,
                                    color: activeTab === tab.key ? '#2563eb' : '#64748b',
                                    borderBottom: activeTab === tab.key ? '3px solid #2563eb' : '3px solid transparent',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <i className={`fas ${tab.icon} mr-2`}></i>{tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '32px' }}>
                        {/* Alert */}
                        {msg.text && (
                            <div className={`alert alert-${msg.type} d-flex align-items-center mb-4`}
                                style={{ borderRadius: 12, border: 'none', fontWeight: 500 }}>
                                <i className={`fas ${msg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                                {msg.text}
                            </div>
                        )}

                        {/* ── TAB: Thông tin cá nhân ── */}
                        {activeTab === 'info' && (
                            <form onSubmit={handleSaveInfo}>
                                <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
                                    <i className="fas fa-id-card mr-2 text-primary"></i>Thông tin cá nhân
                                </h5>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label style={labelStyle}>Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            className="form-control"
                                            style={inputStyle}
                                            value={form.fullName}
                                            onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label style={labelStyle}>Email</label>
                                        <input
                                            className="form-control"
                                            style={{ ...inputStyle, background: '#f1f5f9', color: '#94a3b8' }}
                                            value={form.email}
                                            readOnly
                                        />
                                        <small style={{ color: '#94a3b8', fontSize: 12 }}>Email không thể thay đổi</small>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label style={labelStyle}>Số điện thoại</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRight: 'none' }}>
                                                    <i className="fas fa-phone-alt text-muted" style={{ fontSize: 13 }}></i>
                                                </span>
                                            </div>
                                            <input
                                                className="form-control"
                                                style={{ ...inputStyle, borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                                                value={form.phone}
                                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                                placeholder="0901 234 567"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label style={labelStyle}>Địa chỉ nhận hàng</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRight: 'none' }}>
                                                    <i className="fas fa-map-marker-alt text-muted" style={{ fontSize: 13 }}></i>
                                                </span>
                                            </div>
                                            <input
                                                className="form-control"
                                                style={{ ...inputStyle, borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                                                value={form.address}
                                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                                placeholder="Số nhà, đường, quận, thành phố"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={saving} style={btnPrimaryStyle}>
                                    {saving
                                        ? <><span className="spinner-border spinner-border-sm mr-2"></span>Đang lưu...</>
                                        : <><i className="fas fa-save mr-2"></i>Lưu thay đổi</>
                                    }
                                </button>
                            </form>
                        )}

                        {/* ── TAB: Đổi mật khẩu ── */}
                        {activeTab === 'password' && (
                            <form onSubmit={handleChangePassword} style={{ maxWidth: 460 }}>
                                <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
                                    <i className="fas fa-shield-alt mr-2 text-warning"></i>Bảo mật tài khoản
                                </h5>
                                <div className="mb-4">
                                    <label style={labelStyle}>Mật khẩu hiện tại</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRight: 'none' }}>
                                                <i className="fas fa-lock text-muted" style={{ fontSize: 13 }}></i>
                                            </span>
                                        </div>
                                        <input type="password" className="form-control" style={{ ...inputStyle, borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                                            value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                                            placeholder="Nhập mật khẩu hiện tại" required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label style={labelStyle}>Mật khẩu mới</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRight: 'none' }}>
                                                <i className="fas fa-key text-muted" style={{ fontSize: 13 }}></i>
                                            </span>
                                        </div>
                                        <input type="password" className="form-control" style={{ ...inputStyle, borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                                            value={passwords.newPass} onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                                            placeholder="Ít nhất 6 ký tự" required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label style={labelStyle}>Xác nhận mật khẩu mới</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ borderRadius: '10px 0 0 10px', background: '#f1f5f9', border: '2px solid #e2e8f0', borderRight: 'none' }}>
                                                <i className="fas fa-check-double text-muted" style={{ fontSize: 13 }}></i>
                                            </span>
                                        </div>
                                        <input type="password" className="form-control"
                                            style={{
                                                ...inputStyle,
                                                borderRadius: '0 10px 10px 0', borderLeft: 'none',
                                                borderColor: passwords.confirm && passwords.newPass !== passwords.confirm ? '#ef4444' : '#e2e8f0',
                                            }}
                                            value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                                            placeholder="Nhập lại mật khẩu mới" required />
                                    </div>
                                    {passwords.confirm && passwords.newPass !== passwords.confirm && (
                                        <small style={{ color: '#ef4444', fontSize: 12 }}>
                                            <i className="fas fa-exclamation-circle mr-1"></i>Mật khẩu không khớp
                                        </small>
                                    )}
                                </div>
                                <button type="submit" disabled={saving} style={{ ...btnPrimaryStyle, background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                                    {saving ? 'Đang xử lý...' : <><i className="fas fa-shield-alt mr-2"></i>Đổi mật khẩu</>}
                                </button>
                            </form>
                        )}

                        {/* ── TAB: Lịch sử đơn hàng ── */}
                        {activeTab === 'orders' && (
                            <div>
                                <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
                                    <i className="fas fa-history mr-2 text-success"></i>Lịch sử đơn hàng
                                </h5>
                                {loadingOrders ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-3 text-muted">Đang tải đơn hàng...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
                                        <h5 style={{ color: '#94a3b8', fontWeight: 600 }}>Chưa có đơn hàng nào</h5>
                                        <p style={{ color: '#cbd5e1', fontSize: 14 }}>Hãy mua sắm và quay lại đây!</p>
                                        <button onClick={() => navigate('/shop')} style={btnPrimaryStyle}>
                                            <i className="fas fa-shopping-bag mr-2"></i>Đi mua sắm
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {orders.map(order => (
                                            <div key={order.id} style={{
                                                border: '1px solid #e2e8f0', borderRadius: 14,
                                                marginBottom: 16, overflow: 'hidden',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                            }}>
                                                {/* Header đơn hàng */}
                                                <div style={{
                                                    background: '#f8fafc', padding: '14px 20px',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                        <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>
                                                            Đơn hàng #{order.id}
                                                        </span>
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                    <span style={{ color: '#94a3b8', fontSize: 13 }}>
                                                        <i className="fas fa-calendar-alt mr-1"></i>
                                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                                    </span>
                                                </div>
                                                {/* Body đơn hàng */}
                                                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                                    <div>
                                                        {order.shippingAddress && (
                                                            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                                                                <i className="fas fa-map-marker-alt mr-2 text-danger"></i>
                                                                {order.shippingAddress}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 800, fontSize: 18, color: '#ef4444' }}>
                                                            {Number(order.totalAmount || 0).toLocaleString('vi-VN')}đ
                                                        </div>
                                                        <small style={{ color: '#94a3b8', fontSize: 12 }}>Tổng thanh toán</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

// Shared styles
const labelStyle = { fontWeight: 600, color: '#475569', fontSize: 13, marginBottom: 6, display: 'block' };
const inputStyle = { borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, padding: '10px 14px', transition: 'border-color 0.2s' };
const btnPrimaryStyle = {
    background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    color: '#fff', border: 'none', borderRadius: 10,
    padding: '12px 28px', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
    transition: 'opacity 0.2s',
};
