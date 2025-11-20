import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../services/api';
import './Notifications.css';

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadNotifications();
    }, [isAuthenticated, navigate]);

    const loadNotifications = async () => {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        setLoading(false);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
            );
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleMarkAllAsRead = async () => {
        const result = await markAllAsRead();
        if (result.success) {
            setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true }))
            );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'เมื่อสักครู่';
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'order': return '📦';
            case 'promotion': return '🎁';
            case 'system': return '⚙️';
            default: return '🔔';
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) {
        return <div className="loading">กำลังโหลดการแจ้งเตือน...</div>;
    }

    if (notifications.length === 0) {
        return (
            <div className="notifications-container">
                <div className="notifications-header">
                    <h1>การแจ้งเตือน</h1>
                </div>
                <div className="empty-notifications">
                    <div className="empty-icon">🔔</div>
                    <p>ไม่มีการแจ้งเตือน</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <div>
                    <h1>การแจ้งเตือน</h1>
                    {unreadCount > 0 && (
                        <p className="unread-count">{unreadCount} รายการยังไม่ได้อ่าน</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead} className="mark-all-btn">
                        ทำเครื่องหมายอ่านทั้งหมด
                    </button>
                )}
            </div>

            <div className="notifications-list">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <div className="notification-icon">
                            {getTypeIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                            <h3 className="notification-title">{notification.title}</h3>
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">{formatDate(notification.created_at)}</span>
                        </div>
                        {!notification.is_read && <div className="unread-dot"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Notifications;