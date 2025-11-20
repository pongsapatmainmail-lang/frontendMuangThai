import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ViewHistoryContext = createContext();

export const useViewHistory = () => {
    const context = useContext(ViewHistoryContext);
    if (!context) {
        throw new Error('useViewHistory must be used within ViewHistoryProvider');
    }
    return context;
};

const STORAGE_KEY = 'view_history';
const MAX_HISTORY = 20;

export const ViewHistoryProvider = ({ children }) => {
    const [viewHistory, setViewHistory] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // โหลดประวัติจาก localStorage เมื่อเริ่มต้น
    useEffect(() => {
        const loadHistory = () => {
            try {
                const savedHistory = window.localStorage.getItem(STORAGE_KEY);
                console.log('Loading history from localStorage:', savedHistory); // Debug
                
                if (savedHistory) {
                    const parsed = JSON.parse(savedHistory);
                    console.log('Parsed history:', parsed); // Debug
                    setViewHistory(parsed);
                } else {
                    console.log('No history found in localStorage'); // Debug
                }
            } catch (error) {
                console.error('Error loading view history:', error);
                // ถ้า error ให้ล้างข้อมูลเก่า
                window.localStorage.removeItem(STORAGE_KEY);
            }
            setIsLoaded(true);
        };

        loadHistory();
    }, []);

    // บันทึกประวัติลง localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
    useEffect(() => {
        if (isLoaded) {
            try {
                const dataToSave = JSON.stringify(viewHistory);
                window.localStorage.setItem(STORAGE_KEY, dataToSave);
                console.log('Saving history to localStorage:', dataToSave); // Debug
            } catch (error) {
                console.error('Error saving view history:', error);
            }
        }
    }, [viewHistory, isLoaded]);

    // เพิ่มสินค้าที่ดูลงประวัติ
    const addToHistory = useCallback((product) => {
        console.log('Adding to history:', product); // Debug
        
        setViewHistory(prevHistory => {
            // ลบสินค้าชิ้นเดิมออกถ้ามี (เพื่ออัพเดทเวลา)
            const filteredHistory = prevHistory.filter(item => item.id !== product.id);
            
            // เพิ่มสินค้าใหม่ไว้หน้าสุด พร้อมเวลาดู
            const newHistory = [
                { 
                    ...product, 
                    viewedAt: new Date().toISOString() 
                },
                ...filteredHistory
            ];
            
            // จำกัดจำนวนไม่เกิน MAX_HISTORY
            const limitedHistory = newHistory.slice(0, MAX_HISTORY);
            console.log('New history state:', limitedHistory); // Debug
            
            return limitedHistory;
        });
    }, []);

    // ลบสินค้าออกจากประวัติ
    const removeFromHistory = useCallback((productId) => {
        console.log('Removing from history:', productId); // Debug
        setViewHistory(prevHistory => 
            prevHistory.filter(item => item.id !== productId)
        );
    }, []);

    // ล้างประวัติทั้งหมด
    const clearHistory = useCallback(() => {
        console.log('Clearing all history'); // Debug
        setViewHistory([]);
        window.localStorage.removeItem(STORAGE_KEY);
    }, []);

    // ดึงสินค้าล่าสุด
    const getRecentViews = useCallback((limit = 10) => {
        return viewHistory.slice(0, limit);
    }, [viewHistory]);

    const value = {
        viewHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getRecentViews,
        isLoaded
    };

    return (
        <ViewHistoryContext.Provider value={value}>
            {children}
        </ViewHistoryContext.Provider>
    );
};