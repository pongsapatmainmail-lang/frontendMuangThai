import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import './Checkout.css';

function Checkout() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        shipping_name: user?.first_name && user?.last_name 
            ? `${user.first_name} ${user.last_name}` 
            : '',
        shipping_address: user?.address || '',
        shipping_phone: user?.phone || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ถ้ายังไม่ล็อกอิน ให้ไปหน้า login
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    // ถ้าตะกร้าว่าง ให้กลับไปหน้าแรก
    if (cartItems.length === 0) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // เตรียมข้อมูลสินค้า
        const items = cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity
        }));

        const orderData = {
            ...formData,
            items: items
        };

        const result = await createOrder(orderData);

        if (result.success) {
            clearCart();
            alert('สั่งซื้อสำเร็จ! คำสั่งซื้อของคุณอยู่ระหว่างดำเนินการ');
            navigate('/orders');
        } else {
            if (typeof result.error === 'object') {
                const errorMessages = Object.entries(result.error)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                setError(errorMessages);
            } else {
                setError(result.error);
            }
        }

        setLoading(false);
    };

    return (
        <div className="checkout-container">
            <h1>ชำระเงิน</h1>

            <div className="checkout-content">
                <div className="checkout-form">
                    <h2>ข้อมูลการจัดส่ง</h2>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>ชื่อผู้รับ *</label>
                            <input
                                type="text"
                                name="shipping_name"
                                value={formData.shipping_name}
                                onChange={handleChange}
                                required
                                placeholder="กรอกชื่อผู้รับ"
                            />
                        </div>

                        <div className="form-group">
                            <label>ที่อยู่จัดส่ง *</label>
                            <textarea
                                name="shipping_address"
                                value={formData.shipping_address}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="กรอกที่อยู่จัดส่ง"
                            />
                        </div>

                        <div className="form-group">
                            <label>เบอร์โทรศัพท์ *</label>
                            <input
                                type="tel"
                                name="shipping_phone"
                                value={formData.shipping_phone}
                                onChange={handleChange}
                                required
                                placeholder="กรอกเบอร์โทรศัพท์"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-order-btn"
                            disabled={loading}
                        >
                            {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                        </button>
                    </form>
                </div>

                <div className="order-summary">
                    <h2>สรุปคำสั่งซื้อ</h2>

                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="summary-item">
                                <div className="item-info">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">x{item.quantity}</span>
                                </div>
                                <span className="item-price">
                                    ฿{formatPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-total">
                        <span>ยอดรวมทั้งหมด:</span>
                        <span className="total-amount">฿{formatPrice(getCartTotal())}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;