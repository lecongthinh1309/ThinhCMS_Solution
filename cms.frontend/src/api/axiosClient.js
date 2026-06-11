import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7208/api', // 🌟 Đổi số port này khớp với Backend ASP.NET Core của em
    headers: {
        'Content-Type': 'application/json',
    },
});

// Bộ lọc trung gian để tự động bóc tách tầng dữ liệu khi phản hồi
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        console.error("Lỗi kết nối trục API:", error);
        return Promise.reject(error);
    }
);

export default axiosClient;