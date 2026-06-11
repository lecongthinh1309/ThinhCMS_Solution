import React, { useState } from 'react';

const PostList = () => {
    const [posts] = useState([
        { id: 1, title: "Phong cách áo đầm đẹp dẫn đầu xu hướng", date: "2026-06-11", desc: "Khám phá bí quyết lựa chọn trang phục phù hợp với vóc dáng để luôn tự tin tỏa sáng tại mọi bữa tiệc...", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500" },
        { id: 2, title: "Tips chọn váy trắng 'hack dáng' từ A đến Z cho quý cô", date: "2026-06-10", desc: "Khám phá bí quyết lựa chọn trang phục phù hợp với vóc dáng để luôn tự tin tỏa sáng nơi công sở năng động...", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500" },
        { id: 3, title: "Top 7 kiểu áo sơ mi sang chảnh tôn dáng quý cô 2026", date: "2026-06-05", desc: "Cập nhật ngay những mẹo phối đồ và tin tức phong cách mới nhất cùng hệ thống thời trang ThaiCUS...", imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500" }
    ]);

    return (
        <div className="mt-5 pt-4 border-top">
            <h3 className="blog-section-title text-uppercase text-dark">Xu hướng thời trang</h3>
            <p className="text-muted small mt-n2 mb-4">Cập nhật những mẹo phối đồ và tin tức phong cách mới nhất cùng ThaiCUS</p>

            <div className="row">
                {posts.map((post) => (
                    <div className="col-md-4 mb-4" key={post.id}>
                        <div className="card blog-premium-card h-100">
                            <img src={post.imageUrl} className="card-img-top" alt={post.title} style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '14px', borderTopRightRadius: '14px' }} />
                            <div className="card-body p-3">
                                <span className="text-muted small d-block mb-1">
                                    <i className="fa-regular fa-calendar mr-1"></i> {new Date(post.date).toLocaleDateString('vi-VN')}
                                </span>
                                <h6 className="font-weight-bold text-dark mb-2">{post.title}</h6>
                                <p className="text-secondary small card-text-truncate mb-3">{post.desc}</p>
                                <a href={`/blog/${post.id}`} className="blog-link">
                                    Đọc bài viết <i className="fa-solid fa-arrow-right-long ml-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;