import '../assets/styles/Navbar.css'

function Navbar() {
    return (
      <header className="navbar">
        <div className='region'>
          <img className='img-size' src="/logo192.png" alt="Logo" />

          <a href="/">Trang chủ</a>
          <a href="/">Giới thiệu</a>
          <a href="/">Kho sách</a>
          <a href="/">Thể loại</a>
          <a href="/">Chính sách</a>
        </div>
        <div className='search'>
          <input className='input-search' placeholder='Tìm kiếm...'/>
          <img className='icon-search' src="/icons/icons8-search-48.png" alt="icon-search" />
        </div>
        <div className='region'>
          <img src="/icons/icons8-cart-24.png" alt="icon-cart" />
          <a href="/">Đăng nhập</a>
          <a href='/'>Đăng ký</a>
        </div>
      </header>
    );
  }
  
  export default Navbar;