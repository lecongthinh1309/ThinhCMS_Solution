import axiosClient from '../api/axiosClient';

const categoryProductService = {
    // Gọi tới Endpoint: https://localhost:7208/api/CategoryProducts
    getAll: () => {
        const url = '/CategoryProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;