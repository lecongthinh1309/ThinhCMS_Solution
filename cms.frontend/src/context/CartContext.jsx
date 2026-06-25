import React, { createContext, useState, useEffect, useRef } from 'react';
import { useCustomer } from './CustomerContext';

// Giá trị mặc định đảm bảo không crash khi component render ngoài CartProvider
export const CartContext = createContext({
    cartItems: [],
    addToCart: () => false,
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    totalItems: 0,
    totalPrice: 0
});

export const CartProvider = ({ children }) => {
    const { isLoggedIn, customer } = useCustomer();

    // Helper: tạo key lưu giỏ hàng riêng cho từng tài khoản
    const getCartKey = (cust) => cust ? `thinhcms_cart_${cust.id}` : null;

    // Cờ: khi đang load giỏ hàng (đăng nhập/đăng xuất) thì tạm thời không lưu
    // để tránh race condition ghi đè [] lên dữ liệu cũ trong localStorage
    const isLoadingRef = useRef(false);

    // Lấy giỏ hàng từ LocalStorage của tài khoản hiện tại khi app khởi động
    const [cartItems, setCartItems] = useState(() => {
        try {
            const key = getCartKey(customer);
            if (!key) return [];
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Lưu vào localStorage mỗi khi giỏ hàng thay đổi
    // NHƯNG bỏ qua nếu đang trong quá trình load (đăng nhập/đăng xuất)
    useEffect(() => {
        if (isLoadingRef.current) {
            isLoadingRef.current = false; // Reset cờ sau khi bỏ qua 1 lần
            return;
        }
        const key = getCartKey(customer);
        if (key) {
            localStorage.setItem(key, JSON.stringify(cartItems));
        }
    }, [cartItems]);

    // Khi đăng nhập: tải giỏ hàng của tài khoản đó từ localStorage
    // Khi đăng xuất: xóa state (GIỮ NGUYÊN localStorage để đăng nhập lại vẫn còn)
    useEffect(() => {
        isLoadingRef.current = true; // Bật cờ: sắp thay đổi state do load, không phải do user
        if (isLoggedIn && customer) {
            const key = getCartKey(customer);
            try {
                const saved = localStorage.getItem(key);
                setCartItems(saved ? JSON.parse(saved) : []);
            } catch {
                setCartItems([]);
            }
        } else {
            setCartItems([]); // Đăng xuất: xóa state, không xóa localStorage
        }
    }, [isLoggedIn, customer?.id]);

    // Thêm sản phẩm vào giỏ
    const addToCart = (product, quantity = 1) => {
        if (!isLoggedIn) {
            alert("Vui lòng đăng nhập hoặc đăng ký để thêm sản phẩm vào giỏ hàng!");
            return false;
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Nếu sản phẩm đã có trong giỏ, tăng số lượng nhưng không được vượt quá tồn kho (StockQuantity)
                const newQuantity = existingItem.quantity + quantity;
                const stockLimit = product.stockQuantity || product.quantity || 999;
                
                if (newQuantity > stockLimit) {
                    alert("Số lượng sản phẩm trong kho không đủ!");
                    return prevItems;
                }
                
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            } else {
                // Thêm sản phẩm mới
                return [...prevItems, { ...product, quantity }];
            }
        });
        return true;
    };

    // Xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Cập nhật số lượng của một sản phẩm
    const updateQuantity = (productId, amount) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === productId) {
                const stockLimit = item.stockQuantity || 999;
                const newQuantity = item.quantity + amount;
                
                if (newQuantity > stockLimit) {
                    alert("Số lượng sản phẩm trong kho không đủ!");
                    return item;
                }
                if (newQuantity < 1) {
                    return item; // Không cho giảm xuống dưới 1 (dùng nút xóa để xóa)
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính tổng số lượng (Badge)
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
