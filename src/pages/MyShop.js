import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyShop, getShopProducts, deleteShopProduct } from '../services/api';
import './MyShop.css';

function MyShop() {
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadShopData();
    }, [isAuthenticated, navigate]);

    const loadShopData = async () => {
        setLoading(true);
        const shopData = await getMyShop();

        if (!shopData) {
            navigate('/create-shop');
            return;
        }

        setShop(shopData);
        const productsData = await getShopProducts(shopData.id);
        setProducts(productsData);
        setLoading(false);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('คุณต้องการลบสินค้านี้หรือไม่?')) {
            const result = await deleteShopProduct(productId);
            if (result.success) {
                alert('ลบสินค้าสำเร็จ');
                loadShopData();
            } else {
                alert('เกิดข้อผิดพลาดในการลบสินค้า');
            }
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return <div className="loading">กำลังโหลดข้อมูลร้านค้า...</div>;
    }

    if (!shop) {
        return null;
    }

    return (
        <div className="my-shop-container">
            {/* Shop Header */}
            <div className="shop-header-section">
                {shop.banner && (
                    <div className="shop-banner">
                        <img src={shop.banner} alt="Banner" />
                    </div>
                )}

                <div className="shop-info-section">
                    <div className="shop-logo-large">
                        {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} />
                        ) : (
                            <div className="logo-placeholder">🏪</div>
                        )}
                    </div>

                    <div className="shop-details">
                        <h1>{shop.name}</h1>
                        {shop.description && <p className="shop-desc">{shop.description}</p>}

                        <div className="shop-stats-row">
                            <div className="stat-item">
                                <span className="stat-number">{shop.total_products}</span>
                                <span className="stat-label">สินค้า</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{shop.total_sales}</span>
                                <span className="stat-label">ขายแล้ว</span>
                            </div>
                            {shop.is_verified && (
                                <div className="verified-badge-large">
                                    ✓ ยืนยันแล้ว
                                </div>
                            )}
                        </div>

                        <div className="shop-actions">
                            <button
                                onClick={() => navigate('/my-shop/edit')}
                                className="edit-shop-btn"
                            >
                                ⚙️ แก้ไขร้านค้า
                            </button>
                            <button
                                onClick={() => navigate('/my-shop/add-product')}
                                className="add-product-btn"
                            >
                                ➕ เพิ่มสินค้า
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="shop-products-section">
                <h2>สินค้าของฉัน ({products.length})</h2>

                {products.length === 0 ? (
                    <div className="empty-products-shop">
                        <p>ยังไม่มีสินค้าในร้าน</p>
                        <button
                            onClick={() => navigate('/my-shop/add-product')}
                            className="add-first-product-btn"
                        >
                            เพิ่มสินค้าแรก
                        </button>
                    </div>
                ) : (
                    <div className="products-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>รูปภาพ</th>
                                    <th>ชื่อสินค้า</th>
                                    <th>หมวดหมู่</th>
                                    <th>ราคา</th>
                                    <th>สต็อก</th>
                                    <th>จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="product-image-cell">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <div className="no-image-cell">ไม่มีรูป</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>฿{formatPrice(product.price)}</td>
                                        <td>
                                            <span className={product.stock < 10 ? 'low-stock' : ''}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => navigate(`/my-shop/edit-product/${product.id}`)}
                                                    className="edit-btn-small"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="delete-btn-small"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyShop;