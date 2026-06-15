import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển trang chi tiết
import blogService from '../services/blogService';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Khai báo hook điều hướng

    // Định nghĩa Port Backend để load ảnh bài viết
    const BASE_URL = 'https://localhost:7208';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi lấy bài viết thật từ CSDL:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return <div className="text-center my-4 text-muted small">Đang kết nối SQL Server để tải tin tức...</div>;
    }

    return (
        <div className="mt-5 pt-4 border-top">
            <h3 className="blog-section-title text-uppercase text-dark">Xu hướng thời trang</h3>
            <p className="text-muted small mt-n2 mb-4">Cập nhật những mẹo phối đồ và tin tức phong cách mới nhất cùng ThaiCUS</p>

            <div className="row">
                {posts.length === 0 ? (
                    <div className="col-12 text-center text-muted small">Chưa có bài viết nào trong hệ thống.</div>
                ) : (
                    posts.map((post) => (
                        <div className="col-md-4 mb-4" key={post.id}>
                            <div className="card blog-premium-card h-100">
                                {/* Tự động nối domain vào ảnh bài viết */}
                                <img
                                    src={post.imageUrl ? `${BASE_URL}${post.imageUrl}` : 'https://via.placeholder.com/500x350?text=No+Image'}
                                    className="card-img-top"
                                    alt={post.title}
                                    style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '14px', borderTopRightRadius: '14px' }}
                                />
                                <div className="card-body p-3">
                                    <span className="text-muted small d-block mb-1">
                                        <i className="fa-regular fa-calendar mr-1"></i>
                                        {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                                    </span>
                                    <h6 className="font-weight-bold text-dark mb-2">{post.title}</h6>
                                    <p className="text-secondary small mb-3">{post.shortDescription || post.content || 'Chưa có mô tả.'}</p>

                                    {/* ĐÃ SỬA: Thay <a> bằng button gọi navigate để nhảy sang trang chi tiết bài viết */}
                                    <button
                                        className="btn btn-link blog-link p-0 border-0 align-baseline font-weight-bold"
                                        onClick={() => navigate(`/blog/${post.id}`)}
                                        style={{ textDecoration: 'none', color: '#b45309' }}
                                    >
                                        Đọc bài viết <i className="fa-solid fa-arrow-right-long ml-1"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PostList;