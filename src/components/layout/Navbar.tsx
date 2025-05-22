import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import '../../assets/styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import BookModel from '../../models/BookModel';
import ImageModel from '../../models/ImageModel';
import { findBook } from '../../api/BookAPI';
import { getAllImage } from '../../api/ImageAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faSuitcase } from '@fortawesome/free-solid-svg-icons';

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

    const [searchResults, setSearchResults] = useState<BookModel[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [imageMap, setImageMap] = useState<{ [key: number]: string }>({});
    const [error, setError] = useState(null);

    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const [showProfile, setShowProfile] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editProfileData, setEditProfileData] = useState<any>(null);
    const [showEditProfile, setShowEditProfile] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            const map: { [key: number]: string } = {};
            for (const book of searchResults) {
                try {
                    const imageList = await getAllImage(book.bookId);
                    if (imageList.length > 0) {
                        if (imageList.length > 0 && imageList[0].imageData) {
                            map[book.bookId] = imageList[0].imageData;
                        }
                    }
                } catch (error) {
                    console.error(`Lỗi lấy ảnh cho sách ${book.bookId}:`, error);
                }
            }
            setImageMap(map);
        };

        if (searchResults.length > 0) {
            fetchImages();
        }
    }, [searchResults]);

    console.log('User: ', user);

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
    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTemporarySearchKey(event.target.value); // Cập nhật giá trị tìm kiếm
    // };

    // const handleSearch = (e: React.FormEvent) => {
    //     e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    //     setSearchKey(temporarySearchKey); // Cập nhật giá trị tìm kiếm trong context
    //     setTemporarySearchKey(''); // Reset giá trị tạm thời
    // };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Token sau khi logout:', localStorage.getItem('token')); // phải là null
        navigate('/auth/dang-nhap');
        window.location.reload();
    };

    const changPePassword = () => {
        navigate('/auth/doi-mat-khau');
    };

    let debounceTimeout: NodeJS.Timeout;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTemporarySearchKey(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            if (value.trim() !== '') {
                setIsSearching(true);
                findBook(value, 0)
                    .then((data) => {
                        setSearchResults(data.result || []);
                        setIsSearching(false);
                    })
                    .catch((error) => {
                        console.error('Lỗi tìm kiếm:', error);
                        setSearchResults([]);
                        setIsSearching(false);
                    });
            } else {
                setSearchResults([]);
            }
        }, 300);
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = temporarySearchKey.trim();
        if (trimmed !== '') {
            setSearchKey(trimmed);
            navigate(`/search/${trimmed}`);

            // Lưu lịch sử tìm kiếm vào localStorage
            const updatedHistory = [trimmed, ...searchHistory.filter((item) => item !== trimmed)].slice(0, 10); // giữ 10 từ gần nhất
            setSearchHistory(updatedHistory);
            localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
        }

        setShowDropdown(false);
        setSearchResults([]); // Thêm dòng này để xoá kết quả
        setTemporarySearchKey('');
    };

    const handleDeleteHistory = (indexToDelete: number) => {
        const updated = searchHistory.filter((_, index) => index !== indexToDelete);
        setSearchHistory(updated);
        localStorage.setItem('searchHistory', JSON.stringify(updated));
    };

    const fetchProfile = async () => {
        setShowProfile(true);
        setLoadingProfile(true);
        setProfileError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Không tìm thấy token');
            const res = await fetch('http://localhost:8080/account/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Lỗi lấy thông tin cá nhân');
            const data = await res.json();
            setProfile(data);
        } catch (err: any) {
            setProfileError(err.message || 'Lỗi không xác định');
        }
        setLoadingProfile(false);
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
                        <Link
                            to="/"
                            onClick={() => {
                                setSearchKey('');
                                setTemporarySearchKey('');
                                setSearchResults([]);
                            }}
                        >
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link to="/about">Giới thiệu</Link>
                    </li>
                    <li>
                        <Link to="/policy">Chính sách</Link>
                    </li>
                    {/* <li className="has-submenu">
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
                    </li> */}
                </ul>
            </div>
            {/* search by book name */}
            <div className="search">
                <input
                    className="input-search"
                    placeholder="Tìm kiếm..."
                    onChange={handleChange}
                    value={temporarySearchKey}
                    onFocus={() => setShowHistory(true)}
                    onBlur={() => setTimeout(() => setShowHistory(false), 200)} // ẩn sau khi rời input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(e);
                        }
                    }}
                />
                <img
                    className="icon-search"
                    src="/icons/icons8-search-48.png"
                    alt="icon-search"
                    onClick={handleSearch}
                />

                {showHistory && !temporarySearchKey && searchHistory.length > 0 && (
                    <div className="search-dropdown">
                        {searchHistory.map((keyword, index) => (
                            <div key={index} className="search-item history-item">
                                <div
                                    onClick={() => {
                                        setTemporarySearchKey(keyword);
                                        setSearchKey(keyword);
                                        navigate(`/search/${keyword}`);
                                        setShowHistory(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flex: 1,
                                        cursor: 'pointer',
                                        gap: '5px',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faHistory} />
                                    <span>{keyword}</span>
                                </div>
                                <button className="btn-delete-history" onClick={() => handleDeleteHistory(index)}>
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {(searchResults.length > 0 || isSearching) && (
                    <div className="search-dropdown">
                        {isSearching ? (
                            <div className="search-item">Đang tìm kiếm...</div>
                        ) : (
                            searchResults.map((book) => (
                                <Link
                                    to={`/detail/${book.bookId}`}
                                    key={book.bookId}
                                    className="search-item"
                                    onClick={() => {
                                        setTemporarySearchKey('');
                                        setSearchResults([]);
                                    }}
                                >
                                    <img
                                        className="img-search"
                                        src={
                                            imageMap[book.bookId]
                                                ? imageMap[book.bookId]
                                                : 'https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg'
                                        }
                                        alt={book.bookName}
                                    />
                                    <span>{book.bookName}</span>
                                </Link>
                            ))
                        )}
                    </div>
                )}
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
                    <>
                        <Link to="/order-purchase" className="purchase-order">
                            <FontAwesomeIcon icon={faSuitcase} />
                        </Link>
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
<<<<<<< HEAD
                                <div className="dropdown-content">
                                    <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
                                    <button className="btn-profile">Thông tin cá nhân</button>
                                    <button className="btn-profile" onClick={changPePassword}>Đặt lại mật khẩu</button>
                                </div>
=======
                                    <div className="dropdown-content">
                                        <button className="btn-logout" onClick={handleLogout}>
                                            Đăng xuất
                                        </button>
                                        <button className="btn-profile" onClick={fetchProfile}>
                                            Thông tin cá nhân
                                        </button>
                                    </div>
>>>>>>> feature/thach-Profile
                                )}
                            </div>
                        </div>
                    </>
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

            {showProfile && (
                <div className="modal-profile-overlay">
                    <div className="modal-profile-content">
                        <button className="modal-close-btn" onClick={() => setShowProfile(false)}>
                            ×
                        </button>
                        <img src="/icons/icons8-user-48.png" alt="avatar" className="modal-avatar" />
                        <h2 className="modal-title">Thông tin cá nhân</h2>
                        {loadingProfile && <div className="modal-loading">Đang tải...</div>}
                        {profileError && <div className="modal-error">{profileError}</div>}
                        {profile && (
                            <ul className="modal-info-list">
                                <li>
                                    <b>Họ tên:</b>{' '}
                                    <span>
                                        {profile.firstName} {profile.lastName}
                                    </span>
                                </li>
                                <li>
                                    <b>Email:</b> <span>{profile.email}</span>
                                </li>
                                <li>
                                    <b>SĐT:</b> <span>{profile.phoneNumber}</span>
                                </li>
                                <li>
                                    <b>Địa chỉ thanh toán:</b> <span>{profile.billingAddress}</span>
                                </li>
                                <li>
                                    <b>Địa chỉ giao hàng:</b> <span>{profile.shippingAddress}</span>
                                </li>
                                <li>
                                    <b>Giới tính:</b>{' '}
                                    <span>
                                        {profile.gender === 'M' ? 'Nam' : profile.gender === 'F' ? 'Nữ' : 'Khác'}
                                    </span>
                                </li>
                                <li>
                                    <b>Tên đăng nhập:</b> <span>{profile.username}</span>
                                </li>
                            </ul>
                        )}
                        {profile && (
                            <button
                                className="modal-edit-btn"
                                onClick={() => {
                                    setEditProfileData(profile);
                                    setShowEditProfile(true);
                                    setShowProfile(false);
                                }}
                                style={{
                                    marginTop: 16,
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    padding: '8px 18px',
                                    borderRadius: 6,
                                    border: 'none',
                                    color: '#fff',
                                    background: '#6366f1',
                                }}
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showEditProfile && editProfileData && (
                <div className="modal-profile-overlay">
                    <div className="modal-profile-content">
                        <button
                            className="modal-close-btn"
                            onClick={() => {
                                setShowEditProfile(false);
                                setShowProfile(true);
                            }}
                        >
                            ×
                        </button>
                        <h2 className="modal-title">Chỉnh sửa thông tin</h2>
                        <form
                            className="modal-edit-form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const token = localStorage.getItem('token');
                                    const res = await fetch('http://localhost:8080/account/update-profile', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify(editProfileData),
                                    });
                                    if (!res.ok) throw new Error('Cập nhật thất bại');
                                    const data = await res.json();
                                    setProfile(data);
                                    setShowEditProfile(false);
                                    setShowProfile(true);
                                } catch (err: any) {
                                    alert(err.message || 'Lỗi không xác định');
                                }
                            }}
                            style={{ width: '100%', marginTop: 10 }}
                        >
                            <div style={{ marginBottom: 10 }}>
                                <label>
                                    <b>Họ tên:</b>
                                </label>
                                <input
                                    type="text"
                                    value={editProfileData.firstName}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, firstName: e.target.value })
                                    }
                                    style={{ marginLeft: 8, marginRight: 8, width: 90 }}
                                    required
                                />
                                <input
                                    type="text"
                                    value={editProfileData.lastName}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, lastName: e.target.value })
                                    }
                                    style={{ width: 90 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <label>
                                    <b>Email:</b>
                                </label>
                                <input
                                    type="email"
                                    value={editProfileData.email}
                                    onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                                    style={{ marginLeft: 8, width: 220 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <label>
                                    <b>SĐT:</b>
                                </label>
                                <input
                                    type="text"
                                    value={editProfileData.phoneNumber}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, phoneNumber: e.target.value })
                                    }
                                    style={{ marginLeft: 8, width: 220 }}
                                />
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <label>
                                    <b>Địa chỉ thanh toán:</b>
                                </label>
                                <input
                                    type="text"
                                    value={editProfileData.billingAddress}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, billingAddress: e.target.value })
                                    }
                                    style={{ marginLeft: 8, width: 180 }}
                                />
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <label>
                                    <b>Địa chỉ giao hàng:</b>
                                </label>
                                <input
                                    type="text"
                                    value={editProfileData.shippingAddress}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, shippingAddress: e.target.value })
                                    }
                                    style={{ marginLeft: 8, width: 180 }}
                                />
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <label>
                                    <b>Giới tính:</b>
                                </label>
                                <select
                                    value={editProfileData.gender}
                                    onChange={(e) => setEditProfileData({ ...editProfileData, gender: e.target.value })}
                                    style={{ marginLeft: 8, width: 100 }}
                                >
                                    <option value="M">Nam</option>
                                    <option value="F">Nữ</option>
                                    <option value="O">Khác</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditProfile(false);
                                        setShowProfile(true);
                                    }}
                                    style={{
                                        background: '#eee',
                                        color: '#333',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '7px 16px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: '#6366f1',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '7px 16px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
