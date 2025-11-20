import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // โหลด user จาก localStorage เมื่อเริ่มต้น
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/api/users/profile/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error loading user:', error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    // ลงทะเบียน
    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8000/api/users/register/', userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data || 'เกิดข้อผิดพลาดในการลงทะเบียน' 
            };
        }
    };

    // ล็อกอิน
    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/users/login/', {
                username,
                password
            });
            
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // ดึงข้อมูล user
            const userResponse = await axios.get('http://localhost:8000/api/users/profile/', {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            
            setUser(userResponse.data);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.detail || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
            };
        }
    };

    // อัพเดทโปรไฟล์
    const updateProfile = async (userData) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.put(
                'http://localhost:8000/api/users/profile/',
                userData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setUser(response.data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
            };
        }
    };

    // ล็อกเอาท์
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};