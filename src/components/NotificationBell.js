import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUnreadCount, getNotifications } from '../services/api'; // เพิ่ม getNotifications
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const bellRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated) {
            loadUnreadCount();
            loadNotifications();

            const interval = setInterval(() => {
                loadUnreadCount();
                loadNotifications();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const loadUnreadCount = async () => {
        const count = await getUnreadCount();
        setUnreadCount(count);
    };

    const loadNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data || []);
    };

    // ปิด dropdown ถ้าคลิกนอก
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="notification-wrapper" ref={bellRef}>
            <button 
                className="notification-bell"
                onClick={() => setOpen(!open)}
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {open && (
                <div className="notification-dropdown">
                    {notifications.length === 0 ? (
                        <div className="notification-empty">ไม่มีแจ้งเตือน</div>
                    ) : (
                        notifications.map((n, index) => (
                            <div 
                                key={index} 
                                className={`notification-item ${n.read ? '' : 'unread'}`}
                                onClick={() => navigate('/notifications')}
                            >
                                <div className="notification-title">{n.title}</div>
                                <div className="notification-message">{n.message}</div>
                                <div className="notification-time">{n.time}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
