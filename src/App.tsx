import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <>
            <Toaster position="top-center" />
            <CartProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </CartProvider>
        </>   
    );
}

export default App;
