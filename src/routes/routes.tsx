import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Home from '../pages/user/Home';
import About from '../pages/user/About';
import Cart from '../pages/user/ShoppingCart';
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import ProductDetails from '../pages/user/ProductDetails';
import ShoppingCart from '../pages/user/ShoppingCart';
import { useState } from 'react';
import Checkout from '../pages/user/Checkout';
import ActivateAccount from '../pages/auth/ActivateAccount';
import Test from '../pages/auth/Test';
import Policy from '../pages/user/Policy';
import OrderConfirmSuccess from '../pages/user/OrderConfirmSuccess';
import OrderConfirmFalse from '../pages/user/OrderConfirmFalse';


import AdminLayout from '../layouts/AdminLayout';
import ProductManagement from '../pages/Admin/ProductManagement';
const AppRoutes = () => {
    const [searchKey, setSearchKey] = useState('');

    return (
        <Routes>
            {/* Layout chính (Navbar + Footer) */}
            <Route path="/" element={<MainLayout searchKey={searchKey} setSearchKey={setSearchKey} />}>
                <Route path="/" element={<Home searchKey={searchKey} />} />
                <Route path="/:categoryId" element={<Home searchKey={searchKey} />} />
                <Route path="/about" element={<About />} />
                <Route path="/detail/:id" element={<ProductDetails />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/auth/dang-nhap" element={<SignIn />} />
                <Route path="/auth/dang-ky" element={<SignUp />} />
                <Route path="/test" element={<Test />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/activate/:email/:activationCode" element={<ActivateAccount />} />
                <Route path="/order-confirm-success" element={<OrderConfirmSuccess />} />
                <Route path="/order-confirm-false" element={<OrderConfirmFalse />} />
            </Route>
            {/* <Route path="/checkout" element={<Checkout />} /> */}
            {/* Layout cho trang quản trị */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="product-management" element={<ProductManagement />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
