import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import '../../assets/styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
    searchKey: string;
    setSearchKey: (key: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchKey, setSearchKey }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // State để quản lý submenu
    const { getTotalItems } = useCart(); // dùng hook lấy tổng số lượng sản phẩm trong giỏ hàng
    const [user, setUser] = useState<any | null>(null);

    const [temporarySearchKey, setTemporarySearchKey] = useState(searchKey); // State tạm thời để lưu giá trị tìm kiếm    
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    


    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }, []);

      console.log("User: ",user);

      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setShowDropdown(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Token sau khi logout:', localStorage.getItem('token')); // phải là null
        navigate('/auth/dang-nhap');
        window.location.reload();
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
                        <Link to="/policy">Chính sách</Link>
                    </li>
                    <li className="has-submenu">
                        <Link to="" className="submenu-toggle" onClick={toggleSubmenu}>
                            Thể loại
                        </Link>
                        {isSubmenuOpen && (
                            <ul className="submenu">
                                <li>
                                    <Link to="/1">Sách khoa học</Link>
                                </li>
                                <li>
                                    <Link to="/2">Sách tâm lý học</Link>
                                </li>
                                <li>
                                    <Link to="/3">Sách tiểu thuyết</Link>
                                </li>
                                <li>
                                    <Link to="/4">Sách lịch sử</Link>
                                </li>
                                <li>
                                    <Link to="/5">Sách trinh thám</Link>
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
                {/* <ul className="navbar-list-1">
                    <li>
                        <Link to="/auth/dang-nhap">Đăng nhập</Link>
                    </li>
                    <li>
                        <Link to="/auth/dang-ky">Đăng ký</Link>
                    </li>
                </ul> */}
                {user ? (
                    // Khi đã đăng nhập
                    <div className="user-menu">
                        <span className="username">{user.fullName}</span>
                        <div className="dropdown">
                            <img
                            className="size-icon"
                            src="/icons/icons8-user-48.png"
                            alt="icon-login"
                            onClick={() => setShowDropdown((prev) => !prev)}
                            />
                            {showDropdown && (
                            <div className="dropdown-content">
                                <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
                                <button className="btn-profile">Thông tin cá nhân</button>
                            </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // Khi chưa đăng nhập
                    <ul className="navbar-list-1">
                        <li>
                            <Link to="/auth/dang-nhap">Đăng nhập</Link>
                        </li>
                        <li>
                            <Link to="/auth/dang-ky">Đăng ký</Link>
                        </li>
                    </ul>
                )}

                {/** icon hiện thị ở màn hình nhỏ */}
                <Link to="/auth/dang-nhap" className="icon-login">
                    <img className="size-icon" src="/icons/icons8-user-48.png" alt="icon-login" />
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
