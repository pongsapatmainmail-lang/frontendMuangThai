import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminStats, getRecentOrders, getLowStockProducts, updateOrderStatus } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (!user?.is_staff && !user?.is_admin) {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
            navigate('/');
            return;
        }

        loadDashboardData();
    }, [isAuthenticated, user, navigate]);

    const loadDashboardData = async () => {
        setLoading(true);
        const [statsData, ordersData, lowStockData] = await Promise.all([
            getAdminStats(),
            getRecentOrders(),
            getLowStockProducts()
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData);
        setLowStockProducts(lowStockData);
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            alert('อัพเดทสถานะสำเร็จ');
            loadDashboardData();
        } else {
            alert('เกิดข้อผิดพลาด');
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
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

    const getStatusColor = (status) => {
        const colorMap = {
            'pending': '#ff9800',
            'processing': '#2196f3',
            'shipped': '#4caf50',
            'delivered': '#8bc34a',
            'cancelled': '#f44336'
        };
        return colorMap[status] || '#999';
    };

    if (loading) {
        return <div className="loading">กำลังโหลด Dashboard...</div>;
    }

    if (!stats) {
        return <div className="loading">ไม่สามารถโหลดข้อมูลได้</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>🎛️ Admin Dashboard</h1>
                <button onClick={() => navigate('/admin/notifications')} className="send-notif-btn">
                    📢 ส่งการแจ้งเตือน
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card revenue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>รายได้ทั้งหมด</h3>
                        <p className="stat-value">฿{formatPrice(stats.revenue.total)}</p>
                        <span className="stat-label">เดือนนี้: ฿{formatPrice(stats.revenue.monthly)}</span>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <h3>คำสั่งซื้อทั้งหมด</h3>
                        <p className="stat-value">{stats.orders.total}</p>
                        <span className="stat-label">
                            รอดำเนินการ: {stats.orders.pending} | 
                            สำเร็จ: {stats.orders.completed}
                        </span>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-content">
                        <h3>สินค้าทั้งหมด</h3>
                        <p className="stat-value">{stats.products.total}</p>
                        <span className="stat-label">สต็อกน้อย: {stats.products.low_stock}</span>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>ผู้ใช้ทั้งหมด</h3>
                        <p className="stat-value">{stats.users.total}</p>
                        <span className="stat-label">ใหม่วันนี้: {stats.users.new_today}</span>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-section">
                <h2>คำสั่งซื้อล่าสุด</h2>
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ผู้สั่งซื้อ</th>
                                <th>ยอดรวม</th>
                                <th>สถานะ</th>
                                <th>วันที่</th>
                                <th>จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.user_username}</td>
                                    <td>฿{formatPrice(order.total_price)}</td>
                                    <td>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString('th-TH')}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="pending">รอดำเนินการ</option>
                                            <option value="processing">กำลังดำเนินการ</option>
                                            <option value="shipped">จัดส่งแล้ว</option>
                                            <option value="delivered">ได้รับสินค้าแล้ว</option>
                                            <option value="cancelled">ยกเลิก</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Low Stock Products */}
            {lowStockProducts.length > 0 && (
                <div className="dashboard-section">
                    <h2>⚠️ สินค้าที่เหลือน้อย</h2>
                    <div className="low-stock-grid">
                        {lowStockProducts.map(product => (
                            <div key={product.id} className="low-stock-card">
                                <div className="product-image-small">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} />
                                    ) : (
                                        <div className="no-image-small">ไม่มีรูป</div>
                                    )}
                                </div>
                                <div className="product-info-small">
                                    <h4>{product.name}</h4>
                                    <p className="stock-warning">เหลือ: {product.stock} ชิ้น</p>
                                    <span className="product-price-small">฿{formatPrice(product.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;