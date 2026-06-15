import axios from 'axios';

const axiosClient = axios.create({
    // Thay đổi số port 7001 cho đúng với port IIS Express/Kestrel Backend của em
    baseURL: 'https://localhost:7208/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        console.error("Lỗi trục kết nối API:", error);
        return Promise.reject(error);
    }
);

export default axiosClient;