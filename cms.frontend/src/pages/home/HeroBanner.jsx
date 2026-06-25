import React, { useState, useEffect } from 'react';
import bannerService from '../../services/bannerService';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7208';

function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const data = await bannerService.getActiveBanners();
                setBanners(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách banner từ API:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    if (loading) {
        return (
            <div className="container my-4">
                <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ height: '350px' }}>
                    <div className="spinner-border text-info" role="status"></div>
                </div>
            </div>
        );
    }

    // Giao diện khi chưa chạy DB (Màn hình cô gái bán hàng)
    if (banners.length === 0) {
        return (
            <section className="hero-banner-wrapper my-4">
                <div className="container">
                    <div
                        className="position-relative overflow-hidden d-flex align-items-center"
                        style={{
                            height: '440px',
                            backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 35%, rgba(15, 23, 42, 0.2)), url("https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'
                        }}
                    >
                        <div className="text-white p-5 col-lg-6" style={{ zIndex: 2 }}>
                            <span className="badge text-uppercase px-3 py-2 mb-3" style={{ fontSize: '11px', letterSpacing: '2px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', borderRadius: '6px' }}>BỘ SƯU TẬP MỚI 2026</span>
                            <h1 className="display-4 font-weight-bold mb-3" style={{ lineHeight: '1.15', fontSize: '3rem', letterSpacing: '-1px' }}>Thời Trang <br />Thời Thượng</h1>
                            <p className="lead mb-4 text-white-50" style={{ fontSize: '15px', fontWeight: '300', lineHeight: '1.6' }}>Khám phá các thiết kế mới nhất mang phong cách thanh lịch, sang trọng giúp bạn luôn tự tin tỏa sáng mỗi ngày.</p>
                            <a href="/shop" className="btn btn-light btn-lg px-5 font-weight-bold" style={{ borderRadius: '14px', color: '#0f172a', fontSize: '15px', boxShadow: '0 10px 20px rgba(255,255,255,0.1)', transition: '0.3s' }}>Mua Ngay</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="hero-banner-wrapper my-4">
            <div className="container">
                <div
                    className="position-relative overflow-hidden"
                    style={{
                        height: '440px',
                        borderRadius: '24px',
                        backgroundColor: '#000',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}
                >
                    {banners.map((banner, index) => {
                        const isCurrent = index === currentIndex;
                        return (
                            <div
                                key={banner.id}
                                className="w-100 h-100 position-absolute top-0 left-0 d-flex align-items-center"
                                style={{
                                    opacity: isCurrent ? 1 : 0,
                                    visibility: isCurrent ? 'visible' : 'hidden',
                                    transition: 'opacity 0.8s ease-in-out, visibility 0.8s',
                                    backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9) 40%, rgba(0, 0, 0, 0.1) 100%), url("${IMAGE_BASE_URL}${banner.imageUrl}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="text-white p-5 col-lg-6">
                                    <h1 className="font-weight-bold mb-3" style={{ fontSize: '2.8rem', letterSpacing: '-1px', lineHeight: '1.2' }}>
                                        {banner.title}
                                    </h1>
                                    <div 
                                        className="lead mb-4 text-white-50" 
                                        style={{ fontSize: '15px', fontWeight: '300' }}
                                        dangerouslySetInnerHTML={{ __html: banner.description || '' }}
                                    />
                                    <a
                                        href={banner.linkUrl}
                                        className="btn btn-primary btn-lg px-5 font-weight-bold"
                                        style={{
                                            borderRadius: '14px',
                                            backgroundColor: '#38bdf8',
                                            borderColor: '#38bdf8',
                                            color: '#0f172a',
                                            fontSize: '15px',
                                            boxShadow: '0 10px 20px rgba(56,189,248,0.2)',
                                            transition: '0.3s'
                                        }}
                                    >
                                        Khám Phá Ngay
                                    </a>
                                </div>
                            </div>
                        );
                    })}

                    {/* Nút chuyển slide tròn thanh mảnh kiểu tối giản */}
                    {banners.length > 1 && (
                        <>
                            <button
                                className="btn position-absolute text-white border-0 d-flex align-items-center justify-content-center"
                                style={{ top: '50%', left: '25px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)', borderRadius: '50%', width: '40px', height: '40px', transition: '0.3s' }}
                                onClick={handlePrev}
                            >
                                <i className="fas fa-chevron-left" style={{ fontSize: '12px' }}></i>
                            </button>
                            <button
                                className="btn position-absolute text-white border-0 d-flex align-items-center justify-content-center"
                                style={{ top: '50%', right: '25px', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)', borderRadius: '50%', width: '40px', height: '40px', transition: '0.3s' }}
                                onClick={handleNext}
                            >
                                <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
                            </button>

                            {/* Dấu chấm tiến trình dạng thanh ngang dài hiện đại */}
                            <div className="position-absolute d-flex justify-content-center w-100" style={{ bottom: '25px', zIndex: 10 }}>
                                {banners.map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className="mx-1"
                                        style={{
                                            width: currentIndex === index ? '30px' : '6px',
                                            height: '6px',
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            opacity: currentIndex === index ? 1 : 0.4,
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;