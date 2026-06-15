import axiosClient from '../api/axiosClient';

const blogService = {
    // Hàm lấy tất cả bài viết
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },

    // Hàm lấy chi tiết một bài viết cụ thể
    getPostDetail: (id) => {
        return axiosClient.get(`/Posts/${id}`);
    }
};

export default blogService;