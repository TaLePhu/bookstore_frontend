import { Outlet } from 'react-router-dom';
import '../assets/styles/MainLayout.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

interface MainLayoutProps {
    searchKey: string;
    setSearchKey: (key: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ searchKey, setSearchKey }) => {
    return (
        <div className="App bg-white">
            <Navbar searchKey={searchKey} setSearchKey={setSearchKey} />
            <div className="main-content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
