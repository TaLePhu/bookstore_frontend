import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../assets/styles/Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="navbar">
            <div className='region'>
                <Link to='/'><img className='img-size' src="/logoTeam.png" alt="Logo" /></Link>
                <button className="menu-toggle" onClick={toggleMenu}>
                    <img className='size-icon' src="/icons/icons8-menu-24.png" alt="menu-icon" />
                </button>
                <ul className={`navbar-list ${isMenuOpen ? 'open' : ''}`}>
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
                <Link to="/cart" className="icon-cart">
                    <img className='size-icon' src="/icons/icons8-cart-24.png" alt="icon-cart" />
                </Link>
                <ul className='navbar-list-1'>
                    <li><Link to="/auth/dang-nhap">Đăng nhập</Link></li>
                    <li><Link to="/auth/dang-ky">Đăng ký</Link></li>
                </ul>

                {/** icon hiện thị ở màn hình nhỏ */}
                <Link to="/auth/dang-nhap" className="icon-login">
                    <img className='size-icon' src="/icons/icons8-user-48.png" alt="icon-login" />
                </Link>
            </div>
        </header>
    );
};

export default Navbar;