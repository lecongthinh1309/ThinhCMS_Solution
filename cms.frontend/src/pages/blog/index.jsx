import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogSidebar from './BlogSidebar';
import PostCard from '../../components/PostCard';
import Pagination from '../../components/Pagination';
import blogService from '../../services/blogService';

const PAGE_SIZE = 6; // Số bài viết mỗi trang

function Blog() {
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = selectedCategoryId
                    ? await blogService.getPostsByCategory(selectedCategoryId)
                    : await blogService.getAllPosts();
                setAllPosts(data);
                setCurrentPage(1); // Reset trang khi đổi danh mục
            } catch (error) {
                console.error("Lỗi khi tải bài viết trang blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [selectedCategoryId]);

    // Tính phân trang
    const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
    const pagedPosts = allPosts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
    };

    return (
        <div className="blog-page-wrapper">
            <Header />

            {/* Banner đầu trang Tin tức */}
            <div className="blog-banner bg-white border-bottom py-4 mb-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-secondary">Trang Chủ</a></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">Tin Tức / Blog</li>
                        </ol>
                    </nav>
                    <div className="d-flex justify-content-between align-items-end mt-2">
                        <h2 className="font-weight-bold m-0" style={{ color: '#005088' }}>TIN TỨC & MẸO NHÀ BẾP</h2>
                        {!loading && (
                            <span className="text-muted" style={{ fontSize: '13px', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', fontWeight: '500' }}>
                                {allPosts.length} Bài viết
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bố cục chính */}
            <div className="container py-3">
                <div className="row">
                    {/* Cột trái: Danh sách bài viết */}
                    <div className="col-lg-9 col-md-8">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Đang tải danh sách bài viết...</p>
                            </div>
                        ) : allPosts.length === 0 ? (
                            <div className="text-center py-5 bg-white shadow-sm rounded-lg" style={{ borderRadius: '15px' }}>
                                <i className="far fa-newspaper fa-3x text-muted mb-3"></i>
                                <h4 className="text-secondary font-weight-bold">Không Có Bài Viết Nào</h4>
                                <p className="text-muted">Chưa có bài viết nào được đăng tải trong chuyên mục này.</p>
                            </div>
                        ) : (
                            <>
                                <div className="row">
                                    {pagedPosts.map((post) => (
                                        <div className="col-md-6 mb-4" key={post.id}>
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>

                                {/* Phân trang */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={allPosts.length}
                                    itemLabel="bài viết"
                                />
                            </>
                        )}
                    </div>

                    {/* Cột phải: Sidebar lọc chuyên mục */}
                    <div className="col-lg-3 col-md-4">
                        <BlogSidebar
                            activeCategoryId={selectedCategoryId}
                            onCategoryClick={handleCategoryClick}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Blog;
