import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addShopProduct } from '../services/api';
import './AddProduct.css';

function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);

        if (image) {
            data.append('image', image);
        }

        const result = await addShopProduct(data);

        if (result.success) {
            alert('เพิ่มสินค้าสำเร็จ!');
            navigate('/my-shop');
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
        <div className="add-product-container">
            <div className="add-product-header">
                <button onClick={() => navigate('/my-shop')} className="back-btn">
                    ← กลับ
                </button>
                <h1>➕ เพิ่มสินค้าใหม่</h1>
            </div>

            <div className="add-product-form-container">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2>รูปภาพสินค้า</h2>
                        <div className="image-upload-area">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview-large" />
                            ) : (
                                <div className="image-placeholder-large">
                                    <span>📷</span>
                                    <p>อัพโหลดรูปภาพสินค้า</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>ข้อมูลสินค้า</h2>

                        <div className="form-group">
                            <label>ชื่อสินค้า *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="เช่น: เสื้อยืดคอกลม"
                            />
                        </div>

                        <div className="form-group">
                            <label>คำอธิบาย *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="อธิบายรายละเอียดสินค้า..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>ราคา (บาท) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label>จำนวนสต็อก *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>หมวดหมู่ *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">เลือกหมวดหมู่</option>
                                <option value="แฟชั่น">แฟชั่น</option>
                                <option value="อิเล็กทรอนิกส์">อิเล็กทรอนิกส์</option>
                                <option value="ของใช้ในบ้าน">ของใช้ในบ้าน</option>
                                <option value="อาหารและเครื่องดื่ม">อาหารและเครื่องดื่ม</option>
                                <option value="กีฬาและกิจกรรมกลางแจ้ง">กีฬาและกิจกรรมกลางแจ้ง</option>
                                <option value="ความงามและของใช้ส่วนตัว">ความงามและของใช้ส่วนตัว</option>
                                <option value="หนังสือและสื่อ">หนังสือและสื่อ</option>
                                <option value="ของเล่นและเกม">ของเล่นและเกม</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/my-shop')}
                            className="cancel-btn"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'กำลังเพิ่ม...' : '✓ เพิ่มสินค้า'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;