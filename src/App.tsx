import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { getAllBook } from './api/BookAPI';
import { CartProvider } from './context/CartContext';

function App() {
    // getAllBook().then().catch();

    return (
        <CartProvider>
            <Router>
                <AppRoutes />
            </Router>
        </CartProvider>
    );
}

export default App;
