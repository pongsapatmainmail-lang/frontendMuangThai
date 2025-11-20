import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ViewHistoryProvider } from './context/ViewHistoryContext';

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