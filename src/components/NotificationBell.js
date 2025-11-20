import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUnreadCount } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            loadUnreadCount();
            // อัพเดททุก 30 วินาที
            const interval = setInterval(loadUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const loadUnreadCount = async () => {
        const count = await getUnreadCount();
        setUnreadCount(count);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <button 
            className="notification-bell"
            onClick={() => navigate('/notifications')}
        >
            🔔
            {unreadCount > 0 && (
                <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
        </button>
    );
}

export default NotificationBell;