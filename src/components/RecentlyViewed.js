import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewHistory } from '../context/ViewHistoryContext';
import './RecentlyViewed.css';

function RecentlyViewed() {
    const { getRecentViews, isLoaded } = useViewHistory();
    const navigate = useNavigate();
    const recentProducts = getRecentViews(5);

    // รอให้โหลดเสร็จก่อน
    if (!isLoaded) {
        return null;
    }

    if (recentProducts.length === 0) {
        return null;
    }

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="recently-viewed">
            <div className="recently-viewed-header">
                <h2>เคยดูแล้ว</h2>
                <button 
                    onClick={() => navigate('/history')}
                    className="view-all-btn"
                >
                    ดูทั้งหมด →
                </button>
            </div>

            <div className="recently-viewed-grid">
                {recentProducts.map(product => (
                    <div 
                        key={product.id}
                        className="recent-product-card"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <div className="recent-product-image">
                            {product.image ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <div className="no-image-small">ไม่มีรูป</div>
                            )}
                        </div>
                        <div className="recent-product-info">
                            <h4>{product.name}</h4>
                            <p className="recent-product-price">
                                ฿{formatPrice(product.price)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyViewed;