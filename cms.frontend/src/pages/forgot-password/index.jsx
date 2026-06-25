import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const STEPS = { INPUT: 'input', LOADING: 'loading', SUCCESS: 'success' };

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [step, setStep] = useState(STEPS.INPUT);
    const [serverError, setServerError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) { setEmailError('Vui lòng nhập địa chỉ Email.'); return; }
        if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Địa chỉ Email không hợp lệ.'); return; }

        setStep(STEPS.LOADING);
        setServerError('');
        try {
            await axiosClient.post('/Customers/forgot-password', { email });
            setStep(STEPS.SUCCESS);
        } catch {
            setStep(STEPS.INPUT);
            setServerError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.card}>
                {/* Icon header */}
                <div style={styles.iconWrapper}>
                    <div style={styles.iconCircle}>
                        <i className={`fas ${step === STEPS.SUCCESS ? 'fa-check' : 'fa-key'}`} style={{ fontSize: 28, color: '#fff' }} />
                    </div>
                </div>

                {step === STEPS.SUCCESS ? (
                    /* Success state */
                    <div style={styles.successBlock}>
                        <h2 style={styles.title}>Kiểm tra hộp thư!</h2>
                        <p style={styles.desc}>
                            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến<br />
                            <strong style={{ color: '#2563eb' }}>{email}</strong>
                        </p>
                        <div style={styles.infoBox}>
                            <i className="fas fa-info-circle" style={{ color: '#2563eb', marginRight: 8 }} />
                            Nếu không thấy email, hãy kiểm tra thư mục <strong>Spam / Junk</strong>.
                        </div>
                        <button onClick={() => navigate('/login')} style={styles.primaryBtn}>
                            <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }} />
                            Đến trang Đăng nhập
                        </button>
                        <button onClick={() => { setStep(STEPS.INPUT); setEmail(''); }} style={styles.ghostBtn}>
                            Thử email khác
                        </button>
                    </div>
                ) : (
                    /* Input state */
                    <div>
                        <h2 style={styles.title}>Quên mật khẩu?</h2>
                        <p style={styles.desc}>
                            Không sao! Nhập địa chỉ email đăng ký của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu ngay.
                        </p>

                        {serverError && (
                            <div style={styles.alertError}>
                                <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />{serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Địa chỉ Email</label>
                                <div style={styles.inputWrapper}>
                                    <i className="fas fa-envelope" style={styles.inputIcon} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                                        placeholder="example@email.com"
                                        style={{ ...styles.input, ...(emailError ? styles.inputError : {}) }}
                                        disabled={step === STEPS.LOADING}
                                    />
                                </div>
                                {emailError && <span style={styles.errorMsg}>{emailError}</span>}
                            </div>

                            <button type="submit" disabled={step === STEPS.LOADING} style={styles.primaryBtn}>
                                {step === STEPS.LOADING
                                    ? <span><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }} />Đang gửi...</span>
                                    : <span><i className="fas fa-paper-plane" style={{ marginRight: 8 }} />Gửi email đặt lại mật khẩu</span>
                                }
                            </button>
                        </form>

                        <div style={styles.linksRow}>
                            <Link to="/login" style={styles.backLink}>
                                <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />Quay lại đăng nhập
                            </Link>
                            <Link to="/register" style={styles.registerLink}>Tạo tài khoản mới →</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
        padding: '20px', position: 'relative', overflow: 'hidden',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    blob1: { position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
    blob2: { position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
    card: {
        width: '100%', maxWidth: '460px',
        background: '#fff', borderRadius: '24px',
        padding: '50px 44px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1,
        fontFamily: 'inherit',
    },
    iconWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '28px' },
    iconCircle: {
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
    },
    title: { fontSize: '26px', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 10px' },
    desc: { fontSize: '14px', color: '#64748b', textAlign: 'center', lineHeight: 1.7, marginBottom: '24px' },
    alertError: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '16px' },
    inputGroup: { marginBottom: '18px' },
    label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' },
    inputWrapper: { position: 'relative' },
    inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px' },
    input: { width: '100%', padding: '13px 14px 13px 42px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
    inputError: { borderColor: '#f87171' },
    errorMsg: { color: '#dc2626', fontSize: '12px', marginTop: '4px', display: 'block' },
    primaryBtn: {
        width: '100%', padding: '14px',
        background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '15px', fontWeight: 700, cursor: 'pointer',
        marginBottom: '12px', letterSpacing: '0.4px',
    },
    ghostBtn: {
        width: '100%', padding: '12px',
        background: 'transparent', color: '#64748b',
        border: '2px solid #e5e7eb', borderRadius: '10px',
        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
    },
    infoBox: {
        background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
        padding: '12px 16px', borderRadius: '10px', fontSize: '13px',
        marginBottom: '24px', lineHeight: 1.6,
    },
    successBlock: { textAlign: 'center' },
    linksRow: { display: 'flex', justifyContent: 'space-between', marginTop: '16px' },
    backLink: { color: '#64748b', fontSize: '13px', textDecoration: 'none', fontWeight: 600 },
    registerLink: { color: '#2563eb', fontSize: '13px', textDecoration: 'none', fontWeight: 600 },
};
