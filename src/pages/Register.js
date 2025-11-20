import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password2) {
            setError('รหัสผ่านไม่ตรงกัน');
            return;
        }

        setLoading(true);
        const result = await register(formData);
        
        if (result.success) {
            alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
            navigate('/login');
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
        <div className="auth-container">
            <div className="auth-box">
                <h2>ลงทะเบียน</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>ชื่อจริง</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
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
                                required
                                placeholder="กรอกนามสกุล"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="กรอกชื่อผู้ใช้"
                        />
                    </div>

                    <div className="form-group">
                        <label>อีเมล</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="กรอกอีเมล"
                        />
                    </div>

                    <div className="form-group">
                        <label>รหัสผ่าน</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="กรอกรหัสผ่าน"
                        />
                    </div>

                    <div className="form-group">
                        <label>ยืนยันรหัสผ่าน</label>
                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;