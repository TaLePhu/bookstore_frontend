import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Home from '../pages/user/Home';
import About from '../pages/user/About';

import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import ProductDetails from '../pages/user/ProductDetails';
import Category from '../pages/user/Category';
import ShoppingCart from '../pages/user/ShoppingCart';
import { useState } from 'react';

const AppRoutes = () => {
    const [searchKey, setSearchKey] = useState('');

    return (
        <Routes>
            {/* Layout chính (Navbar + Footer) */}
            <Route path="/" element={<MainLayout searchKey={searchKey} setSearchKey={setSearchKey} />}>
                <Route index element={<Home searchKey={searchKey} />} />
                <Route path="/about" element={<About />} />
                <Route path="/detail/:id" element={<ProductDetails />} />
                <Route path="/category" element={<Category />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/auth/dang-nhap" element={<SignIn />} />
                <Route path="/auth/dang-ky" element={<SignUp />} />
            </Route>

            {/* Layout cho trang quản trị */}
        </Routes>
    );
};

export default AppRoutes;
