import '../assets/styles/Navbar.css'

const Navbar = () => {
    return (
      <header className="navbar">
        <div className='region'>
          <a href='/'><img className='img-size' src="/logoTeam.png" alt="Logo" /></a>
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/">Giới thiệu</a></li>
            <li><a href="/">Kho sách</a></li>
            <li><a href="/">Thể loại</a></li>
          </ul>
        </div>
        <div className='search'>
          <input className='input-search' placeholder='Tìm kiếm...'/>
          <img className='icon-search' src="/icons/icons8-search-48.png" alt="icon-search" />
        </div>
        <div className='region'>
          <ul>
            <li><img src="/icons/icons8-cart-24.png" alt="icon-cart" /></li>
            <li><a href="/">Đăng nhập</a></li>
            <li><a href='/'>Đăng ký</a></li>
          </ul>      
        </div>
      </header>
    );
  }
  
  export default Navbar;