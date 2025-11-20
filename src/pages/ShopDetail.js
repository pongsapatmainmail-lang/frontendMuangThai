import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopById, getShopProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ShopDetail.css';

function ShopDetail() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadShopDetail();
    }, [id]);

    const loadShopDetail = async () => {
        setLoading(true);
        const [shopData, productsData] = await Promise.all([
            getShopById(id),
            getShopProducts(id)
        ]);

        if (shopData) {
            setShop(shopData);
            setProducts(productsData);
        } else {
            alert('ไม่พบร้านค้า');
            navigate('/shops');
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="loading">กำลังโหลดข้อมูลร้านค้า...</div>;
    }

    if (!shop) {
        return null;
    }

    return (
        <div className="shop-detail-container">
            {/* Shop Header */}
            <div className="shop-detail-header">
                <button onClick={() => navigate('/shops')} className="back-button">
                    ← กลับ
                </button>

                {shop.banner && (
                    <div className="shop-banner-detail">
                        <img src={shop.banner} alt="Banner" />
                    </div>
                )}

                <div className="shop-info-detail">
                    <div className="shop-logo-detail">
                        {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} />
                        ) : (
                            <div className="logo-placeholder-detail">🏪</div>
                        )}
                    </div>

                    <div className="shop-text-info">
                        <h1>{shop.name}</h1>
                        {shop.description && <p>{shop.description}</p>}

                        <div className="shop-meta">
                            <div className="meta-item">
                                <span className="meta-icon">📦</span>
                                <span>{shop.total_products} สินค้า</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-icon">✓</span>
                                <span>{shop.total_sales} ขายแล้ว</span>
                            </div>
                            {shop.is_verified && (
                                <div className="verified-badge-detail">
                                    ✓ ยืนยันแล้ว
                                </div>
                            )}
                        </div>

                        {(shop.phone || shop.email) && (
                            <div className="shop-contact">
                                {shop.phone && (
                                    <div className="contact-item">
                                        <span className="contact-icon">📞</span>
                                        <span>{shop.phone}</span>
                                    </div>
                                )}
                                {shop.email && (
                                    <div className="contact-item">
                                        <span className="contact-icon">✉️</span>
                                        <span>{shop.email}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="shop-products-detail">
                <h2>สินค้าทั้งหมด ({products.length})</h2>

                {products.length === 0 ? (
                    <div className="empty-shop-products">
                        <p>ร้านนี้ยังไม่มีสินค้า</p>
                    </div>
                ) : (
                    <div className="products-grid-detail">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShopDetail;