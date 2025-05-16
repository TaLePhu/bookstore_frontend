import { Link } from 'react-router-dom';
import '../../assets/styles/AdmNavbar.css';

const AdmNavbar = () => {
    return (
        <div className="adm-navbar">
            <h2 className="adm-title">Admin Panel</h2>
            <nav className="adm-menu">
                <Link to="product-management">Quản lí sản phẩm</Link>
                <Link to="#">Quản lí nhân sự</Link>
                <Link to="#">Quản lí khách hàng</Link>
            </nav>
        </div>
    );
};

export default AdmNavbar;
