import axiosClient from '../api/axiosClient';

const categoryProductService = {
    getAllCategoryProducts: () => {
        
        const url = '/categoriesproducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;