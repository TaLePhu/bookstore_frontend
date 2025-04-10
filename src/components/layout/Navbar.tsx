import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../assets/styles/Navbar.css';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getTotalItems } = useCart(); // dùng hook lấy tổng số lượng sản phẩm trong giỏ hàng

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                    <li>
                        <Link to="/category">Thể loại</Link>
                    </li>
                </ul>
            </div>
            <div className="search">
                <input className="input-search" placeholder="Tìm kiếm..." />
                <img className="icon-search" src="/icons/icons8-search-48.png" alt="icon-search" />
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

// import { Link } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import '../../assets/styles/Navbar.css';
// import { useCart } from "../../context/CartContext";
// import Book from '../../models/BookModel';
// import ImageModel from '../../models/ImageModel';
// import { getAllImage } from '../../api/ImageAPI';

// interface NavbarProps {
//     bookList: Book[];  // Nhận bookList từ props
// }

// const Navbar = ({ bookList }: NavbarProps) => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const { getTotalItems } = useCart();
//     const [listImage, setListImage] = useState<ImageModel[]>([]);
//     const [uploadData, setUploadData] = useState(true);
//     const [error, setError] = useState(null);

//     // State để lưu tên tìm kiếm và bookId
//     const [searchTerm, setSearchTerm] = useState('');
//     const [bookId, setBookId] = useState<number | null>(null);

//     useEffect(() => {
//         if (bookId !== null) {
//             // Gọi API lấy hình ảnh cho bookId
//             getAllImage(bookId).then(
//                 ImageData => {
//                     setListImage(ImageData);
//                     setUploadData(false);
//                 }
//             ).catch(
//                 error => {
//                     setError(error.message);
//                     setUploadData(false);
//                 }
//             );
//         }
//     }, [bookId]); // Chỉ gọi lại API khi bookId thay đổi

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     // Hàm tìm kiếm sách và cập nhật bookId
//     const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(event.target.value);

//         // Tìm sách có tên trùng với searchTerm và lấy bookId
//         const foundBook = bookList.find(book => book.bookName?.toLowerCase().includes(event.target.value.toLowerCase()));
//         if (foundBook) {
//             setBookId(foundBook.bookId);  // Cập nhật bookId khi tìm thấy sách
//         } else {
//             setBookId(null);  // Không tìm thấy sách, đặt bookId là null
//         }
//     };

//     const imageSrc = listImage.length > 0 && listImage[0].imageData
//         ? listImage[0].imageData
//         : "https://cdn.pixabay.com/photo/2023/12/29/18/23/daisy-8476666_1280.jpg";

//     return (
//         <header className="navbar">
//             <div className='region'>
//                 <Link to='/'><img className='img-size' src="/logoTeam.png" alt="Logo" /></Link>
//                 <button className="menu-toggle" onClick={toggleMenu}>
//                     <img className='size-icon' src="/icons/icons8-menu-24.png" alt="menu-icon" />
//                 </button>
//                 <ul className={`navbar-list ${isMenuOpen ? 'open' : ''}`}>
//                     <li><Link to="/">Trang chủ</Link></li>
//                     <li><Link to="/Gioi-thieu">Giới thiệu</Link></li>
//                     <li><Link to="/kho-sach">Kho sách</Link></li>
//                     <li><Link to="/the-loai">Thể loại</Link></li>
//                 </ul>
//             </div>
//             <div className='search'>
//                 <input
//                     className='input-search'
//                     placeholder='Tìm kiếm...'
//                     value={searchTerm}
//                     onChange={handleSearchChange} // Cập nhật khi người dùng nhập
//                 />
//                 <img className='icon-search' src="/icons/icons8-search-48.png" alt="icon-search" />
//                 {/* Tạo dropdown tìm kiếm nếu có */}
//                 <div className="search-dropdown">
//                     {bookList && bookList.filter(book => book.bookName?.toLowerCase().includes(searchTerm.toLowerCase())).map((book) => (
//                         <div key={book.bookId} className="search-item">
//                             <img src={imageSrc || '/default-book-image.jpg'} alt={book.bookName} />
//                             <span>{book.bookName}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <div className='region'>
//                 <Link to="/cart" className="cart-container">
//                     <img className='size-icon' src="/icons/icons8-cart-24.png" alt="icon-cart" />
//                     <span className="cart-count">{getTotalItems()}</span>
//                 </Link>
//                 <ul className='navbar-list-1'>
//                     <li><Link to="/auth/dang-nhap">Đăng nhập</Link></li>
//                     <li><Link to="/auth/dang-ky">Đăng ký</Link></li>
//                 </ul>
//                 <Link to="/auth/dang-nhap" className="icon-login">
//                     <img className='size-icon' src="/icons/icons8-user-48.png" alt="icon-login" />
//                 </Link>
//             </div>
//         </header>
//     );
// };

// export default Navbar;
