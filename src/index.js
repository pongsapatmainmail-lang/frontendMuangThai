import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ViewHistoryProvider } from './context/ViewHistoryContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // เพิ่มตรงนี้

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ViewHistoryProvider>
          <App />
        </ViewHistoryProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

// ลงทะเบียน service worker เพื่อให้เว็บเป็น PWA
serviceWorkerRegistration.register();
