import { Outlet } from 'react-router-dom';
import '../assets/styles/MainLayout.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
    return(
        <div className="App bg-white">
            <Navbar/>
            <div className="main-content">
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
};

export default MainLayout;