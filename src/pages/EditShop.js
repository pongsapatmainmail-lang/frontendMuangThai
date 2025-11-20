import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyShop, updateShop } from '../services/api';
import './EditShop.css';

function EditShop() {
    const [shop, setShop] = useState(null);
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
        loadShop();
    }, [isAuthenticated, navigate]);

    const loadShop = async () => {
        setLoading(true);
        const shopData = await getMyShop();

        if (!shopData) {
            alert('คุณยังไม่มีร้านค้า');
            navigate('/create-shop');
            return;
        }

        setShop(shopData);
        setFormData({
            name: shopData.name || '',
            description: shopData.description || '',
            phone: shopData.phone || '',
            email: shopData.email || '',
            address: shopData.address || ''
        });
        setLogoPreview(shopData.logo);
        setBannerPreview(shopData.banner);
        setLoading(false);
    };

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

    const handleRemoveLogo = () => {
        setLogo(null);
        setLogoPreview(null);
    };

    const handleRemoveBanner = () => {
        setBanner(null);
        setBannerPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('address', formData.address);

        if (logo) data.append('logo', logo);
        if (banner) data.append('banner', banner);

        const result = await updateShop(shop.id, data);

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
        return <div className="loading">กำลังโหลดข้อมูลร้านค้า...</div>;
    }

    if (!shop) {
        return null;
    }

    return (
        <div className="edit-shop-container">
            <div className="edit-shop-header">
                <button onClick={() => navigate('/my-shop')} className="back-btn">
                    ← กลับ
                </button>
                <h1>⚙️ แก้ไขร้านค้า</h1>
            </div>

            <div className="edit-shop-form-container">
                {success && <div className="success-message">{success}</div>}
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
                                        <div className="image-with-remove">
                                            <img src={logoPreview} alt="Logo Preview" className="image-preview" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveLogo}
                                                className="remove-image-btn"
                                            >
                                                ✕
                                            </button>
                                        </div>
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
                                <p className="file-hint">แนะนำขนาด: 500x500 พิกเซล</p>
                            </div>

                            <div className="upload-item">
                                <label>แบนเนอร์</label>
                                <div className="image-preview-container banner">
                                    {bannerPreview ? (
                                        <div className="image-with-remove">
                                            <img src={bannerPreview} alt="Banner Preview" className="image-preview" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveBanner}
                                                className="remove-image-btn"
                                            >
                                                ✕
                                            </button>
                                        </div>
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
                                <p className="file-hint">แนะนำขนาด: 1200x300 พิกเซล</p>
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

                    <div className="form-section">
                        <h2>สถานะร้านค้า</h2>
                        <div className="status-info">
                            <div className="status-item">
                                <span className="status-label">สถานะ:</span>
                                <span className={`status-badge ${shop.is_active ? 'active' : 'inactive'}`}>
                                    {shop.is_active ? '🟢 เปิดใช้งาน' : '🔴 ปิดใช้งาน'}
                                </span>
                            </div>
                            <div className="status-item">
                                <span className="status-label">การยืนยัน:</span>
                                <span className={`status-badge ${shop.is_verified ? 'verified' : 'unverified'}`}>
                                    {shop.is_verified ? '✓ ยืนยันแล้ว' : '⏳ รอการยืนยัน'}
                                </span>
                            </div>
                        </div>
                        <p className="status-note">
                            💡 หมายเหตุ: การเปิด/ปิดใช้งานและการยืนยันร้านจะดำเนินการโดย Admin
                        </p>
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

export default EditShop;