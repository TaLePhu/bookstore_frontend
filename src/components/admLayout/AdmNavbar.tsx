import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/AdmNavbar.css';

const AdmNavbar = () => {
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/auth/dang-nhap');
        window.location.reload();
    };

    return (
        <div className="adm-navbar">
            <p className="adm-title">Admin Dashboard</p>
            <nav className="adm-menu">
                <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
                    Tổng quan
                </Link>
                <Link to="/admin/product-management" className={location.pathname === '/admin/product-management' ? 'active' : ''}>
                    Quản lí sản phẩm
                </Link>
                <Link to="/admin/order-management" className={location.pathname === '/admin/order-management' ? 'active' : ''}>
                    Quản lí đơn hàng
                </Link>
                <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                    Quản lí người dùng
                </Link>
            </nav>
            <div className="adm-user">
                {user ? (
                    <div className="user-info">
                        <span className="username">{user.firstName}</span>
                        <span className="user-role">{user.role}</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">
                        Đăng nhập
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AdmNavbar;
