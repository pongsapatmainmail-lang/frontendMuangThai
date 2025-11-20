import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createShop } from '../services/api';
import './CreateShop.css';

function CreateShop() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        phone: '',
        email: '',
        address: ''
    });
    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBanner(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('address', formData.address);

        if (logo) data.append('logo', logo);
        if (banner) data.append('banner', banner);

        const result = await createShop(data);

        if (result.success) {
            alert('สร้างร้านค้าสำเร็จ!');
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
        <div className="create-shop-container">
            <div className="create-shop-header">
                <h1>🏪 สร้างร้านค้าของคุณ</h1>
                <p>เริ่มต้นขายสินค้าออนไลน์ง่ายๆ</p>
            </div>

            <div className="create-shop-form-container">
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2>ข้อมูลร้านค้า</h2>

                        <div className="form-group">
                            <label>ชื่อร้านค้า *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="เช่น: ร้านของดีมีคุณภาพ"
                            />
                        </div>

                        <div className="form-group">
                            <label>คำอธิบายร้านค้า</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="บอกเล่าเกี่ยวกับร้านค้าของคุณ..."
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>รูปภาพ</h2>

                        <div className="image-upload-group">
                            <div className="upload-item">
                                <label>โลโก้ร้านค้า</label>
                                <div className="image-preview-container">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo Preview" className="image-preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span>🏪</span>
                                            <p>อัพโหลดโลโก้</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="file-input"
                                />
                            </div>

                            <div className="upload-item">
                                <label>แบนเนอร์</label>
                                <div className="image-preview-container banner">
                                    {bannerPreview ? (
                                        <img src={bannerPreview} alt="Banner Preview" className="image-preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span>🖼️</span>
                                            <p>อัพโหลดแบนเนอร์</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                    className="file-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>ข้อมูลติดต่อ</h2>

                        <div className="form-group">
                            <label>เบอร์โทรศัพท์</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="0xx-xxx-xxxx"
                            />
                        </div>

                        <div className="form-group">
                            <label>อีเมล</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="shop@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>ที่อยู่</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                placeholder="ที่อยู่ร้านค้า..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="cancel-btn"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'กำลังสร้าง...' : '🏪 สร้างร้านค้า'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateShop;