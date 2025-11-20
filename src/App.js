import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ViewHistory from './pages/ViewHistory';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminSendNotification from './pages/AdminSendNotification';
import ShopList from './pages/ShopList';
import ShopDetail from './pages/ShopDetail';
import CreateShop from './pages/CreateShop';
import MyShop from './pages/MyShop';
import AddProduct from './pages/AddProduct';
import NotificationBell from './components/NotificationBell';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import EditShop from './pages/EditShop';
import EditProduct from './pages/EditProduct';
import './App.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
axios.get(`${API_URL}/api/data`)

function App() {
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container">
            <Link to="/" className="logo">🛒 MuangThai</Link>
            <nav>
              <Link to="/">หน้าแรก</Link>
              <Link to="/shops">ร้านค้า</Link>
              <Link to="/history">ประวัติ</Link>
              {isAuthenticated && (
                <>
                  <Link to="/orders">คำสั่งซื้อ</Link>
                  <Link to="/my-shop" className="my-shop-link">🏪 ร้านของฉัน</Link>
                  <Link to="/profile">โปรไฟล์</Link>
                  {(user?.is_staff || user?.is_admin) && (
                    <Link to="/admin" className="admin-link">🎛️ Admin</Link>
                  )}
                  <NotificationBell />
                </>
              )}
              <Link to="/cart" className="cart-link">
                ตะกร้า
                {getCartCount() > 0 && (
                  <span className="cart-badge">{getCartCount()}</span>
                )}
              </Link>
              {isAuthenticated ? (
                <>
                  <span className="user-name">สวัสดี, {user?.first_name || user?.username}</span>
                  <button onClick={logout} className="logout-btn">ออกจากระบบ</button>
                </>
              ) : (
                <>
                  <Link to="/login">เข้าสู่ระบบ</Link>
                  <Link to="/register">ลงทะเบียน</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/shops" element={<ShopList />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/create-shop" element={<CreateShop />} />
            <Route path="/my-shop" element={<MyShop />} />
            <Route path="/my-shop/add-product" element={<AddProduct />} />
            <Route path="/history" element={<ViewHistory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/notifications" element={<AdminSendNotification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-shop/edit" element={<EditShop />} />
            <Route path="/my-shop/edit-product/:id" element={<EditProduct />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;