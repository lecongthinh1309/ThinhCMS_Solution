import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useCustomer } from '../../context/CustomerContext';

const Field = ({ name, label, type = 'text', placeholder, icon, form, errors, handleChange }) => (
    <div style={styles.inputGroup}>
        <label style={styles.label}>{label}</label>
        <div style={styles.inputWrapper}>
            <i className={`fas ${icon}`} style={styles.inputIcon} />
            <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                style={{ ...styles.input, ...(errors[name] ? styles.inputError : {}) }}
            />
        </div>
        {errors[name] && <span style={styles.errorMsg}>{errors[name]}</span>}
    </div>
);

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useCustomer();
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverMsg, setServerMsg] = useState({ type: '', text: '' });

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ và tên.';
        if (!form.email) e.email = 'Vui lòng nhập Email.';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email không hợp lệ.';
        if (form.phone && !/^[0-9]{10,11}$/.test(form.phone)) e.phone = 'Số điện thoại không hợp lệ (10-11 chữ số).';
        if (!form.address.trim()) e.address = 'Vui lòng nhập địa chỉ.';
        if (!form.password) e.password = 'Vui lòng nhập mật khẩu.';
        else if (form.password.length < 6) e.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
        if (!form.confirmPassword) e.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
        else if (form.password !== form.confirmPassword) e.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        return e;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setServerMsg({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            const res = await axiosClient.post('/Customers/register', {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                address: form.address,
                password: form.password,
            });
            if (res.success) {
                setServerMsg({ type: 'success', text: '🎉 ' + (res.message || 'Đăng ký thành công! Đang chuyển hướng...') });
                // Tự đăng nhập và chuyển về trang chủ sau 1.5 giây
                setTimeout(() => {
                    login({ id: res.customerId, fullName: form.fullName, email: form.email, phone: form.phone, address: form.address });
                    navigate('/');
                }, 1500);
            }
        } catch (err) {
            setServerMsg({ type: 'error', text: err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />
            <div style={styles.blob3} />

            <div style={styles.card}>
                {/* Left decorative panel */}
                <div style={styles.leftPanel}>
                    <div style={styles.brandBadge}>✨ THINHCMS FASHION</div>
                    <h1 style={styles.brandTitle}>Tham gia<br />cộng đồng!</h1>
                    <p style={styles.brandSub}>Đăng ký ngay để nhận những ưu đãi và bộ sưu tập thời trang mới nhất mỗi ngày.</p>
                    <div style={styles.stats}>
                        {[['10K+', 'Thành viên'], ['500+', 'Sản phẩm'], ['4.9★', 'Đánh giá']].map(([num, label], i) => (
                            <div key={i} style={styles.statItem}>
                                <div style={styles.statNum}>{num}</div>
                                <div style={styles.statLabel}>{label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={styles.decorCircle1} />
                    <div style={styles.decorCircle2} />
                </div>

                {/* Right panel — form */}
                <div style={styles.rightPanel}>
                    <div style={styles.formHeader}>
                        <h2 style={styles.formTitle}>Tạo tài khoản</h2>
                        <p style={styles.formSub}>Điền thông tin để bắt đầu mua sắm</p>
                    </div>

                    {serverMsg.text && (
                        <div style={serverMsg.type === 'success' ? styles.alertSuccess : styles.alertError}>
                            <i className={`fas ${serverMsg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: 8 }} />
                            {serverMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <Field name="fullName" label="Họ và tên *" placeholder="Nguyễn Văn A" icon="fa-user" form={form} errors={errors} handleChange={handleChange} />
                        <Field name="email" label="Email *" type="email" placeholder="example@email.com" icon="fa-envelope" form={form} errors={errors} handleChange={handleChange} />
                        <Field name="phone" label="Số điện thoại" placeholder="0901234567" icon="fa-phone" form={form} errors={errors} handleChange={handleChange} />
                        <Field name="address" label="Địa chỉ *" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" icon="fa-map-marker-alt" form={form} errors={errors} handleChange={handleChange} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Field name="password" label="Mật khẩu *" type="password" placeholder="••••••••" icon="fa-lock" form={form} errors={errors} handleChange={handleChange} />
                            <Field name="confirmPassword" label="Xác nhận mật khẩu *" type="password" placeholder="••••••••" icon="fa-shield-alt" form={form} errors={errors} handleChange={handleChange} />
                        </div>

                        <div style={styles.termNote}>
                            Bằng cách đăng ký, bạn đồng ý với <span style={{ color: '#2563eb', cursor: 'pointer' }}>Điều khoản dịch vụ</span> của chúng tôi.
                        </div>

                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading
                                ? <span><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} />Đang xử lý...</span>
                                : <span><i className="fas fa-user-plus" style={{ marginRight: 8 }} />Tạo tài khoản miễn phí</span>
                            }
                        </button>
                    </form>

                    <p style={styles.loginPrompt}>
                        Đã có tài khoản?{' '}
                        <Link to="/login" style={styles.loginLink}>Đăng nhập →</Link>
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
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '20px', position: 'relative', overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    blob1: { position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
    blob2: { position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' },
    blob3: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', pointerEvents: 'none' },
    card: { display: 'flex', width: '100%', maxWidth: '960px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 },
    leftPanel: {
        width: '320px', flexShrink: 0,
        background: 'linear-gradient(135deg, #059669, #0d9488)',
        padding: '50px 36px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', color: '#fff', position: 'relative', overflow: 'hidden',
    },
    brandBadge: { display: 'inline-block', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '24px', width: 'fit-content' },
    brandTitle: { fontSize: '34px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#fff' },
    brandSub: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '32px' },
    stats: { display: 'flex', gap: '20px' },
    statItem: { textAlign: 'center' },
    statNum: { fontSize: '22px', fontWeight: 800, color: '#fff' },
    statLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' },
    decorCircle1: { position: 'absolute', bottom: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' },
    decorCircle2: { position: 'absolute', bottom: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)' },
    rightPanel: { flex: 1, background: '#fff', padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' },
    formHeader: { marginBottom: '22px' },
    formTitle: { fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: 0 },
    formSub: { color: '#64748b', fontSize: '14px', marginTop: '4px' },
    alertSuccess: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    alertError: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    inputGroup: { marginBottom: '14px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' },
    inputWrapper: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px' },
    input: { width: '100%', padding: '11px 12px 11px 36px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' },
    inputError: { borderColor: '#f87171' },
    errorMsg: { color: '#dc2626', fontSize: '11px', marginTop: '3px', display: 'block' },
    termNote: { fontSize: '12px', color: '#94a3b8', marginBottom: '18px', lineHeight: 1.5 },
    submitBtn: {
        width: '100%', padding: '13px',
        background: 'linear-gradient(135deg, #059669, #0d9488)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '14px', fontWeight: 700, cursor: 'pointer',
        letterSpacing: '0.5px',
    },
    loginPrompt: { textAlign: 'center', color: '#64748b', fontSize: '13px', marginTop: '16px' },
    loginLink: { color: '#059669', fontWeight: 700, textDecoration: 'none' },
    homeLink: { display: 'block', textAlign: 'center', marginTop: '12px', color: '#94a3b8', fontSize: '13px', textDecoration: 'none' },
};
