import axiosClient from '../api/axiosClient';

const productService = {
    // 1. Hàm lấy toàn bộ danh sách sản phẩm
    getAllProducts: () => {
        return axiosClient.get('/Products');
    },

    // 2. Hàm lọc sản phẩm theo mã danh mục
    getProductsByCategory: (categoryId) => {
        return axiosClient.get(`/Products/categoryproduct/${categoryId}`);
    },

    // 3. Hàm lấy dữ liệu chi tiết của 1 sản phẩm (Bắt buộc phải có để hết lỗi)
    getProductDetail: (id) => {
        return axiosClient.get(`/Products/${id}`);
    }
};

export default productService;