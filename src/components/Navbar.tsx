import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

const Navbar = () => {
    return (
        <header className="navbar">
            <div className='region'>
                <Link to='/'><img className='img-size' src="/logoTeam.png" alt="Logo" /></Link>
                <ul className='navbar-list'>
                    <li><Link to="/">Trang chủ</Link></li>
                    <li><Link to="/Gioi-thieu">Giới thiệu</Link></li>
                    <li><Link to="/kho-sach">Kho sách</Link></li>
                    <li><Link to="/the-loai">Thể loại</Link></li>
                </ul>
            </div>
            <div className='search'>
                <input className='input-search' placeholder='Tìm kiếm...' />
                <img className='icon-search' src="/icons/icons8-search-48.png" alt="icon-search" />
            </div>
            <div className='region'>
                <img src="/icons/icons8-cart-24.png" alt="icon-cart" />
                <ul className='navbar-list'>
                    <li><Link to="/auth/dang-nhap">Đăng nhập</Link></li>
                    <li><Link to="/auth/dang-ky">Đăng ký</Link></li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
