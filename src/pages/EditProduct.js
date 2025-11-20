import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById, updateShopProduct } from '../services/api';
import './EditProduct.css';

function EditProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadProduct();
    }, [id, isAuthenticated, navigate]);

    const loadProduct = async () => {
        setLoading(true);
        const productData = await getProductById(id);

        if (!productData) {
            alert('ไม่พบสินค้า');
            navigate('/my-shop');
            return;
        }

        setProduct(productData);
        setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price || '',
            stock: productData.stock || '',
            category: productData.category || ''
        });
        setImagePreview(productData.image);
        setLoading(false);
    };

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

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(product?.image || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stock', formData.stock);
        data.append('category', formData.category);

        if (image) {
            data.append('image', image);
        }

        const result = await updateShopProduct(id, data);

        if (result.success) {
            setSuccess('บันทึกข้อมูลสำเร็จ!');
            setTimeout(() => {
                navigate('/my-shop');
            }, 1500);
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

        setSaving(false);
    };

    if (loading) {
        return <div className="loading">กำลังโหลดข้อมูลสินค้า...</div>;
    }

    if (!product) {
        return null;
    }

    return (
        <div className="edit-product-container">
            <div className="edit-product-header">
                <button onClick={() => navigate('/my-shop')} className="back-btn">
                    ← กลับ
                </button>
                <h1>✏️ แก้ไขสินค้า</h1>
            </div>

            <div className="edit-product-form-container">
                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2>รูปภาพสินค้า</h2>
                        <div className="image-upload-area">
                            {imagePreview ? (
                                <div className="image-with-remove">
                                    <img src={imagePreview} alt="Preview" className="image-preview-large" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="remove-image-btn"
                                    >
                                        ✕
                                    </button>
                                </div>
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
                            <p className="file-hint">อัพโหลดรูปใหม่เพื่อเปลี่ยนรูปภาพ</p>
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
                            disabled={saving}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={saving}
                        >
                            {saving ? 'กำลังบันทึก...' : '💾 บันทึกการเปลี่ยนแปลง'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;