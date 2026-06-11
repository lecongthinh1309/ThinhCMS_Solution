import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Giả lập dữ liệu nếu API chưa bật, nếu có API sẽ tự động đè lên
                const mockData = [
                    { id: null, name: "TẤT CẢ SẢN PHẨM" },
                    { id: 1, name: "TRANG PHỤC MẶC Ở NHÀ" },
                    { id: 2, name: "VEST & ÂU PHỤC NAM" },
                    { id: 3, name: "ĐẦM DẠ HỘI QUÝ PHÁI" },
                    { id: 4, name: "THỜI TRANG CÔNG SỞ NỮ" }
                ];
                setCategories(mockData);

                const data = await categoryProductService.getAll();
                if (data && data.length > 0) {
                    setCategories([{ id: null, name: "TẤT CẢ SẢN PHẨM" }, ...data]);
                }
            } catch (error) {
                console.log("Sử dụng dữ liệu cấu trúc mẫu cho danh mục.");
            }
        };
        fetchCategories();
    }, []);

    const handleTabClick = (id) => {
        setActiveId(id);
        if (onSelectCategory) onSelectCategory(id);
    };

    return (
        <div className="category-tabs-container">
            {categories.map((item) => (
                <button
                    key={item.id ?? 'all'}
                    className={`tab-item-btn ${activeId === item.id ? 'active' : ''}`}
                    onClick={() => handleTabClick(item.id)}
                >
                    {item.name.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default CategoryProductList;