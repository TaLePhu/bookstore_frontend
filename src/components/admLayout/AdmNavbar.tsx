import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/AdmNavbar.css';

const AdmNavbar = () => {
    const location = useLocation();

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
                <Link to="/admin/orders" className={location.pathname === '/admin/orders' ? 'active' : ''}>
                    Quản lí đơn hàng
                </Link>
                <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
                    Quản lí người dùng
                </Link>
            </nav>
        </div>
    );
};

export default AdmNavbar;
