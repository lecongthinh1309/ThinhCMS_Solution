import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';

const PostDetail = () => {
    const { id } = useParams(); // Lấy ID bài viết từ URL trình duyệt
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Port Backend C# của em để hiển thị ảnh
    const BASE_URL = 'https://localhost:7208';

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                setLoading(true);
                // Gọi API lấy chi tiết 1 bài viết theo ID
                const data = await blogService.getPostDetail(id);
                setPost(data);
            } catch (error) {
                console.error("Lỗi lấy chi tiết bài viết từ SQL Server:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetail();
    }, [id]);

    if (loading) {
        return <div className="text-center my-5 py-5 text-muted">Đang tải nội dung bài viết từ CSDL...</div>;
    }

    if (!post) {
        return <div className="text-center my-5 py-5 text-danger">Không tìm thấy bài viết này trong hệ thống!</div>;
    }

    return (
        <div className="container my-5">
            {/* Nút quay lại trang chủ */}
            <button className="btn btn-outline-dark mb-4 btn-sm" onClick={() => navigate('/')}>
                <i className="fa-solid fa-arrow-left mr-1"></i> Quay lại danh sách tin tức
            </button>

            {/* Khối hiển thị nội dung chi tiết bài viết */}
            <div className="bg-white p-4 p-md-5 rounded shadow-sm border m-auto" style={{ maxWidth: '800px' }}>
                <div className="text-muted small d-flex align-items-center mb-2">
                    <i className="fa-regular fa-calendar mr-1"></i>
                    Ngày đăng: {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                </div>

                {/* Tiêu đề bài viết lấy từ DB */}
                <h1 className="font-weight-bold text-dark mb-4" style={{ fontSize: '2.2rem' }}>
                    {post.title}
                </h1>

                <hr className="my-4" />

                {/* Hình ảnh minh họa của bài viết */}
                {post.imageUrl && (
                    <div className="text-center my-4">
                        <img
                            src={`${BASE_URL}${post.imageUrl}`}
                            alt={post.title}
                            className="w-100 rounded shadow-sm object-fit-cover"
                            style={{ maxHeight: '400px', borderRadius: '12px' }}
                        />
                    </div>
                )}

                {/* Nội dung chi tiết bài viết */}
                <div
                    className="blog-main-content text-dark mt-4"
                    style={{ lineHeight: '1.9', fontSize: '1.1rem', textAlign: 'justify' }}
                >
                    {post.content || 'Nội dung chi tiết của bài viết đang được ban quản trị ThaiCMS cập nhật thêm thông tin...'}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;