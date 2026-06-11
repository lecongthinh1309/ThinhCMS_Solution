import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết (Phần bài chung em đã làm)
    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    },

    // 2. THÊM MỚI BƯỚC NÀY: Hàm lấy danh sách Chuyên mục tin tức
    getBlogCategories: () => {
        const url = '/Categories'; // Endpoint này gọi sang CategoriesController của Backend
        return axiosClient.get(url);
    }
};

export default blogService;