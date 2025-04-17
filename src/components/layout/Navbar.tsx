import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../../assets/styles/Navbar.css';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
    searchKey: string;
    setSearchKey: (key: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchKey, setSearchKey }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // State để quản lý submenu
    const { getTotalItems } = useCart(); // dùng hook lấy tổng số lượng sản phẩm trong giỏ hàng

    const [temporarySearchKey, setTemporarySearchKey] = useState(searchKey); // State tạm thời để lưu giá trị tìm kiếm

    // Hàm xử lý khi người dùng nhấn nút tìm kiếm

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSubmenu = () => {
        setIsSubmenuOpen(!isSubmenuOpen); // Toggle submenu
    };

    // Hàm xử lý thay đổi input tìm kiếm
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTemporarySearchKey(event.target.value); // Cập nhật giá trị tìm kiếm
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        setSearchKey(temporarySearchKey); // Cập nhật giá trị tìm kiếm trong context
        setTemporarySearchKey(''); // Reset giá trị tạm thời
    };

    return (
        <header className="navbar">
            <div className="region">
                <Link to="/">
                    <img className="img-size" src="/logoTeam.png" alt="Logo" />
                </Link>
                <button className="menu-toggle" onClick={toggleMenu}>
                    <img className="size-icon" src="/icons/icons8-menu-24.png" alt="menu-icon" />
                </button>
                <ul className={`navbar-list ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/">Trang chủ</Link>
                    </li>
                    <li>
                        <Link to="/about">Giới thiệu</Link>
                    </li>
                    <li>
                        <Link to="/">Kho sách</Link>
                    </li>
                    <li className="has-submenu">
                        <Link to="" className="submenu-toggle" onClick={toggleSubmenu}>
                            Thể loại
                        </Link>
                        {isSubmenuOpen && (
                            <ul className="submenu">
                                <li>
                                    <Link to="/1">Thể loại 1</Link>
                                </li>
                                <li>
                                    <Link to="/2">Thể loại 2</Link>
                                </li>
                                <li>
                                    <Link to="/3">Thể loại 3</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
            {/* search by book name */}
            <div className="search">
                <input
                    className="input-search"
                    placeholder="Tìm kiếm..."
                    onChange={handleChange}
                    value={temporarySearchKey}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e); // Gọi hàm tìm kiếm khi nhấn Enter
                        }
                    }}
                />
                <img
                    className="icon-search"
                    src="/icons/icons8-search-48.png"
                    alt="icon-search"
                    onClick={handleSearch}
                />
            </div>
            <div className="region">
                <Link to="/cart" className="cart-container">
                    <img className="size-icon" src="/icons/icons8-cart-24.png" alt="icon-cart" />
                    <span className="cart-count">{getTotalItems()}</span>
                </Link>
                <ul className="navbar-list-1">
                    <li>
                        <Link to="/auth/dang-nhap">Đăng nhập</Link>
                    </li>
                    <li>
                        <Link to="/auth/dang-ky">Đăng ký</Link>
                    </li>
                </ul>

                {/** icon hiện thị ở màn hình nhỏ */}
                <Link to="/auth/dang-nhap" className="icon-login">
                    <img className="size-icon" src="/icons/icons8-user-48.png" alt="icon-login" />
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
