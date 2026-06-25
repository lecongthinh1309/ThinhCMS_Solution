import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useCustomer } from '../../context/CustomerContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useCustomer();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const e = {};
        if (!form.email) e.email = 'Vui lòng nhập Email.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ.';
        if (!form.password) e.password = 'Vui lòng nhập mật khẩu.';
        return e;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setServerError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            const res = await axiosClient.post('/Customers/login', { email: form.email, password: form.password });
            if (res.success) {
                login(res.customer);   // ← Lưu vào CustomerContext + localStorage
                navigate('/');
            }
        } catch (err) {
            setServerError(err?.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={styles.pageWrapper}>
            {/* Background blobs */}
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                {/* Left panel */}
                <div style={styles.leftPanel}>
                    <div style={styles.brandBadge}>THINHCMS</div>
                    <h1 style={styles.brandTitle}>Chào mừng<br />trở lại! 👋</h1>
                    <p style={styles.brandSub}>Đăng nhập để khám phá hàng ngàn mẫu thời trang cao cấp dành riêng cho bạn.</p>
                    <div style={styles.featureList}>
                        {['🎁 Ưu đãi độc quyền cho thành viên', '🚀 Giao hàng nhanh toàn quốc', '💎 Sản phẩm chính hãng 100%'].map((f, i) => (
                            <div key={i} style={styles.featureItem}>{f}</div>
                        ))}
                    </div>
                </div>

                {/* Right panel — form */}
                <div style={styles.rightPanel}>
                    <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Đăng nhập</h2>
                        <p style={styles.formSub}>Nhập thông tin tài khoản của bạn</p>
                    </div>

                    {serverError && (
                        <div style={styles.alertError}>
                            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-envelope" style={styles.inputIcon} />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                                />
                            </div>
                            {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Mật khẩu</label>
                            <div style={styles.inputWrapper}>
                                <i className="fas fa-lock" style={styles.inputIcon} />
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
                                />
                            </div>
                            {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
                        </div>

                        <div style={styles.forgotRow}>
                            <Link to="/forgot-password" style={styles.forgotLink}>Quên mật khẩu?</Link>
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? (
                                <span><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} />Đang xử lý...</span>
                            ) : (
                                <span><i className="fas fa-sign-in-alt" style={{ marginRight: 8 }} />Đăng nhập</span>
                            )}
                        </button>
                    </form>

                    <div style={styles.divider}><span style={styles.dividerText}>hoặc</span></div>

                    <p style={styles.registerPrompt}>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" style={styles.registerLink}>Đăng ký ngay →</Link>
                    </p>

                    <Link to="/" style={styles.homeLink}>
                        <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    blob1: {
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blob2: {
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        display: 'flex',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        position: 'relative',
        zIndex: 1,
    },
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: '#fff',
    },
    brandBadge: {
        display: 'inline-block',
        background: 'rgba(255,255,255,0.2)',
        backdropFilter: 'blur(10px)',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '2px',
        marginBottom: '24px',
        width: 'fit-content',
    },
    brandTitle: {
        fontSize: '36px',
        fontWeight: 800,
        lineHeight: 1.2,
        marginBottom: '16px',
        color: '#fff',
    },
    brandSub: {
        fontSize: '15px',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 1.7,
        marginBottom: '32px',
    },
    featureList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    featureItem: {
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(5px)',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 500,
    },
    rightPanel: {
        flex: 1,
        background: '#fff',
        padding: '50px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    formHeader: { marginBottom: '28px' },
    formTitle: { fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 },
    formSub: { color: '#64748b', fontSize: '14px', marginTop: '6px' },
    alertError: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        padding: '12px 16px',
        borderRadius: '10px',
        fontSize: '14px',
        marginBottom: '20px',
    },
    inputGroup: { marginBottom: '18px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
    inputWrapper: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px' },
    input: {
        width: '100%', padding: '12px 14px 12px 40px', border: '2px solid #e5e7eb',
        borderRadius: '10px', fontSize: '14px', outline: 'none',
        transition: 'border-color 0.2s', boxSizing: 'border-box',
        fontFamily: 'inherit',
    },
    inputError: { borderColor: '#f87171' },
    errorMsg: { color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' },
    forgotRow: { display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' },
    forgotLink: { color: '#2563eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' },
    submitBtn: {
        width: '100%', padding: '14px',
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '15px', fontWeight: 700, cursor: 'pointer',
        transition: 'opacity 0.2s, transform 0.1s',
        letterSpacing: '0.5px',
    },
    divider: {
        position: 'relative', textAlign: 'center', margin: '24px 0',
        borderTop: '1px solid #e5e7eb',
    },
    dividerText: {
        background: '#fff', padding: '0 12px', color: '#9ca3af',
        fontSize: '13px', position: 'relative', top: '-10px',
    },
    registerPrompt: { textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 },
    registerLink: { color: '#2563eb', fontWeight: 700, textDecoration: 'none' },
    homeLink: {
        display: 'block', textAlign: 'center', marginTop: '20px',
        color: '#94a3b8', fontSize: '13px', textDecoration: 'none',
    },
};
