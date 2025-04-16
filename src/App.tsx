import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { CartProvider } from './context/CartContext';

function App() {
    return (
        <CartProvider>
            <Router>
                <AppRoutes />
            </Router>
        </CartProvider>
    );
}

export default App;
