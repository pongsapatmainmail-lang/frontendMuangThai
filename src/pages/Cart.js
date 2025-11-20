import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            alert('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <h1>ตะกร้าสินค้า</h1>
                <div className="empty-cart">
                    <p>ไม่มีสินค้าในตะกร้า</p>
                    <a href="/" className="continue-shopping">เลือกซื้อสินค้าต่อ</a>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>ตะกร้าสินค้า ({cartItems.length} รายการ)</h1>
            
            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-image">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} />
                                ) : (
                                    <div className="no-image">ไม่มีรูป</div>
                                )}
                            </div>
                            
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-category">{item.category}</p>
                                <p className="item-price">฿{formatPrice(item.price)}</p>
                            </div>
                            
                            <div className="item-quantity">
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="qty-btn"
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    min="1"
                                    max={item.stock}
                                />
                                <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="qty-btn"
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>
                            </div>
                            
                            <div className="item-total">
                                ฿{formatPrice(item.price * item.quantity)}
                            </div>
                            
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="remove-btn"
                            >
                                ลบ
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="cart-summary">
                    <h2>สรุปคำสั่งซื้อ</h2>
                    <div className="summary-row">
                        <span>ยอดรวม:</span>
                        <span className="total-price">฿{formatPrice(getCartTotal())}</span>
                    </div>
                    <button onClick={handleCheckout} className="checkout-btn">
                        ดำเนินการชำระเงิน
                    </button>
                    <button onClick={clearCart} className="clear-cart-btn">ล้างตะกร้า</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;