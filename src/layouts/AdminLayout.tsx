import { Outlet } from 'react-router-dom';
import AdmNavbar from '../components/admLayout/AdmNavbar';
import '../assets/styles/AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdmNavbar />
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
