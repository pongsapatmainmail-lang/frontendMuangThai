import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../services/api';
import './AdminSendNotification.css';

function AdminSendNotification() {
    const [formData, setFormData] = useState({
        user_id: 'all',
        type: 'promotion',
        title: '',
        message: '',
        link: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated || (!user?.is_staff && !user?.is_admin)) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const result = await sendNotification(formData);

        if (result.success) {
            setSuccess(result.data.message || 'ส่งการแจ้งเตือนสำเร็จ!');
            setFormData({
                user_id: 'all',
                type: 'promotion',
                title: '',
                message: '',
                link: ''
            });
        } else {
            setError('เกิดข้อผิดพลาดในการส่งการแจ้งเตือน');
        }

        setLoading(false);
    };

    return (
        <div className="admin-send-notification">
            <div className="notification-header">
                <button onClick={() => navigate('/admin')} className="back-btn">
                    ← กลับ
                </button>
                <h1>📢 ส่งการแจ้งเตือน</h1>
            </div>

            <div className="notification-form-container">
                {success && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ส่งถึง</label>
                        <select
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="all">ทุกคน</option>
                        </select>
                        <p className="form-hint">ปัจจุบันสามารถส่งถึงทุกคนเท่านั้น</p>
                    </div>

                    <div className="form-group">
                        <label>ประเภท</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="promotion">โปรโมชั่น 🎁</option>
                            <option value="system">ระบบ ⚙️</option>
                            <option value="order">คำสั่งซื้อ 📦</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>หัวข้อ</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="เช่น: โปรโมชั่นพิเศษ!"
                        />
                    </div>

                    <div className="form-group">
                        <label>ข้อความ</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="4"
                            placeholder="เช่น: ลดราคา 50% ทุกสินค้า วันนี้เท่านั้น!"
                        />
                    </div>

                    <div className="form-group">
                        <label>ลิงก์ (ถ้ามี)</label>
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="เช่น: / หรือ /product/1"
                        />
                        <p className="form-hint">ลิงก์ที่ผู้ใช้จะไปถึงเมื่อคลิกการแจ้งเตือน</p>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin')}
                            className="cancel-btn"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'กำลังส่ง...' : '📤 ส่งการแจ้งเตือน'}
                        </button>
                    </div>
                </form>

                <div className="preview-section">
                    <h3>ตัวอย่าง</h3>
                    <div className="notification-preview">
                        <div className="preview-icon">
                            {formData.type === 'promotion' && '🎁'}
                            {formData.type === 'system' && '⚙️'}
                            {formData.type === 'order' && '📦'}
                        </div>
                        <div className="preview-content">
                            <h4>{formData.title || 'หัวข้อการแจ้งเตือน'}</h4>
                            <p>{formData.message || 'ข้อความการแจ้งเตือนจะแสดงที่นี่'}</p>
                            <span className="preview-time">เมื่อสักครู่</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSendNotification;