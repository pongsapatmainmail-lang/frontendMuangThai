import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useViewHistory } from '../context/ViewHistoryContext';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToHistory } = useViewHistory();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        const data = await getProductById(id);
        if (data) {
            setProduct(data);
            // เพิ่มสินค้าลงประวัติการดู
            addToHistory(data);
        } else {
            alert('ไม่พบสินค้า');
            navigate('/');
        }
        setLoading(false);
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleQuantityChange = (value) => {
        const newQuantity = parseInt(value);
        if (newQuantity > 0 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        alert(`เพิ่ม ${product.name} ${quantity} ชิ้น ลงตะกร้าแล้ว!`);
    };

    const handleBuyNow = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        navigate('/cart');
    };

    if (loading) {
        return <div className="loading">กำลังโหลดข้อมูลสินค้า...</div>;
    }

    if (!product) {
        return <div className="loading">ไม่พบสินค้า</div>;
    }

    return (
        <div className="product-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← กลับ
            </button>

            <div className="product-detail-content">
                <div className="product-detail-image">
                    {product.image ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        <div className="no-image-large">ไม่มีรูปภาพ</div>
                    )}
                </div>

                <div className="product-detail-info">
                    <div className="product-category-badge">{product.category}</div>
                    <h1 className="product-title">{product.name}</h1>
                    
                    <div className="product-price-section">
                        <span className="product-price-large">฿{formatPrice(product.price)}</span>
                    </div>

                    <div className="product-stock-info">
                        {product.stock > 0 ? (
                            <>
                                <span className="in-stock">✓ มีสินค้า</span>
                                <span className="stock-count">เหลือ {product.stock} ชิ้น</span>
                            </>
                        ) : (
                            <span className="out-of-stock">✗ สินค้าหมด</span>
                        )}
                    </div>

                    <div className="product-description">
                        <h3>รายละเอียดสินค้า</h3>
                        <p>{product.description}</p>
                    </div>

                    {product.stock > 0 && (
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <label>จำนวน:</label>
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e.target.value)}
                                        min="1"
                                        max={product.stock}
                                    />
                                    <button 
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button 
                                    onClick={handleAddToCart}
                                    className="add-to-cart-button"
                                >
                                    🛒 เพิ่มลงตะกร้า
                                </button>
                                <button 
                                    onClick={handleBuyNow}
                                    className="buy-now-button"
                                >
                                    ซื้อเลย
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="product-meta">
                        <div className="meta-item">
                            <span className="meta-label">หมวดหมู่:</span>
                            <span className="meta-value">{product.category}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">เพิ่มเมื่อ:</span>
                            <span className="meta-value">
                                {new Date(product.created_at).toLocaleDateString('th-TH')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;