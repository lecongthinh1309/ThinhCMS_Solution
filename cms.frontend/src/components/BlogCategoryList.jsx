import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
    // Kho lưu trữ danh sách chuyên mục bài viết
    const [blogCategories, setBlogCategories] = useState([]);
    // Trạng thái chờ tải dữ liệu (Loading)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogCategories = async () => {
            try {
                setLoading(true);
                // Gọi API lấy dữ liệu từ Backend
                const data = await blogService.getBlogCategories();
                setBlogCategories(data);
            } catch (error) {
                console.error("Lỗi hệ thống khi gọi API chuyên mục tin tức:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogCategories();
    }, []); // Mảng rỗng [] cực kỳ quan trọng giúp API chỉ gọi 1 lần khi mở trang!

    // Hiển thị tạm thời lúc đang đợi cục mạng tải dữ liệu
    if (loading) {
        return <div className="text-center my-3 text-muted small">Đang nạp các chuyên mục bài viết...</div>;
    }

    return (
        <div className="card shadow-sm p-3 mt-4 bg-white rounded">
            <h5 className="card-title text-uppercase font-weight-bold text-secondary">
                <i className="fa-solid fa-tags mr-2 text-info"></i> Chủ đề bài viết
            </h5>

            <div className="list-group list-group-flush mt-2">
                {blogCategories.length === 0 ? (
                    <p className="text-muted small pl-2">Chưa có chủ đề tin tức nào.</p>
                ) : (
                    blogCategories.map((cate) => (
                        <a
                            key={cate.id}
                            href={`/blog/category/${cate.id}`}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 px-1 text-dark text-decoration-none small"
                        >
                            <span><i className="fa-regular fa-hashtag mr-2 text-muted"></i>{cate.name}</span>
                            <span className="badge badge-light border text-muted">Read</span>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogCategoryList;