import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShops } from '../services/api';
import './ShopList.css';

function ShopList() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadShops();
    }, []);

    const loadShops = async () => {
        setLoading(true);
        const data = await getShops();
        setShops(data);
        setLoading(false);
    };

    if (loading) {
        return <div className="loading">กำลังโหลดร้านค้า...</div>;
    }

    return (
        <div className="shop-list-container">
            <div className="shop-list-header">
                <h1>🏪 ร้านค้าทั้งหมด</h1>
                <p>เลือกร้านค้าที่คุณสนใจ</p>
            </div>

            {shops.length === 0 ? (
                <div className="empty-shops">
                    <p>ยังไม่มีร้านค้าในระบบ</p>
                </div>
            ) : (
                <div className="shops-grid">
                    {shops.map(shop => (
                        <div
                            key={shop.id}
                            className="shop-card"
                            onClick={() => navigate(`/shop/${shop.id}`)}
                        >
                            {shop.logo ? (
                                <div className="shop-logo">
                                    <img src={shop.logo} alt={shop.name} />
                                </div>
                            ) : (
                                <div className="shop-logo-placeholder">
                                    🏪
                                </div>
                            )}

                            <div className="shop-info">
                                <h3>{shop.name}</h3>
                                {shop.description && (
                                    <p className="shop-description">{shop.description}</p>
                                )}
                                <div className="shop-stats">
                                    <span>📦 {shop.total_products} สินค้า</span>
                                    <span>✓ {shop.total_sales} ขายแล้ว</span>
                                </div>
                                {shop.is_verified && (
                                    <span className="verified-badge">✓ ยืนยันแล้ว</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ShopList;