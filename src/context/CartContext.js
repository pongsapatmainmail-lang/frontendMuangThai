import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    // ฟังก์ชันโหลดตะกร้าจาก localStorage
    const loadCart = () => {
        try {
            const savedCart = window.localStorage.getItem('shopee_cart');
            if (savedCart) {
                return JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
        return [];
    };

    const [cartItems, setCartItems] = useState(loadCart);

    // บันทึกตะกร้าลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
    useEffect(() => {
        try {
            window.localStorage.setItem('shopee_cart', JSON.stringify(cartItems));
            console.log('Cart saved:', cartItems); // Debug
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }, [cartItems]);

    // เพิ่มสินค้าลงตะกร้า
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                // ถ้ามีสินค้าอยู่แล้ว เพิ่มจำนวน
                const updated = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                console.log('Updated cart:', updated); // Debug
                return updated;
            } else {
                // ถ้ายังไม่มี เพิ่มสินค้าใหม่
                const updated = [...prevItems, { ...product, quantity: 1 }];
                console.log('Added to cart:', updated); // Debug
                return updated;
            }
        });
    };

    // ลบสินค้าออกจากตะกร้า
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const updated = prevItems.filter(item => item.id !== productId);
            console.log('Removed from cart:', updated); // Debug
            return updated;
        });
    };

    // อัพเดทจำนวนสินค้า
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems => {
            const updated = prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: quantity }
                    : item
            );
            console.log('Quantity updated:', updated); // Debug
            return updated;
        });
    };

    // ล้างตะกร้า
    const clearCart = () => {
        setCartItems([]);
        console.log('Cart cleared'); // Debug
    };

    // คำนวณยอดรวม
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
    };

    // นับจำนวนสินค้าทั้งหมด
    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};