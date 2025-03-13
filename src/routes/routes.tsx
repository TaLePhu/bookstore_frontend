import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Home from '../pages/user/Home';
import About from '../pages/user/About';

import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

const AppRoutes = () => {
    return(
        <Routes>
            {/* Layout chính (Navbar + Footer) */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="Gioi-thieu" element={<About />} />

                <Route path="/auth/dang-nhap" element={<SignIn/>}/>
                <Route path="/auth/dang-ky" element={<SignUp/>}/>
            </Route>

            {/* Layout cho trang quản trị */}
        </Routes>
    );
};

export default AppRoutes;