import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách quần áo, váy dạ hội
    getAllProducts: () => {
        const url = '/Products'; // ⚠️ Đảm bảo Backend có ProductsController tương ứng
        return axiosClient.get(url);
    }
};

export default productService;