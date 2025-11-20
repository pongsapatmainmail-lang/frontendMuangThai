import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewHistory } from '../context/ViewHistoryContext';
import { useCart } from '../context/CartContext';
import './ViewHistory.css';

function ViewHistory() {
    const { viewHistory, removeFromHistory, clearHistory, isLoaded } = useViewHistory();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'เมื่อสักครู่';
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product);
        alert(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`);
    };

    const handleRemove = (e, productId) => {
        e.stopPropagation();
        if (window.confirm('ต้องการลบสินค้านี้ออกจากประวัติการดูหรือไม่?')) {
            removeFromHistory(productId);
        }
    };

    const handleClearAll = () => {
        if (window.confirm('ต้องการล้างประวัติการดูทั้งหมดหรือไม่?')) {
            clearHistory();
        }
    };

    // แสดง Loading ขณะโหลด
    if (!isLoaded) {
        return <div className="loading">กำลังโหลดประวัติ...</div>;
    }

    if (viewHistory.length === 0) {
        return (
            <div className="view-history-container">
                <div className="history-header">
                    <h1>ประวัติการดูสินค้า</h1>
                </div>
                <div className="empty-history">
                    <div className="empty-icon">👀</div>
                    <p>ยังไม่มีประวัติการดูสินค้า</p>
                    <button onClick={() => navigate('/')} className="browse-btn">
                        เลือกดูสินค้า
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-history-container">
            <div className="history-header">
                <div>
                    <h1>ประวัติการดูสินค้า</h1>
                    <p className="history-count">ทั้งหมด {viewHistory.length} รายการ</p>
                </div>
                <button onClick={handleClearAll} className="clear-all-btn">
                    ล้างทั้งหมด
                </button>
            </div>

            <div className="history-grid">
                {viewHistory.map(product => (
                    <div 
                        key={product.id} 
                        className="history-card"
                        onClick={() => handleProductClick(product.id)}
                    >
                        <button 
                            className="remove-btn"
                            onClick={(e) => handleRemove(e, product.id)}
                        >
                            ✕
                        </button>

                        <div className="history-card-image">
                            {product.image ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <div className="no-image">ไม่มีรูปภาพ</div>
                            )}
                        </div>

                        <div className="history-card-info">
                            <h3 className="history-card-name">{product.name}</h3>
                            <p className="history-card-category">{product.category}</p>
                            
                            <div className="history-card-footer">
                                <span className="history-card-price">
                                    ฿{formatPrice(product.price)}
                                </span>
                                <span className="history-card-stock">
                                    {product.stock > 0 ? `มีสินค้า` : 'สินค้าหมด'}
                                </span>
                            </div>

                            <div className="history-card-time">
                                <span>🕒 {formatDate(product.viewedAt)}</span>
                            </div>

                            {product.stock > 0 && (
                                <button 
                                    className="history-add-cart-btn"
                                    onClick={(e) => handleAddToCart(e, product)}
                                >
                                    เพิ่มลงตะกร้า
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewHistory;