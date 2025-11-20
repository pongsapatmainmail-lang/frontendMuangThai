import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const { user, isAuthenticated, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user, isAuthenticated, navigate]);

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

        const result = await updateProfile(formData);

        if (result.success) {
            setSuccess('อัพเดทข้อมูลสำเร็จ!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
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

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccess('');
        // Reset ข้อมูลเดิม
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    };

    if (!user) {
        return <div className="loading">กำลังโหลด...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>โปรไฟล์ของฉัน</h1>
                <p>จัดการข้อมูลส่วนตัวของคุณ</p>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.first_name ? user.first_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                        </div>
                        <h3>{user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.username}
                        </h3>
                        <p className="username-text">@{user.username}</p>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-label">สมาชิกตั้งแต่</span>
                            <span className="stat-value">
                                {new Date(user.date_joined).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-main">
                    {success && <div className="success-message">{success}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>ข้อมูลส่วนตัว</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>ชื่อจริง</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="กรอกชื่อจริง"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>นามสกุล</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="กรอกนามสกุล"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>อีเมล</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="กรอกอีเมล"
                                />
                            </div>

                            <div className="form-group">
                                <label>เบอร์โทรศัพท์</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="กรอกเบอร์โทรศัพท์"
                                />
                            </div>

                            <div className="form-group">
                                <label>ที่อยู่</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    rows="4"
                                    placeholder="กรอกที่อยู่"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>ข้อมูลบัญชี</h2>
                            
                            <div className="info-item">
                                <span className="info-label">ชื่อผู้ใช้:</span>
                                <span className="info-value">{user.username}</span>
                            </div>

                            <div className="info-item">
                                <span className="info-label">สถานะ:</span>
                                <span className="status-badge active">ใช้งานอยู่</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            {isEditing ? (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={handleCancel}
                                        className="cancel-btn"
                                        disabled={loading}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="save-btn"
                                        disabled={loading}
                                    >
                                        {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                                    </button>
                                </>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(true)}
                                    className="edit-btn"
                                >
                                    แก้ไขข้อมูล
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;