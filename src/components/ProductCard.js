import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart(product);
        alert(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`);
    };

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleShopClick = (e) => {
        e.stopPropagation();
        if (product.shop_id) {
            navigate(`/shop/${product.shop_id}`);
        }
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className="product-image">
                {product.image ? (
                    <img src={product.image} alt={product.name} />
                ) : (
                    <div className="no-image">ไม่มีรูปภาพ</div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                
                {product.shop_name && (
                    <div className="product-shop" onClick={handleShopClick}>
                        🏪 {product.shop_name}
                    </div>
                )}
                
                <div className="product-footer">
                    <span className="product-price">฿{formatPrice(product.price)}</span>
                    <span className="product-stock">คงเหลือ: {product.stock}</span>
                </div>
                <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;