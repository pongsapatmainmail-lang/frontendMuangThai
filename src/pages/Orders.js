import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getOrders, cancelOrder } from '../services/api';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [isAuthenticated, navigate]);

    const loadOrders = async () => {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setLoading(false);
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('คุณต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?')) {
            const result = await cancelOrder(orderId);
            if (result.success) {
                alert('ยกเลิกคำสั่งซื้อสำเร็จ');
                loadOrders();
            } else {
                alert(result.error);
            }
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'รอดำเนินการ',
            'processing': 'กำลังดำเนินการ',
            'shipped': 'จัดส่งแล้ว',
            'delivered': 'ได้รับสินค้าแล้ว',
            'cancelled': 'ยกเลิก'
        };
        return statusMap[status] || status;
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status}`;
    };

    if (loading) {
        return <div className="loading">กำลังโหลดคำสั่งซื้อ...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="orders-container">
                <h1>คำสั่งซื้อของฉัน</h1>
                <div className="empty-orders">
                    <p>ยังไม่มีคำสั่งซื้อ</p>
                    <button onClick={() => navigate('/')} className="shop-now-btn">
                        เลือกซื้อสินค้า
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h1>คำสั่งซื้อของฉัน</h1>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div className="order-info">
                                <h3>คำสั่งซื้อ #{order.id}</h3>
                                <span className="order-date">{formatDate(order.created_at)}</span>
                            </div>
                            <span className={getStatusClass(order.status)}>
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <div className="item-image">
                                        {item.product.image ? (
                                            <img src={item.product.image} alt={item.product.name} />
                                        ) : (
                                            <div className="no-image">ไม่มีรูป</div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <h4>{item.product.name}</h4>
                                        <p>฿{formatPrice(item.price)} x {item.quantity}</p>
                                    </div>
                                    <div className="item-total">
                                        ฿{formatPrice(item.total)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="shipping-info">
                                <strong>ที่อยู่จัดส่ง:</strong>
                                <p>{order.shipping_name}</p>
                                <p>{order.shipping_address}</p>
                                <p>โทร: {order.shipping_phone}</p>
                            </div>
                            <div className="order-actions">
                                <div className="order-total">
                                    <span>ยอดรวม:</span>
                                    <span className="total-price">฿{formatPrice(order.total_price)}</span>
                                </div>
                                {order.status === 'pending' && (
                                    <button 
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="cancel-order-btn"
                                    >
                                        ยกเลิกคำสั่งซื้อ
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Orders;