import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * CustomerContext — Quản lý trạng thái đăng nhập của Khách hàng (Customer)
 * Phân biệt rõ với User (Admin) đăng nhập qua Cookie MVC.
 */

const CustomerContext = createContext({
    customer: null,
    login: () => {},
    logout: () => {},
    isLoggedIn: false,
});

// Helper: đọc/ghi localStorage
const getStoredCustomer = () => {
    try {
        const raw = localStorage.getItem('thinhcms_customer');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export function CustomerProvider({ children }) {
    const [customer, setCustomer] = useState(getStoredCustomer);

    const login = useCallback((customerData) => {
        localStorage.setItem('thinhcms_customer', JSON.stringify(customerData));
        setCustomer(customerData);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('thinhcms_customer');
        localStorage.removeItem('thinhcms_cart'); // Xóa giỏ hàng khi đăng xuất
        setCustomer(null);
    }, []);

    const isLoggedIn = Boolean(customer);

    return (
        <CustomerContext.Provider value={{ customer, login, logout, isLoggedIn }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomer() {
    return useContext(CustomerContext);
}

export default CustomerContext;
