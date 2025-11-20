import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// ฟังก์ชันดึง token
const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Products
export const getProducts = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/products/`, { params });
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', error.response);
        return [];
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/categories/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

// Orders
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(
            `${API_URL}/orders/`,
            orderData,
            { headers: getAuthHeader() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating order:', error);
        return {
            success: false,
            error: error.response?.data || 'เกิดข้อผิดพลาดในการสั่งซื้อ'
        };
    }
};

export const getOrders = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/orders/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/orders/${id}/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
};

export const cancelOrder = async (id) => {
    try {
        const response = await axios.post(
            `${API_URL}/orders/${id}/cancel/`,
            {},
            { headers: getAuthHeader() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error cancelling order:', error);
        return {
            success: false,
            error: error.response?.data?.error || 'เกิดข้อผิดพลาดในการยกเลิก'
        };
    }
};

export const getNotifications = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/notifications/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};

export const getUnreadCount = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/notifications/unread_count/`,
            { headers: getAuthHeader() }
        );
        return response.data.count;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
};

export const markAsRead = async (id) => {
    try {
        const response = await axios.post(
            `${API_URL}/notifications/${id}/mark_as_read/`,
            {},
            { headers: getAuthHeader() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error marking as read:', error);
        return { success: false };
    }
};

export const markAllAsRead = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/notifications/mark_all_as_read/`,
            {},
            { headers: getAuthHeader() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error marking all as read:', error);
        return { success: false };
    }
};

export const getAdminStats = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/admin/stats/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return null;
    }
};

export const getRecentOrders = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/admin/recent-orders/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
};

export const getLowStockProducts = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/admin/low-stock/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        return [];
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.patch(
            `${API_URL}/admin/orders/${orderId}/status/`,
            { status },
            { headers: getAuthHeader() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: error.response?.data };
    }
};

export const sendNotification = async (notificationData) => {
    try {
        const response = await axios.post(
            `${API_URL}/admin/send-notification/`,
            notificationData,
            { headers: getAuthHeader() }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.response?.data };
    }
};

export const getShops = async () => {
    try {
        const response = await axios.get(`${API_URL}/shops/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shops:', error);
        return [];
    }
};

export const getShopById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/shops/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shop:', error);
        return null;
    }
};

export const getMyShop = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/shops/my_shop/`,
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching my shop:', error);
        return null;
    }
};

export const createShop = async (shopData) => {
    try {
        const response = await axios.post(
            `${API_URL}/shops/`,
            shopData,
            { 
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'เกิดข้อผิดพลาดในการสร้างร้านค้า'
        };
    }
};

export const updateShop = async (shopId, shopData) => {
    try {
        const response = await axios.patch(
            `${API_URL}/shops/${shopId}/`,
            shopData,
            { 
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'เกิดข้อผิดพลาดในการอัพเดทร้านค้า'
        };
    }
};

export const getShopProducts = async (shopId) => {
    try {
        const response = await axios.get(`${API_URL}/shops/${shopId}/products/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching shop products:', error);
        return [];
    }
};

export const addShopProduct = async (productData) => {
    try {
        const response = await axios.post(
            `${API_URL}/shops/add_product/`,
            productData,
            { 
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า'
        };
    }
};

export const updateShopProduct = async (productId, productData) => {
    try {
        const response = await axios.patch(
            `${API_URL}/shops/${productId}/update_product/`,
            productData,
            { 
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'เกิดข้อผิดพลาดในการแก้ไขสินค้า'
        };
    }
};

export const deleteShopProduct = async (productId) => {
    try {
        const response = await axios.delete(
            `${API_URL}/shops/${productId}/delete_product/`,
            { headers: getAuthHeader() }
        );
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || 'เกิดข้อผิดพลาดในการลบสินค้า'
        };
    }
};